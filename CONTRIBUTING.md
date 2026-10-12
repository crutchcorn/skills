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
require Codex-compatible Responses support. Package scripts load `.env` through
the native CLI. Node 24 and pnpm 12 are declared in `package.json`.

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
skill. Tools are unavailable in this suite: it measures proposed actions and
actual prose deliverables, not repository execution or reference discovery.

The grader sees the original request, context, response, and one combined rubric
per case. Criteria preserve task facts and allow different valid approaches. The
shared HTTP grader in `evals/judge.yaml` validates its response before Promptfoo
interprets it; malformed, incomplete, or inconsistent verdicts cannot pass.

Defaults are three uncached repetitions and up to four concurrent requests.
Each behavior response also needs a grading call. Native filters, `--repeat`,
and `--max-concurrency` control cost and scope. Check the reported row count:
Promptfoo treats a filter matching zero cases as a successful empty run.

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
