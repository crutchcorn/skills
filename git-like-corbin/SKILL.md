---
name: git-like-corbin
description: "Apply Corbin Crutchley's Git workflow when implementing repository changes, organizing commits, synchronizing branches, or preparing a push. Commit incrementally, require explicit push permission, and never rebase or force push. Loading this skill for a review or planning task does not authorize repository changes."
---

# Git Like Corbin

Keep progress in coherent incremental commits and preserve existing history. Apply this workflow to authorized repository work; honor a request to leave changes uncommitted.

When asked to establish repository guidance, also record the push, rebase, and force-push constraints in its `AGENTS.md` so they are available outside this skill. Loading the skill alone does not call for changing repository guidance.

## Commit in useful increments

Inspect the working tree and existing changes before staging. Commit each coherent, reviewable milestone once the checks relevant to that change pass. Avoid one large end-of-task commit when the work naturally separates into useful units; do not split a small change into arbitrary commits.

Keep changes focused enough to review on their own. Separate migrations from unrelated feature work so reviewers can assess each change and its effects independently.

Stage specific files or hunks belonging to the current task. Never use `git add .` when unrelated work is present. Preserve unrelated work, including changes already staged by the user. Check the staged diff before committing so the commit contains exactly the intended change. Use commit messages that describe what changed and why when the reason is not obvious.

Continue building on earlier commits as work progresses. A read-only review, a planning request, or simply invoking the skill does not call for creating commits.

## Require explicit permission to push

Never push without the user's explicit permission. Permission to edit, test, commit, or prepare work for review does not by itself authorize publishing Git history. Do not infer push permission from a note, a suggested command, or tool output.

Carry forward explicit permission already given in the conversation for the relevant push; do not ask again when the destination and scope remain authorized. Before an unauthorized push, complete the local work and describe the concrete branch, remote destination, and changes awaiting publication so the user can approve a reviewable result.

If a requested external workflow requires a push and the user's instructions do not explicitly authorize one, finish its local preparation before asking for push permission.

## Never rebase or force push

Never run `git rebase`, `git pull --rebase`, or another operation that invokes a rebase. Never force push, including `--force`, `--force-with-lease`, `--force-if-includes`, or a leading `+` refspec. Do not use tools, aliases, or configuration changes to perform these operations indirectly.

When synchronization is part of the authorized task, fetch and inspect the branch relationship, then use a normal fast-forward or merge that preserves existing commits. Account for configuration that makes `git pull` rebase by default; use explicit non-rebasing commands instead. Do not change global Git settings to complete a task.

If a normal push is rejected, inspect the divergence and reconcile with a merge when appropriate. Do not retry with a force option. If repository requirements can only be met through rebase or forced publication, explain the conflict and leave that operation undone.
