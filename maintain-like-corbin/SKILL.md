---
name: maintain-like-corbin
description: "Resolve maintenance problems using Corbin Crutchley's preferences. Use when fixing test, type, or tooling failures, investigating dependency-owned bugs, completing migration cleanup, or documenting environment configuration. Fix underlying causes and keep cleanup scoped; do not audit or refactor unrelated code by default."
---

# Maintain Like Corbin

Leave the affected system easier to maintain by fixing the cause and completing the requested change. Preserve unrelated work and avoid expanding a focused repair into a general cleanup.

## Fix the cause of a failure

Understand what the failing check or broken behavior is demonstrating before changing code or configuration. Correct the underlying problem rather than silencing the signal.

- Do not disable a check, skip a failing test, weaken an assertion, add a broad suppression, or cast away a type error merely to make the task appear complete.
- A check or configuration can itself be wrong. When evidence identifies that as the cause, correct it while retaining coverage of the intended invariant; explain why the old check was inaccurate.
- Keep type and tooling repairs separate from unrelated runtime behavior. Do not change application semantics to satisfy a compiler or linter unless the diagnostic exposes a real runtime defect that is part of the task.
- Prefer the smallest repair that restores the intended contract. Run the relevant existing checks and verify the behavior that motivated the fix.

When adding tests, prefer explicit, readable cases over loops that hide distinct scenarios, setup, or assertions. Preserve useful existing data-driven coverage unless changing it serves the requested work; do not rewrite tests solely to impose a preferred style.

## Investigate dependency-owned bugs

When the evidence points to a dependency, isolate the failing behavior and inspect the relevant upstream source, issue history, and releases. Check current primary sources for an existing fix or supported workaround before adding a local patch.

Prefer a compatible upstream fix when it resolves the problem within scope. If a local workaround is necessary, keep it narrow, explain the dependency defect and the condition for removing the workaround, and add meaningful regression coverage when warranted. Avoid broad upgrades or dependency replacement unless the task requires them.

Investigating upstream is not permission to publish an issue, comment, pull request, or other message. Prepare a useful reproduction or proposed fix locally when helpful; publish only when the user authorizes that external action. Do not keep retrying a failed external mutation without understanding its outcome.

## Finish migrations within their scope

For vanilla JavaScript-to-framework UI migrations, check whether the old controller, event bus, or subscription layer still exists only to trigger framework renders. Move that application-owned state into framework primitives and expose values/actions directly; a hook around the unchanged controller is not a completed ownership migration. Preserve shared lifetime and actual persistence, retry, ordering, and conflict behavior. Keep adapters for genuinely external owners. If `architect-like-corbin` is available, its framework-state migration reference provides a worked example.

After the replacement works, remove code, dependencies, configuration, scripts, and documentation made obsolete by that migration. Check actual references and consumers before removal; a name that looks old is not proof that it is unused.

For JavaScript/TypeScript projects, use Knip to identify unused code and dependencies. Check its configured entrypoints and dynamic consumers before acting on a finding; static analysis is evidence to investigate, not automatic permission to delete every reported item.

Update affected imports, package manifests and lockfiles, commands, and configuration examples together. Preserve compatibility or rollback paths that remain part of the requirements. Run the relevant build, type, lint, and behavior checks to confirm the migration no longer depends on the removed pieces. Do not treat this as authorization to clean up unrelated parts of the repository.

## Document configuration without exposing secrets

Use `.env.example` to document the configuration the affected application needs. Include variable names, required versus optional status, useful setup context, and safe defaults or obvious placeholders. Keep the example aligned with actual configuration consumers.

Actual secrets must never enter agent context, tool output, generated examples, or responses. Inspect `.env.example`, configuration schemas, and source references for the necessary names rather than opening secret-bearing environment files or dumping process environments. Do not request that the user paste a secret into chat.

When a command needs existing credentials, let the established runtime or credential mechanism supply them without reading or echoing their values. Avoid tracing or debug output that could reveal them. If a value is missing, tell the user its exact name and the specific place to set it, such as the application's local `.env` file or the shell profile the project documents, and use sanitized errors and presence checks that do not print values.
