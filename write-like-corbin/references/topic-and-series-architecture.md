# Topic selection and series architecture

## Select characteristic subject matter

Prefer topics in these recurring families:

- **Frontend foundations and framework concepts:** JavaScript, the browser and DOM, React, Angular, Vue, components, rendering, reactivity, forms, and styling.
- **Internals and demystification:** compiler behavior, framework source code, scheduling, performance, memory models, and the machinery hidden by an API.
- **Cross-framework translation:** the shared concept beneath different APIs, followed by parallel implementations and a fair comparison of tradeoffs.
- **Practical engineering friction:** a bug, surprising behavior, awkward setup, migration, tooling limitation, or repeated source of confusion encountered in real work.
- **Computer-science foundations made concrete:** binary, networking, UUIDs, regular expressions, monads, compilation, and similar abstractions connected back to ordinary development.
- **Accessibility and human-centered engineering:** semantic HTML, assistive technology, inclusive UX, cognitive load, documentation, and the people affected by technical choices.
- **Engineering leadership and team systems:** communication, trust, hiring, career tracks, documentation, remote work, incentives, accountability, and organizational tradeoffs.
- **Personal career and community reflection:** nontraditional paths, mistakes, luck, privilege, local community, mental health, and lessons bounded by lived experience.
- **Transparent project or community updates:** history, governance, funding, organizational changes, contributors, and what happens next.

Treat the technology as a vehicle for a question, not the entire premise. A Corbin-like topic usually contains at least one of these tensions:

- A familiar feature feels like magic until its mechanism is exposed.
- The accepted rule is useful but incomplete or misleading.
- A simple solution works until a realistic constraint appears.
- Several tools look unrelated but share a transferable mental model.
- A technical decision has an overlooked effect on users, learners, teammates, or the business.
- A personal success becomes more instructive after naming its mistakes, luck, or structural context.

Avoid choosing a topic solely because it is fashionable. Prefer one where a concrete example, observed failure, primary source, or lived situation can anchor the explanation.

## Choose the pedagogical angle

Use one or more of these recurring approaches:

1. **Need before name:** Let the reader experience the problem before introducing the abstraction that solves it.
2. **Primitive before convenience:** Begin with browser behavior, plain JavaScript, a manual implementation, or a simplified system before showing the framework API.
3. **Mechanism before rule:** Explain why a recommendation works so the reader can transfer it beyond the demonstrated case.
4. **One complication at a time:** Start with the smallest useful example, then introduce state, interactivity, errors, performance, accessibility, or production constraints in response to visible shortcomings.
5. **Failure as evidence:** Show the broken or insufficient version, inspect the result, and let the correction reveal the mental model.
6. **Parallel comparison:** Hold the example and conceptual headings stable while changing React, Angular, Vue, or other implementations.
7. **History as causality:** Use chronology to explain which pressure produced an API or convention; do not present history as disconnected trivia.
8. **Spiral learning:** Revisit an earlier concept at greater depth after the reader has acquired the prerequisite knowledge.
9. **Practice and retrieval:** End substantial lessons with a challenge, production extension, recap, or comparison table that recombines earlier ideas.
10. **Human consequence:** Connect correctness to accessibility, maintainability, trust, learning, organizational capacity, or user experience.

State prerequisites and exclusions explicitly. Make each article hospitable to a new reader even when it belongs to a sequence.

## Plan a collection

Do not impose one universal series shape. Choose the architecture that matches the subject:

| Architecture | Characteristic flow | Best fit |
| --- | --- | --- |
| Dependency chain | baseline primitive → mechanism → new capability → limitation → deeper capability → synthesis | Frameworks, internals, and systems whose concepts genuinely depend on one another |
| Parallel lenses | shared syllabus → repeat it across tools → compare the resulting ergonomics and tradeoffs | Framework or library comparisons |
| Chronological-causal narrative | initial tension → inciting opportunity → experiment or decision → consequence → extracted lessons | Career, project history, and leadership journeys |
| Widening lens | personal observation → interpersonal pattern → team or structural effect → bounded recommendation | Leadership, accessibility, and human-centered engineering |

Most technical collections still follow a broader learning rhythm:

1. Establish the promise, audience, prerequisites, and boundaries.
2. Build a shared foundation using standards, history, or the smallest primitive.
3. Accumulate useful capabilities through a stable example or project.
4. Surface edge cases, failure modes, and escape hatches only after the baseline is clear.
5. End with synthesis: a comparison, production application, challenge, or decision framework.

Use a persistent artifact when the lessons are cumulative. Extend the same application, component, scenario, or organizational story so each new concept has a reason to exist. Do not preserve continuity when it would make an article harder to understand than a fresh example.

## Connect adjacent articles

Derive the next topic from an unresolved question rather than merely selecting another item in the same category:

- The manual approach becomes verbose, motivating an abstraction.
- A client-side capability raises a server-side question.
- A successful implementation exposes an error, timing, performance, or accessibility concern.
- A personal outcome raises the question of which circumstances, people, or systems made it possible.
- A recommendation needs a counterexample or a comparison before it can be trusted.

At the start of a follow-up article:

1. Recall only the prior result needed now.
2. Link or name the earlier piece without requiring the reader to remember it.
3. State the new gap, limitation, or question.
4. Explain what capability the reader will gain by resolving it.

At the end, close the current promise before teasing the next layer. A bridge should feel like a consequence of what was learned, not an advertisement pasted onto the conclusion.

## Preserve variety and scope

- Let foundational chapters be broad and later chapters narrower.
- Alternate dense chapters with shorter consolidation or application chapters when the material benefits from breathing room.
- Keep parallel framework sections structurally comparable without pretending the frameworks are identical.
- Let personal collections prioritize emotional or causal continuity over exhaustive topic coverage.
- Allow a series to remain incomplete when the published corpus is incomplete; do not invent missing chapters or imply they already exist.
- Avoid turning every standalone idea into a series. Use a collection only when later pieces can reuse earlier knowledge or deliberately examine the same question from another scale.
