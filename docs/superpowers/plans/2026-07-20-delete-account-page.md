# Account & Data Deletion Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a public `/delete-account` page with a working request form that satisfies Google Play's "Delete account URL" requirement, plus a discoverability link from the Privacy Policy.

**Architecture:** New Astro page `src/pages/delete-account.astro` following the exact shell/pattern of `src/pages/privacy.astro` (Layout + Header + Footer + `site` content collection). A standalone inline form (modeled on `EmailSignup.astro`'s validation/submit pattern) POSTs `{type:'account_deletion', email, details}` `no-cors` to a dedicated Google Apps Script endpoint, left as a clearly-marked placeholder constant. One sentence + link added to the Privacy Policy's "Data retention" section.

**Tech Stack:** Astro 5, vanilla JS in a page `<script>`, scoped `<style>`. No test runner exists; verification is `astro build` (must succeed) plus `astro dev` browser checks.

## Global Constraints

- Site deploy = commit to `main` + `git push` (Cloudflare auto-build). This work stays on branch `delete-account-page`; do NOT push until the user asks.
- App name shown to users: **Third Wave**. Developer/operator: **Your Free Call Will End Soon, Co**. Contact email: **privacy@thirdwave.fun**.
- Turnaround stated on page: **within 30 days**.
- Deletion form endpoint is a NEW dedicated Apps Script (NOT the signup script). It is a placeholder constant `DELETION_ENDPOINT` in the page until the user pastes the real `/exec` URL. The submit button must guard to an "Unavailable" state while the placeholder is unset so it never silently no-ops.
- No `window.twTrack` call on this form (deletion is not a marketing conversion).
- Do NOT edit `public/index.html` or `src/components/Footer.astro` (no footer link — Privacy Policy link only).
- Match `privacy.astro` visual language: `--font-display` / `--font-label` / `--font-sans` CSS vars, `--color-text` etc., the `.eyebrow` / title / `<section><h2>` / `<dl>` rhythm.

---

### Task 1: Create the `/delete-account` page

**Files:**
- Create: `src/pages/delete-account.astro`

**Interfaces:**
- Consumes: `Layout.astro` (props `title`, `description`, `socialDescription`), `Header.astro` (props `status`, `meta`, `ticker`, `ctaHref`, `ctaText`), `Footer.astro` (props `production`, `copyrightHolder`, `youtube`, `instagram`), and `getEntry('site','site')` — all exactly as used in `src/pages/privacy.astro:1-26,349-354`.
- Produces: a page reachable at route `/delete-account` with form element `#delete-form`.

- [ ] **Step 1: Create the page file with full content**

Create `src/pages/delete-account.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import { getEntry } from 'astro:content';

const siteEntry = await getEntry('site', 'site');
const siteData = siteEntry.data;

const PRIVACY_EMAIL = 'privacy@thirdwave.fun';
const MAILTO_URL = `mailto:${PRIVACY_EMAIL}`;
---

<Layout
	title="Third Wave — Delete Your Account"
	description="Request permanent deletion of your Third Wave account and associated data."
	socialDescription="Delete your Third Wave account and data."
>
	<Header
		status={siteData.topBar.status}
		meta={siteData.topBar.meta}
		ticker={siteData.ticker}
		ctaHref={MAILTO_URL}
		ctaText="CONTACT US"
	/>

	<main>
		<article class="doc">
			<p class="eyebrow">Legal</p>
			<h1 class="doc-title">Delete Your Account</h1>

			<section>
				<p>
					Use this page to request permanent deletion of your <strong>Third Wave</strong>
					account and its associated data. The Third Wave app is operated by Your Free
					Call Will End Soon, Co.
				</p>
			</section>

			<section>
				<h2>How to request deletion</h2>
				<ol>
					<li>Enter the email address associated with your Third Wave account below.</li>
					<li>Optionally add any details that help us locate your account.</li>
					<li>Submit the form. We&rsquo;ll email that address to confirm before we delete anything.</li>
				</ol>
			</section>

			<section>
				<form class="del-form" id="delete-form" novalidate>
					<label class="field-label" for="del-email">Account email</label>
					<input
						type="email"
						id="del-email"
						class="text-input"
						placeholder="you@example.com"
						required
						aria-describedby="del-message"
						aria-label="Account email address"
					/>

					<label class="field-label" for="del-details">Details (optional)</label>
					<textarea
						id="del-details"
						class="text-input textarea"
						rows="4"
						placeholder="Anything that helps us find your account."
						aria-label="Additional details"
					></textarea>

					<button type="submit" class="submit-btn" id="del-submit">Request deletion</button>
					<p class="form-message" id="del-message" role="status" aria-live="polite"></p>
				</form>
			</section>

			<section>
				<h2>What we delete</h2>
				<p>When your request is verified, we permanently delete:</p>
				<ul>
					<li>Your account profile and username</li>
					<li>Your email address and any profile photo</li>
					<li>Content and projects you uploaded through the Services</li>
					<li>Gameplay and usage data tied to your account</li>
				</ul>
			</section>

			<section>
				<h2>What we keep, and for how long</h2>
				<p>
					We retain a limited set of records only where we are legally required to,
					including for tax and accounting, fraud prevention, dispute resolution, and
					responding to lawful requests from authorities. We keep these records only as
					long as applicable law requires, after which they are deleted. See our
					<a href="/privacy">Privacy Policy</a> for details on data retention.
				</p>
			</section>

			<section>
				<h2>Timing</h2>
				<p>We process verified deletion requests within 30 days.</p>
			</section>

			<section>
				<h2>Questions</h2>
				<p>
					If you have any questions about deleting your account or data, contact us at
					<a href={MAILTO_URL}>{PRIVACY_EMAIL}</a>.
				</p>
			</section>
		</article>
	</main>

	<Footer
		production={siteData.footer.production}
		copyrightHolder={siteData.footer.copyrightHolder}
		youtube={siteData.social.youtube}
		instagram={siteData.social.instagram}
	/>
</Layout>

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.doc {
		padding: 64px 40px 80px;
		max-width: 740px;
		margin: 0 auto;
		width: 100%;
	}

	.eyebrow {
		font-family: var(--font-label);
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #888;
		margin-bottom: 24px;
	}

	.doc-title {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: clamp(36px, 6vw, 56px);
		line-height: 0.98;
		letter-spacing: -0.025em;
		text-transform: uppercase;
		color: var(--color-text);
		margin-bottom: 40px;
	}

	section {
		margin-bottom: 48px;
	}

	section h2 {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 22px;
		letter-spacing: -0.01em;
		color: var(--color-text);
		margin-bottom: 16px;
	}

	section p {
		font-family: var(--font-sans);
		font-size: 15px;
		line-height: 1.65;
		color: #b3b3b3;
		margin-bottom: 16px;
	}

	section p:last-child { margin-bottom: 0; }

	ol, ul {
		margin: 0;
		padding-left: 20px;
	}

	li {
		font-family: var(--font-sans);
		font-size: 15px;
		line-height: 1.65;
		color: #b3b3b3;
		margin-bottom: 12px;
	}

	li:last-child { margin-bottom: 0; }

	a {
		color: var(--color-text);
		text-decoration: underline;
		text-underline-offset: 2px;
		transition: opacity 0.2s ease;
	}

	a:hover { opacity: 0.7; }

	strong { color: var(--color-text); font-weight: 600; }

	.del-form {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 480px;
	}

	.field-label {
		font-family: var(--font-label);
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #888;
		margin-bottom: 8px;
	}

	.text-input {
		background: transparent;
		border: 1px solid var(--color-rule-strong);
		padding: 14px 16px;
		color: var(--color-text);
		font-size: 16px;
		font-family: inherit;
		outline: none;
		margin-bottom: 20px;
		transition: border-color 0.2s ease;
		width: 100%;
	}

	.text-input:focus { border-color: var(--color-text); }
	.text-input::placeholder { color: #666; }
	.text-input[aria-invalid='true'] { outline: 1px solid #c87a5e; outline-offset: -1px; }

	.textarea { resize: vertical; line-height: 1.5; }

	.submit-btn {
		background: var(--color-text);
		border: 0;
		color: var(--color-bg);
		padding: 16px 28px;
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.14em;
		font-family: var(--font-label);
		cursor: pointer;
		text-transform: uppercase;
		transition: opacity 0.2s ease;
		align-self: flex-start;
	}

	.submit-btn:hover { opacity: 0.85; }
	.submit-btn:disabled { cursor: not-allowed; opacity: 0.5; }

	.form-message {
		margin-top: 14px;
		font-family: var(--font-label);
		font-size: 12px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #b3b3b3;
	}

	@media (max-width: 820px) {
		.doc { padding: 40px 22px 56px; }
		.doc-title { margin-bottom: 32px; }
		section { margin-bottom: 40px; }
		.submit-btn { width: 100%; align-self: stretch; text-align: center; }
	}
</style>

<script>
	// TODO: paste the deployed dedicated Apps Script /exec URL for deletion requests.
	const DELETION_ENDPOINT = '';

	const form = document.getElementById('delete-form');
	const emailInput = document.getElementById('del-email');
	const detailsInput = document.getElementById('del-details');
	const submitBtn = document.getElementById('del-submit');
	const message = document.getElementById('del-message');

	const isPlausibleEmail = (value) => /^[^@\s]+@[^@\s]+$/.test(value);

	if (!form || !emailInput || !detailsInput || !submitBtn || !message) {
		console.error('Deletion form initialization failed: required DOM elements not found.');
	} else if (!DELETION_ENDPOINT) {
		submitBtn.disabled = true;
		submitBtn.textContent = 'Unavailable';
		message.textContent = 'Requests are temporarily unavailable. Email privacy@thirdwave.fun.';
	} else if (!form.dataset.deleteBound) {
		form.dataset.deleteBound = 'true';
		form.addEventListener('submit', async (e) => {
			e.preventDefault();
			message.textContent = '';
			const email = emailInput.value.trim();
			const details = detailsInput.value.trim();

			if (!isPlausibleEmail(email)) {
				emailInput.setAttribute('aria-invalid', 'true');
				message.textContent = 'Enter a valid email address.';
				return;
			}
			emailInput.removeAttribute('aria-invalid');

			message.textContent = 'Submitting…';
			const previousButtonText = submitBtn.textContent ?? '';
			submitBtn.textContent = '...';
			submitBtn.disabled = true;

			try {
				await fetch(DELETION_ENDPOINT, {
					method: 'POST',
					body: JSON.stringify({ type: 'account_deletion', email, details }),
					mode: 'no-cors',
				});
				message.textContent = "Request received. We'll email you to confirm.";
				emailInput.value = '';
				detailsInput.value = '';
			} catch (err) {
				console.error('Network error during deletion request', err);
				message.textContent = 'Network error. Try again.';
			} finally {
				submitBtn.textContent = previousButtonText;
				submitBtn.disabled = false;
			}
		});

		emailInput.addEventListener('focus', () => {
			emailInput.removeAttribute('aria-invalid');
			if (message.textContent !== "Request received. We'll email you to confirm.") {
				message.textContent = '';
			}
		});
	}
</script>
```

- [ ] **Step 2: Verify the build succeeds**

Run: `npm run build`
Expected: build completes with no errors; output includes a `delete-account` route (e.g. `dist/delete-account/index.html` or `dist/delete-account.html`).

- [ ] **Step 3: Verify in the dev server**

Run: `npm run dev` and open `http://localhost:4321/delete-account`
Expected: page renders with Header + Footer, matches Privacy Policy styling. Submitting an invalid email shows "Enter a valid email address." With `DELETION_ENDPOINT` still empty, the button reads "Unavailable" and is disabled with the fallback message. Stop the dev server when done.

- [ ] **Step 4: Commit**

```bash
git add src/pages/delete-account.astro
git commit -m "Add /delete-account request page (Google Play deletion URL)"
```

---

### Task 2: Link the deletion page from the Privacy Policy

**Files:**
- Modify: `src/pages/privacy.astro` (the "Data retention" `<section>`, around `src/pages/privacy.astro:290-308`)

**Interfaces:**
- Consumes: nothing new.
- Produces: an in-page `<a href="/delete-account">` in the Data retention section.

- [ ] **Step 1: Add the deletion link to the Data retention section**

In `src/pages/privacy.astro`, inside the "Data retention" `<section>` (the one whose `<h2>` is "Data retention"), append a new paragraph after the existing two `<p>` elements, immediately before the closing `</section>`:

```astro
					<p>
						You can request deletion of your account and associated data at any time
						via our <a href="/delete-account">account deletion page</a>.
					</p>
```

- [ ] **Step 2: Verify the build succeeds**

Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 3: Verify the link in the dev server**

Run: `npm run dev`, open `http://localhost:4321/privacy`, scroll to "Data retention".
Expected: the new sentence appears and its link navigates to `/delete-account`. Stop the dev server when done.

- [ ] **Step 4: Commit**

```bash
git add src/pages/privacy.astro
git commit -m "Privacy Policy: link to account deletion page"
```

---

## Post-implementation (user actions, not code)

1. Deploy the dedicated Apps Script that receives `{type, email, details}` and logs it (e.g. to a Sheet / email). Paste its `/exec` URL into `DELETION_ENDPOINT` in `src/pages/delete-account.astro`, rebuild, and re-test the success path.
2. Merge `delete-account-page` → `main` and `git push origin main` (triggers Cloudflare deploy).
3. Paste `https://thirdwave.fun/delete-account` into Google Play Console → Store listing → "Delete account URL".

## Self-Review

- **Spec coverage:** app/developer identity → Task 1 intro section ✓; prominent steps → "How to request deletion" ol + form near top ✓; deleted-vs-kept + retention → two sections ✓; 30-day turnaround → Timing section ✓; real POST form to dedicated endpoint w/ placeholder + Unavailable guard → Task 1 script ✓; no twTrack ✓; Privacy Policy link, no footer/homepage edits → Task 2 ✓.
- **Placeholder scan:** `DELETION_ENDPOINT = ''` is an intentional, spec-required placeholder with a guard, documented in Post-implementation — not a plan gap. No other TODOs.
- **Type consistency:** element IDs (`delete-form`, `del-email`, `del-details`, `del-submit`, `del-message`) referenced in `<script>` match those in the markup ✓.
