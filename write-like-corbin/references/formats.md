# Format patterns

## Technical tutorials and explainers

Use this default shape:

1. Name the confusing behavior or practical problem.
2. State prerequisite knowledge or scope when needed.
3. Show the smallest runnable or imaginable example.
4. Ask what the output means or why the behavior occurs.
5. Explain the mechanism in plain language.
6. Add capability or complexity step by step.
7. Cover an edge case, common misconception, or performance/accessibility concern.
8. Summarize what the reader can now do.

Prefer executable examples over abstract pseudocode when practical. When comparing frameworks, explain the shared concept first, then show parallel React, Angular, and Vue treatments with the same example and comparable headings.

Use warnings for unstable APIs and notes for details that matter without interrupting the main path. Link claims to primary sources when technical facts could change.

For a history-led technical explainer, state the thesis early, then alternate between the historical pressure and the code or API it produced. Reconnect each era to the thesis so the timeline explains the present-day mental model rather than becoming trivia.

### Miniature example

Generic:

> Signals provide reactive state. Create one and subscribe to it.

Corbin-shaped:

> Think about the last time a value changed in your JavaScript but the page stayed exactly the same. Annoying, right? A signal gives us two pieces we can connect: a place to store that value and a way to tell interested code that it changed. Let's build the smallest version first.

## Leadership or personal essays

Use this default shape:

1. Open inside a specific moment or uncomfortable question.
2. Provide only the backstory needed to understand the stakes.
3. Show the decision, including uncertainty or a mistake.
4. Explain what happened rather than retroactively making the path look inevitable.
5. Extract a small set of reusable lessons.
6. Identify who might face different constraints.
7. Close on a human consequence or practical action.

Use first person freely, but do not make the story self-congratulatory. Name luck, privilege, team contribution, and incomplete knowledge when relevant. Give public credit and take responsibility for failures.

### Miniature example

Generic:

> Managers should document decisions so teams have context.

Corbin-shaped:

> I used to think repeating the context behind a decision was redundant. After all, we'd already talked about it in a meeting. Then a teammate asked a question that made the real problem obvious: they had never been invited to that meeting. Documentation wasn't bureaucracy in this case; it was the only way the decision could travel farther than the room.

## Announcements and community updates

Use this default shape:

1. Put the news in the first paragraph, often in bold.
2. Explain the motivation and prior context.
3. State what changes and what remains stable.
4. Credit named contributors and partners.
5. Be transparent about money, governance, limitations, or uncertainty when relevant.
6. Explain what comes next.
7. Give readers a concrete way to participate.
8. End with gratitude; sign with Corbin's role only if appropriate.

Keep brand playfulness, but make the operational facts unmistakable.

## Short workplace communication

Use BLUF:

1. State the ask, decision, or status in the first one or two lines.
2. Add enough context to prevent a clarification round-trip.
3. Use bullets or numbering when recipients must answer multiple points.
4. Explain the rationale behind directives.
5. Separate sensitive feedback from public coordination.

Keep this much tighter than an article. A Corbin-like message is contextual and glanceable, not necessarily long.

## Voice assessment

When reviewing whether text sounds like Corbin, evaluate five dimensions:

| Dimension | Strong match |
| --- | --- |
| Reader relationship | Collaborative, respectful, assumes capability |
| Reasoning | Cause and effect are explicit; `why` is visible |
| Evidence | Concrete example, experience, code, or source anchors the claim |
| Nuance | Recommendation has limits and alternatives |
| Humanity | User, learner, teammate, or community impact remains visible |

Address each of the five dimensions by name, including the ones the text handles well, so the reader can see the full picture. Give specific revision suggestions. Do not score surface phrases while ignoring the underlying reasoning.
