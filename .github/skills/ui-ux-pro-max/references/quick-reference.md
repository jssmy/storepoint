# Quick Reference — All 10 Rule Categories

## Priority 1 — Accessibility (CRITICAL)

| Rule ID | Rule | Do | Don't |
|---|---|---|---|
| `color-contrast` | Minimum 4.5:1 for normal text; 3:1 for large text | Test all text/bg pairs with contrast checker | Low-contrast gray body text |
| `focus-states` | Visible focus rings (2–4px) on all interactive elements | `focus-visible:ring-2` or CSS `:focus-visible` | `outline-none` without replacement |
| `alt-text` | Descriptive alt on meaningful images | `alt="Bar chart showing monthly revenue"` | `alt=""` on meaningful images; omit entirely |
| `aria-labels` | `aria-label` for icon-only buttons | `<button aria-label="Close dialog">` | Icon button with no text and no aria-label |
| `keyboard-nav` | Tab order matches visual order; all widgets keyboard-operable | Test with Tab key through all interactions | Mouse-only custom dropdowns/selects |
| `form-labels` | `<label htmlFor>` or wrapping input | Visible label above each field | Placeholder as only label |
| `color-not-only` | Supplement color with icon/text for status | Red border + error icon + text message | Red border only for error state |
| `reduced-motion` | `@media (prefers-reduced-motion: reduce)` — disable/reduce | Provide no-motion variant for all transitions | Ignoring user motion preference |
| `heading-hierarchy` | Sequential `<h1>`→`<h6>`; skip link for main content | Never skip heading levels | Jump from `<h1>` to `<h4>` |
| `dynamic-type` | Support system text size scaling without truncation | Test at max Dynamic Type size | `maxFontSizeMultiplier={1}` everywhere |
| `voiceover-sr` | Meaningful `accessibilityLabel`/`accessibilityHint`; logical reading order | Group related elements; set reading order | Unlabeled custom UI elements |
| `escape-routes` | Back/cancel in all modals and multi-step flows | Always provide close affordance | No close button on overlay modal |

---

## Priority 2 — Touch & Interaction (CRITICAL)

| Rule ID | Rule | Do | Don't |
|---|---|---|---|
| `touch-target-size` | Min 44×44pt (iOS) / 48×48dp (Android) | `hitSlop` to expand tap area | 24pt icon with no extended hit area |
| `touch-spacing` | 8px+ gap between adjacent touch targets | `gap: 8` between buttons | Two buttons touching — causes mis-taps |
| `hover-vs-tap` | Primary interactions on tap/click | Design for touch first | Hover-only tooltips/menus |
| `loading-buttons` | Disable + spinner during async operations | `disabled={isLoading}` + `<Spinner />` | No feedback during async — double submit |
| `press-feedback` | Visual feedback within 80–150ms | Ripple / opacity change on press | No visual change on tap |
| `safe-area-awareness` | Primary targets away from notch/home indicator | `insets.bottom` padding on fixed bars | Button overlapping home indicator |
| `standard-gestures` | Use platform standard gestures | Swipe-back on iOS; predictive back on Android | Redefine swipe-back to do something else |
| `no-precision-required` | Avoid pixel-perfect taps on small elements | Generous padding; large tap targets | Thin slider handle requiring exact tap |
| `gesture-alternative` | Always provide visible control for gesture-only actions | Swipe-to-delete + visible delete button | Swipe-only with no visible affordance |

---

## Priority 3 — Performance (HIGH)

| Rule ID | Rule | Do | Don't |
|---|---|---|---|
| `image-optimization` | WebP/AVIF, responsive srcset, expo-image | `<expo-image>` with contentFit and placeholder | Raw unoptimized PNG/JPG |
| `image-dimension` | `width` + `height` or `aspect-ratio` on all images | Prevents CLS; reserves space before load | Images without dimensions — CLS spike |
| `font-loading` | `font-display: swap` to avoid FOIT | Preload critical font variants only | All font weights loaded eagerly |
| `lazy-loading` | Lazy load non-critical components | `React.lazy` / Next.js `dynamic()` / `loading="lazy"` | Import all routes eagerly at root |
| `virtualize-lists` | Virtualize lists > 50 items | FlashList / react-window / `content-visibility: auto` | `ScrollView` + `.map()` for 200 items |
| `reduce-reflows` | Batch DOM reads then writes; no layout reads during render | `getBoundingClientRect` outside render; batch writes | Interleaving reads/writes in a loop |
| `main-thread-budget` | < 16ms per frame for 60fps | Move heavy computation off main thread | Synchronous heavy compute in scroll handler |
| `progressive-loading` | Skeleton/shimmer for > 300ms operations | Shimmer placeholder while data loads | Long blocking spinner with blank content |
| `debounce-throttle` | Debounce high-frequency events | `useDebounce` on search input | API call on every keystroke |

---

## Priority 4 — Style Selection (HIGH)

| Rule ID | Rule | Do | Don't |
|---|---|---|---|
| `style-match` | Match style to product type and audience | Run `--design-system` before building | Pick glassmorphism for a healthcare app arbitrarily |
| `consistency` | One style across all screens | Define design tokens; apply globally | Glassmorphism on screen 1, brutalism on screen 2 |
| `no-emoji-icons` | SVG vector icons only | Heroicons, Lucide, react-native-vector-icons | Emoji as nav or status icons |
| `elevation-consistent` | Consistent shadow/elevation scale | Define elevation-1 to elevation-5 tokens | Random shadow values per component |
| `dark-mode-pairing` | Design light + dark together; verify contrast in both | Test contrast independently for both modes | Invert light palette for dark mode |
| `icon-style-consistent` | One icon set; same stroke width | All Heroicons outline or all solid — not mixed | Mix outlined and filled icons at same hierarchy |
| `primary-action` | One primary CTA per screen | One prominent button; others visually subordinate | Three equal-weight primary buttons on one screen |

---

## Priority 5 — Layout & Responsive (HIGH)

| Rule ID | Rule | Do | Don't |
|---|---|---|---|
| `viewport-meta` | `width=device-width initial-scale=1` | Include in every HTML head | `user-scalable=no` or `maximum-scale=1` |
| `mobile-first` | Design 375px first; scale up | Mobile breakpoint is baseline | Desktop design crammed onto 375px |
| `horizontal-scroll` | No horizontal scroll on mobile | All content fits viewport width | Overflow-x causes horizontal scroll |
| `spacing-scale` | 4pt/8dp incremental spacing system | `gap: 8`, `padding: 16`, `margin: 24` | Arbitrary spacing values (7px, 13px, 22px) |
| `container-width` | `max-w-6xl` or `max-w-7xl` on desktop | Consistent max-width container | Edge-to-edge text on 1440px display |
| `viewport-units` | `min-h-dvh` instead of `100vh` on mobile | `min-height: 100dvh` | `height: 100vh` cut off by browser UI |
| `content-priority` | Core content first; secondary folded on mobile | Progressive disclosure in layout | All content visible and equal on mobile |
| `fixed-element-offset` | Fixed nav/bar reserves padding for scroll content | `paddingBottom` = fixed bar height + safe area | Scroll content hidden behind sticky bottom bar |

---

## Priority 6 — Typography & Color (MEDIUM)

| Rule ID | Rule | Do | Don't |
|---|---|---|---|
| `line-height` | 1.5–1.75 body; 1.2–1.4 headings | `lineHeight: 1.6` on paragraph text | `lineHeight: 1` — cramped and unreadable |
| `readable-font-size` | Min 16px body on mobile | Prevents iOS auto-zoom | 12px body text on mobile |
| `font-scale` | Consistent type scale (12 14 16 18 24 32) | Define tokens; use only scale values | Font size changes by 1–2px between levels |
| `color-semantic` | Semantic color tokens | `colors.error`, `colors.surface`, `colors.onSurface` | Raw `#FF0000` hardcoded in component |
| `weight-hierarchy` | Bold headings (600–700); regular body (400) | Clear weight contrast between title and body | All text same weight — no hierarchy |
| `number-tabular` | Tabular figures for data/prices/timers | `font-variant-numeric: tabular-nums` | Proportional figures in price table — values shift |
| `color-dark-mode` | Desaturated lighter tonal variants for dark mode | HSL lightness adjustments for dark surfaces | Invert light-mode colors for dark |

---

## Priority 7 — Animation (MEDIUM)

| Rule ID | Rule | Do | Don't |
|---|---|---|---|
| `duration-timing` | 150–300ms micro-interactions; ≤ 400ms complex | Define duration tokens; use consistently | > 500ms on feedback animations |
| `transform-performance` | Animate `transform` and `opacity` only | `transform: translateY(0)` transitions | Animating `height`, `width`, `top`, `margin` |
| `easing` | `ease-out` entering; `ease-in` exiting | Context-appropriate easing | `linear` for UI transitions — mechanical feel |
| `spring-physics` | Spring curves for natural feel | react-native-reanimated spring; Framer Motion spring | Cubic-bezier for all animations |
| `interruptible` | Animations must be cancellable on user input | Test: tap during animation — should cancel | Animation locks UI for its duration |
| `reduced-motion` | Respect `prefers-reduced-motion` | Provide no-motion fallback for all animations | Animated loading forced on reduced-motion |
| `exit-faster-than-enter` | Exit ~60–70% of enter duration | Enter 300ms → Exit 180ms | Exit same duration as enter — feels sluggish |
| `stagger-sequence` | Stagger list item entrance by 30–50ms per item | `delay: index * 40` on item entrance | All items animate simultaneously |
| `no-blocking-animation` | UI stays interactive during animations | Transitions do not prevent taps | Modal transition blocks close button |

---

## Priority 8 — Forms & Feedback (MEDIUM)

| Rule ID | Rule | Do | Don't |
|---|---|---|---|
| `input-labels` | Visible label above/beside every field | `<label htmlFor="email">Email</label>` | Placeholder as sole label |
| `error-placement` | Error directly below the failed field | `<p role="alert">{error}</p>` below input | Only a top-of-page error banner |
| `inline-validation` | Validate on blur; not on each keystroke | Show error after field loses focus | Error appears while user types first character |
| `submit-feedback` | Loading → success/error state on submit | Spinner on button; then success message | No feedback after submit — user re-taps |
| `focus-management` | Auto-focus first invalid field after submit | `ref.current.focus()` on first error field | Page stays scrolled to bottom after error |
| `error-recovery` | Error states include cause + how to fix | "Email already registered — sign in instead" | "Invalid input" with no guidance |
| `progressive-disclosure` | Reveal complex options progressively | "Advanced settings" toggle for expert options | 20-field form presented all at once |
| `multi-step-progress` | Step indicator in multi-step flows; allow back | Progress bar + back link on every step | Step 3 of 5 with no progress indicator |
| `destructive-emphasis` | Danger color + spatial separation for destructive actions | Red "Delete account" separated from primary actions | "Delete" styled same as "Save" |

---

## Priority 9 — Navigation Patterns (HIGH)

| Rule ID | Rule | Do | Don't |
|---|---|---|---|
| `bottom-nav-limit` | Bottom nav max 5 items; icon + text label | 3–5 items with label below icon | 6 items; icon-only without labels |
| `back-behavior` | Back is predictable; restores scroll + state | Navigate back to previous screen with state restored | Back resets all filters and scroll to top |
| `deep-linking` | All key screens reachable via URL/deep link | Configure linking in app entry | Push notification opens home screen only |
| `modal-escape` | Modals have clear close; swipe-down on mobile | `×` close button + swipe-down gesture | Modal with no close affordance |
| `state-preservation` | Preserve scroll position and filter state on back | Cache scroll position; restore on back | Scroll position always resets to top on back |
| `adaptive-navigation` | Sidebar on ≥ 1024px; bottom/top nav on mobile | Layout adapts at breakpoint | Same bottom nav on iPad as on iPhone |
| `focus-on-route-change` | Move focus to main content after route change | `ref.focus()` on page `<h1>` or `<main>` | Focus stays on previous screen element |
| `persistent-nav` | Core navigation reachable from all screens | Nav accessible even deep in drill-down | Nav hidden entirely in sub-flows |

---

## Priority 10 — Charts & Data (LOW)

| Rule ID | Rule | Do | Don't |
|---|---|---|---|
| `chart-type-match` | Match chart to data type | Trend → Line; Comparison → Bar; Proportion → Donut | Pie chart with 10 slices; bar chart for time series |
| `legend-visible` | Legend always near chart; never below fold | Position legend inside or beside chart | Legend below scroll fold; no legend at all |
| `tooltip-on-interact` | Exact value tooltip on hover/tap | Interactive tooltip with label + value + unit | No tooltip — values unreadable from visual alone |
| `accessible-colors` | Accessible palette; supplement with patterns | Add shape/texture to differentiate series | Red/green only for pass/fail data |
| `empty-data-state` | Meaningful empty state — not blank chart | "No data yet — complete your first order" | Empty axes with no explanation |
| `responsive-chart` | Charts reflow/simplify on small screens | Horizontal bar on mobile; fewer axis ticks | Desktop-sized chart on 375px — axes unreadable |
| `screen-reader-summary` | `aria-label` describing chart's key insight | `aria-label="Revenue grew 40% over Q1"` | Chart with no accessible description |
| `large-dataset` | Aggregate or sample datasets > 1000 points | Aggregation with drill-down for detail | Rendering 5000 data points at once |
