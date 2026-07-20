# Design: Account & Data Deletion Request page (`/delete-account`)

**Date:** 2026-07-20
**Status:** Approved design, pending spec review

## Purpose

Google Play requires a "Delete account URL" on the store listing — a public page
that (1) refers to the app / developer name shown on the listing, (2) prominently
features the steps a user takes to request account deletion, and (3) specifies which
data is deleted vs. kept, plus any retention period. This page provides a real,
working request form that satisfies all three requirements.

The URL supplied to the Play Console is `https://thirdwave.fun/delete-account`.

## Architecture

New Astro page at `src/pages/delete-account.astro`, following the exact pattern of
`src/pages/privacy.astro`:

- Uses `Layout.astro` + `Header.astro` + `Footer.astro` (shared components), pulling
  `site` content collection data the same way `privacy.astro` does.
- Reuses the `.privacy`-style scoped typography (eyebrow / title / `<section>` / `<h2>` /
  `<dl>` / lists) so it matches the Privacy Policy visually. Styles are copied into
  this page's `<style>` block (Astro scopes styles per-component; privacy's styles are
  not shared), with additions for the form.

This is an Astro page, so `astro dev` serves it fine at `/delete-account` (unlike the
static homepage). Nothing in `public/` changes.

## Page content

Order top-to-bottom, so the action is unmissable:

1. **Eyebrow + title.** Eyebrow "Legal", H1 "Delete Your Account".
2. **Intro identifying app/developer.** "Request permanent deletion of your **Third
   Wave** account and its associated data. The Third Wave app is operated by Your Free
   Call Will End Soon, Co." (Satisfies Play requirement #1.)
3. **"How to request deletion" — numbered steps.** e.g.:
   1. Enter the email address associated with your Third Wave account below.
   2. Optionally tell us anything that helps us locate your account.
   3. Submit the form. We'll email that address to confirm before we delete anything.
   (Satisfies Play requirement #2 — steps are prominent, immediately above the form.)
4. **The form** (see next section).
5. **"What we delete"** — a `<dl>`/list: account profile, username, email address,
   profile photo, uploaded content and projects, and gameplay/usage data tied to the
   account.
6. **"What we keep, and for how long"** — records we are legally required to retain
   (tax/accounting, fraud-prevention, dispute-resolution, and law-enforcement
   obligations), retained only as long as applicable law requires and then deleted.
   Drawn from the Privacy Policy's "Data retention" section. **(If a hard number
   exists — e.g. tax records up to 7 years — insert it here.)** (Satisfies Play
   requirement #3.)
7. **Turnaround statement:** "We process verified deletion requests within **30
   days**." (GDPR-standard.)
8. **Contact fallback:** questions → `privacy@thirdwave.fun` (mirrors privacy page).

## The form

Modeled on `EmailSignup.astro`'s submit/validation/error pattern, but standalone
(not the shared component — this form has different fields and copy).

**Fields:**
- Account email — `type="email"`, `required`, validated with the same
  `/^[^@\s]+@[^@\s]+$/` plausibility check as EmailSignup.
- Details — optional `<textarea>` (which account / any context). Not required.

**Submit behavior:**
- `e.preventDefault()`, validate email; on invalid set `aria-invalid` + inline message.
- `fetch(DELETION_ENDPOINT, { method: 'POST', mode: 'no-cors', body: JSON.stringify({
  type: 'account_deletion', email, details }) })`.
- `DELETION_ENDPOINT` is a **placeholder constant** at the top of the page script,
  clearly commented `// TODO: paste deployed Apps Script /exec URL`. This is a NEW,
  dedicated Apps Script (separate from the email-signup script) so deletion requests
  land in their own sheet/inbox. The page is functionally inert until the URL is
  pasted; the button shows an "Unavailable" state if the endpoint is still the
  placeholder, so it never silently no-ops in production.
- States: idle → "Submitting…" (button disabled, text "...") → "Request received.
  We'll email you to confirm." (clears fields) → on throw, "Network error. Try again."
  Restore button in `finally`.
- **No `window.twTrack` call** — deletion is not a marketing conversion.

**Accessibility:** `aria-describedby` message region with `role="status"
aria-live="polite"`, `aria-label`s on inputs, `aria-invalid` toggling — same as
EmailSignup.

## Discoverability

Add one link to the Privacy Policy's existing "Data retention" `<section>`
(`src/pages/privacy.astro`): a sentence like "You can request deletion of your account
and associated data at any time via our <a href="/delete-account">account deletion
page</a>." Single-file edit; the global footer (and `public/index.html`) are **not**
touched.

## Out of scope (YAGNI)

- No server-side deletion automation — requests are logged for manual processing, same
  operational model as email signup.
- No footer link in either `Footer.astro` or `public/index.html`.
- No changes to the static homepage.
- No new shared component; the form lives inline in the page.
- No analytics/conversion tracking on this form.

## Verification

- `astro build` succeeds; `astro dev` serves `/delete-account` and `/privacy`.
- Page renders with Header/Footer, matches privacy page styling.
- Form: invalid email blocked with message; valid email with placeholder endpoint
  shows the "Unavailable" guard (or, once a real URL is pasted, the success state).
- Privacy page shows the new deletion link and it navigates to `/delete-account`.
- Deploy = commit to `main` + `git push origin main` (Cloudflare auto-builds).
