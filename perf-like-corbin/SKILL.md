---
name: perf-like-corbin
description: "Investigate and improve application performance using Corbin Crutchley's preferences. Use for performance regressions, bundle-size changes, route-specific loading, or optimization work. Measure the relevant behavior and preserve the intended experience; do not turn unrelated changes into a performance audit."
---

# Perf Like Corbin

Make the intended experience faster with evidence from the environment that matters. Keep the investigation and changes scoped to the reported problem or requested optimization.

## Establish a useful comparison

Identify the affected user action, page, or workload and the performance property that needs to improve. Measure a meaningful baseline before optimizing or making a bundle-size change. Use the project's existing measurement tools when they can answer the question.

- Define the before/after report before changing code: the metrics to compare, tested target and workload, build/cache/runtime conditions, and uncertainty the comparison must account for. Repeat those conditions after the change; measure production output for production bundle or loading claims.
- Validate against the actual target and a representative workload: the relevant browser, device class, deployment runtime, data volume, or concurrency. A local development result is not automatically evidence about production.
- Measure what the user experiences or the resource cost at issue. For example, use route payloads for a loading problem and a representative request workload for a slow endpoint.
- Account for normal variability. Repeat a noisy measurement enough to distinguish an improvement from noise; avoid reporting one unusually favorable run.
- If the target or baseline is unavailable, state what was measured and the remaining limit. Do not invent a comparison or present an unverified speedup as established.

When you cannot inspect code or run measurements, include the complete comparison plan above in the proposal. Identify missing inputs without deferring post-change verification to a future follow-up.

Choose a focused change based on the evidence. Do not add a benchmark framework or broaden into a repository-wide audit when existing tools and a narrow comparison suffice.

## Load features where they are used

Keep feature-specific JavaScript and CSS on the pages that use that feature. Inspect the actual route output or network requests when changing imports, splitting a bundle, or moving styles.

- Avoid placing a page-specific dependency or stylesheet in a shared entrypoint solely for convenience.
- Use the framework's supported route loading and code-splitting mechanisms. Shared code belongs in a common bundle when its consumers genuinely need it.
- Check both the page using the feature and an unrelated page. Confirm that the feature still works and that its assets no longer burden pages that do not use it.
- Include the cost of deferred work in the result. Moving work later can trade initial loading for a slower interaction; verify the interaction the user will actually perform.

## Preserve the intended experience

Keep the requested design, behavior, accessibility, and useful feedback intact while optimizing. Do not quietly remove a visual, interaction, or feature to improve a metric. If a material experience tradeoff is necessary, explain the concrete choice within the user's requirements.

Use CSS custom properties and the cascade for theme values and visual state that CSS can express. Avoid JavaScript effects that synchronize the same values across elements. JavaScript may still own a real user preference, persistence, or other application behavior; expose the needed state to CSS without duplicating the styling logic.

## Verify the improvement

Repeat the relevant baseline measurement after the change under comparable conditions, and check the affected behavior and appearance. Report the before/after result, the tested target and workload, and any material uncertainty or shifted cost. Keep speculative improvements separate from measured ones.
