---
name: test-like-corbin
description: "Choose, write, and review tests using Corbin Crutchley's testing preferences. Use when deciding whether a change needs tests, adding regression coverage, choosing test boundaries, or setting up a test suite. Favor user-centered integration tests and narrow tests for complex internal logic; avoid routine coverage expansion for its own sake."
---

# Test Like Corbin

Protect behavior that matters to users without making implementation details expensive to change. Apply these preferences within the requested work; do not migrate an existing test suite just to match a preferred tool.

## Decide whether a new test earns its place

Write a new test only when it addresses a real user-facing problem, prevents a particularly nasty internal regression, or the user specifically requests tests.

- Do not add tests merely because a file changed or a coverage metric is low.
- Do not test interfaces expected to change soon. Prefer a stable user outcome around them when one exists.
- For complex internal behavior, identify the meaningful invariant or failure before choosing a narrow unit test.
- Small, reversible changes do not automatically need new tests. Run relevant existing checks and inspect the result when those provide sufficient confidence.
- Do not introduce screenshot tests unless the user specifically requests them.

For boundary choices or examples of coverage to add or skip, read [references/test-decisions.md](references/test-decisions.md).

## Choose the smallest useful integration

Prefer integration tests over end-to-end tests, including integration tests that run in a browser. Use end-to-end coverage when the behavior genuinely depends on connecting the deployed or full-system pieces.

- For UI behavior, render the relevant page or flow and interact as a user would: navigate, fill labeled controls, submit, and observe the result. Assert visible outcomes and accessible behavior rather than component markup, CSS classes, or internal state.
- For backend behavior, exercise the application boundary with the real participating code and assert the response or meaningful persisted effects.
- Keep unit tests narrowly scoped to particularly complex logic or internal regressions whose important cases would be difficult to exercise clearly through an integration test.
- Choose cases that would catch the actual problem. Avoid asserting a restatement of the implementation or every intermediate helper call.

A browser test is not automatically an end-to-end test: a page using the real UI and application code with HTTP intercepted at its boundary can be an integration test.

## Do not test UI in headless or logic tests

Keep headless and logic tests focused on user-facing behavior. Use the accessibility tree and user-facing text as finders: roles, accessible names, labels, and visible text. Use attributes only in rare cases when those finders cannot reliably identify the relevant element; this exception never permits class or style checks.

Never assert the presence, absence, or value of CSS classes, inline styles, or computed styles as a source of truth for UI correctness. These assertions couple tests to implementation details without validating the rendered appearance. Assert the observable behavior instead, such as an accessible error message appearing after an invalid submission.

Validate styling through screenshot testing when automated visual coverage is warranted. Reserve it primarily for stabilized design-system components whose appearance is an established contract. Avoid screenshot coverage for fast-evolving product UI by default; use visual inspection and tests of stable user outcomes there.

## Make cases readable

Prefer explicit, named test cases over loops that hide the scenarios being exercised. A little duplication is useful when it lets readers understand a case and its failure without tracing shared control flow. Use parameterized cases when a concise table makes equivalent inputs and expected outcomes clearer; do not abstract tests merely to remove repeated lines.

## Keep real behavior inside the boundary

Avoid mocks wherever practical. If isolation requires a substitute, put it at a genuine external boundary.

- Use MSW for intercepted `fetch` requests and `openapi-msw` when an OpenAPI contract is available. Keep application request handling and consumption real.
- Use a disposable database with real queries rather than mocking repositories, ORM methods, or query builders. Ensure the substitute preserves the database behavior the test is meant to cover.
- Do not mock child components, internal hooks, application services, or helpers merely to make a test easier to write.
- Treat every boundary substitution as a limit on what the test demonstrates. If the bug lies across that boundary, include the real dependency in the test instead.

## Use the preferred tooling when choosing a setup

- Use Vitest for JavaScript/TypeScript tests on both frontend and backend.
- Use Vitest Browser Mode with Playwright for frontend tests.
- Use the project's existing setup when extending it; changing runners or adding a new testing layer is a separate scope decision.
- Before writing version-sensitive configuration, identify the installed or intended versions and consult current official documentation, including the [Vitest Browser Mode setup guide](https://vitest.dev/guide/browser/) for frontend setup. Make this a prerequisite, not a fallback after configuration fails. When tools are unavailable, explicitly include documentation verification before applying the setup in your plan and label any configuration example as unverified.

## Verify the coverage

For a regression, confirm that the new test exposes the original failure when practical, then passes with the fix. Run the relevant existing tests and required checks. In the handoff, state the protected behavior, what ran, and any material boundary the test does not cover. If no new test is warranted, briefly explain why when that decision is relevant to the request.
