# Writable derived state

Use this reference when a component shows server-provided data that the user can edit, or when reviewing code that copies query results into local state. The todo list below is adapted from Corbin's article [Writable Derived State: Stop Synchronizing State](https://playfulprogramming.com/posts/writable-derived-state); link the article when explaining the pattern.

## The failure pattern

The intuitive implementation fetches the server data, then "syncs" it into editable local state:

```tsx
const { data: serverTodos } = useQuery({
  queryKey: ["todos"],
  queryFn: ({ signal }) => getTodos({ signal }),
});
const [todos, setTodos] = useState<Todo[]>([]);

// The problematic part: the server wins every update.
useEffect(() => {
  if (serverTodos) setTodos(serverTodos);
}, [serverTodos]);
```

The user adds a todo, switches tabs, and returns. TanStack Query refetches on window focus, `serverTodos` changes, and the effect replaces the user's list with the server's. The same thing happens on reconnect, on interval refetches, and after any `invalidateQueries` call elsewhere in the app. The effect declares that server state should overwrite client state, which is the opposite of what an editable default needs.

Variations of the same problem:

- `useEffect(() => { form.reset(data) }, [data])`
- `const [value, setValue] = useState(data?.value)` where `data` arrives later, so the local state is initialized with `undefined` and must be patched by an effect
- `key={data.updatedAt}` on an editor to force a remount when server data changes

## The ownership change

Hold only the user's edits locally. Derive the displayed value from the edits when they exist and from the server otherwise:

```tsx
const { data: serverTodos, isLoading, isRefetching, error } = useQuery({
  queryKey: ["todos"],
  queryFn: ({ signal }) => getTodos({ signal }),
});

const [localTodos, setLocalTodos] = useState<Todo[] | null>(null);
const todos = localTodos ?? serverTodos ?? [];
```

`localTodos === null` means "no unsaved edits; show the server's value". A refetch updates `serverTodos` and, because the user has no edits, the display updates with it. Once the user edits, `localTodos` holds their version and the server's background changes stop affecting the display until the edits are cleared.

Removing the effect also removed the duplicated copy: there is one source for the server value (the query cache) and one source for the user's edits (local state). The mental model is "use server data when the client's data is missing", not "copy server data into the client".

## Clearing edits after a save

Clear the local override only when the server has the user's current version. Compare the submitted value with the current local value so edits made while the save was in flight survive:

```tsx
const queryClient = useQueryClient();

const saveTodos = useMutation({
  mutationFn: (next: Todo[]) => updateTodos(next),
  onSuccess: async (_data, submitted) => {
    await queryClient.invalidateQueries({ queryKey: ["todos"] });
    // Only clear the override if the user has not edited since this save started.
    setLocalTodos((current) => (current === submitted ? null : current));
  },
});

<button disabled={saveTodos.isPending} onClick={() => saveTodos.mutate(todos)}>
  Save
</button>
```

If the user clicks Save, then adds another todo before the request returns, `current` is a newer array than `submitted`, so the override stays and the new todo is not lost. The next Save sends the newer list. If the save fails, `localTodos` is untouched, so the user can retry with the same edits visible.

Returning the `invalidateQueries` promise from the handler keeps the mutation in `isPending` until the refetch completes, so the button stays disabled until the server's version is on screen.

## Rendering the states

```tsx
{isLoading && <p>Loading todos…</p>}
{isRefetching && <p aria-live="polite">Refreshing…</p>}
{error && <p role="alert">Could not refresh todos. Showing the last loaded list.</p>}
<ul>{todos.map((todo) => <li key={todo.id}>{todo.title}</li>)}</ul>
<button onClick={() => setLocalTodos([...todos, newTodo()])}>Add todo</button>
{localTodos && <button onClick={() => setLocalTodos(null)}>Discard changes</button>}
```

The list renders in every state. The initial load shows a placeholder; a background refresh keeps the list and adds an indicator; a failed refresh keeps the list and adds a message; the user's unsaved edits are visible and can be discarded explicitly.
