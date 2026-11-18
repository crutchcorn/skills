---
name: make-change-descriptions-like-corbin
description: "Draft, revise, or review pull request bodies and reviewer-facing engineering change descriptions using Corbin Crutchley's public PR patterns. Use when explaining a change's behavior, motivation, issue context, validation, or review needs. General articles, announcements, and code implementation without a description request do not need this skill."
---

# Make Change Descriptions like Corbin

Give a reviewer enough context to understand the change without reconstructing its purpose from the diff or a conversation. Corbin's strongest examples make the behavior concrete, explain the reasoning, and sound like a capable teammate asking another capable teammate to take a look.

This guidance combines patterns from 1,041 public PRs opened before 2025 with Corbin's explicit preferences. Direct praise for a description is stronger evidence than enthusiasm for a feature. For the measurements, source examples, explicit preferences, and limits of that inference, read [references/corpus-findings.md](references/corpus-findings.md) when discussing the evidence or calibrating the style. The downloaded corpus is not required to use this skill.

## Write from the actual change

For repository work, inspect the final diff against its intended PR base, affected behavior, relevant issue context, and available validation results. For a text-only request, use the supplied facts. Preserve the repository's PR template and the user's requested audience and format.

Describe the final result for someone who has not seen the chat. If scope changed, rewrite the description around the current change. Development chronology belongs only where it explains a remaining constraint, dependency, or decision. Do not list files or commits as a substitute for explaining their purpose.

Do not invent issue numbers, test runs, screenshots, performance gains, root causes, compatibility guarantees, or contributor credit. Distinguish a plausible explanation from an established cause. If a material fact is missing, use a precise qualification or identify the missing information; do not block a useful draft over optional detail.

## Lead with behavior and purpose

Generally lead with the user's experience: who encounters the problem, what they can now do, or how their experience improves. When a change has no direct user impact, lead with its practical outcome for maintainers, contributors, or operations, such as a more reliable build or simpler maintenance. Keep the description outcomes-focused; implementation details should explain how the change achieves that outcome.

Start with the concrete problem or capability, then what this PR does about it:

- Bug fix: name the trigger, the old failure, and the resulting behavior.
- Feature: say what someone can now do. A small usage example often communicates an API better than several paragraphs.
- Documentation: identify the missing or misleading guidance and who needs it.
- Refactor, tooling, or dependency change: explain the practical reason and any relevant compatibility or workflow effect. Avoid inventing a user-visible change.

Prefer a sentence like “Saving after a network error clears the form. This change keeps the entered values so the user can retry” to “Update form state handling.” An opening such as “This PR adds…” is fine when the rest of the sentence carries useful information.

## Spend detail where it helps review

Start with a short paragraph for a routine change. Roughly 30–100 prose words is a useful starting range, not a target or limit. A one-line correction can need less; a substantial behavioral or architectural change can need much more. Code examples, screenshots, and required template text add length without necessarily adding prose.

Expand when the reviewer needs one of these:

- **Cause and solution:** connect the failure mechanism to the fix, then explain why the approach fits. Include alternatives only when they clarify a real tradeoff.
- **Before and after:** use a small code example or reproduction for behavior that is easier to demonstrate. Label what the reviewer should notice.
- **Several related changes:** use a short list organized by purpose. Keep the reason they belong together visible.
- **Compatibility and scope:** name affected APIs, runtimes, migrations, partial coverage, or remaining limitations when material.
- **Review needs:** ask a specific question, such as whether an API name fits or an example covers the intended audience. Explain what is uncertain instead of adding a generic request for feedback.

For visible or interactive changes, include live screenshots and short videos wherever possible: capture the actual running application or use supplied captures of it. Show before/after screenshots for appearance changes and use video to demonstrate interactions, transitions, or a sequence of steps. Embed or link the real artifacts and explain the user-visible result they demonstrate. Do not substitute generated mockups or invent captures or URLs. When captures are unavailable, describe the behavior accurately using the available evidence. Visual evidence complements validation; it does not replace it.

Use headings for substantial sections or required templates. Do not add empty sections, an executive summary, or a long checklist to a tiny fix. Use a checklist when it communicates actual readiness or meaningful remaining work; keep it current as the PR evolves.

## Make links explain relationships

Link the issue that supplies the problem or expected behavior when one exists. Still summarize the essential context in the description; a reviewer should not have to follow every link to understand the change.

Use a closing relationship such as `Fixes #123` only when the PR actually resolves that issue. For partial work, use language such as “Addresses the dropdown portion of #123; keyboard navigation remains.” Use a qualified issue reference or full URL across repositories.

Distinguish issues being resolved from prerequisite PRs, prior attempts, follow-ups, and supporting documentation. If another PR must land first, state that dependency and the merge order explicitly. Do not present a planned follow-up as completed work or turn someone else's contribution into Corbin's original work.

Do not invent an issue or add a link merely to imitate a recurring pattern. Many successful small changes have no issue link.

## Keep the tone candid and collaborative

Use plain language, contractions, and a direct explanation of what you noticed and changed. First person is appropriate for an actual observation, choice, or uncertainty. Credit real contributors when their work explains the origin of the change.

Be confident about demonstrated behavior and specific about limits. If tests fail on the base branch too, report the comparison only when it was actually checked. A suspected unrelated failure remains a suspicion. Replace broad apologies, self-deprecation, and “this should work” with the exact risk or review question.

Warmth or an occasional aside can fit the project. Do not manufacture enthusiasm, emojis, exaggerated claims, or a gratitude paragraph to make the prose sound like Corbin. Respect maintainers' work without apologizing for making a contribution.

## Report validation precisely

Include the checks that help someone assess this change: what was exercised and the observed result. Mention relevant failures, checks not run, and material coverage gaps. Preserve distinctions between tests added, tests executed, and manual inspection. Never mark an inherited template checkbox as complete without evidence.

Scale this to the change and repository requirements. A small documentation correction may need only a concise note about what was checked. A risky UI or API change benefits from the relevant scenario and remaining limits. Avoid narrating every command or repeating the entire CI log.

Before delivering, check that the description answers the questions that matter for this particular change: who benefits and what outcome changes, why it needed changing, why this approach, what evidence supports it, and what the reviewer still needs to decide. Return the requested text itself. Drafting does not authorize publishing or modifying a remote PR.
