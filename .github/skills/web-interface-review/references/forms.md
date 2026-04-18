# Forms Rules

| Rule | Flag When |
|---|---|
| Inputs need `autocomplete` + `name` | `<input>` missing `autocomplete` or `name` |
| Use correct `type` and `inputmode` | Email field using `type="text"` instead of `type="email"`; phone without `inputmode="tel"` |
| Never block paste | `onPaste` handler calls `event.preventDefault()` |
| Labels clickable | `<label>` without `htmlFor` matching input `id`, or not wrapping the control |
| Disable spellcheck on codes/emails/usernames | `<input type="email">` or username/token fields missing `spellCheck={false}` |
| Checkboxes/radios: single hit target | `<input type="checkbox">` and `<label>` not sharing one hit target (dead zone between them) |
| Submit button enabled until request starts | Submit button `disabled` before the user submits (should stay enabled until in-flight) |
| Spinner during request | No loading indicator while form is submitting |
| Errors inline next to fields | Errors shown only in a top banner, not adjacent to the offending field |
| Focus first error on submit | On submit with errors, focus not programmatically moved to first error field |
| Placeholders end with `…` and show example | Placeholder is `"Enter email"` instead of `"you@example.com…"` |
| `autocomplete="off"` on non-auth fields | Non-credential fields missing `autocomplete="off"` to suppress password manager UI |
| Warn before navigation with unsaved changes | Form with unsaved changes missing `beforeunload` handler or router navigation guard |

### Common Patterns to Flag

```tsx
// BAD — wrong type, no autocomplete
<input placeholder="Email" />

// GOOD
<input
  type="email"
  name="email"
  autoComplete="email"
  inputMode="email"
  spellCheck={false}
  placeholder="you@example.com…"
/>

// BAD — paste blocked
<input onPaste={(e) => e.preventDefault()} />

// BAD — submit disabled before request
<button disabled={!isValid}>Submit</button>

// GOOD — enable submit; disable once request starts
<button disabled={isSubmitting}>
  {isSubmitting ? <Spinner /> : 'Save API Key'}
</button>

// BAD — error only at top
<div className="error-banner">{errors.email}</div>
<input name="email" />

// GOOD — error adjacent to field
<input name="email" aria-describedby="email-error" />
<p id="email-error" role="alert">{errors.email}</p>
```
