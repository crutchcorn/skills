---
name: architect-like-corbin
description: "Make architectural and reuse decisions using Corbin Crutchley's preferences. Use when choosing where a feature belongs, extending an existing system, defining a reusable package boundary, or evaluating a proposed abstraction or refactor. Favor existing conventions and concrete requirements; do not turn ordinary edits into architecture audits."
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
