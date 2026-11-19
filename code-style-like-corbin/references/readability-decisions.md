# Readability decisions

These fictional examples show how to apply the readability preferences within the requested change. Use them as defaults, not instructions to rewrite every matching expression.

## Named types in function signatures

Give the shapes of a function's inputs and outputs names even when each type is used only in that signature. For example, replace:

```ts
function summarizeReport(
  { title, entries }: { readonly title: string; entries: readonly string[] },
): { title: string; entryCount: number } {
  return { title, entryCount: entries.length };
}
```

with:

```ts
type ReportRequest = {
  readonly title: string;
  entries: readonly string[];
};

type ReportSummary = {
  title: string;
  entryCount: number;
};

function summarizeReport({ title, entries }: ReportRequest): ReportSummary {
  return { title, entryCount: entries.length };
}
```

The names explain what the shapes represent without requiring another consumer to justify them. Apply the same approach to `Promise<ReportSummary>`, `ReportSummary[]`, and callback parameters that carry a structured payload.

## Reuse follows the caller's meaning

These types can intentionally have identical fields:

```ts
type InviteMemberInput = {
  name: string;
  email: string;
};

type BillingContactInput = {
  name: string;
  email: string;
};
```

An invitation and a billing contact can have different validation, permissions, and reasons to change. Keep their types independent when those caller contracts are independent. Deriving both from a common type solely because their fields match would encode a relationship the application does not have. Reuse a type when callers actually mean the same contract, rather than treating structural compatibility as enough.

## Composition without forced unification

A `ButtonGroup` should compose the existing `Button` when it arranges actions that use the same button behavior. Its purpose is the relationship between those buttons; it does not need to duplicate their implementation.

A `Combobox` with editable search and a `Select` that chooses from a fixed list may have similar markup while owning different interaction logic and state transitions. If combining them requires a growing collection of mode flags and exceptions, keep the controls separate. Share a sound primitive only where the actual capability and contract align. Repeated markup can be the preferable cost of letting each control evolve safely.

The same reasoning applies outside components. Two workflows can currently calculate the same result while following independent business policies. Keep the calculations separate when that independence matters. A shared helper needs a real shared responsibility and a maintenance benefit; removing a copied block does not supply either by itself.

## Early exits and local accumulation

For a function that gathers eligible IDs with a finite integer limit, express the empty case, irrelevant items, and completion condition directly:

```ts
type Entry = { id: string; enabled: boolean };

function collectIds(entries: readonly Entry[], limit: number): string[] {
  if (entries.length === 0 || limit <= 0) return [];

  const ids: string[] = [];
  for (const entry of entries) {
    if (!entry.enabled) continue;

    ids.push(entry.id);
    if (ids.length >= limit) break;
  }
  return ids;
}
```

The local array makes progress visible without changing `entries`. A plain `entries.map(...)` remains useful for a simple transformation, and a readable reducer can also accumulate a result locally. Choose based on the algorithm rather than enforcing one collection method.

An early exit must still perform work required by the contract. If a validation callback must receive an empty list when there are no validators, call it before returning. A bare return would skip that required notification.

## Comments that protect intent

Explain a relationship a maintainer could otherwise simplify incorrectly:

```ts
// A group's validation mode changes only after that group is submitted;
// submitting the parent form must not change an untouched group's mode.
const submissionAttempts = group
  ? group.submissionAttempts
  : form.submissionAttempts;
```

The useful information is the independence of the two submission counters. A comment such as "Get the submission attempts" would only repeat the assignment. Put explanations of subtle type behavior beside the relevant type branch for the same reason.
