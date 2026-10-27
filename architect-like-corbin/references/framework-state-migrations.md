# Migrate state ownership into the framework

Use this reference when moving an imperative UI into a framework or reviewing a migration that retained custom subscription machinery. The report editor below is a fictional example created for this skill; it is not an excerpt or version of an application's source.

## The failure pattern

A vanilla report editor uses a model to keep its title input, preview, and save-status toolbar in agreement. After moving those views to React, the migration retains the model and subscribes React to it:

```tsx
type SaveStatus = "unsaved" | "saving" | "saved" | "error" | "conflict";
type ReportSnapshot = { title: string; status: SaveStatus };

function createReportModel(initialTitle: string) {
  let snapshot: ReportSnapshot = { title: initialTitle, status: "saved" };
  const listeners = new Set<() => void>();

  function replace(next: ReportSnapshot) {
    snapshot = next;
    listeners.forEach((listener) => listener());
  }

  return {
    getSnapshot: () => snapshot,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    updateTitle(title: string) {
      replace({ ...snapshot, title, status: "unsaved" });
    },
    reportSaveStatus(status: SaveStatus) {
      replace({ ...snapshot, status });
    },
  };
}

function useReportEditor(model: ReturnType<typeof createReportModel>) {
  const snapshot = useSyncExternalStore(model.subscribe, model.getSnapshot);
  return { ...snapshot, updateTitle: model.updateTitle };
}
```

Assume the model's only consumers are the migrated React views and their autosave code. The extra machinery exists to deliver changes back into React:

`edit → mutable model → listeners → snapshot subscription → React render`

Naming the wrapper `useReportEditor`, or returning fields instead of the model itself, leaves that mechanism intact. Replacing `useSyncExternalStore` with `useEffect(() => model.subscribe(...))` also retains the redundant owner and creates a manual React bridge.

## The ownership change

Make React own the rendered values. This is the complete replacement for the example's **state and notification layer**, not a complete autosave implementation:

```tsx
function useReportSessionState(initialTitle: string) {
  const [title, setTitle] = useState(initialTitle);
  const [status, setStatus] = useState<SaveStatus>("saved");

  const updateTitle = useCallback((next: string) => {
    setTitle(next);
    setStatus("unsaved");
  }, []);

  // The persistence code uses this setter directly; there is no listener bus.
  return { title, status, updateTitle, reportSaveStatus: setStatus };
}
```

Call this state hook once in the report's owning React provider. Its public `useReportEditor` hook reads that provider's context; it does not instantiate a new session in each consumer. Put the provider above the edit/preview route switch if the draft must survive that navigation. Scope its session by account and report, resetting at that boundary without losing drafts that requirements say to retain.

Integrate the existing autosave policy at that owner. Keep debouncing and external transport in effects or suitable existing data-library hooks, invoke explicit user actions from handlers, and have the relevant transitions call `reportSaveStatus`. Keep timer IDs, in-flight requests, and protocol bookkeeping in refs or suitable existing services when they do not drive rendering. The service must not own a second renderable status snapshot and broadcast it back to React. The setter is an internal integration point; components receive domain actions such as `retry` and `resolveConflict`.

The context-reading hook exposes the **public contract** once those persistence actions are implemented:

```tsx
type ReportEditorValue = Pick<
  ReturnType<typeof useReportSessionState>,
  "title" | "status" | "updateTitle"
> & {
  retry(): Promise<void>;
  flush(): Promise<boolean>;
  resolveConflict(choice: "local" | "remote"): Promise<void>;
};

const ReportEditorContext = createContext<ReportEditorValue | null>(null);

function useReportEditor() {
  const session = useContext(ReportEditorContext);
  if (!session) throw new Error("ReportSessionProvider is required");
  return session;
}
```

The owner publishes the values and actions through that context. This is its render boundary; the persistence actions above still need their actual policy implementation:

```tsx
<ReportEditorContext.Provider
  value={{ title, status, updateTitle, retry, flush, resolveConflict }}
>
  {children}
</ReportEditorContext.Provider>
```

The input and toolbar then consume that same session:

```tsx
function ReportTitleField() {
  const { title, updateTitle } = useReportEditor();
  return (
    <input
      aria-label="Report title"
      value={title}
      onChange={(event) => updateTitle(event.target.value)}
    />
  );
}

function ReportSaveStatus() {
  const { status, retry } = useReportEditor();
  return (
    <div role="status">
      {status === "saving" ? "Saving report…" : status}
      {status === "error" && <button onClick={retry}>Retry save</button>}
    </div>
  );
}
```

The input and toolbar receive the same provider-owned state. React propagates changes; consumers do not call `model.getSnapshot()`, register listeners, or notify each other. Render-derived values, such as whether the title is blank, are computed from `title` without another synchronized state variable.

## Preserve the domain work

State primitives replace notification plumbing. They do not implement server persistence or its concurrency rules. Before changing the real implementation, inventory the relevant contracts and preserve them at the new owner:

| Existing requirement | What the migration must retain |
| --- | --- |
| Debounced autosave | Edits schedule saves with the same timing; teardown and session changes handle pending work deliberately. |
| Edits during load/save | Late responses do not replace newer text or report an unsaved revision as saved. |
| Ordered writes and uncertain retries | Capture payload/version/mutation identity; preserve required ordering and retry identity rather than sending conflicting parallel requests. |
| Server version conflicts | Preserve the user's text and expose the actual resolution choices. |
| Publish requires persistence | Await a successful flush of the intended revision before publishing; a render's `status === "saved"` is not a flush guarantee. |
| Edit and flush in the same event | React state updates are not immediate. Capture the intended payload/revision or provide an action that combines the edit and flush; `updateTitle(next); await flush()` must not read the previous render's title. |
| Multiple views and navigation | Use the same session while its required owner remains alive. Separate hook calls must not create independent drafts or duplicate autosave workers. |
| Account/report changes | Keep requests scoped to the correct session; prevent stale completions or cleanup from applying old content to a new account/report. |

Retain pure transition functions, payload mapping, and protocol helpers when useful. Do not turn a migration into a new generic synchronization library, introduce a state dependency without a concrete need, or replace the domain behavior with a naive save-on-every-render effect. Effects may still synchronize with the network; removing every effect is not the goal.

For a full reducer-based migration, keep the reducer pure. Perform transport outside the reducer and dispatch results that identify the session/revision they belong to. Cleanup must tolerate effect setup/cleanup repeating and must not silently drop required work or publish stale results.

## When an external store is the right boundary

Suppose a third-party document engine owns the report, receives edits from non-React plugins, and must keep running independently of the React toolbar. React is then a consumer of an external owner. Keep the engine's supported React integration, or adapt its subscription with `useSyncExternalStore`; do not mirror it into competing React state merely to remove that API.

For such an adapter, preserve subscription cleanup and stable, cached snapshots, and provide the appropriate server snapshot if server rendering is supported. An established state library may already provide the correct hook. Name the actual external owner and why it must remain external. A controller being in a separate `.ts` file, or having unit tests, does not establish that requirement.

React's [external-store reference](https://react.dev/reference/react/useSyncExternalStore) describes this integration boundary. Its [custom-hook guide](https://react.dev/learn/reusing-logic-with-custom-hooks) explains that hooks share logic rather than state instances, and [effect guidance](https://react.dev/learn/you-might-not-need-an-effect) distinguishes external synchronization from redundant derived state.

## Review the migration through behavior

Trace an edit from the input to the framework state owner, sibling views, and save boundary. Confirm who owns state and lifetime, not merely that public methods have new names. Exercise shared updates, route changes, a failed save and retry, edits during an in-flight request, conflicts, and flush-before-publish when those behaviors exist. Check that real external integrations still receive their updates.

After callers use the new values/actions, remove listener registries, snapshot getters, notification-only controllers, and manual retention machinery made obsolete by that ownership change. Retain any pieces with a demonstrated remaining consumer. Verify relevant existing checks and add behavioral coverage where it would catch a meaningful migration regression; do not use a keyword ban on `subscribe` or `useSyncExternalStore` as proof of correctness.
