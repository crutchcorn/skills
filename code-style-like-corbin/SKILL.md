---
name: code-style-like-corbin
description: "Write and review code using Corbin Crutchley's readability preferences. Use when implementing or editing code, reviewing readability of expressions and control flow, or simplifying nested function and constructor calls. Prefer named intermediate values and straightforward control flow while preserving behavior. Prose-only requests, stack selection, and architecture planning without implementation do not need this skill."
---

# Code Style Like Corbin

Make the steps of a computation easy to read and inspect. Apply this preference to the code being written or reviewed; do not turn a focused change into a repository-wide style cleanup.

## Name computed arguments before passing them

Prefer descriptive intermediate values over nesting function calls, transformations, or awaited results directly inside another function or constructor call. Give each meaningful step a name rather than making the reader unpack the expression from the inside out.

For example, replace:

```ts
const collection = new Collection(source.map(transform));
consume(await load());
```

with:

```ts
const items = source.map(transform);
const collection = new Collection(items);

const result = await load();
consume(result);
```

Choose names that describe the value's role in the actual domain. Literals, existing identifiers, and simple property reads can remain inline. Passing a callback does not itself require extracting another variable or helper.

## Keep the main path clear with early exits

Handle invalid, unsupported, empty, or unchanged cases with an early `return` when that keeps the remaining work easier to follow. In loops, use `continue` for irrelevant items and `break` when the work is complete. Preserve return values, errors, and required cleanup when rearranging branches; use nesting when it better expresses genuinely dependent decisions.

## Build results with local accumulators

Use a fresh local array or object and update it directly when that makes an algorithm's steps straightforward. Local accumulation does not require mutating caller-owned inputs or shared state; preserve existing immutability contracts.

Choose loops, `map`, `filter`, or `reduce` for how clearly they express the work. Keep a simple transformation or readable reducer when it already fits. Do not introduce repeated spreads, an elaborate pipeline, or a loop rewrite solely to impose one style.

## Explain surprising behavior and invariants

Add a concise comment beside logic whose intent is easy to lose: a type relationship, compatibility constraint, subtle side effect, or algorithmic tradeoff. Explain what must remain true and why the apparent simplification would change it. Avoid comments that merely narrate obvious operations or repeat a function's name.

For worked examples of early exits, local accumulation, and explanatory comments, read [references/readability-decisions.md](references/readability-decisions.md).

## Preserve behavior while separating steps

Keep evaluation order, invocation counts, method receivers, error behavior, and asynchronous sequencing intact. Extract multiple computed arguments in their original order; do not introduce parallel execution as a style change.

Keep conditional, short-circuit, optional, and callback computations inside the control flow that originally governed them. Do not hoist work into an unconditional statement or outside a callback merely to flatten a call.

For a readability-only change, use the existing relevant checks and review the resulting control flow. Do not add tests that merely enforce variable names or expression shape; add behavioral coverage only when the change warrants it.
