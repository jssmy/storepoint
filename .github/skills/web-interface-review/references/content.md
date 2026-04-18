# Content, Copy, i18n & Hydration Rules

## Content & Copy

| Rule | Flag When |
|---|---|
| Active voice | Passive constructions: "The CLI will be installed" → "Install the CLI" |
| Title Case for headings/buttons | Sentence case on page headings or button labels where Title Case expected (Chicago style) |
| Numerals for counts | Spelled-out numbers: "eight deployments" → "8 deployments" |
| Specific button labels | Vague labels: "Continue", "Submit", "OK" → "Save API Key", "Deploy to Production" |
| Error messages include fix/next step | Error message states only the problem, not what to do |
| Second person ("you"), not first ("I/we") | First-person UI copy |
| `&` over "and" in space-constrained labels | "Settings and Preferences" in a tab label → "Settings & Preferences" |
| Hover and interactive states increase contrast | Hover/active/focus state is *less* prominent than rest state |

---

## Locale & i18n

| Rule | Flag When |
|---|---|
| Use `Intl.DateTimeFormat` | Hardcoded date string: `new Date().toLocaleDateString('en-US')` or template literals building date strings |
| Use `Intl.NumberFormat` | Hardcoded number/currency format: `${amount} USD` or manual thousands separators |
| Language detection via `Accept-Language` / `navigator.languages` | Locale detected by IP address instead of browser/request headers |
| Wrap non-translatable tokens | Brand names, code tokens, identifiers in translatable strings without `translate="no"` wrapper |

### Common Patterns to Flag

```tsx
// BAD — hardcoded locale format
<span>{new Date(createdAt).toLocaleDateString('en-US')}</span>
<span>${amount} USD</span>

// GOOD
<span>{new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(createdAt))}</span>
<span>{new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(amount)}</span>

// BAD — brand name in translatable string gets auto-translated
<p>Connect with Vercel to deploy.</p>

// GOOD
<p>Connect with <span translate="no">Vercel</span> to deploy.</p>
```

---

## Hydration Safety

| Rule | Flag When |
|---|---|
| Controlled inputs need `onChange` | `<input value={x}>` without an `onChange` handler (React warning; read-only accident) |
| Use `defaultValue` for uncontrolled | `value` used when the intent is uncontrolled (no need to track every keystroke) |
| Date/time rendering hydration guard | `new Date()` or `Date.now()` rendered directly — server and client timestamps differ, causing hydration mismatch |
| `suppressHydrationWarning` only where needed | `suppressHydrationWarning` used broadly instead of only on the specific element with known mismatch |

### Common Patterns to Flag

```tsx
// BAD — server/client mismatch
<span>Last updated: {new Date().toLocaleTimeString()}</span>

// GOOD — render after mount
const [time, setTime] = useState<string | null>(null);
useEffect(() => { setTime(new Date().toLocaleTimeString()); }, []);
<span>Last updated: {time ?? '…'}</span>

// BAD — controlled without handler
<input value={query} />

// GOOD
<input value={query} onChange={(e) => setQuery(e.target.value)} />
```

---

## Hover & Interactive States

| Rule | Flag When |
|---|---|
| Buttons/links need `hover:` state | `<button>` or `<a>` with no `hover:bg-*`, `hover:text-*`, or equivalent visual change |
| Interactive states must increase contrast | Hover, active, or focus styles that reduce contrast from the rest state |
