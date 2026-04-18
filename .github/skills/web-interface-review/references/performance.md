# Performance, Images & Content Handling Rules

## Images

| Rule | Flag When |
|---|---|
| `<img>` needs explicit `width` + `height` | `<img>` missing either attribute (causes CLS) |
| Below-fold images: `loading="lazy"` | `<img>` without `loading="lazy"` that is clearly below the fold |
| Above-fold critical images: `priority` or `fetchpriority="high"` | Hero/LCP images without `priority` (Next.js `<Image>`) or `fetchpriority="high"` |

---

## Performance

| Rule | Flag When |
|---|---|
| Large lists: virtualize | Array `.map()` rendering >50 items without virtualization (`virtua`, `react-window`, `content-visibility: auto`) |
| No layout reads in render | `getBoundingClientRect()`, `offsetHeight`, `offsetWidth`, `scrollTop` called synchronously during render or in `useLayoutEffect` that triggers re-render |
| Batch DOM reads/writes | Layout read followed immediately by a write in a loop (forced reflow) |
| Prefer uncontrolled inputs | Controlled `<input>` where every keystroke triggers expensive computation |
| `<link rel="preconnect">` for CDN domains | External resource (font CDN, image CDN, API) loaded without `<link rel="preconnect" href="...">` in `<head>` |
| Critical fonts: preload + `font-display: swap` | Web fonts used above the fold without `<link rel="preload" as="font">` and `font-display: swap` |

### Common Patterns to Flag

```tsx
// BAD — renders 200 rows without virtualization
{items.map(item => <Row key={item.id} item={item} />)}

// GOOD — virtualize with react-window or virtua
<VList style={{ height: 600 }}>
  {items.map(item => <Row key={item.id} item={item} />)}
</VList>

// BAD — layout read in render causes forced reflow
function Component() {
  const height = ref.current?.offsetHeight; // layout read
  return <div style={{ marginTop: height }}>...</div>;
}
```

---

## Content Handling

| Rule | Flag When |
|---|---|
| Text containers handle long content | Text rendered without `truncate`, `line-clamp-*`, or `break-words` in a container that could overflow |
| Flex children need `min-w-0` | `<div className="flex">` child with text that truncates, missing `min-w-0` on the flex child |
| Handle empty states | Component that renders from an array or string without a check for empty/null (broken empty UI) |
| Anticipate variable-length UGC | User-generated content rendered in fixed containers without overflow handling |

### Common Patterns to Flag

```tsx
// BAD — text overflows flex container
<div className="flex">
  <span className="truncate">{longUserName}</span>
</div>

// GOOD — min-w-0 allows truncation inside flex
<div className="flex">
  <span className="min-w-0 truncate">{longUserName}</span>
</div>

// BAD — no empty state
{items.map(item => <Item key={item.id} item={item} />)}

// GOOD
{items.length === 0
  ? <EmptyState />
  : items.map(item => <Item key={item.id} item={item} />)}
```
