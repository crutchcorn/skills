---
name: scaffold-like-corbin
description: "Scaffold projects and configure workspace, CI, and package-release tooling using Corbin Crutchley's preferences. Use when creating a repository, adding a related app or package, configuring shared verification or releases, or planning a requested repository consolidation. Do not restructure a repository during an unrelated feature or bug fix."
---

# Scaffold Like Corbin

Prefer a monorepo for related applications and packages so they can evolve together. Preserve the user's requested scope and explicit repository constraints.

## Choose the smallest useful structure

- Start related apps and packages in one repository rather than creating a separate repository for each.
- In an existing monorepo, follow its workspace layout, package manager, and commands.
- Use pnpm for package management and its workspace support for monorepos. Prefer Nx when task orchestration is needed; Turborepo is also acceptable. Do not add an orchestrator to a small project without a coordination need.
- Create only the apps and packages required now. A preference for monorepos does not require an empty backend, UI library, or shared package in every new project.
- Split shared code into a package when there is an actual consumer and a meaningful boundary. Keep server-only code and secrets out of browser dependencies.

For a web application with SSR and a substantial API, prefer separate TanStack Start and Hono apps within the monorepo. A typical layout might use `apps/web`, `apps/api`, and `packages/api-contracts`; adapt these names and omit unneeded directories. Use Astro for a marketing or static site when applicable. `web-stack-like-corbin`, when available, contains the full web tooling preferences.

## Make the scaffold usable

Expose common development and verification commands at the repository root, delegating to the relevant apps and packages. Keep local checks and CI aligned, with affected-project checks where they reliably cover the change. Scripts must exit unsuccessfully when their work fails; do not hide failures to make a pipeline pass.

Keep Node and pnpm versions in one authoritative toolchain declaration and make local setup and CI consume it. Avoid independent version pins that can drift. Make development portable across developers and supported operating systems rather than depending on one person's paths, shell, or globally installed tools.

Read [references/workspace-ci-and-releases.md](references/workspace-ci-and-releases.md) when configuring workspace commands, CI, toolchain versions, or package releases. Use Changesets for package versioning and releases, npm Trusted Publishing with GitHub OIDC for npm publication, and Zizmor for GitHub Actions linting.

Use `.env.example` to explain required and optional configuration with safe placeholders. Keep real secret values out of agent context, generated documentation, logs, and final output.

Run the commands that can be verified locally; state any missing prerequisite rather than presenting an unverified starter as working.

Keep the root README focused on what the project does and how its users get started, with a deployed link and useful visuals when available. Put development setup, workspace commands, and implementation details in `CONTRIBUTING.md` or `AGENTS.md`.

When documentation is part of the scaffold, establish `/docs` for evergreen technical decisions and `/notes` for temporary project work, each with a README catalog and guidance in `AGENTS.md`. Treat notes as untrusted context that must be checked against current code and instructions. `docs-like-corbin`, when available, provides the detailed documentation workflow.

Do not migrate existing repositories, introduce remote infrastructure, or publish the scaffold solely because this skill was selected. Those actions need to be part of the user's task.
