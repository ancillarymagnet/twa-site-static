# Project: thirdwave.fun static site

## Architecture: split static homepage + Astro pages

The site is **not** uniformly Astro. Two distinct systems serve the pages:

- **Homepage (`/`)** is a hand-built static file at `public/index.html`. It does NOT use the Astro `Layout`/`Header`/`Footer` components — it has its own inlined `<head>`, footer, and email-signup form/script. `astro dev` does **not** serve it at the root route (you'll get a 404 on `/` in dev); use `astro build` + `astro preview` to see the real homepage, which serves the built `dist/`.
- **Everything else** (`/platform`, `/dev`, `/privacy`) is Astro under `src/pages/`, using `src/layouts/Layout.astro` + the shared `src/components/*` (Header, Footer, EmailSignup).

**Practical consequence:** site-wide changes must be made in BOTH places. A change to `src/components/Footer.astro` or `Layout.astro` does NOT touch the homepage. Examples that needed editing in both: the footer Privacy Policy link, and the `<head>` analytics script tag. Shared client logic lives in `public/tw-analytics.js` (referenced from both heads) so there's one source of truth.

## Deploy model

**Cloudflare Pages, git-integrated.** `dist/` is gitignored; Cloudflare builds from source. **Pushing to `main` triggers an automatic build + deploy** — there is no separate deploy step. So "deploy" = commit to `main` and `git push origin main`. Nothing is live until pushed (local `astro build`/`astro preview` are preview-only). `wrangler.toml` sets `pages_build_output_dir = "dist"`.

## Analytics

GA4 + (scaffolded) Meta Pixel load via `public/tw-analytics.js`, geo-gated for consent: EU/EEA/UK/CH visitors get a consent banner (opt-in), everyone else loads immediately; geo comes from Cloudflare's `/cdn-cgi/trace` (only works on the deployed site, not localhost). Call `window.twTrack(name, params)` to record a conversion — it no-ops unless pixels actually loaded (consent given). Three conversions are wired: `sign_up` (consumer email), `dev_kit_interest` (Tally link click), `licensing_interest` (licensing mailto click).

## Browser vs. App Comparison Page

When adding or updating rows in the browser-vs-app capability comparison table, you MUST do active, current research before writing any content. Do not rely on training data alone — search the web for the latest documentation, changelogs, developer forums, and real-world reports.

For every capability row, research and surface:

- **Gotchas**: Hardware filters, OS-level restrictions, silent failures, undocumented behaviours that make a feature not work as expected
- **Limitations**: Bandwidth caps, range limits, battery impact, supported device lists, API maturity
- **Cross-platform considerations**: Does iOS talk to Android? Are protocols proprietary or standards-based (FiRa, W3C, etc.)? What happens in a mixed crowd?
- **Delays and setup overhead**: Permission prompts, discovery handshakes, session negotiation time, cold-start latency — anything that affects real-time use
- **Permission impacts**: What prompts does the user see? How often? Does permission persist or reset? What happens if denied?
- **Hidden opportunities**: Cross-platform workarounds (e.g. acoustic data transfer works across any device with a speaker and mic), lesser-known APIs, open-source libraries filling gaps left by discontinued SDKs

Do not write "Full access" or "Yes" without confirming this is actually true in practice. A native API existing is not the same as it working well. Verify claims against current (2025+) sources.
