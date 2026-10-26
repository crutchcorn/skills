# Preserve the source while constructing new branches

Use this reference when capturing the source or building the split. Choose Git mechanics that fit the repository; these invariants matter more than a particular command sequence.

## Snapshot without changing the real index

Record the original branch/ref, HEAD, status, staged and unstaged diffs, and non-ignored untracked paths and contents. Binary-capable diffs and content hashes are useful for the before/after comparison. Handle path names safely, including whitespace; prefer NUL-delimited Git output when parsing lists.

One workable snapshot approach is an isolated temporary index:

1. Set `GIT_INDEX_FILE` to a new absolute path in a temporary directory for snapshot commands only. Start with an absent file; an empty file from `mktemp` is not a valid Git index.
2. Initialize that index from the pinned source HEAD using `git read-tree`.
3. Stage the intended tracked working-tree state and selected non-ignored untracked files into the temporary index. Review the original staged and unstaged layers separately before combining them. Do not point snapshot commands at the real index.
4. Use `git write-tree` to record the final tree. If a durable snapshot commit is needed, create one with `git commit-tree` and retain its ID or a clearly identified recovery ref without moving the source branch. Keep this bookkeeping commit out of the proposed PRs.
5. Release the temporary-index environment before branch work. Verify that the source index and working files are unchanged.

A tree captures the final file state, not the user's staging boundary. Preserve the original checkout and retain the original index inventory for verification. Do not use `git add -A` against the real index or `git commit --only` on a source file containing mixed staged and unstaged work.

Sparse checkouts, skip-worktree/assume-unchanged entries, filters, and nested repositories can affect what a snapshot captures. Check for these when present. A superproject tree records only submodule commit pointers, not dirty files inside submodules. Inventory those separately and either handle them explicitly as their own repository work or report them as outstanding; never claim their contents were captured by a gitlink.

If source files change while capturing, retry the affected capture or use an already consistent snapshot. Pinning HEAD alone does not freeze uncommitted edits.

## Distinguish source work from upstream work

Let `D` be the pinned default tip, `S` the pinned source HEAD, `B` their merge base, and `T` the frozen source tree including intended uncommitted changes.

- `B → S` reveals all committed source work, even across many commits.
- `B → T` is the net source change to allocate, including intended uncommitted work.
- `B → D` reveals upstream changes that the output branches must preserve or deliberately reconcile.

When `D` advanced independently, `D → T` includes apparent reversions of upstream-only work. It is useful context, but is not the list of source changes to distribute. Likewise, concatenating per-commit patches can replay changes that were later reverted or applied twice. Group the final net change, using history to understand intent.

Build an expected combined result by integrating `B → T` onto `D` in a separate checkout. A temporary snapshot commit descended from `S` allows a three-way integration when appropriate. When Git cannot reconcile an overlap automatically, use both versions and the intended behavior to resolve it. Record the resolution; ask about genuinely ambiguous intent rather than silently discarding either side. Already-upstream source changes need no duplicate PR delta, but must remain accounted for.

Compare the combined modular branches with that integrated result, including file contents, additions/deletions, renames, binary data, and modes. A match establishes content coverage; branch-level checks still establish whether each proposed PR is coherent. If integration cannot be completed, report that gap instead of claiming full verification.

## Keep the proposed PR diffs focused

For an independent branch, construct it on `D` and review its diff from `D`. For a stacked branch, construct it on the finished prerequisite tip and review its diff from that tip. Record the target branch name and pinned base commit, since branch names can later move.

For example, a parser improvement and a telemetry fix can occupy different hunks in the same file. Give each branch only the relevant hunks and its tests. If an export feature needs a new parser API, base that feature branch on the parser branch and target the parser branch in the proposed PR. Explain the eventual target change after the prerequisite merges; do not rebase or force-push to arrange the stack.

If a conflict blocks construction, preserve the source and finished branches. Resolve it in the task's isolated checkout, or report the unresolved group with its affected paths and reason. Do not abandon source changes to obtain a clean result.
