---
name: fetch-data-like-corbin
description: "Fetch and mutate server data in frontend apps using Corbin Crutchley's TanStack Query preferences. Use when adding or reviewing data fetching, loading and refetch states, dependent or conditional queries, mutations, optimistic updates, or local edits of server-provided data in a client application. Prefer declarative queries and writable derived state over effects that sync state; do not replace an existing data layer during unrelated work. Backend endpoint implementation and explanatory writing about data fetching do not need this skill."
---

# Fetch Data Like Corbin

Keep what the user already sees and already typed. Server data is a default that arrives late and changes over time; the interface should keep working while it loads, refreshes, fails, or gets saved.

## Use TanStack Query for server state

In frontend applications, use TanStack Query for data fetching and mutations instead of hand-rolled `useEffect` plus `useState` fetching. Keep ordinary local UI state local; the query cache holds server state.

Respect the project's existing data layer. Reuse its query key conventions, API client, and `QueryClient` configuration before adding new patterns. Do not migrate unrelated fetching to TanStack Query while fixing a single screen.

## Show the right loading state

Distinguish a first load from a refresh of data the user can already see. Read [references/query-and-mutation-patterns.md](references/query-and-mutation-patterns.md) for code covering the loading states, dependent queries, cancellable query functions, and optimistic updates described below.

- Use `isLoading` for the initial load when there is no data to show: render a spinner, skeleton, or placeholder in place of the content.
- Use `isRefetching` when cached data exists and a background fetch is in flight: keep the data visible and add a small indicator that it is updating. Do not swap visible content for a spinner.
- Do not use `isPending` alone to drive a spinner for a disabled or dependent query; it is also true while the query is waiting to be enabled.

## Preserve existing data during refetches and errors

A failed refetch keeps the last successful `data` alongside `error`. Render the data and show the error near it; do not replace a populated view with an error screen or an empty state. Use `isLoadingError` when the initial load failed and there is nothing to show, and `isRefetchError` when a refresh failed behind existing data.

When a query key changes (filters, pagination, selected item), use `placeholderData: keepPreviousData` so the previous result stays on screen until the new one arrives, and use `isPlaceholderData` to disable actions that depend on the new result.

## Write declarative, type-safe queries

- Put every input the query depends on into the query key. Changing the key triggers the fetch; the component never has to call `refetch()` in response to a prop or state change.
- Use `skipToken` for conditional or dependent queries: `queryFn: id ? () => fetchItem(id) : skipToken`. TypeScript narrows `id` inside the closure, so no `id!` assertion or cast is needed. Prefer it over `enabled: false` plus a non-null assertion.
- Treat `useEffect(() => { refetch() }, [dep])` as a signal that `dep` belongs in the query key, or that the query should be skipped with `skipToken` until its inputs exist.
- Reserve `refetch()` for an explicit user action such as a "Refresh" button. `refetch()` does not work while `queryFn` is `skipToken`; if a manual trigger is truly required, use `enabled: false` for that case and say why.

## Prefer writable derived state over syncing state

When the server provides a default the user can edit, do not copy server data into local state with an effect. Hold only the user's edits locally and derive the displayed value: `const value = localEdits ?? serverData ?? fallback`. The server value fills in when the user has not made changes; the user's edits win until they are explicitly cleared.

Read [references/writable-derived-state.md](references/writable-derived-state.md) for the before-and-after example and the mutation flow. The full explanation is Corbin's article [Writable Derived State: Stop Synchronizing State](https://playfulprogramming.com/posts/writable-derived-state); link it when explaining this pattern.

Treat an effect of the form `useEffect(() => setLocal(serverData), [serverData])` as a review signal: a refetch, window focus, or reconnect will overwrite the user's unsaved work.

## Handle mutation races

A mutation takes time, and the user may keep editing or trigger a refetch while it is in flight.

- Do not discard edits made while a mutation is pending. Clear local edits only when the saved value is still the current value, for example by comparing the submitted variables to the current local state in `onSuccess`, or by clearing the override after the refetch completes and only if no newer edits exist.
- For optimistic updates through the cache, follow the full sequence in `onMutate`: `await queryClient.cancelQueries({ queryKey })` so an in-flight refetch cannot overwrite the optimistic value, snapshot the previous data, apply the optimistic update, and return the snapshot. Roll back from that snapshot in `onError`. Invalidate in `onSettled`, and return the invalidation promise so the mutation stays pending until the refetch completes.
- When several mutations against the same data can overlap, invalidate only after the last one settles (for example, when `queryClient.isMutating({ mutationKey }) === 1`) so an earlier mutation's refetch does not overwrite a later optimistic update.
- When only one component shows the optimistic result, prefer rendering from the mutation's `variables` and `isPending` instead of writing to the cache; it needs no rollback logic.

## Make query functions cancellable and honest about errors

- Destructure `signal` from the query function context and pass it to `fetch` or the API client. TanStack Query aborts the request when the query is unmounted, the key changes, or `cancelQueries` runs; without `signal`, stale responses still arrive and consume bandwidth.
- Throw for unsuccessful HTTP responses. `fetch` resolves on 4xx and 5xx, so check `response.ok` and throw an error carrying the status and a useful message. If the API client returns errors as values (such as OpenAPI Fetch's `{ data, error }`), throw when `error` is present so TanStack Query records the failure, retries appropriately, and exposes `error` to the component.
- Never return `undefined` from a query function; return the parsed data or throw.

## Check the result

Walk the changed screen through its states before calling the work done: empty cache on first load, cached data with a background refetch, a failed refetch behind existing data, a changed query key, and a mutation that fails or overlaps with user edits. Confirm user edits survive a refetch and a failed save, and that leaving the screen aborts in-flight requests.
