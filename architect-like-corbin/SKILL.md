---
name: architect-like-corbin
description: "Make architectural and reuse decisions using Corbin Crutchley's preferences. Use when choosing where a feature belongs, extending an existing system, migrating vanilla JavaScript behavior into a UI framework, defining a reusable package boundary, or evaluating a proposed abstraction or refactor. Favor existing conventions and concrete requirements; do not turn ordinary edits into architecture audits."
---

# Architect Like Corbin

Extend the system that exists. Keep new structure proportional to the requested behavior and preserve useful boundaries without anticipating hypothetical products.

## Find the existing path

Before adding a parallel implementation, inspect the nearby code and representative callers for existing components, conventions, and extension points.

- Reuse a suitable component or helper before creating an equivalent one.
- Follow the project's established organization and patterns when they support the requirement.
- Prefer an existing extension point, such as a provider, adapter, or configuration option, over a competing mechanism for the same purpose.
- If an existing approach cannot support the requirement, explain the concrete limitation and make the smallest coherent change that addresses it.

Keep this investigation focused on the area being changed. A feature request does not imply a repository-wide architecture review.

## Let the framework own its state

When migrating imperative or vanilla JavaScript UI code into a framework, re-evaluate state ownership instead of preserving the old notification architecture by default. Read [references/framework-state-migrations.md](references/framework-state-migrations.md) for a fictional before-and-after example and the external-store boundary.

- Identify what owns each value, who changes it, and how long it must survive. Put application UI state in the target framework's state primitives; derive display values from that state. In React, prefer hooks returning values and actions, backed by `useState` or `useReducer`.
- Treat hand-built listener sets, `subscribe/getSnapshot` pairs, change broadcasts, and effects that mirror one application-owned state container into another as migration review signals. Do not invent an external store solely to make the framework subscribe to its own state. Wrapping the old controller in a hook or replacing its subscription API with an effect does not change ownership.
- Preserve shared state and its lifetime. Multiple calls to a custom hook do not share state automatically; lift ownership to the appropriate parent/provider or reuse the project's established state solution when consumers need the same instance.
- Keep real external synchronization: persistence, request ordering, retries, conflicts, and editor/browser integrations may still need effects or existing data-library APIs. Reuse suitable facilities and preserve domain policy. These requirements do not by themselves justify a second UI notification system.
- Use an external-store adapter such as React's `useSyncExternalStore` when a concrete source must remain outside the framework, such as an independently owned editor or a store shared with non-framework consumers. Identify that owner and requirement; the API's presence alone is not a defect.

Before calling the migration complete, trace an edit through the new state owner to every affected view and persistence boundary. Remove obsolete notification plumbing once its consumers have migrated, and verify the behavior and lifetime that the old mechanism supported.

## Keep reusable packages independent

For a package intended for reuse, separate its general capability from the consuming application's identity and integrations.

- Keep application branding, product-specific copy, and application-specific integration wiring in the consumer.
- Supply the values or behavior the package actually needs through a small public interface. Add adapters or injection points when a real consumer requires them.
- Avoid importing application code into a reusable package or requiring it to know one application's deployment and service setup.
- Keep application-specific code close to the application when no reusable boundary is needed. Not every module needs to become a package.

For example, a reusable upload component can accept a concrete upload callback and presentation options while the application supplies its storage integration and branding. That does not require inventing a plugin framework for future storage providers.

## Abstract when the requirement is concrete

- Do not create speculative abstractions, general-purpose frameworks, or configuration options for imagined future use cases.
- Prefer a direct implementation when the current requirements are simple and the common boundary is not yet clear.
- Extract shared behavior when existing consumers or a current requirement demonstrate what belongs together. Similar-looking code alone does not prove that it should share an abstraction.
- Keep refactors limited to those necessary for the requested behavior. Record a useful unrelated improvement separately rather than folding it into the change.

When explaining the decision, name the existing mechanism being reused, any new boundary, and the requirement that makes it necessary. Avoid proposing a broader redesign merely to make the local change look uniform.
