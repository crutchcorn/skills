# Contributing

## Running evals

Each skill has `evals/evals.json` with two kinds of checks:

- **Triggers:** prompts that should (`positive`) or should not (`negative`) cause an agent to load the skill, given only the catalog of skill names and descriptions. These test the frontmatter `description`.
- **Behaviors:** task prompts run with the full skill loaded. A judge model grades the narrated response against `must` and `mustNot` assertions.

The runner uses any OpenAI-compatible chat completions endpoint. Node 24 and pnpm 12 are declared in `package.json`; pnpm downloads the pinned Node if yours differs.

Copy `.env.example` to `.env` and fill in `EVAL_API_KEY` and `EVAL_MODEL`. `.env` is gitignored and loaded through Node's `--env-file-if-exists`, so no secrets touch the shell history. Then:

```sh
pnpm eval
```

Optional variables, also documented in `.env.example`: `EVAL_BASE_URL` (default `https://api.openai.com/v1`) and `EVAL_JUDGE_MODEL` (default `EVAL_MODEL`).

Useful flags:

```sh
pnpm eval git-like-corbin test-like-corbin   # only these skills
pnpm eval --only triggers                    # skip behavior evals
pnpm eval --verbose                          # print passing rows and full agent responses
```

The command exits non-zero when any check fails. Behavior evals grade a narrated plan rather than real tool use, so treat them as a regression signal for the skill text, not proof of agent behavior.

The schema for `evals.json` is in [evals/schema.json](evals/schema.json).
