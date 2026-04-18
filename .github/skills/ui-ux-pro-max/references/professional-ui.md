# Professional UI — Common Rules

## Icons & Visual Elements

| Rule | Do | Don't |
|---|---|---|
| Use vector icons (SVG / icon font) | Heroicons, Lucide, Phosphor, react-native-vector-icons | Emoji as icons; raster PNG icons at fixed size |
| One icon set consistently | All Heroicons outline; all Phosphor bold | Mix Heroicons outline with Material filled icons |
| Stroke weight consistent | Same weight across all icons in UI | 1px stroke for some, 2.5px for others on same screen |
| Size relative to context | 16px inline; 20px button; 24px nav; 32px empty state | Fixed 24px everywhere regardless of context |
| Color inherits from text | `currentColor` for icon fill/stroke | Hardcoded icon color that ignores dark mode |
| Decorative icons marked aria-hidden | `aria-hidden="true"` on decorative icons | Decorative icon read aloud by VoiceOver |
| Status icons supplement color | ✓ green + "Confirmed" text + green background | Green dot alone to indicate active status |

---

## Interaction & Feedback

| Interaction | Expected Feedback | Timing |
|---|---|---|
| Button tap / click | Press state (ripple/opacity) → loading spinner → success/error | Immediate press feedback; response ≤ 300ms for perceived instant |
| Form submit | Disable button + show spinner → success message or field errors | Spinner within 100ms; feedback within 2s |
| Delete / destructive action | Confirmation dialog → loading state → undo toast (optional) | Confirmation before irreversible action |
| Pull-to-refresh | Spinner/animation while refreshing → data updates | PTR spinner visible; completion ≤ 3s |
| Swipe-to-dismiss | Smooth drag with rubber-banding → fade out | Interruptible; cancel on reverse swipe |
| Long press | Context menu or tooltip after 500ms threshold | No long-press on primary actions — unexpected |
| Empty / error state | Meaningful illustration + copy + action CTA | Blank page or raw error message |

---

## Light / Dark Mode Contrast

| Token | Light Mode | Dark Mode | Notes |
|---|---|---|---|
| `background` | `#FFFFFF` or `#F9FAFB` | `#111827` or `#0F172A` | Root page background |
| `surface` | `#FFFFFF` or `#F3F4F6` | `#1F2937` or `#1E293B` | Card / sheet surface |
| `surface-elevated` | `#FFFFFF` with shadow | `#374151` or `#334155` | Elevated card / modal |
| `text-primary` | `#111827` | `#F9FAFB` | Primary text; 4.5:1 on bg |
| `text-secondary` | `#6B7280` | `#9CA3AF` | Secondary text; 4.5:1 on bg |
| `text-disabled` | `#D1D5DB` | `#4B5563` | Disabled text; not in tab order |
| `border` | `#E5E7EB` | `#374151` | Dividers and card outlines |
| `primary` | Brand primary | Lighter tonal variant | Maintain 3:1+ on surface |
| `error` | `#DC2626` | `#FCA5A5` | Error on surface — check contrast |
| `success` | `#16A34A` | `#86EFAC` | Success on surface — check contrast |
| `warning` | `#D97706` | `#FDE68A` | Warning — amber family |

> **Rule**: Design light and dark tokens together. Never derive dark palette by inverting light palette. Always verify contrast ratios independently in both modes.

---

## Layout & Spacing Scale

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px / 1pt | Tight inline spacing; icon-to-label gap |
| `space-2` | 8px / 2pt | Related-element spacing inside components |
| `space-3` | 12px / 3pt | Dense form field spacing |
| `space-4` | 16px / 4pt | Base padding; section internal spacing |
| `space-5` | 20px / 5pt | Medium spacing between related sections |
| `space-6` | 24px / 6pt | List item padding; card padding |
| `space-8` | 32px / 8pt | Major section spacing; between card groups |
| `space-10` | 40px / 10pt | Page section spacing on mobile |
| `space-12` | 48px / 12pt | Hero section padding; bottom of page |
| `space-16` | 64px / 16pt | Desktop section padding |
| `space-20` | 80px / 20pt | Hero top padding desktop |

### Content Width Tokens

| Breakpoint | Max Width | Use |
|---|---|---|
| xs (mobile) | 375–428px | Full width; 16px horizontal padding |
| sm | 640px | Single column content |
| md | 768px | Two-column layout possible |
| lg | 1024px | Switch to sidebar navigation |
| xl | 1280px | `max-w-6xl` for page container |
| 2xl | 1536px | `max-w-7xl`; rare large dashboards |

---

## Typography — Size Scale

| Token | Size | Weight | Usage |
|---|---|---|---|
| `text-xs` | 12px | 400 | Metadata, captions, labels |
| `text-sm` | 14px | 400 / 500 | Body text small; sidebar items |
| `text-base` | 16px | 400 | Body text (minimum mobile body) |
| `text-lg` | 18px | 400 / 500 | Lead paragraph |
| `text-xl` | 20px | 500 / 600 | Section heading level 4 |
| `text-2xl` | 24px | 600 | Section heading level 3 |
| `text-3xl` | 30px | 600 / 700 | Section heading level 2 |
| `text-4xl` | 36px | 700 | Page heading level 1 |
| `text-5xl` | 48px | 700 | Hero headline |
| `text-6xl` | 60px | 700 / 800 | Large hero display |
| `text-7xl` | 72px | 800 | Display / marketing headline |
| `text-8xl` | 96px | 900 | Max impact display only |

> **Line-height rules**: Body text `1.5–1.75`; Heading `1.2–1.4`; Display `1.0–1.1`
