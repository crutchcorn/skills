---
name: web-stack-like-corbin
description: "Choose and configure Corbin Crutchley's preferred web stack when starting a web app, selecting frontend or backend tooling, or making an explicit stack migration. Covers runtime, frameworks, routing, forms, validation, state, styling, API clients, data, auth, testing, and deployment preferences. Load it for any library choice in a web application, including a single library such as a form or routing library, so the preferred option is considered first. Explanatory writing or framework comparisons without a project technology decision do not need this skill. Do not use an unrelated feature or bug fix as a reason to replace an existing stack."
---

# Web Stack Like Corbin

Use Corbin's preferred tools for open technology decisions. Preserve the user's explicit choices and working project constraints; this skill does not authorize a stack migration or deployment.

## Load the relevant preferences

Read [references/stack.md](references/stack.md) before selecting tools. It is the source of truth for preferred tools, acceptable alternatives, and conditional choices. For each dependency, identify the current feature or integration that will use it before adding it. Defer tools whose only consumer is a possible future feature, including validation libraries when no current input boundary needs them; the preferred stack is not an installation checklist.

Read [references/compatibility.md](references/compatibility.md) when resolving package versions, configuring TypeScript execution or form logic, preserving the OpenAPI pipeline, or targeting a deployment runtime. Verify current upstream documentation before relying on release status or APIs.

## Choose the architecture

- Use Astro for marketing and other static sites.
- Prefer React for application interfaces and TanStack Router for client-side routing.
- Use TanStack Query for async/server state, TanStack Form v2 for form logic even while in alpha, and prefer Valibot for runtime validation.
- Prefer TanStack Start when the application needs SSR. Keep its API side lightweight; put the substantive backend in a separate Hono app in the same monorepo.
- Prefer Hono for the backend and PostgreSQL with Drizzle v1 RC for persistence when a database is needed.
- Prefer Cloudflare for hosting. Match dependencies to the actual deployment runtime; Node.js is the default JavaScript runtime preference, not a claim that every host runs Node.js.

For existing projects, inspect their manifests, lockfiles, configuration, and deployment requirements first. Explain a material compatibility conflict and choose a supported path within the task's scope instead of silently changing the requested tool or version.

## Configure the chosen tools

- When choosing type-checking tooling, use TypeScript 6 for both frontend and backend. Keep type checking separate from runtime execution or transpilation; do not downgrade an existing project during unrelated work.
- Use pnpm for package management. Prefer Nx for task orchestration when needed; Turborepo is also acceptable.
- Prefer Prettier for formatting and ESLint for linting. Add language support where needed, including Astro or Vue. Do not run Prettier through ESLint plugins.
- Use Stylelint for CSS/SCSS and Knip to identify unused code, dependencies, and exports. Investigate findings before removing anything.
- Use CSS Modules with SCSS strictly for media-query variables. Do not introduce Tailwind or another styling system by default, or expand Sass into a general abstraction layer.
- Generate client API types with openapi-typescript, use OpenAPI Fetch for clients, and MSW with openapi-msw for fetch mocks. Preserve the OpenAPI specification, generated types, client, and mock pipeline during refactors.
- Use Vitest, including for the backend. For frontend tests, use Vitest Browser Mode with Playwright. A choice of test runner does not require new tests for every change.

Keep formatting, linting, type checking, and the relevant build checks independently runnable. Record implementation and contributor setup in `AGENTS.md` or `CONTRIBUTING.md`; keep the project README focused on its users.

## Check the result

Check that each selected dependency serves a present requirement, the selected versions support one another, and the build targets the intended runtime. Run relevant existing checks and report any verification that could not be completed. Explain departures from these preferences in terms of the user's requirement or a concrete compatibility constraint.
