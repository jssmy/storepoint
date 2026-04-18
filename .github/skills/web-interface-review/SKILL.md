---
name: web-interface-review
description: 'Review UI code for Vercel Web Interface Guidelines compliance. Use for auditing components, pages, or entire feature directories against accessibility, forms, animation, typography, performance, navigation, touch, theming, i18n, and content-copy rules. Produces clickable file:line findings grouped by file.'
argument-hint: <file-or-pattern>
---

# Web Interface Guidelines Review

Review files in `$ARGUMENTS` for compliance with Vercel Web Interface Guidelines. Read every file, check all applicable rules, output findings in clickable `file:line` format grouped by file.

Output: concise but comprehensive. Sacrifice grammar for brevity. High signal-to-noise. No preamble.

## Procedure

1. Identify files from `$ARGUMENTS` (glob, directory, or explicit list).
2. Read each file fully before checking rules.
3. Apply all rule categories below. Skip categories clearly inapplicable to the file type.
4. For each violation: `file.tsx:42 - <terse finding>`.
5. If a file has no violations: `✓ pass`.
6. Group output by file with a `## filename` heading.

## Output Format

```text
## src/Button.tsx

src/Button.tsx:42 - icon button missing aria-label
src/Button.tsx:18 - input lacks label
src/Button.tsx:55 - animation missing prefers-reduced-motion
src/Button.tsx:67 - transition: all → list properties explicitly

## src/Modal.tsx

src/Modal.tsx:12 - missing overscroll-behavior: contain
src/Modal.tsx:34 - "..." → "…"

## src/Card.tsx

✓ pass
```

State issue + location. Skip explanation unless fix is non-obvious.

## Anti-Patterns — Flag Immediately

- `user-scalable=no` or `maximum-scale=1` disabling zoom
- `onPaste` + `preventDefault` blocking paste
- `transition: all` — list properties explicitly
- `outline-none` / `outline: none` without `:focus-visible` replacement
- Inline `onClick` for navigation without `<a>` or `<Link>`
- `<div>` or `<span>` with click handler — use `<button>`
- `<img>` without explicit `width` + `height`
- Large array `.map()` (>50 items) without virtualization
- Form inputs without `<label>` or `aria-label`
- Icon-only buttons without `aria-label`
- Hardcoded date/number formats — use `Intl.*`
- `autoFocus` without justification comment

## Rule Categories

Check all files against the relevant reference:

- **Accessibility & Focus**: semantic HTML, ARIA, keyboard handlers, focus rings → [references/accessibility.md](./references/accessibility.md)
- **Forms**: labels, autocomplete, types, paste, errors, submit state → [references/forms.md](./references/forms.md)
- **Visual** (Animation, Typography, Dark Mode): reduced-motion, compositor props, quotes, numerics, color-scheme → [references/visual.md](./references/visual.md)
- **Performance** (Images, Content Handling, Layout reads): CLS, lazy loading, virtualization, flex `min-w-0` → [references/performance.md](./references/performance.md)
- **Navigation, State & Touch**: URL sync, deep links, destructive actions, touch-action, safe areas → [references/navigation.md](./references/navigation.md)
- **Content, Copy, i18n & Hydration**: voice, title case, Intl formatting, hydration mismatches → [references/content.md](./references/content.md)
