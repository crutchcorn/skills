# Readability decisions

These examples illustrate the preferences confirmed by Corbin after reviewing his projects. They are defaults to apply within the requested change, not instructions to rewrite every matching expression. The examples below are fictional; the linked source files record the supporting project evidence.

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

An early exit must still perform work required by the contract. For example, TanStack Form's no-validator branch calls `runValidation` with an empty list; returning without that call would change behavior.

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

## Project evidence

Reviewed from local checkouts on November 18, 2026. The references use the inspected revisions so later changes do not silently alter the examples. Authorship was spot-checked for the supporting passages; repository membership alone was not treated as proof of a personal preference.

| Source | Evidence |
| --- | --- |
| [CLI keyboard parsing](https://github.com/crutchcorn/cli-testing-library/blob/e2d3f84268c915f0c8af1a0971ecdcd1f56fdf73/packages/cli-testing-library/src/user-event/keyboard/getNextKeyDef.ts#L61-L114) | Unsupported descriptors and control characters exit before the remaining parsing work. |
| [Vue equality handling](https://github.com/reduxjs/vue-redux/blob/04ff7008a95b124e408cf4bd9ffbddc140c9ce8a/packages/vue-redux/src/utils/use-trackless-shallow-ref-with-equality-check.ts#L5-L39) | An unchanged value exits before mutation and notification; the introductory comment explains the tracking behavior that motivates the implementation. |
| [Form validation](https://github.com/TanStack/form/blob/eba4084b706699e4c4d8cfc39f895f722ea9cdfc/packages/form-core/src/ValidationLogic.ts#L74-L131) | Early exits retain validation callbacks, a local array collects validators, and comments explain which submission counter governs the mode. |
| [Article suggestions](https://github.com/playfulprogramming/playfulprogramming/blob/80efa6d5099f58a3cd8651a5366b2a0750ea8992/src/utils/get-suggested-articles.ts#L72-L160) | Fresh arrays accumulate candidates; `continue` skips irrelevant posts and `break` stops once enough suggestions exist. |
| [Object mapping](https://github.com/crutchcorn/ts-util-helpers/blob/e198f1951f81c8bec5c57180698960bbadc7a823/src/objects/object-map.ts#L25-L30) | A reducer updates a fresh result object, demonstrating that local accumulation also fits a reducer. |
| [Recursive selection types](https://github.com/crutchcorn/ts-util-helpers/blob/e198f1951f81c8bec5c57180698960bbadc7a823/src/objects/pick-deep.ts#L21-L45) | Comments explain array handling and preservation of optional properties beside the conditional types. |
