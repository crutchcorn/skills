# Evidence from Corbin's public PRs

## Collection and interpretation

Collected on November 18, 2026 with `gh api graphql`, querying public PRs by `author:crutchcorn` and creation date before January 1, 2025. Two disjoint date partitions returned 377 and 664 PRs, avoiding GitHub search's 1,000-result ceiling. All 1,041 unique results were downloaded across 155 repositories. The earliest returned PRs are from 2015.

The local research directory is `.tmp/github-prs-before-2025/` at the repository root. It contains raw API pages, `prs.json`, individual Markdown descriptions, `index.csv`, the collection manifest, analysis scripts, computed statistics, and qualitative review candidates. It is ignored by Git. Installed copies of this skill do not need that directory.

Collected evidence includes 1,533 issue comments, 943 submitted review records, and 173 reactions on PR bodies. All comment, review, reaction, and closing-issue connections were checked for pagination and their downloaded counts reconciled. The 938 inline review threads were counted, but their comments were not downloaded. Deleted or no-longer-public PRs cannot be recovered from this public search.

These are **current API descriptions of PRs opened before 2025**, not reconstructed original descriptions. Bodies, checklists, reactions, and review states can change. Feedback includes later activity; 23 nonauthor comments or nonempty review summaries in the heuristic human set are dated 2025 or later. GitHub does not establish which body version a reviewer read.

“Best received” is not a measured description-quality score:

- Direct feedback about the description itself is the strongest available evidence.
- Nonauthor thumbs-up and heart reactions on the PR body are positive engagement, but usually concern the feature or fix too.
- Nonauthor approval records indicate successful review, not necessarily praise for the prose or a final approval state.
- Merge status, comment volume, project stars, and time to merge were not used to rank writing quality. An author's own merge is not independent endorsement.
- Bot filtering excludes `[bot]`/`-bot` suffixes and known service accounts; it is heuristic. Example feedback was inspected manually.

This is an observational, uneven corpus. Playful Programming supplies 449 PRs, TanStack Form 89, and Clerk Docs 68. Project culture, templates, feature demand, reviewer relationships, change size, and editing after feedback all affect comparisons. A missing reaction or approval is **absence of a recorded signal**, not negative reception. Some descriptions explicitly reuse other contributors' work and should not be treated as independent samples of original phrasing.

## Length

Counts below approximate visible prose: Unicode word tokens after removing HTML comments, fenced code, image embeds, and URLs, while retaining link labels. Visible template text and checklists remain, so these are not clean counts of authored sentences. Percentiles use nearest observed ranks; medians average the two central values when needed.

| Group | PRs | Nonempty descriptions | Median words in nonempty descriptions | Middle 50% |
| --- | ---: | ---: | ---: | ---: |
| Entire corpus | 1,041 | 797 | 34 | 15–66 |
| At least one nonauthor thumbs-up or heart | 59 | 56 | 64.5 | 40–90 |
| At least one nonauthor approval record | 310 | 262 | 39 | 18–67 |
| Either of those signals | 351 | 302 | 41.5 | 19–75 |
| Neither recorded signal | 690 | 495 | 31 | 13–59 |

Including hooray and rocket reactions expands the positive-reaction group to 75 PRs; its 68 nonempty descriptions have a median of 66 words. This sensitivity check supports the same broad observation: engaged PRs often contain a little more context, but most descriptions remain brief.

That association is inconsistent within projects. At Playful Programming, the median is 27.5 words overall versus 26 in the signal group; at TanStack Form it is 36 versus 69; at Plop it is 53 in both. These comparisons use nonempty descriptions and the union of primary reactions and approval records. They do not control for templates or complexity. There is no demonstrated optimal length or reason to enforce a minimum.

**Practical inference:** a short paragraph is a better default than a report. Let explanation, examples, and reviewer decisions determine the final length. The skill's approximate 30–100-word starting range is an editorial recommendation, not an empirically established success threshold.

## The clearest direct endorsement

In [gitgraph.js #392](https://github.com/nicoespeon/gitgraph.js/pull/392), the maintainer [explicitly praised the description](https://github.com/nicoespeon/gitgraph.js/pull/392#issuecomment-732521028):

> The PR description is very nice. I like the before/after examples and your explanation is very clear.

The description contains approximately 318 prose words. It establishes its prerequisite PR and merge order, links two issues, shows broken and corrected screenshots, explains the positioning problem and approach, and connects the implementation to maintenance benefits. It is much longer than the corpus median for a good reason: there is a mechanism to explain.

The same reviewer also identified visual regressions, and the PR later received approval after fixes. Clear explanation helped review; it did not establish that the code was already correct. This is the strongest direct evidence for showing before/after behavior and explaining cause and effect. It is one explicit endorsement, not a broad causal result.

The original also includes a broad apology and historical technical and Git-workflow details. Those are not recommendations to reproduce. Preserve the useful reasoning and respect current project requirements.

## Recurring useful moves

| Move | Source and reception | What to carry forward |
| --- | --- | --- |
| Show the new API rather than describe it abstractly | [TanStack Form #925](https://github.com/TanStack/form/pull/925): 22 nonauthor hearts, an approval, 40 prose words plus a code sample | One sentence explains field validation from a form schema; the example shows the consumer behavior. A readiness checklist records adapter and documentation work. Feature enthusiasm is not direct praise for the text. |
| Make a visual fix inspectable | [Playful Programming #202](https://github.com/playfulprogramming/playfulprogramming/pull/202): one heart, approval, enthusiastic reviewer feedback | Three specific dropdown defects are paired with before/after screenshots or a result image. This makes the observable change easier to review than a styling-file inventory. |
| Explain a tradeoff in terms of users and maintainers | [TanStack Form #439](https://github.com/TanStack/form/pull/439): one thumbs-up and an approval | Connect DOM-independent APIs to React Native, different UI libraries, and future adapters. Explain why extra caller syntax buys something useful. |
| State uncertainty precisely | [node-plop #97](https://github.com/plopjs/node-plop/pull/97): two thumbs-up, merged and released | Explain the type-definition purpose, then identify three failing tests and uncertainty about their relationship to the change. Preserve that qualification; do not upgrade a suspicion into a verified baseline comparison. |
| Credit prior work and give reviewers a preview | [Playful Programming #47](https://github.com/playfulprogramming/playfulprogramming/pull/47): three thumbs-up and three hoorays | Name the designer, link a preview, and explain a material asset-usage constraint. Warmth has a concrete subject rather than being decoration. |
| Separate the problem, evidence, and intended improvement | [Flagsmith client #32](https://github.com/Flagsmith/flagsmith-js-client/pull/32): maintainer discussion and merge, no body reactions | A failing caller example, the reported errors, and the intended behavior make a short report concrete. This illustrates the writing pattern; it is not a top-reaction example. |

The recurring focus is the consumer's experience or the maintainer's decision: what was broken or missing, what is now possible, and why the approach makes sense. Internal details earn space when they establish that relationship.

## Issues, evidence, and structure

Of the 59 PRs with a primary positive body reaction, 24 contain an issue-style reference, 19 contain a URL, 29 contain code formatting, 23 contain a list, 13 contain a heading, four contain an image or media marker, and 26 contain validation or reproduction vocabulary. These are lexical feature counts, not judgments about whether a linked issue was resolved, whether a test ran, or whether a screenshot was sufficient. Templates can inflate them.

Across all 1,041 PRs, 255 contain an issue-style reference and 114 contain a closing keyword with an issue reference. The signal union contains 102 and 51 respectively. Issue references occur often enough to be a useful habit, but most PRs lack one; this is not evidence for requiring an issue on every change.

[gitgraph.js #392](https://github.com/nicoespeon/gitgraph.js/pull/392) distinguishes a prerequisite from the issues it resolves. [node-vibrant #77](https://github.com/Vibrant-Colors/node-vibrant/pull/77) explains overlap with another PR and which work belongs there. Those relationships matter more than link count. A partial fix should describe its scope rather than promise full closure.

**Practical inference:** preserve repository templates, but do not imitate their boilerplate as personal style. Add examples, headings, lists, links, or readiness checklists when they make a particular review easier. Describe actual validation and limits rather than copying a checked box.

## Tone and counterexamples

The useful register is conversational and collaborative: a concrete observation, a proposed improvement, relevant credit, and a specific uncertainty or request. Some historical descriptions add emojis, enthusiastic compliments, apologies, or self-deprecation. The data does not establish that these increased reception. Keep warmth when natural; replace vague modesty with a precise limitation or question.

Two counterexamples prevent overfitting:

- [Playful Programming #98](https://github.com/playfulprogramming/playfulprogramming/pull/98) has an empty description, three primary positive reactions, and an approval. Reactions can celebrate the underlying work without evaluating the description.
- [TypeScript Handbook #852](https://github.com/microsoft/TypeScript-Handbook/pull/852) received five hoorays but was closed because of documentation placement and scope. [rehype-img-size #5](https://github.com/ksoichiro/rehype-img-size/pull/5) received two thumbs-up, while its maintainer still raised CommonJS compatibility concerns and handled the work separately. Enthusiasm, compatibility acceptance, and merge decisions are different outcomes.

The skill therefore combines observed habits with bounded editorial judgment: lead with meaningful behavior, make reasoning inspectable, scale detail to the review, connect relevant issues, and preserve honesty about validation and remaining scope. It does not claim that any template or tone guarantees approval.

## Corbin's explicit follow-up preferences

After reviewing the initial skill, Corbin requested two additions. These are stated preferences, rather than further statistical conclusions from the corpus:

- Include live screenshots and videos wherever possible. For visible or interactive changes, use captures of the running application to demonstrate the result.
- Generally focus on users where relevant, and remain outcomes-focused otherwise. Internal changes should still explain their practical benefit to maintainers, contributors, or operations.
