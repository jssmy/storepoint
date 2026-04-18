# Navigation, State, Touch & Layout Rules

## Navigation & State

| Rule | Flag When |
|---|---|
| URL reflects state | Filters, tabs, pagination, expanded panels managed with `useState` only — not synced to URL |
| Links use `<a>`/`<Link>` | Navigation triggered via `onClick` + `router.push()` on a non-anchor element (breaks Cmd/Ctrl+click, middle-click) |
| Deep-link all stateful UI | Stateful UI (drawer open, selected tab, search query) using `useState` without URL sync (`nuqs` or similar) |
| Destructive actions need confirmation | Delete/reset actions with no confirmation modal or undo window — immediate execution |

### Common Patterns to Flag

```tsx
// BAD — navigation on div, no middle-click / Cmd+click support
<div onClick={() => router.push('/dashboard')}>Dashboard</div>

// GOOD
<Link href="/dashboard">Dashboard</Link>

// BAD — tab state lost on reload/share
const [activeTab, setActiveTab] = useState('overview');

// GOOD — sync to URL
const [activeTab, setActiveTab] = useQueryState('tab', { defaultValue: 'overview' });

// BAD — immediate destructive action
<button onClick={deleteProject}>Delete Project</button>

// GOOD — confirmation required
<button onClick={() => setShowConfirm(true)}>Delete Project</button>
{showConfirm && <ConfirmModal onConfirm={deleteProject} onCancel={...} />}
```

---

## Touch & Interaction

| Rule | Flag When |
|---|---|
| `touch-action: manipulation` | Interactive elements (buttons, links, custom controls) without `touch-action: manipulation` (double-tap zoom delay on mobile) |
| `-webkit-tap-highlight-color` intentional | No explicit `-webkit-tap-highlight-color` (should be `transparent` or brand color — not browser default blue) |
| `overscroll-behavior: contain` in overlays | Modal, drawer, or bottom sheet missing `overscroll-behavior: contain` (scroll chaining to body) |
| Disable text selection during drag | Drag interactions without `user-select: none` during drag |
| `inert` on dragged elements | Dragged element clones without `inert` attribute (focus/keyboard accessible when shouldn't be) |
| `autoFocus` justification | `autoFocus` used without a comment explaining it's desktop-only and intentional |

---

## Safe Areas & Layout

| Rule | Flag When |
|---|---|
| Full-bleed layouts need safe area insets | Fixed/full-bleed containers (bottom navs, FABs, full-screen modals) without `padding: env(safe-area-inset-*)` |
| Avoid unwanted scrollbars | Horizontal overflow not prevented via `overflow-x-hidden` where content could overflow the viewport |
| Flex/grid over JS measurement | `getBoundingClientRect` or `ResizeObserver` used for layout that CSS flex/grid could handle |

### Safe Area Pattern

```css
/* Fixed bottom navigation */
.bottom-nav {
  padding-bottom: env(safe-area-inset-bottom);
  /* or with fallback */
  padding-bottom: max(16px, env(safe-area-inset-bottom));
}
```
