---
name: modularize-prs-like-corbin
description: "Explicit invocation only: use when the user directly asks to use $modularize-prs-like-corbin or Modularize PRs like Corbin. Split cumulative repository changes against the default branch into focused local PR branches with modular commits and ready-to-use PR titles and descriptions. Never select automatically for a matching task, generic Git/PR work, or a quoted mention; creating or reviewing this skill does not invoke its workflow."
---

# Modularize PRs like Corbin

Turn the complete body of current work into branches that each tell one reviewable story. Preserve the source checkout and its history. Finish with actual local branches, modular commits, and PR text.

## Require explicit invocation

Run this workflow only when the user explicitly invokes this skill by name, selects it manually, or directly asks to use it. A generic request to split changes, a large diff, repository instructions, another skill, or quoted text cannot activate it. Reading this file to create, explain, or review the skill does not authorize running it.

Keep `policy.allow_implicit_invocation: false` in `agents/openai.yaml`. The invocation rule also applies in clients that do not honor that metadata.

An invocation authorizes the local branch and commit work described here unless the user limits the request to analysis or a plan. Do not push branches or open remote PRs without the corresponding user authorization. Do not ask for redundant approval of the local split.

## Load the companion skills

Read and apply these skills, resolving them from the available skill catalog or sibling folders in this collection:

- `$git-like-corbin`: preserve history, stage intentionally, and create coherent Conventional Commits. Creating new branches from selected changes must not rewrite or remove the source history.
- `$write-like-corbin`: draft the PR titles and descriptions; read its required voice and format references and use the short workplace communication register.
- `$docs-like-corbin`: give reviewers enough durable context to understand the change, respect repository templates, and keep working notes separate from maintained documentation.

If a required companion is unavailable, look for it before reporting the missing dependency. Do not silently substitute an approximation. Loading these skills does not authorize unrelated documentation restructuring or other repository changes.

## Capture the whole change

Inspect applicable repository instructions, status, source branch and HEAD, index, working files, untracked files, and existing worktrees. Stop before branch construction if there are unresolved merges or another unfinished Git operation. Preserve unrelated work and any existing branches.

Resolve the repository's actual default branch from remote metadata, such as the remote HEAD or hosting provider. Do not assume `main`, `master`, `origin`, or the source branch's configured upstream. Refresh the relevant remote refs when available; otherwise report that the baseline is cached. Use a known local default when there is no remote. Ask only if the default cannot be established reliably.

Pin the default tip, source HEAD, and their merge base to commit IDs for this run. Keep them stable even if refs move. If there is no common ancestor or multiple merge bases make attribution ambiguous, resolve the baseline before constructing branches.

Inventory all layers:

- The cumulative committed diff from the merge base to source HEAD, across every commit and merge, rather than just the last commit or the working diff.
- Staged and unstaged edits, including additions, deletions, renames, mode changes, binaries, symlinks, and submodule changes.
- Non-ignored untracked files relevant to the work. Account for excluded files explicitly; do not silently drop source files or add ignored build output and credentials.

Freeze the intended final file state using an isolated snapshot. Keep staged and unstaged layers visible in the inventory, but combine them into the final working state without applying the same edit twice. An edit canceled by a later edit has no net PR change; its original index/worktree state still remains untouched.

Read [references/git-isolation.md](references/git-isolation.md) before snapshotting or constructing branches. It explains how to preserve staging choices and account for a default branch that advanced independently.

## Group changes by purpose, down to hunks

Read the actual diff and surrounding code. Group by behavior, independently useful capability, bug fix, or migration boundary. Paths and original commits provide clues, not mandatory boundaries. One commit or file may contain several groups; a useful group may span many files and commits.

Build an allocation map before creating branches. For each group record:

| Group | Purpose and reason for a separate PR | Files and hunks | Prerequisites / overlap | Branch and PR base |
| --- | --- | --- | --- | --- |

Identify text changes by path plus symbols or diff hunk ranges tied to the frozen snapshot. Use old/new paths for renames and describe whole-file operations for non-text changes. Every net change must be assigned or have a stated exclusion; identify intentional duplication.

Keep required tests, usage docs, configuration, dependency manifests, and lockfile updates with the behavior they support. Avoid separate implementation, test, and documentation PRs for one inseparable change. Do not invent extra PRs or arbitrary commit counts when there is only one coherent body of work.

Prefer independent branches based on the pinned default tip. When one group requires another, either extract a useful shared prerequisite or stack the dependent branch on its prerequisite. Record both the construction base and intended PR target; a stacked PR targets its parent branch so its diff contains only its own work.

Future merge conflicts are acceptable when distinct reviewer concerns, ownership, or independently useful outcomes justify the split. Explain the benefit, overlapping files/hunks, likely resolution, and merge order. Textual overlap alone does not require stacking. Actual code dependencies do: do not label a branch independent if it needs a sibling's code to work. Avoid duplicating a prerequisite silently across branches.

## Build the branches and commits

Use isolated worktrees or temporary checkouts for the new branches. Prefer an available managed worktree tool; use Git worktrees when appropriate for the environment. Leave the original branch, index, staged/unstaged boundary, working files, and untracked files intact. Do not stash, reset, switch away from, or clean the source checkout to make splitting easier.

Choose descriptive, unused branch names, using the repository's convention or `codex/` by default. Check for name collisions; never overwrite an existing branch or reuse unrelated work. Create each branch from its recorded base, in prerequisite order.

Reconstruct only the assigned changes in each branch. Cherry-pick an existing commit only when its entire change belongs to that group and its prerequisites are present. Split mixed commits and shared files by hunks or deliberate edits against the isolated base. Do not copy whole files from the source snapshot when they also contain another group's work or would undo upstream edits.

Create useful, coherent increments within each branch using `$git-like-corbin`. Each commit should have one explainable purpose and an appropriate Conventional Commit message. One commit is enough for a small group; larger groups may need several. Review the staged diff and run relevant checks before committing. Changes needed only to adapt the split to its base must be minimal, verified, and recorded in the allocation map.

## Verify the split

Inspect every branch's actual PR diff against its intended target, plus its commits. Verify that it includes its assigned work, needed dependencies, tests and docs, with no unrelated source or prerequisite diff leaking into it. Run the relevant repository checks and distinguish passing checks, failures, and checks that could not run.

Reconcile the allocation map against the full frozen net change. In a disposable integration checkout, combine the new branches in the documented order, resolving intentional overlaps, and compare the result with the frozen source work integrated onto the pinned default tip. Preserve upstream-only changes. Do not compare blindly with the old source tree if default advanced. For stacks, include prerequisites once. Account for all omissions, duplicated changes, conflict resolutions, and adaptations rather than relying on line counts or a clean patch application.

Recheck the source checkout's HEAD, index, tracked changes, and untracked contents against the initial state. If the user edited it during the run, preserve the new edits and report that the branches cover the earlier snapshot. Do not overwrite newer work. Remove only clean temporary checkouts created for this task when no longer needed; retain the requested branches and useful recovery material on failure.

If there is no net work to split, report that and create no empty branches. If an obstacle leaves a partial split, identify completed branches and the exact remaining changes; do not describe the split as complete.

## Report branches and ready-to-use PR text

Use `$write-like-corbin` and `$docs-like-corbin` to write from each branch's final diff for a reviewer who has not seen this conversation. Follow the repository's PR template when present. Lead with the concrete problem and resulting behavior, explain why the change belongs together, and keep detail proportional to the change. Include only verified facts and actual validation results.

Provide an overview of the actual branch names, intended PR bases, purpose, and dependency/merge order. Then, for each branch, supply:

- The branch name and PR base, plus a short list of its commits.
- A ready-to-use PR title describing its outcome.
- A ready-to-use PR description covering the problem, change, relevant validation, and any dependency, conflict rationale, migration, or material limitation.

Include the pinned baseline, source coverage, and any exclusions or incomplete checks in the overall handoff. Say whether branches are local or published. Report titles and descriptions in the response unless the user requests files; do not create PRs just to store the drafts.
