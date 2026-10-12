---
name: choose-libraries-like-corbin
description: "Evaluate dependencies and build-versus-buy decisions using Corbin Crutchley's preferences. Use when selecting a library, replacing a dependency, comparing tooling, or considering substantial custom code for a well-understood problem. For a web application library, also load web-stack-like-corbin, which lists the specific preferred tools. Prefer suitable native capabilities and maintained libraries; do not trigger dependency migrations during unrelated changes."
---

# Choose Libraries Like Corbin

Prefer the smallest maintenance burden that meets the actual requirements. Apply these preferences to the dependency decision in scope, while preserving the user's explicit choices and the project's constraints. For web application tooling, `web-stack-like-corbin`, when available, names the preferred library in each area; use this skill to evaluate fit and alternatives around that preference.

## Start with what the project already has

Identify the required behavior, runtime, compatibility constraints, and existing capabilities before adding a dependency.

1. Prefer a suitable built-in feature of the runtime or current tooling.
2. Reuse an appropriate dependency already present in the project.
3. Prefer a maintained library over substantial handwritten code for a well-understood problem.
4. Write small project-specific code when it is simpler to own than a dependency and does not recreate a complex established solution.

These are preferences, not a reason to stretch an unsuitable tool. Compare the cost of adapting an existing capability with the cost of adding and maintaining a new one.

For example, prefer native Node.js TypeScript execution over adding `ts-node` when the project's Node.js version and required syntax support it. Check current official documentation and retain the separate type-checking step; executing TypeScript is not a substitute for type checking. Do not add a runner solely from habit.

## Evaluate maintenance and fit

Favor tools that are current and well maintained over tools that are merely more popular, within reason. Use current primary sources when recommending or introducing a dependency.

- Check compatibility with the project's runtime, framework, deployment target, and intended use.
- Look for meaningful maintenance signals: supported releases, relevant fixes, compatibility updates, and responses to concrete issues.
- Do not equate a recent release with quality, or a quiet release history with abandonment. Stable tools may need few changes.
- Weigh the API surface, transitive dependencies, operational cost, and integration work against the code the library replaces.
- Use popularity as supporting evidence for ecosystem support, not as the deciding metric.

Explain the choice in terms of the problem it solves, maintenance evidence, and the material tradeoff. If current evidence is unavailable, label the uncertainty rather than asserting that a project is maintained or abandoned.

## Keep the decision scoped

- Do not replace working dependencies, upgrade unrelated packages, or introduce a second toolchain just to align an existing project with these defaults.
- A library is especially valuable when a mature problem space has substantial edge cases, such as parsing, standards compliance, or serialization. A few lines of straightforward domain logic do not automatically need a package.
- If the user already chose a library, work within that choice unless a concrete incompatibility prevents the task. Explain the incompatibility and make the smallest necessary adjustment.
- Validate the behavior that motivated the dependency choice using the project's relevant checks. Do not add a broad test suite merely to prove that a dependency was installed.
