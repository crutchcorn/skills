---
name: ui-like-corbin
description: "Build and revise user interfaces using Corbin Crutchley's accessibility and visual consistency preferences. Use for changes to interactive UI, responsive layouts, themes, or visual styling. Treat keyboard access, screen-reader behavior, focus, and zoom as correctness; verify the changed interface in the running app without expanding the task into a full accessibility audit."
---

# UI Like Corbin

Make the requested interface usable across input methods, display sizes, and user preferences. Reuse the existing design system and verify the result as a user would experience it.

## Follow the design system

- Reuse existing components and design tokens for spacing, colors, and radii before introducing new values or variants.
- Match the surrounding interface's interaction and layout conventions. Add a new pattern only when the requested behavior needs it.
- Use proper icon components from the project's icon system instead of Unicode characters as UI icons. Give meaningful icons accessible names through the control or appropriate labeling; keep decorative icons from adding redundant announcements.
- Keep changes scoped to the requested interface. Do not introduce a design-system migration as part of an ordinary UI edit.

## Treat accessibility as behavior

Keyboard interaction, screen-reader behavior, focus, and zoom are part of correctness, not optional polish.

- Prefer native semantic controls and existing accessible components. Expose the name, role, state, and relationships users need to understand the interaction.
- Make the changed flow work with a keyboard. Verify that each focused control has a visible indicator in the changed interface, including reused design-system controls. Moving, trapping, or restoring focus does not establish that its indicator is visible. Keep focus in a logical order and manage it deliberately when content opens, closes, or changes context.
- Make errors, status changes, and required input understandable without relying on color or visual position alone.
- Ensure text resizing and browser zoom preserve access to content and controls. Check that the changed layout can reflow without hiding essential actions.
- Use screen-reader verification for interactions whose announcements or focus behavior changed when the environment supports it. An accessibility-tree inspection can help, but does not by itself demonstrate the full screen-reader experience.

Apply these checks to the behavior being changed. Do not expand a focused implementation into an unsolicited audit of the entire product.

## Respect user preferences and customization

- Honor reduced-motion preferences in the motion being introduced or changed. Preserve understandable state changes without requiring unnecessary movement.
- Honor contrast preferences and maintain readable contrast and visible control and focus states across the supported themes.
- Respect light/dark preferences and preserve an explicit in-app theme selection when one exists. Do not force a theme change as a side effect of an unrelated UI edit.
- Prefer CSS custom properties for theme values over JavaScript effects that synchronize styles. JavaScript can retain responsibility for the user's selected preference and persistence.
- When theme customization is part of the feature, keep its controls keyboard and screen-reader accessible, and ensure the resulting themes preserve readable text, discernible controls, and visible focus.

These preferences guide the feature in scope; they do not require adding a new theme editor or preference system to every application.

## Review the running interface

Verify the changed flow with this sequence:

1. Launch the real application and open its existing route or preview. Inspect the changed interface at both mobile and larger viewport sizes, with the surrounding context visible.
2. Exercise the actual interaction and relevant loading, empty, error, and success states. Check keyboard operation, visible focus, and focus movement.
3. Check layout, content overflow, zoom, and text, control, and focus-indicator contrast across the supported themes affected by the work. Verify relevant motion preferences too.

If execution is unavailable, report that limitation and what was checked instead, then give this same sequence as the concrete work still pending. Do not describe source inspection or an unlaunched preview as a completed visual review.

Visual review can include temporary screenshots for inspection. Do not introduce screenshot regression tests unless the user specifically asks for them.
