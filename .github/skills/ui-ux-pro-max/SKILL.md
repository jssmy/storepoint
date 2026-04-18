---
name: ui-ux-pro-max
description: 'UI/UX design intelligence for web and mobile. Includes 50+ styles, 161 color palettes, 57 font pairings, 161 product types, 99 UX guidelines, and 25 chart types across 10 stacks (React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui, and HTML/CSS). Actions: plan, build, create, design, implement, review, fix, improve, optimize, enhance, refactor, and check UI/UX code. Projects: website, landing page, dashboard, admin panel, e-commerce, SaaS, portfolio, blog, and mobile app. Elements: button, modal, navbar, sidebar, card, table, form, and chart. Styles: glassmorphism, claymorphism, minimalism, brutalism, neumorphism, bento grid, dark mode, responsive, skeuomorphism, and flat design. Topics: color systems, accessibility, animation, layout, typography, font pairing, spacing, interaction states, shadow, and gradient. Integrations: shadcn/ui MCP for component search and examples.'
argument-hint: <product-type> <style-keywords>
---

# UI/UX Pro Max — Design Intelligence

Comprehensive design guide for web and mobile applications. Searchable database with priority-based recommendations spanning styles, palettes, font pairings, product patterns, UX guidelines, and chart types.

**Decision criteria:** If the task changes how a feature **looks, feels, moves, or is interacted with** — use this skill.

## When to Apply

**Use:** designing pages, creating/refactoring components, choosing color/typography/layout, reviewing UI for UX/a11y, implementing navigation/animation, making product-level design decisions.

**Skip:** pure backend logic, API/DB design only, infrastructure/DevOps, non-visual automation.

## Rule Categories by Priority

| Priority | Category | Impact | Key Checks | Anti-Patterns |
|---|---|---|---|---|
| 1 | Accessibility | CRITICAL | Contrast 4.5:1, alt text, keyboard nav, aria-labels | Removing focus rings; icon-only buttons without labels |
| 2 | Touch & Interaction | CRITICAL | Min 44×44px, 8px+ spacing, loading feedback | Hover-only patterns; instant 0ms state changes |
| 3 | Performance | HIGH | WebP/AVIF, lazy load, reserve space (CLS < 0.1) | Layout thrashing; cumulative layout shift |
| 4 | Style Selection | HIGH | Match product type, consistency, SVG icons | Mixing flat & skeuomorphic; emoji as icons |
| 5 | Layout & Responsive | HIGH | Mobile-first, viewport meta, no horizontal scroll | Fixed px containers; disabled zoom |
| 6 | Typography & Color | MEDIUM | Base 16px, line-height 1.5, semantic color tokens | Text < 12px body; gray-on-gray; raw hex in components |
| 7 | Animation | MEDIUM | 150–300ms, transform/opacity only, motion meaning | `transition: all`; animating width/height; no reduced-motion |
| 8 | Forms & Feedback | MEDIUM | Visible labels, inline errors, helper text | Placeholder-only label; errors at top only |
| 9 | Navigation Patterns | HIGH | Predictable back, bottom nav ≤ 5, deep linking | Overloaded nav; broken back; no deep links |
| 10 | Charts & Data | LOW | Legends, tooltips, accessible colors | Relying on color alone to convey meaning |

## Anti-Patterns — Flag Immediately

- `user-scalable=no` or `maximum-scale=1` disabling zoom
- `onPaste` + `preventDefault` blocking paste
- `transition: all` — list properties explicitly
- `outline-none` / `outline: none` without `:focus-visible` replacement
- `<div onClick>` or `<span onClick>` for navigation — use `<a>` or `<Link>`
- `<div>` or `<span>` as interactive controls — use `<button>`
- `<img>` without explicit `width` + `height` (CLS)
- Array `.map()` of > 50 items without virtualization
- Form inputs without `<label>` or `aria-label`
- Icon-only buttons without `aria-label`
- Hardcoded date/number formats — use `Intl.*`
- `autoFocus` without justification

## Procedure

### Step 1: Analyze Requirements

Extract from the request:
- **Product type**: tool, productivity, entertainment, service, or hybrid
- **Audience**: consumer vs professional; age group; context (commute, work, leisure)
- **Keywords**: playful, vibrant, minimal, dark, content-first, immersive, etc.
- **Stack**: React Native (primary for this project)

### Step 2: Generate Design System (REQUIRED — start here)

```bash
python3 .github/skills/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" --design-system [-p "Project Name"]
```

Returns: pattern, style, color palette, typography, effects, and anti-patterns.

```bash
# Example
python3 .github/skills/ui-ux-pro-max/scripts/search.py "beauty spa wellness service" --design-system -p "Serenity Spa"
```

**Persist the design system** (Master + Overrides pattern):

```bash
python3 .github/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name"
# Creates design-system/MASTER.md

python3 .github/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name" --page "dashboard"
# Also creates design-system/pages/dashboard.md (overrides Master for that page)
```

Retrieval context when building a page:
> "I am building the [Page Name] page. Read `design-system/MASTER.md`. Check if `design-system/pages/[page-name].md` exists — if so, prioritize its rules."

### Step 3: Domain Deep-Dives (as needed)

```bash
python3 .github/skills/ui-ux-pro-max/scripts/search.py "<keyword>" --domain <domain> [-n <max>]
```

| Need | Domain | Example keywords |
|---|---|---|
| Product type patterns | `product` | `"entertainment social"` |
| Style options | `style` | `"glassmorphism dark"` |
| Color palettes | `color` | `"entertainment vibrant"` |
| Font pairings | `typography` | `"playful modern"` |
| Chart type | `chart` | `"real-time dashboard"` |
| UX guidelines | `ux` | `"animation accessibility"` |
| Google Fonts | `google-fonts` | `"sans serif variable"` |
| Landing page structure | `landing` | `"hero social-proof"` |
| React perf | `react` | `"rerender memo list"` |
| App a11y/touch | `web` | `"accessibilityLabel touch safe-areas"` |
| AI/CSS keywords | `prompt` | `"minimalism"` |

### Step 4: Stack Guidelines

```bash
python3 .github/skills/ui-ux-pro-max/scripts/search.py "<keyword>" --stack react-native
```

## Common Sticking Points

| Problem | Fix |
|---|---|
| Dark mode contrast issues | `color-dark-mode` + `color-accessible-pairs` (Priority 6) |
| Animations feel unnatural | `spring-physics` + `exit-faster-than-enter` (Priority 7) |
| Form UX is poor | `inline-validation` + `error-clarity` + `focus-management` (Priority 8) |
| Navigation feels confusing | `nav-hierarchy` + `bottom-nav-limit` + `back-behavior` (Priority 9) |
| Layout breaks on small screens | `mobile-first` + `breakpoint-consistency` (Priority 5) |
| Performance / jank | `virtualize-lists` + `main-thread-budget` + `debounce-throttle` (Priority 3) |

## Pre-Delivery (Summary)

- Run `--domain ux "animation accessibility z-index loading"` as final UX validation pass
- Check all CRITICAL priority items (P1 Accessibility, P2 Touch)
- Test on 375px (small phone) and landscape
- Verify with reduced-motion enabled and Dynamic Type at largest size
- Confirm all touch targets ≥ 44pt and content clear of safe areas

See [full pre-delivery checklist](./references/checklist.md).

## References

- [Quick Reference — all 10 rule categories in detail](./references/quick-reference.md)
- [Professional UI common rules (icons, interaction, contrast, layout)](./references/professional-ui.md)
- [Pre-delivery checklist](./references/checklist.md)
