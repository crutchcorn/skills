---
name: rethink-code-like-corbin
description: "Rethink code using Corbin Crutchley's purpose-first cleanroom workflow when an implementation repeatedly struggles to pass review, needs frequent rewrites, or the user explicitly requests a fresh design. Validate an isolated replacement before integrating it and migrating controlled consumers to its new API. Routine bug fixes, isolated check failures, and ordinary refactors do not need this workflow."
---

# Rethink Code Like Corbin

When successive fixes keep recreating the same design problems, step back to what the code is meant to accomplish. Have a fresh subagent build and validate a testing-only replacement from that purpose, then adopt the new design and migrate its consumers.

Keep the reset scoped to the troubled implementation and the downstream changes needed to replace it. Apply this workflow within the user's authorized task; a request to explain, review, or author the skill does not itself authorize rewriting code.

## Describe the purpose without carrying over the design

Set aside the current implementation, architecture, and API shape, including the shape downstream code expects. For this experiment, those choices do not constrain the replacement, even when ordinary architecture guidance favors reusing existing mechanisms.

Write a short brief describing:

- The user or system outcome the code must deliver, and what is outside its scope.
- Required behavior, domain invariants, and representative success, edge, and failure cases.
- Genuine operating constraints, such as runtime, supported platforms, data integrity, security, or measured performance needs.
- The repository's applicable quality standards and commands, including how the candidate will actually be included in those checks.

Derive these from requirements and observable behavior. Translate any necessary knowledge from existing code or review history into behavioral requirements. Leave out old source, signatures, class structures, dependency graphs, caller-shaped fixtures, proposed fixes, and instructions to preserve compatibility. Distinguish a real domain rule from an implementation accident; clarify a consequential uncertainty instead of silently inventing a requirement.

For example, a draft-saving component's purpose might be to retain edits, save the latest draft, and retain unsaved changes after a failed request. An existing controller class, subscription mechanism, or caller's expected return object is not part of that purpose.

## Delegate an isolated testing-only implementation

Spawn a new subagent with a fresh context. Do not fork the implementation discussion or send the old code, existing callers, or failed designs. With tools that support it, choose an empty history, such as `fork_turns: "none"`.

Give it the brief, relevant quality instructions, and an isolated scratch workspace with the minimum toolchain needed to build and test. Keep the old implementation and consumers out of its supplied workspace and context. If shared filesystem access makes them reachable, explicitly restrict the agent to the supplied material; do not ask it to browse the repository for design inspiration.

Instruct the subagent to:

- Implement the capability from the brief, choosing a clear API and structure on their own merits.
- Write meaningful tests against the intended behavior and run the applicable quality checks.
- Keep the candidate disconnected from production imports, exports, and runtime wiring. Testing-only means a working implementation exercised in isolation, not just a mock, sketch, or test suite.
- Return the implementation, tests, proposed API, design rationale, assumptions, and actual check results, including unresolved failures.

Do not prescribe the replacement design in the handoff. The parent owns integration later. If fresh-context delegation is unavailable, prepare the brief and explain that the cleanroom step remains incomplete; do not claim that rewriting it yourself satisfied the workflow.

## Validate before integration

Evaluate the candidate as fresh production-quality code before changing production consumers. Use the brief's acceptance criteria and the codebase's relevant formatting, lint, type, test, and build checks. Ensure those checks exercise the candidate: a green repository run that ignores the scratch directory proves nothing about it.

Inspect the code and tests yourself. Confirm that the design is understandable, the API expresses the purpose, and the tests cover meaningful outcomes rather than mirroring the implementation. Add independent examples or checks where the candidate's coverage misses a stated requirement. Check relevant error handling, lifecycle or concurrency behavior, performance, and accessibility when the capability makes them material; do not turn this into an unrelated audit.

Passing only the subagent's happy-path tests is insufficient. Fix demonstrated defects in the isolated candidate and repeat the affected checks. Do not weaken assertions, suppress diagnostics, or reshape the brief to justify the result. Failed or unavailable required checks leave the gate unmet: resolve the cause or report what remains blocked, and keep production migration pending. If successive attempts still miss the purpose, revisit the brief and the specific design problem before trying again.

## Adopt the new API and migrate consumers

Once the candidate passes the gate, implement the validated version in the production codebase and inspect the actual downstream usages. Map which consumers are under our control and which are owned outside the changeable system. Keep the validated design intact unless integration exposes a genuine missing requirement; validate any substantive revision again.

- Refactor every controlled downstream consumer in scope to use the new API directly. Update its imports, behavior tests, examples, and affected documentation together.
- Write an adapter only for downstream code outside our control. Identify the concrete consumer and ownership constraint, keep translation at that boundary, and test the required compatibility there. Keep legacy shapes out of the new core API.
- Migration effort, many call sites, a separate package in the same controlled repository, or a desire for a smaller diff do not justify an adapter. Internal callers use the new API even when an external consumer requires a compatibility boundary.

Run the applicable checks again against the integrated implementation and its consumers, including behavior across the changed boundaries. Remove the superseded implementation, obsolete plumbing, and scratch artifacts after verifying they are no longer needed; retain useful tests with the production implementation. Preserve unrelated work.

Report the resulting design, downstream migration, any external adapter and its reason, and evidence that both the isolated and integrated versions passed their checks. Distinguish completed validation from anything still pending.
