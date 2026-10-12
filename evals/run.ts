// Runs each skill's evals/evals.json against an OpenAI-compatible chat endpoint.
// Usage: pnpm eval [skill ...] [--only triggers|behaviors] [--concurrency N] [--verbose]
// Configuration comes from .env (see .env.example); loaded by --env-file-if-exists in the script.
import { readFile, readdir, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

type Skill = {
  name: string;
  description: string;
  body: string;
  references: { path: string; content: string }[];
};

type EvalFile = {
  skill: string;
  triggers: { positive: string[]; negative: string[] };
  behaviors: {
    id: string;
    prompt: string;
    context?: string;
    must?: string[];
    mustNot?: string[];
  }[];
};

type Result = {
  skill: string;
  kind: "trigger" | "behavior";
  label: string;
  pass: boolean;
  detail: string;
};

type Message = { role: "system" | "user"; content: string };

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const { values: flags, positionals: selected } = parseArgs({
  allowPositionals: true,
  options: {
    only: { type: "string" },
    concurrency: { type: "string", default: "4" },
    verbose: { type: "boolean", short: "v", default: false },
  },
});

if (flags.only && flags.only !== "triggers" && flags.only !== "behaviors") {
  fail("--only must be 'triggers' or 'behaviors'.");
}

const apiKey = process.env.EVAL_API_KEY;
const model = process.env.EVAL_MODEL;
const judgeModel = process.env.EVAL_JUDGE_MODEL ?? model;
const baseUrl = (process.env.EVAL_BASE_URL ?? "https://api.openai.com/v1").replace(/\/+$/, "");

if (!apiKey || !model) {
  fail(
    "Set EVAL_API_KEY and EVAL_MODEL in .env (copy .env.example). Optional: EVAL_BASE_URL, EVAL_JUDGE_MODEL.",
  );
}

const skills = await loadSkills();
const catalog = skills.map((s) => `- ${s.name}: ${s.description}`).join("\n");
const targets = selected.length > 0 ? skills.filter((s) => selected.includes(s.name)) : skills;

const unknown = selected.filter((name) => !skills.some((s) => s.name === name));
if (unknown.length > 0) fail(`Unknown skill(s): ${unknown.join(", ")}`);

const jobs: (() => Promise<Result[]>)[] = [];
for (const skill of targets) {
  const evals = await loadEvals(skill.name);
  if (!evals) {
    console.warn(`skip ${skill.name}: no evals/evals.json`);
    continue;
  }
  if (evals.skill !== skill.name) fail(`${skill.name}/evals/evals.json: "skill" is "${evals.skill}"`);

  if (flags.only !== "behaviors") {
    for (const prompt of evals.triggers.positive) jobs.push(guard(skill.name, "trigger", prompt, () => runTrigger(skill, prompt, true)));
    for (const prompt of evals.triggers.negative) jobs.push(guard(skill.name, "trigger", prompt, () => runTrigger(skill, prompt, false)));
  }
  if (flags.only !== "triggers") {
    for (const behavior of evals.behaviors) jobs.push(guard(skill.name, "behavior", behavior.id, () => runBehavior(skill, behavior)));
  }
}

const results = (await runPool(jobs, Number(flags.concurrency))).flat();
report(results);
process.exit(results.some((r) => !r.pass) ? 1 : 0);

function guard(skill: string, kind: Result["kind"], label: string, job: () => Promise<Result[]>) {
  return async (): Promise<Result[]> => {
    try {
      return await job();
    } catch (error) {
      return [{ skill, kind, label, pass: false, detail: `error: ${(error as Error).message}` }];
    }
  };
}

async function runTrigger(skill: Skill, prompt: string, shouldLoad: boolean): Promise<Result[]> {
  const system = [
    "You are a coding agent. Before starting a task you may load zero or more skills from the catalog below.",
    "Load a skill only when its description matches the request. Do not load skills speculatively.",
    'Reply with JSON only: {"skills": ["skill-name", ...]}',
    "",
    "Catalog:",
    catalog,
  ].join("\n");

  const raw = await chat(model!, [
    { role: "system", content: system },
    { role: "user", content: prompt },
  ]);
  const loaded: string[] = parseJson(raw)?.skills ?? [];
  const didLoad = loaded.includes(skill.name);
  return [
    {
      skill: skill.name,
      kind: "trigger",
      label: `${shouldLoad ? "+" : "-"} ${prompt}`,
      pass: didLoad === shouldLoad,
      detail: `loaded: ${loaded.length > 0 ? loaded.join(", ") : "(none)"}`,
    },
  ];
}

async function runBehavior(skill: Skill, behavior: EvalFile["behaviors"][number]): Promise<Result[]> {
  const system = [
    "You are a coding agent working in a user's repository. Tools are unavailable in this evaluation,",
    "so narrate exactly what you would do: files you would inspect, commands you would run, changes you",
    "would make, questions you would ask, and what you would tell the user. Be concrete. Make reasonable",
    "assumptions about the repository and state them.",
    "",
    "The following skill is active. Follow it.",
    "",
    `<skill name="${skill.name}">`,
    skill.body,
    "</skill>",
    ...skill.references.flatMap((ref) => ["", `<reference path="${ref.path}">`, ref.content, "</reference>"]),
  ].join("\n");

  const user = behavior.context ? `${behavior.context}\n\n${behavior.prompt}` : behavior.prompt;
  const response = await chat(model!, [
    { role: "system", content: system },
    { role: "user", content: user },
  ]);

  const assertions = [
    ...(behavior.must ?? []),
    ...(behavior.mustNot ?? []).map((text) => `Does NOT: ${text}`),
  ];

  const judgeSystem = [
    "You grade an AI coding agent's narrated response against assertions.",
    "An assertion beginning with 'Does NOT:' passes only when the response avoids the described behavior.",
    "Judge what the response actually does or commits to doing, not what it merely mentions.",
    "Quote brief evidence for each verdict.",
    'Reply with JSON only: {"results": [{"assertion": "...", "pass": true, "evidence": "..."}]}',
  ].join("\n");
  const judgeUser = [
    "<response>",
    response,
    "</response>",
    "",
    "Assertions:",
    ...assertions.map((a) => `- ${a}`),
  ].join("\n");

  const verdicts: { assertion: string; pass: boolean; evidence: string }[] =
    parseJson(await chat(judgeModel!, [
      { role: "system", content: judgeSystem },
      { role: "user", content: judgeUser },
    ]))?.results ?? [];

  if (flags.verbose) {
    console.log(`\n=== ${skill.name} / ${behavior.id} ===\n${response}\n`);
  }

  return assertions.map((assertion, i) => {
    const verdict = verdicts[i];
    return {
      skill: skill.name,
      kind: "behavior",
      label: `${behavior.id}: ${assertion}`,
      pass: verdict?.pass === true,
      detail: verdict ? verdict.evidence : "judge returned no verdict",
    };
  });
}

async function chat(model: string, messages: Message[], attempt = 0): Promise<string> {
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages }),
  });

  if ((res.status === 429 || res.status >= 500) && attempt < 3) {
    await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
    return chat(model, messages, attempt + 1);
  }
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return data.choices?.[0]?.message?.content ?? "";
}

function parseJson(text: string): any {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) return undefined;
  try {
    return JSON.parse(candidate.slice(start, end + 1));
  } catch {
    return undefined;
  }
}

async function loadSkills(): Promise<Skill[]> {
  const skills: Skill[] = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const skillPath = join(root, entry.name, "SKILL.md");
    if (!(await exists(skillPath))) continue;

    const source = await readFile(skillPath, "utf8");
    const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) fail(`${entry.name}/SKILL.md: missing frontmatter`);
    const [, frontmatter, body] = match!;
    const name = frontmatterValue(frontmatter, "name");
    const description = frontmatterValue(frontmatter, "description");
    if (name !== entry.name) fail(`${entry.name}/SKILL.md: name "${name}" does not match directory`);

    const references: Skill["references"] = [];
    const refDir = join(root, entry.name, "references");
    if (await exists(refDir)) {
      for (const file of (await readdir(refDir)).sort()) {
        references.push({ path: `references/${file}`, content: await readFile(join(refDir, file), "utf8") });
      }
    }
    skills.push({ name, description, body: body.trim(), references });
  }
  return skills;
}

function frontmatterValue(frontmatter: string, key: string): string {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  if (!match) fail(`frontmatter missing "${key}"`);
  return match![1].trim().replace(/^"(.*)"$/, "$1").replace(/\\"/g, '"');
}

async function loadEvals(skill: string): Promise<EvalFile | null> {
  const path = join(root, skill, "evals", "evals.json");
  if (!(await exists(path))) return null;
  return JSON.parse(await readFile(path, "utf8")) as EvalFile;
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function runPool<T>(tasks: (() => Promise<T>)[], limit: number): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let next = 0;
  const workers = Array.from({ length: Math.max(1, limit) }, async () => {
    while (next < tasks.length) {
      const i = next++;
      results[i] = await tasks[i]();
    }
  });
  await Promise.all(workers);
  return results;
}

function report(results: Result[]) {
  const bySkill = Map.groupBy(results, (r) => r.skill);
  for (const [skill, rows] of bySkill) {
    const passed = rows.filter((r) => r.pass).length;
    console.log(`\n${skill}  ${passed}/${rows.length}`);
    for (const r of rows) {
      if (r.pass && !flags.verbose) continue;
      console.log(`  ${r.pass ? "PASS" : "FAIL"} [${r.kind}] ${r.label}`);
      console.log(`       ${r.detail}`);
    }
  }
  const total = results.length;
  const passed = results.filter((r) => r.pass).length;
  console.log(`\n${passed}/${total} passed (model: ${model}, judge: ${judgeModel})`);
}

function fail(message: string): never {
  console.error(message);
  process.exit(2);
}
