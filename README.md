# Engineer like [Corbin Crutchley](https://corbincrutchley.com)

You ask an AI agent to fix a bug. Along the way, it has to decide what to reuse, which tests are worth writing, and where to explain the change so the next person can understand it.

That's a lot of decisions hiding inside “fix this bug.”

These skills help your agent approach those decisions with Corbin's engineering preferences: keep the people using the software in mind, explain the reasoning, and leave the project easier to work on. They cover everything from choosing a web stack to writing a README that helps someone get started. Yes, including this one. 😉

A **skill** is a reusable set of instructions for a particular kind of work. Pick the ones that help with your task; you don't need to adopt the whole collection.

## Give it a try

Install with the [skills CLI](https://github.com/vercel-labs/skills):

```sh
npx skills add crutchcorn/skills
```

Choose the skills you want to use and the agent you want to use them with. Then give your agent a concrete task. For example:

> Use $test-like-corbin to cover this bug: when saving a profile fails, the form loses everything I typed.

That gives the agent a problem worth protecting against. The testing skill guides it toward exercising the form as a person would: enter some details, try to save, encounter an error, and check that the details are still there for another attempt.

Now we've given it both the problem and an approach to solving it.

## Find the skill for your task

| Skill | What it helps you do |
| --- | --- |
| [Write Like Corbin](write-like-corbin/SKILL.md) | Explain an idea with clear examples, visible reasoning, and a little personality. |
| [Docs Like Corbin](docs-like-corbin/SKILL.md) | Help people use your project and find the context behind its decisions. |
| [Git Like Corbin](git-like-corbin/SKILL.md) | Keep changes easy to review, with explicit rules against rewriting history, force pushes, discarding work, and pushing without permission. |
| [Test Like Corbin](test-like-corbin/SKILL.md) | Protect against meaningful bugs with tests that exercise real behavior. |
| [Choose Libraries Like Corbin](choose-libraries-like-corbin/SKILL.md) | Decide when built-in tooling, a maintained library, or a little custom code fits best. |
| [Architect Like Corbin](architect-like-corbin/SKILL.md) | Fit a feature into the project you have and keep reusable code useful to other projects. |
| [UI Like Corbin](ui-like-corbin/SKILL.md) | Build interfaces people can use across keyboards, screen readers, themes, and screen sizes. |
| [Perf Like Corbin](perf-like-corbin/SKILL.md) | Make the experience faster, measure the difference, and preserve the design. |
| [Maintain Like Corbin](maintain-like-corbin/SKILL.md) | Fix the underlying problem and finish migrations without leaving obsolete pieces behind. |
| [Web Stack Like Corbin](web-stack-like-corbin/SKILL.md) | Choose frontend, backend, and deployment tools using Corbin's preferred stack. |
| [Scaffold Like Corbin](scaffold-like-corbin/SKILL.md) | Start with the apps you actually need and make development, checks, and releases straightforward. |

## Put a few together

Some tasks benefit from more than one perspective. If you're improving a dashboard, you might ask:

> Use $ui-like-corbin and $perf-like-corbin to improve this dashboard's loading. Keep its design, and check that it still works on mobile and with a keyboard.

Or, when it's time to explain what you've built:

> Use $docs-like-corbin and $write-like-corbin to rewrite this project's README. Help a new user understand what it does and try it for themselves.

These are opinionated defaults, and your project's requirements still matter. An existing Vue app can stay a Vue app. A small fix can stay a small fix. Start with one task you already need to do, choose a skill that fits, and give your agent the context to do it well.
