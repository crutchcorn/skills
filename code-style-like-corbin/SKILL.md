---
name: code-style-like-corbin
description: "Write and review code using Corbin Crutchley's readability preferences. Use when implementing or editing code, naming structured function types, reviewing code duplication, reviewing readability of expressions and control flow, or simplifying nested function and constructor calls. Prefer meaningful names and maintainable boundaries while preserving behavior. Prose-only requests, stack selection, and architecture planning without implementation do not need this skill."
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

## Name structured types in function signatures

Prefer a named type over an inline object or other structured type in a function's parameters or return annotation, even when the type is used only once. This includes destructured parameters, callback payloads, object elements in arrays, and object results wrapped in `Promise`.

Reuse a named type only when the application site aligns from the caller's perspective: it represents the same concept and contract. Matching fields or structural assignability alone do not justify reuse. Do not shoehorn distinct callers into one type for the sake of DRY. Otherwise create a type with a name that describes the value's domain or role, such as `ReportRequest` or `ReportSummary`, even if its fields duplicate another type.

Keep primitive annotations and references to named types inline, such as `string`, `ReportSummary[]`, or `Promise<ReportSummary>`. Preserve optional properties, readonly modifiers, generic relationships, and the accepted inputs and outputs when extracting a type.

## DRY is not worth pursuing

Removing copied code is not a goal. Duplication is often acceptable and can be ideal when it keeps independently changing concepts easy to understand and maintain. Making code DRY solely to remove repeated lines, without a stronger architectural reason, is an anti-pattern.

Judge reuse by the callers' concepts, behavioral contracts, reasons to change, and maintenance cost. Share code when those align and the abstraction makes their relationship clearer. Keep separate implementations when sharing would couple independent behavior, require unrelated configuration flags, or make a change for one caller risk breaking another. The number of repeated lines or consumers is not sufficient justification for extraction.

Compose components where the shared capability is real: a `ButtonGroup` should compose the existing `Button` when their behavior and contracts align. Do not force distinct controls such as a combobox and a select into one implementation merely because their markup overlaps. They can share an appropriate primitive while retaining independent interaction logic and contracts; duplication is preferable when further unification makes maintenance harder.

## Keep the main path clear with early exits

Handle invalid, unsupported, empty, or unchanged cases with an early `return` when that keeps the remaining work easier to follow. In loops, use `continue` for irrelevant items and `break` when the work is complete. Preserve return values, errors, and required cleanup when rearranging branches; use nesting when it better expresses genuinely dependent decisions.

## Build results with local accumulators

Use a fresh local array or object and update it directly when that makes an algorithm's steps straightforward. Local accumulation does not require mutating caller-owned inputs or shared state; preserve existing immutability contracts.

Choose loops, `map`, `filter`, or `reduce` for how clearly they express the work. Keep a simple transformation or readable reducer when it already fits. Do not introduce repeated spreads, an elaborate pipeline, or a loop rewrite solely to impose one style.

## Explain surprising behavior and invariants

Add a concise comment beside logic whose intent is easy to lose: a type relationship, compatibility constraint, subtle side effect, or algorithmic tradeoff. Explain what must remain true and why the apparent simplification would change it. Avoid comments that merely narrate obvious operations or repeat a function's name.

For worked examples of named function types, duplication and composition, early exits, local accumulation, and explanatory comments, read [references/readability-decisions.md](references/readability-decisions.md).

## Preserve behavior while separating steps

Keep evaluation order, invocation counts, method receivers, error behavior, and asynchronous sequencing intact. Extract multiple computed arguments in their original order; do not introduce parallel execution as a style change.

Keep conditional, short-circuit, optional, and callback computations inside the control flow that originally governed them. Do not hoist work into an unconditional statement or outside a callback merely to flatten a call.

For a readability-only change, use the existing relevant checks and review the resulting control flow. Do not add tests that merely enforce variable names or expression shape; add behavioral coverage only when the change warrants it.
