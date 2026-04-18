# Accessibility & Focus Rules

## Accessibility

| Rule | Flag When |
|---|---|
| Icon-only buttons need `aria-label` | `<button>` with only an icon child, no visible text, no `aria-label` |
| Form controls need `<label>` or `aria-label` | `<input>`, `<select>`, `<textarea>` without associated label |
| Interactive elements need keyboard handlers | `onClick` present but `onKeyDown`/`onKeyUp` missing on non-native interactive elements |
| `<button>` for actions, `<a>`/`<Link>` for navigation | `<div onClick>` or `<span onClick>` used instead |
| Images need `alt` | `<img>` without `alt` attribute; decorative images need `alt=""` |
| Decorative icons need `aria-hidden="true"` | Icon components beside visible label text, no `aria-hidden` |
| Async updates need `aria-live="polite"` | Toast notifications, inline validation messages, status updates without live region |
| Prefer semantic HTML over ARIA | `role="button"` on a `<div>` when `<button>` would work |
| Headings hierarchical `<h1>`–`<h6>` | Heading levels that skip (e.g., `<h1>` followed by `<h3>`) |
| Skip link for main content | App shell / layout files without `<a href="#main-content">Skip to content</a>` |
| `scroll-margin-top` on heading anchors | `<h2 id="...">` used as anchor target without `scroll-margin-top` to clear sticky headers |

### Common Patterns to Flag

```tsx
// BAD — no aria-label on icon button
<button onClick={close}><XIcon /></button>

// GOOD
<button onClick={close} aria-label="Close dialog"><XIcon aria-hidden="true" /></button>

// BAD — div used as button
<div onClick={handleSave} className="btn">Save</div>

// GOOD
<button onClick={handleSave}>Save</button>

// BAD — async update without live region
<div>{validationMessage}</div>

// GOOD
<div aria-live="polite">{validationMessage}</div>
```

---

## Focus States

| Rule | Flag When |
|---|---|
| Interactive elements need visible focus | `<button>`, `<a>`, `<input>` etc. without `focus-visible:ring-*` or equivalent focus style |
| Never remove outline without replacement | `outline-none` or `outline: none` in CSS/className without a compensating `focus-visible:` style |
| Use `:focus-visible` over `:focus` | `:focus { outline: ... }` — prefer `:focus-visible` to avoid ring on mouse click |
| Group focus with `:focus-within` | Compound controls (e.g., combobox, custom dropdown) that could use `:focus-within` for group indicator |

### Common Patterns to Flag

```tsx
// BAD — outline removed, nothing replaces it
<button className="outline-none">Submit</button>

// GOOD — removed for mouse, visible for keyboard
<button className="outline-none focus-visible:ring-2 focus-visible:ring-blue-500">Submit</button>

// BAD — CSS uses :focus (shows ring on click too)
button:focus { outline: 2px solid blue; }

// GOOD
button:focus-visible { outline: 2px solid blue; }
```
