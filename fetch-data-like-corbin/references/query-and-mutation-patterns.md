# Query and mutation patterns

Use this reference when writing or reviewing TanStack Query code for loading states, dependent queries, cancellable query functions, or optimistic mutations. The examples use React; the same options apply to the other framework adapters.

## Initial load versus refetch

```tsx
const { data, isLoading, isRefetching, isLoadingError, isRefetchError, error } = useQuery({
  queryKey: ["projects", filter],
  queryFn: ({ signal }) => getProjects(filter, { signal }),
  placeholderData: keepPreviousData,
});

if (isLoading) return <ProjectListSkeleton />;
if (isLoadingError) return <ErrorPanel error={error} />;

return (
  <>
    {isRefetching && <Spinner size="small" aria-label="Refreshing projects" />}
    {isRefetchError && <InlineError>Could not refresh. Showing the last loaded results.</InlineError>}
    <ProjectList projects={data ?? []} />
  </>
);
```

- `isLoading` is `isPending && isFetching`: the first fetch with nothing cached. It stays `false` for a disabled or skipped query, so it is safe for the spinner.
- `isRefetching` is `isFetching && !isPending`: a background fetch while data is already on screen.
- After a failed refetch, `data` still holds the last successful result and `error` is set. Rendering `data` first and the error inline keeps the content visible.
- `placeholderData: keepPreviousData` keeps the previous filter's results visible while the new key loads instead of dropping back to the skeleton. Disable actions that depend on the new result while `isPlaceholderData` is `true`.

## Dependent queries with `skipToken`

```tsx
import { skipToken, useQuery } from "@tanstack/react-query";

const { data: project } = useQuery({
  queryKey: ["project", projectId],
  queryFn: projectId ? ({ signal }) => getProject(projectId, { signal }) : skipToken,
});
```

The `projectId` check narrows the type inside the closure. The equivalent `enabled: !!projectId` version needs `getProject(projectId!, …)` and will call the function with `undefined` if the two conditions ever disagree.

When the input changes, the key changes and TanStack Query fetches the new project. Nothing needs to call `refetch()`:

```tsx
// Review signal: the dependency belongs in the query key instead.
useEffect(() => {
  refetch();
}, [projectId, refetch]);
```

`refetch()` throws while `queryFn` is `skipToken`. Reserve it for an explicit user action on a query that has a real `queryFn`.

## Cancellable query functions that throw

```ts
export class HttpError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "HttpError";
  }
}

export async function getProjects(filter: string, { signal }: { signal?: AbortSignal }) {
  const response = await fetch(`/api/projects?filter=${encodeURIComponent(filter)}`, { signal });
  if (!response.ok) {
    throw new HttpError(response.status, `Failed to load projects (${response.status})`);
  }
  return (await response.json()) as Project[];
}
```

- `fetch` only rejects on network failure. Without the `response.ok` check, a 500 response becomes successful `data` and the component renders an error body as if it were a result.
- Passing `signal` lets TanStack Query abort the request when the component unmounts, the key changes, or a mutation calls `cancelQueries`. Aborted requests reject with an `AbortError`, which TanStack Query handles without surfacing it as a query error.
- With OpenAPI Fetch, the client returns `{ data, error, response }` instead of throwing. Throw when `error` is present so the query enters its error state:

```ts
queryFn: async ({ signal }) => {
  const { data, error } = await client.GET("/projects", { params: { query: { filter } }, signal });
  if (error) throw error;
  return data;
};
```

Use `retry` with a function to skip retries for 4xx responses that will not change on a second attempt.

## Optimistic updates through the cache

```tsx
const queryClient = useQueryClient();

const toggleStar = useMutation({
  mutationKey: ["project", "star"],
  mutationFn: (input: { id: string; starred: boolean }) => setStarred(input),
  onMutate: async (input) => {
    // Stop in-flight refetches from overwriting the optimistic value.
    await queryClient.cancelQueries({ queryKey: ["project", input.id] });
    const previous = queryClient.getQueryData<Project>(["project", input.id]);
    queryClient.setQueryData<Project>(["project", input.id], (old) =>
      old ? { ...old, starred: input.starred } : old,
    );
    return { previous };
  },
  onError: (_error, input, context) => {
    if (context?.previous) queryClient.setQueryData(["project", input.id], context.previous);
  },
  onSettled: (_data, _error, input) => {
    // Only the last overlapping mutation refetches, so an earlier response cannot clobber a later update.
    if (queryClient.isMutating({ mutationKey: ["project", "star"] }) === 1) {
      return queryClient.invalidateQueries({ queryKey: ["project", input.id] });
    }
  },
});
```

- `cancelQueries` before writing the cache is what prevents a background refetch, started before the click, from resolving later and replacing the optimistic value with stale server data.
- The snapshot returned from `onMutate` is the rollback source in `onError`. Refetching alone is not a rollback when the server is unreachable.
- Returning the `invalidateQueries` promise keeps the mutation pending until the refetch finishes, so `isPending` covers the whole "saving" period.
- The `isMutating` check handles rapid repeated clicks: each click applies its optimistic update, and only the final settle triggers the refetch.

## Optimistic updates through the UI

When a single component shows the optimistic result, render from the mutation itself instead of writing to the cache:

```tsx
const addComment = useMutation({
  mutationFn: (text: string) => postComment(postId, text),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ["comments", postId] }),
});

<ul>
  {comments.map((comment) => <li key={comment.id}>{comment.text}</li>)}
  {addComment.isPending && <li className={styles.pending}>{addComment.variables}</li>}
  {addComment.isError && (
    <li className={styles.failed}>
      {addComment.variables}
      <button onClick={() => addComment.mutate(addComment.variables)}>Retry</button>
    </li>
  )}
</ul>
```

There is no cache write and nothing to roll back; the pending item disappears when the refetch completes, and a failed item stays visible with a retry action so the user's text is not lost.
