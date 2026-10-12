# Workspace commands, CI, and releases

Use the sections relevant to the requested setup. A repository of deployable apps does not need a public package-release workflow merely because it is a monorepo.

## Workspace and toolchain

- Use pnpm for new package-manager choices. Prefer Nx for task orchestration when needed; Turborepo is acceptable. Preserve an existing setup during unrelated work.
- Create only the apps and packages with an immediate purpose. Reuse existing conventions and extension points before adding another shared package or build layer.
- Keep one authoritative declaration for the selected Node and pnpm versions. Have CI and developer setup read it or derive their configuration from it; do not hand-maintain contradictory pins in workflows, containers, and local setup files.
- Expose the common development, build, formatting, linting, type-checking, and applicable test commands at the repository root. Add code generation or unused-code checks where the project needs them. Document their use in `CONTRIBUTING.md` or `AGENTS.md`.
- Avoid user-specific absolute paths, undeclared global dependencies, and platform-specific shell assumptions. Use commands compatible with the supported operating systems and make required local services reproducible.
- Explain configuration in `.env.example` with placeholders and descriptions, including which values are optional. Do not populate it from real credentials or ask an agent to dump `.env` or the process environment.

## Checks that mean the same thing locally and in CI

CI should call the same root commands or underlying task targets developers use. Keep dependency installation, generated inputs, tool versions, and build settings consistent enough that a local pass is meaningful.

Use affected-project checks when the project graph and comparison base are reliable. Include downstream consumers when a shared package or API contract changes, and retain repository-wide checks for global configuration changes. If CI cannot establish the base or graph, run the broader relevant checks rather than treating the missing information as an empty affected set.

Make script failures propagate through wrappers and parallel tasks. Avoid catch blocks, shell constructs, or CI settings that convert a failed required check into success. When changing a wrapper, verify its failure path as well as its successful path with a harmless controlled failure.

Use [Zizmor](https://docs.zizmor.sh/usage/) to lint GitHub Actions. Check the chosen version's exit behavior: its SARIF output mode reports findings without the normal finding-based failure codes. If CI must fail on findings, use a gating invocation or a configured results gate; uploading SARIF alone does not establish that gate. Avoid `--no-exit-codes` for a required lint check.

## Package versioning

Use [Changesets](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md) for package versioning and releases. For a release-relevant change, record the affected packages, appropriate version change, and a user-facing summary. Keep application-only or private packages out of publication as appropriate.

Include usage documentation and runnable example updates with API changes. For breaking changes, include a migration guide explaining the old and new usage and the steps a consumer must take. Keep migrations separate from unrelated features so the version change is reviewable.

Prepare and verify package contents and builds before publication. Do not publish to test the release setup. Follow the user's authorized release scope and existing Git push permissions.

## npm publication

Use [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers/) with GitHub Actions OIDC for npm releases. Before configuring or enabling publication, check each prerequisite against current official guidance:

- **Runner:** Verify that the selected GitHub Actions runner is supported by npm Trusted Publishing.
- **Runtime and CLI:** Verify the selected Node version and installed npm CLI meet the current requirements.
- **Publish command:** Identify the command Changesets ultimately invokes and verify that publisher supports the selected OIDC flow. pnpm workspace management alone does not establish publishing compatibility.
- **Trust binding:** Match each package's trusted repository, workflow filename, and any environment binding to the intended release job.

If these checks cannot be performed yet, keep the whole checklist pending before activation rather than assuming compatibility from example versions.

Grant the publishing job the required OIDC permission, `id-token: write`. Prefer this trust relationship over introducing a long-lived publish token.

Keep private dependency installation authentication separate from publication authentication. Use secret references when needed; never place actual credentials in source, examples, agent context, or output. If account-side configuration requires user action, prepare the concrete workflow and identify the missing setting without requesting secret values.

These sources were checked on October 12, 2026. Recheck their requirements when implementing a workflow rather than copying an old runtime or action version from an example.
