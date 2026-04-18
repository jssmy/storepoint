# Visual Rules — Animation, Typography, Dark Mode & Theming

## Animation

| Rule | Flag When |
|---|---|
| Honor `prefers-reduced-motion` | CSS animation/transition or JS animation without `@media (prefers-reduced-motion: reduce)` variant |
| Animate `transform`/`opacity` only | Animating `width`, `height`, `top`, `left`, `margin`, `padding`, or `background` (non-compositor) |
| Never `transition: all` | `transition: all` in CSS or Tailwind `transition` class without explicit property list |
| Set correct `transform-origin` | Transform without `transform-origin` where origin matters (scales, rotations) |
| SVG transforms on `<g>` wrapper | SVG element animated directly without `<g>` wrapper + `transform-box: fill-box; transform-origin: center` |
| Animations interruptible | CSS animation with no mechanism to stop mid-way on user input (e.g., forced `animation-fill-mode: both` with no cancel path) |

### Common Patterns to Flag

```css
/* BAD */
.card { transition: all 0.2s ease; }

/* GOOD */
.card { transition: transform 0.2s ease, opacity 0.2s ease; }

/* BAD — no reduced-motion handling */
.spinner { animation: spin 1s linear infinite; }

/* GOOD */
.spinner { animation: spin 1s linear infinite; }
@media (prefers-reduced-motion: reduce) {
  .spinner { animation: none; }
}
```

```tsx
{/* BAD — SVG transform directly on element */}
<circle cx="12" cy="12" r="5" style={{ transform: 'rotate(45deg)' }} />

{/* GOOD */}
<g style={{ transformBox: 'fill-box', transformOrigin: 'center', transform: 'rotate(45deg)' }}>
  <circle cx="12" cy="12" r="5" />
</g>
```

---

## Typography

| Rule | Flag When |
|---|---|
| Use `…` not `...` | Literal `...` in JSX/TSX string content |
| Curly quotes not straight | Straight `"` or `'` in prose/copy strings (not in code/attributes) |
| Non-breaking spaces | `10 MB`, `⌘ K`, or brand names with a breakable space between quantity/modifier and unit |
| Loading states end with `…` | `"Loading"`, `"Saving"` without ellipsis |
| `font-variant-numeric: tabular-nums` for number columns | Tables or comparison UIs with numbers lacking `tabular-nums` |
| `text-wrap: balance` / `text-pretty` on headings | `<h1>`–`<h3>` without `text-wrap: balance` or `text-pretty` (widow words) |

### Quick Fixes

| Wrong | Right |
|---|---|
| `...` | `…` |
| `"Loading..."` | `"Loading…"` |
| `10 MB` | `10&nbsp;MB` |
| `⌘ K` | `⌘&nbsp;K` |

---

## Dark Mode & Theming

| Rule | Flag When |
|---|---|
| `color-scheme: dark` on `<html>` | Dark theme applied via CSS classes but `color-scheme: dark` missing on `:root`/`html` (native inputs, scrollbars wrong color) |
| `<meta name="theme-color">` matches background | Missing or mismatched `theme-color` meta tag in dark mode |
| Native `<select>` explicit colors | `<select>` without explicit `background-color` and `color` (broken on Windows dark mode) |
