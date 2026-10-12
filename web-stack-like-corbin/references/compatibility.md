# Compatibility and version decisions

Read this reference when implementing the affected part of the stack. Verify current upstream docs and actual installed versions; the user's preferences are not a substitute for API compatibility checks.

## TypeScript 6 and the compiler API

Corbin selected TypeScript 6 for both frontend and backend type checking. The supplied rationale is that TypeScript 7.0 does not provide the needed JavaScript compiler API, with a new API expected in 7.1. Preserve the TypeScript 6 preference rather than silently selecting the newest major.

Treat release availability as a dated fact, not an evergreen assertion that 7.1 is unreleased. Microsoft's [compiler API guide](https://github.com/microsoft/TypeScript-wiki/blob/main/Using-the-Compiler-API.md), checked October 12, 2026, covers TypeScript 6 and earlier and describes a different API for 7.1. Before a requested upgrade, verify both availability and support in the tools that consume that API. Do not assume a future API is a drop-in replacement.

## Native Node.js TypeScript execution

Prefer native Node.js execution over a separate TypeScript runner when it supports the project's source. Native execution does not perform type checking; retain a separate type-checking step for frontend and backend code, selecting TypeScript 6 for a new setup. Preserve the existing type checker during unrelated changes.

Check the selected Node version against the [Node TypeScript documentation](https://nodejs.org/api/typescript.html), especially supported syntax, module resolution, and TSX. Do not assume native execution reads `tsconfig.json`, transforms JSX, or implements bundler aliases. Use the existing build pipeline or a justified tool when those features are required.

## Drizzle v1 RC

The user's explicit preference is Drizzle v1 RC. The [official PostgreSQL setup guide](https://orm.drizzle.team/docs/get-started/postgresql-new), checked October 12, 2026, uses the `rc` channel for ORM and migration tooling. Resolve and lock compatible concrete versions in the requested v1 RC line. Recheck tags before installing; `rc` is mutable and is not a permanent version pin.

If that line no longer fits the requested platform, explain the specific conflict and resolve the choice with the user when necessary. Do not silently substitute an older stable line or a different future RC.

## TanStack Form v2

The user explicitly chose TanStack Form v2 even during alpha. Use a concrete v2 release and its matching docs when selecting form tooling. Do not substitute v1 solely because a stable release would usually be preferred, or migrate an existing form library during unrelated work.

The [official v2 alpha announcement](https://tanstack.com/blog/announcing-tanstack-form-v2-alpha), checked October 12, 2026, describes changed APIs and differing feature availability across adapters. Before installation, verify the selected adapter's peer dependency range against the app's React or other framework version, confirm its required features, and consult documentation matching the concrete v2 release. If these checks cannot be run, include them in the installation plan and leave the version unresolved rather than skipping compatibility checks. Do not assume v1 examples or React-only capabilities transfer unchanged to another adapter. Consult the [v1 migration guide](https://tanstack.com/form/alpha/docs/migrate-from-v1) for an authorized migration and update runnable examples with the changed API.

## OpenAPI types, client, and mocks

Use [openapi-typescript](https://openapi-ts.dev/introduction) to generate client types from the maintained OpenAPI specification. Keep the generation command available through the repository's normal workflow. Generated types are not runtime validation; use Valibot at relevant input boundaries.

When refactoring, trace the complete path from the specification through generated types to OpenAPI Fetch and openapi-msw. Preserve generation inputs and outputs, package exports, client imports, and mock consumers. Regenerate and run the relevant type checks and integration checks after contract changes instead of hand-editing generated declarations or disconnecting mocks from the shared contract.

## Deployment runtimes

Node.js is the JavaScript runtime default and Cloudflare is the infrastructure preference. Verify the actual runtime of the selected Cloudflare product and compatibility of its framework adapter, database driver, and Node APIs. Apply the same check to AWS or Netlify when selected.

Local RustFS containers are development dependencies. Do not assume they can run inside a production request handler or require them for a frontend-only build.
