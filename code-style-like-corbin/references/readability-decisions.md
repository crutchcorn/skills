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
