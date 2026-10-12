# Preferred web stack

These are Corbin's supplied preferences, recorded on October 12, 2026. They are defaults for open choices, not an instruction to install every tool. An acceptable alternative need not require special approval when it fits the user's request or the existing project.

## Runtime and tooling

| Area | Preferred choice | Alternatives and constraints |
| --- | --- | --- |
| JavaScript runtime | Node.js | Check deployment runtime compatibility separately. |
| Package manager | pnpm | Preserve an existing package manager during unrelated changes. |
| Task orchestration | Nx | Turborepo is also acceptable. Add orchestration when there is a concrete coordination need. |
| Type checking | TypeScript 6 for frontend and backend | Preserve this major-version preference; check compiler API compatibility before considering a later major. |
| Formatting | Prettier | Oxfmt or Vite+ are acceptable. Include language plugins when needed, such as Astro. |
| Linting | ESLint | Oxlint or Vite+ are acceptable. Include language plugins when needed, such as Astro or Vue. Do not add Prettier plugins to ESLint. |
| CSS/SCSS linting | Stylelint | Keep formatting with the chosen formatter and configure linting for the styles the project uses. |
| Unused-code analysis | Knip | Use findings to identify obsolete code and dependencies; verify entrypoints and dynamic consumers before deletion. |

Prefer the native capabilities of the selected tooling to extra dependencies. For example, use Node's native TypeScript execution when the actual source and runtime support it, rather than adding ts-node by habit. See [compatibility.md](compatibility.md) for the limits.

## Frontend and content

| Area | Preferred choice | Alternatives and constraints |
| --- | --- | --- |
| Application UI | React | Vue or Angular are acceptable. |
| Async/server state | TanStack Query | Use it for fetching and server-state lifecycles; keep ordinary local UI state appropriately local. |
| Form logic | TanStack Form v2, including alpha releases | Resolve a concrete v2 version and use the matching framework adapter and documentation. Do not silently substitute v1 because it is stable. |
| Styling | CSS Modules + SCSS | SCSS is strictly for media-query variables. Do not add Tailwind or another styling system. Keep other styling in ordinary CSS syntax; use CSS custom properties for ordinary design values. |
| Client-side routing | TanStack Router | Choose a router compatible with the selected framework; do not assume a React integration works with Vue or Angular. |
| Application SSR | TanStack Start | Next.js is acceptable. Keep Start's API side lightweight and use a separate Hono backend in a monorepo. |
| Marketing and static sites | Astro | Do not add an application SSR framework when the site only needs static output. |
| HTML/CSS to SVG, including OG images | Satori | Check its supported input and styling model when implementing the conversion. |
| Markdown | Unified / Rehype / Remark | Sätteri is acceptable. Choose the processing stages the task needs. |

The SCSS constraint permits defining, sharing, and using breakpoint variables in media queries. It does not authorize Sass mixins, functions, loops, nesting, or theme variables for unrelated styling.

## Backend, APIs, and data

| Area | Preferred choice | Alternatives and constraints |
| --- | --- | --- |
| Backend framework | Hono | Fastify is acceptable. |
| Runtime validation | Valibot | Validate at relevant input boundaries; generated TypeScript types do not validate runtime values. |
| Client API type generation | openapi-typescript | Generate from the OpenAPI contract and preserve generation during refactors. |
| API client | OpenAPI Fetch (`openapi-fetch`) | Use the API's OpenAPI contract. |
| Fetch mocking | MSW + openapi-msw | Mock at the HTTP boundary rather than replacing application internals. |
| Database adapter / ORM | Drizzle v1 RC | Resolve an actual compatible v1 RC release with matching tooling; do not assume a mutable dist-tag always points to v1. |
| Database | PostgreSQL | D1 or SQLite are acceptable where appropriate. |
| Authentication | BetterAuth | Clerk or Cognito are acceptable. |
| Local S3 container | RustFS | Add it when local object storage is needed. |

Keep the frontend and substantive API in separate apps when using TanStack Start with Hono. Share API contracts where useful without making the browser depend on server implementation or secrets. Keep OpenAPI, generated client types, OpenAPI Fetch, and openapi-msw aligned when moving code or changing API contracts. Update usage docs and runnable examples with API changes and include a migration guide for breaking changes.

## Testing and deployment

| Area | Preferred choice | Alternatives and constraints |
| --- | --- | --- |
| Test runner | Vitest, including backend tests | Choose tests for real user-facing problems, difficult internal regressions, or an explicit request. |
| Frontend tests | Vitest Browser Mode + Playwright | Prefer user-centric integration tests; using a browser does not make a test an E2E test. |
| Infrastructure | Cloudflare | AWS or Netlify are acceptable. A hosting preference does not authorize deployment or resource creation. |
| Repository organization | Monorepo | Keep related apps and shared packages together; avoid creating unused packages or services. |
| Package versioning and releases | Changesets | Apply to packages that need versioning and release management. |
| npm publishing | npm Trusted Publishing / GitHub OIDC | Verify runner and publisher compatibility; configuring a release workflow does not itself authorize publication. |
| GitHub Actions linting | Zizmor | Ensure required checks fail on findings; do not assume a SARIF upload alone enforces failure. |

Prefer integration tests over E2E tests, with narrow unit tests for complex logic where appropriate. Avoid mocks except at true external boundaries, and do not introduce screenshot tests without an explicit request. For a full testing workflow, use `test-like-corbin` when available; the stack choices here do not require that skill to be installed.
