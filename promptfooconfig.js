import { execFileSync } from 'node:child_process';
import { globSync, readFileSync } from 'node:fs';
import { parse } from 'yaml';

// Build the routing catalog from the actual frontmatter, without exposing bodies.
const catalog = globSync('*-like-corbin/SKILL.md').sort().map((path) => {
  const frontmatter = readFileSync(path, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)[1];
  const { name, description } = parse(frontmatter);
  return `- ${name}: ${description}`;
}).join('\n');
const model = process.env.EVAL_MODEL || 'gpt-6.1-sol';
const config = {
  apiKeyEnvar: 'OPENAI_API_KEY',
  apiBaseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  reasoning: { effort: 'low' },
  max_output_tokens: 8192,
  store: false,
};

/** @type {import('promptfoo').TestSuiteConfig} */
export default {
  description: 'Skill routing and task quality',
  sharing: false,
  prompts: [
    { id: 'file://evals/skill-prompt.json', label: 'With skill' },
    { id: 'file://evals/no-skill-prompt.json', label: 'Without skill' },
  ],
  providers: [
    { id: `openai:responses:${model}`, label: 'candidate', prompts: ['With skill'], config },
    { id: `openai:responses:${model}`, label: 'no-skill', prompts: ['Without skill'], config },
  ],
  defaultTest: {
    vars: { catalog },
    options: {
      disableVarExpansion: true,
      provider: 'file://evals/judge.yaml',
      rubricPrompt: 'file://evals/grader-prompt.json',
    },
  },
  tests: ['file://*-like-corbin/evals/tests.yaml'],
  evaluateOptions: { repeat: 3, maxConcurrency: 4, cache: false, timeoutMs: 120000 },
  metadata: { revision: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim() },
  outputPath: 'evals/results/latest.json',
};
