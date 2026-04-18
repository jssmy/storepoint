# Pre-Delivery Checklist

Run this checklist before shipping any UI feature, screen, or component.

---

## Visual Quality

- [ ] Color contrast ≥ 4.5:1 for normal text, ≥ 3:1 for large text (verify with dev tools / axe)
- [ ] No low-contrast text (avoid pure gray body text without contrast check)
- [ ] Dark mode verified with independent contrast ratios
- [ ] Consistent icon set — no mixed styles or weights
- [ ] Consistent spacing scale — no arbitrary pixel values
- [ ] Elevation hierarchy makes visual depth clear
- [ ] Primary action is visually dominant per screen (one primary CTA)
- [ ] All states designed: default, hover, active/pressed, focus, disabled, loading, error, empty

---

## Interaction & Feedback

- [ ] All buttons show loading state during async operations
- [ ] All buttons disabled during async to prevent duplicate submissions
- [ ] Form errors appear below the invalid field (not only at page top)
- [ ] Form validates on blur (not on keystroke)
- [ ] Error messages explain what went wrong AND how to fix it
- [ ] Multi-step flows have visible progress indicator and back navigation
- [ ] Destructive actions require confirmation
- [ ] All interactive states respond within 80–150ms (press feedback)
- [ ] Success state clearly different from loading state

---

## Light & Dark Mode

- [ ] Both modes tested across all screens
- [ ] Semantic color tokens used (no hardcoded hex in component styles)
- [ ] Images and illustrations work in both modes
- [ ] Charts use accessible color palette that works in both modes
- [ ] Dark mode surfaces are elevated through brightness, not contrast alone
- [ ] `prefers-color-scheme` respected from system setting

---

## Layout & Responsive

- [ ] Tested on 375px (iPhone SE) — no horizontal scroll, no clipping
- [ ] Tested on 428px (iPhone Pro Max) — content scales appropriately
- [ ] Tested on 1440px — max-width container centered with breathing room
- [ ] Fixed/sticky bars reserve bottom padding for scroll content
- [ ] `min-h-dvh` used instead of `100vh` on mobile-targeting layouts
- [ ] Viewport meta tag present: `width=device-width, initial-scale=1`
- [ ] Keyboard navigation does not scale past layout breakpoints unexpectedly

---

## Accessibility

- [ ] All interactive elements reachable by keyboard (Tab, Enter, Escape, Arrow)
- [ ] Focus ring visible on all interactive elements
- [ ] Tab order matches visual reading order
- [ ] All images have descriptive `alt` or `alt=""` for decorative
- [ ] Icon-only buttons have `aria-label`
- [ ] Form inputs have associated visible `<label>` (not placeholder-only)
- [ ] Errors announced to screen readers (`role="alert"` or `aria-live`)
- [ ] Modals trap focus and restore focus on close
- [ ] Page title updates on route changes (SPA)
- [ ] Skip link available for long pages
- [ ] `prefers-reduced-motion` respected — no forced full animations

---

## Touch & Mobile Specific

- [ ] All touch targets ≥ 44×44pt (iOS) / 48×48dp (Android)
- [ ] 8px+ spacing between adjacent touch targets
- [ ] Content clear of home indicator and Dynamic Island/notch
- [ ] Platform-standard gestures preserved (swipe-back on iOS)
- [ ] Long-press context menu tested if implemented
- [ ] Scroll areas do not conflict with system gestures

---

## Performance (Spot Checks)

- [ ] Images use WebP/AVIF format with correct dimensions set
- [ ] Hero/LCP image loads within 2.5s on simulated 4G
- [ ] Lists > 50 items are virtualized
- [ ] No font FOIT — `font-display: swap` applied
- [ ] Route-level code splitting applied (no single 1MB+ initial bundle)
- [ ] Core Web Vitals green in Lighthouse (LCP < 2.5s, CLS < 0.1, INP < 200ms)
