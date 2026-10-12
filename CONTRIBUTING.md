# Contributing

## Run evals

[Promptfoo](https://www.promptfoo.dev/docs/intro/) runs the evals directly. The
setup follows the same pattern as layered-react-structure: a small config,
file prompts, native YAML cases, and built-in configuration validation.

```sh
pnpm install
cp .env.example .env
pnpm test:evals
```

Fill in the gitignored `.env`. All suites share exactly three settings:

| Variable | Used for |
| --- | --- |
| `OPENAI_API_KEY` | Authentication for responses, grading, and Codex |
| `EVAL_MODEL` | The model for all three; defaults to `gpt-6.1-sol` |
| `OPENAI_BASE_URL` | API base URL; defaults to `https://api.openai.com/v1` |

The endpoint must support Responses and Chat Completions; agent runs additionally
require Codex-compatible Responses support. Promptfoo automatically loads `.env`
when present and also accepts environment variables supplied by CI. Node and pnpm
versions are declared in `package.json`.

Start with a small run:

```sh
pnpm eval --filter-metadata skill=git-like-corbin --filter-providers candidate --repeat 1
pnpm eval --filter-metadata kind=trigger --repeat 1
pnpm eval --filter-pattern 'Writing: lead with' --repeat 1
pnpm eval:view
```

`pnpm eval` runs all 141 cases. Routing cases see only skill descriptions;
behavior cases receive skill text and supporting references through native
`file://` variables. Behavior cases compare the same model with and without the
skill. Compare candidate results with the no-skill control to identify where the
skill helps; inspect control failures separately. To gate on skill-enabled behavior, use
`pnpm eval --filter-providers candidate`. A comparison run can exit unsuccessfully
when only its no-skill controls fail.
Run controls alone with `pnpm eval --filter-prompts '^Without skill$'`.

Tools are unavailable in this suite: it measures proposed actions and actual
prose deliverables, not repository execution or reference discovery.

The grader sees the original request, context, response, and one combined rubric
per case. Criteria preserve task facts and allow different valid approaches. The
shared HTTP grader in `evals/judge.yaml` validates its response before Promptfoo
interprets it; malformed, incomplete, or inconsistent verdicts cannot pass.

Defaults are three uncached repetitions and up to four concurrent requests.
Each behavior response also needs a grading call. Native filters, `--repeat`,
and `--max-concurrency` control cost and scope. Check the reported row count:
Promptfoo treats a filter matching zero cases as a successful empty run.

## Check real skill use

```sh
pnpm eval:agents --repeat 1
```

The native Codex SDK provider performs a read-only documentation review of a
small static repository fixture. Its `.agents/skills/docs-like-corbin` symlink
points to the current skill, so there is no copied skill text to maintain.
The model must discover the required reference, inspect source, and identify a
stale documented timeout without editing files. The fixture contains no secrets.

Built-in `skill-used` and trajectory assertions check skill use and commands
referencing the required files; a rubric checks the source-grounded review.
Codex's skill-use signal is heuristic, and command matching does not independently
prove successful reads. This suite exercises a real review workflow, not file
editing or every skill behavior. It replaces the custom fixture lifecycle with
native provider and assertion configuration.

The provider uses the same three API settings, disables network/web tools, and
isolates HOME and CODEX_HOME under gitignored `evals/results/codex-home`. It does
not reuse your personal Codex login or installed skills. The sandbox is read-only,
so repeated runs need no fixture reset or teardown scripts.

## Calibrate the judge

```sh
pnpm eval:calibrate --repeat 1
```

Native `echo` and `providerOutput` cases evaluate fixed responses using the same
production rubrics. Positive examples use `llm-rubric`; negative examples use
`not-llm-rubric`. Provider and parsing errors remain failures in both cases.

The eight examples in `evals/calibration/tests.yaml` cover preserved facts,
changed facts, invented claims, and different valid architecture decisions.
Labels are **proposed**, pending human review; inspect each response and rationale
before treating agreement as validated judge accuracy. Labels stay outside the
grader prompt.

## GitHub Actions

[The Zizmor workflow](.github/workflows/zizmor.yml) checks GitHub Actions on
pushes to `main` and PRs targeting `main`, including forks. Findings appear as
annotations and fail the job. Run the same pinned version locally:

```sh
uvx zizmor==1.30.1 .
```

Set `GH_TOKEN` to enable the online audits that CI runs. Without a token, the
local command performs offline audits only.

[The Promptfoo workflow](.github/workflows/promptfoo.yml) runs on every push to
`main`, including merges, and on pull requests targeting `main`. It uses the
[pinned CLI through the package scripts](https://www.promptfoo.dev/docs/integrations/ci-cd/)
and installs dependencies with `pnpm install --frozen-lockfile`. The pnpm action
reads `packageManager`; pnpm installs the Node runtime recorded in the lockfile.

Configuration validation runs first. Three independent jobs then run the
skill-enabled candidate, judge calibration, and real Codex agent suites with
their configured three uncached repetitions. Any assertion or provider error
fails its job; the remaining suites still finish. No-skill controls remain a
local comparison and do not gate CI.

Configure these under **Settings → Secrets and variables → Actions**:

| Setting | GitHub Actions location | Required? |
| --- | --- | --- |
| `OPENAI_API_KEY` | Repository secret | Yes, for live evals |
| `EVAL_MODEL` | Repository variable | Optional; uses the existing default |
| `OPENAI_BASE_URL` | Repository variable | Optional; uses the existing default |

Fork and Dependabot PRs run configuration validation only because GitHub does
not supply the repository API secret. Live evals run for same-repository PRs
and pushes to `main`. To evaluate a fork before merging, review its changes and
place the reviewed revision on a trusted branch in this repository.
A missing API secret fails live jobs with a setup error.

Each live job uploads its JSON report as a `promptfoo-*` artifact, including when
evals fail. Download reports from the workflow run's **Artifacts** section; they
are retained for 14 days. Reports are not published to Promptfoo. New commits
cancel older runs for the same PR; each push to `main` keeps its own run.

## Compare runs and add cases

`pnpm eval:view` opens the local `.promptfoo` history. Use the no-skill column as
an immediate baseline, and compare saved runs before and after a skill change.
The main config records the Git revision; Promptfoo records rendered prompts,
responses, scores, and model configuration. Runs use working files, so commit
intended changes before capturing a revision baseline. Name runs with
`--description` when comparing revisions or experiments.

JSON exports go under gitignored `evals/results/` and overwrite the previous
export for that suite. Use `--output evals/results/my-run.json` to keep a named
export. Three repetitions are a small sample; inspect individual failures and
increase repeats before drawing strong conclusions.

Add cases directly to each skill's `evals/tests.yaml` using native
[test cases](https://www.promptfoo.dev/docs/configuration/test-cases/) and
[assertions](https://www.promptfoo.dev/docs/configuration/expected-outputs/).
Descriptions should state the concrete expected behavior or routing boundary.
Keep the metadata for filtering. Add positive and negative routing cases, and
prefer outcome-based rubrics over requiring one exact response. Shared rubric
files keep calibration aligned with production checks.

Run `pnpm test:evals` after editing configuration or cases. It validates all
configs without paid model calls. Real eval commands call the configured API.
