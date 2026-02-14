# Bold Mono Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reskin the TWA static site to a clean off-black/off-white aesthetic with Lexend Semibold typography, removing visual effects and replacing the color palette.

**Architecture:** Pure CSS reskin across 7 files. No structural HTML changes. Replace Google Fonts import, update CSS variables, and rewrite component styles to match the new minimal aesthetic.

**Tech Stack:** Astro, vanilla CSS, Google Fonts (Lexend)

---

### Task 1: Update Layout.astro — fonts and design tokens

**Files:**
- Modify: `src/layouts/Layout.astro`

**Step 1: Replace the Google Fonts link (line 23)**

Change:
```html
<link href="https://fonts.googleapis.com/css2?family=Bowlby+One:wght@400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```
To:
```html
<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;600&display=swap" rel="stylesheet">
```

**Step 2: Replace CSS variables and base styles (lines 31-58)**

Replace the entire `<style is:global>` block with:
```css
<style is:global>
	:root {
		--color-bg: #111111;
		--color-text: #f0ede8;
		--color-accent: #b3a0cd;
		--color-muted: rgba(240, 237, 232, 0.5);
		--font-heading: 'Lexend', sans-serif;
		--font-body: 'Lexend', sans-serif;
	}

	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	html {
		font-family: var(--font-body);
		background: var(--color-bg);
		color: var(--color-text);
		line-height: 1.5;
	}

	body {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
</style>
```

**Step 3: Verify dev server runs**

Run: `npm run dev`
Expected: Site loads with Lexend font and new dark background. Components will look partially broken until restyled — that's fine.

**Step 4: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: update design tokens and font to Lexend"
```

---

### Task 2: Restyle Header.astro

**Files:**
- Modify: `src/components/Header.astro`

**Step 1: Replace the entire `<style>` block (lines 16-80)**

Replace with:
```css
<style>
	.header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		padding: 1.5rem 2rem;
		background: var(--color-bg);
		border-bottom: 1px solid rgba(240, 237, 232, 0.1);
	}

	.header-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.brand {
		font-family: var(--font-heading);
		font-size: 1.25rem;
		font-weight: 600;
		letter-spacing: -0.02em;
		color: var(--color-text);
	}

	.signup-link {
		font-family: var(--font-heading);
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text);
		text-decoration: none;
		padding: 0.5rem 1rem;
		border: 1px solid var(--color-accent);
		border-radius: 4px;
		transition: background 0.2s ease, color 0.2s ease;
	}

	.signup-link:hover {
		background: var(--color-accent);
		color: var(--color-bg);
	}

	@media (max-width: 768px) {
		.header {
			padding: 1rem 1.5rem;
		}

		.brand {
			font-size: 1rem;
		}

		.signup-link {
			font-size: 0.75rem;
			padding: 0.4rem 0.8rem;
		}
	}
</style>
```

Key changes: solid bg (no blur/transparency), removed uppercase, font-weight 600, purple border on button, clean hover.

**Step 2: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat: restyle header with clean minimal look"
```

---

### Task 3: Restyle Hero.astro

**Files:**
- Modify: `src/components/Hero.astro`

**Step 1: Replace the entire `<style>` block (lines 20-136)**

Replace with:
```css
<style>
	.hero {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 80vh;
		padding: 4rem 2rem;
		text-align: center;
		overflow: hidden;
	}

	.hero-background {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image: url('/images/hero-bg.png');
		background-size: auto 80%;
		background-position: center center;
		background-repeat: no-repeat;
		opacity: 0.6;
		z-index: 1;
	}

	.hero-content {
		width: 100%;
		position: relative;
		z-index: 2;
		padding: 0 2rem;
	}

	.hero-title {
		font-family: var(--font-heading);
		font-size: clamp(3rem, 12vw, 8rem);
		font-weight: 600;
		letter-spacing: -0.02em;
		line-height: 0.95;
		margin-bottom: 2rem;
		color: var(--color-text);
	}

	.hero-tagline {
		font-family: var(--font-heading);
		font-size: clamp(2rem, 8vw, 5rem);
		font-weight: 600;
		letter-spacing: -0.02em;
		line-height: 0.95;
		color: var(--color-accent);
		margin: 1rem 0 2rem 0;
	}

	.hero-subtitle {
		font-size: clamp(1.2rem, 4vw, 1.8rem);
		font-weight: 400;
		color: var(--color-muted);
		margin-bottom: 3rem;
		line-height: 1.4;
		max-width: 800px;
		margin-left: auto;
		margin-right: auto;
	}

	@media (max-width: 768px) {
		.hero {
			min-height: 50vh;
			padding: 1.5rem;
		}

		.hero-title {
			margin-bottom: 0.8rem;
		}

		.hero-tagline {
			margin-bottom: 1.2rem;
		}
	}
</style>
```

Key changes: removed backgroundFloat and fadeInUp keyframes, removed animation properties, tagline is plain purple text (no pill/background), title uses font-weight 600 with tight letter-spacing, subtitle uses muted color.

**Step 2: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat: restyle hero with bold Lexend typography"
```

---

### Task 4: Restyle EmailSignup.astro

**Files:**
- Modify: `src/components/EmailSignup.astro`

**Step 1: Replace the entire `<style>` block (lines 31-127)**

Replace with:
```css
<style>
	.signup {
		padding: 3rem 2rem;
		display: flex;
		justify-content: center;
	}

	.signup-content {
		max-width: 500px;
		width: 100%;
		text-align: center;
	}

	.signup-description {
		font-size: 1.1rem;
		margin-bottom: 1.5rem;
		color: var(--color-muted);
	}

	.form-group {
		display: flex;
		gap: 0.5rem;
		padding: 0.5rem;
		border-radius: 8px;
		border: 1px solid rgba(240, 237, 232, 0.2);
	}

	.email-input {
		flex: 1;
		background: transparent;
		border: none;
		padding: 0.8rem 1.2rem;
		color: var(--color-text);
		font-size: 1rem;
		outline: none;
		font-family: var(--font-body);
		font-weight: 400;
	}

	.email-input::placeholder {
		color: var(--color-muted);
	}

	.submit-btn {
		background: var(--color-accent);
		color: var(--color-bg);
		border: none;
		padding: 0.8rem 1.5rem;
		border-radius: 4px;
		font-weight: 600;
		font-size: 1rem;
		cursor: pointer;
		transition: opacity 0.2s ease;
		font-family: var(--font-heading);
		white-space: nowrap;
	}

	.submit-btn:hover {
		opacity: 0.85;
	}

	@media (max-width: 768px) {
		.signup {
			padding: 2rem 1.5rem;
		}

		.form-group {
			flex-direction: column;
			gap: 0.8rem;
			padding: 1rem;
		}

		.email-input {
			padding: 1rem 1.2rem;
		}

		.submit-btn {
			padding: 1rem 1.5rem;
		}
	}
</style>
```

Key changes: removed glassmorphism (backdrop-filter, rgba bg), removed fadeInUp animation, simple border with 8px radius, button is solid purple with subtle hover, clean placeholder color.

**Step 2: Commit**

```bash
git add src/components/EmailSignup.astro
git commit -m "feat: restyle email signup with clean minimal form"
```

---

### Task 5: Restyle YouTubeSection.astro

**Files:**
- Modify: `src/components/YouTubeSection.astro`

**Step 1: Replace the entire `<style>` block (lines 51-173)**

Replace with:
```css
<style>
	.youtube-section {
		padding: 4rem 2rem;
		text-align: center;
	}

	.youtube-content {
		max-width: 800px;
		margin: 0 auto;
	}

	.youtube-title {
		font-family: var(--font-heading);
		font-size: clamp(1.5rem, 5vw, 2.5rem);
		font-weight: 600;
		letter-spacing: -0.02em;
		line-height: 0.95;
		margin-bottom: 1rem;
	}

	.youtube-description {
		font-size: 1.1rem;
		margin-bottom: 2rem;
		color: var(--color-muted);
		font-weight: 400;
	}

	.video-grid {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		margin-bottom: 2rem;
		max-width: 800px;
		margin-left: auto;
		margin-right: auto;
	}

	.video-item {
		position: relative;
		width: 100%;
		height: 0;
		padding-bottom: 56.25%;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.youtube-player {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border: none;
	}

	@media (max-width: 768px) {
		.youtube-section {
			padding: 3rem 1.5rem;
		}

		.youtube-title {
			margin-bottom: 0.8rem;
		}

		.youtube-description {
			font-size: 1rem;
			margin-bottom: 1.5rem;
		}
	}
</style>
```

Key changes: removed fadeInUp animation, removed unused .channel-link styles, subtler shadow, wider gap between videos, font-weight 600 on title, muted description color.

**Step 2: Commit**

```bash
git add src/components/YouTubeSection.astro
git commit -m "feat: restyle youtube section with cleaner layout"
```

---

### Task 6: Restyle SocialLinks.astro

**Files:**
- Modify: `src/components/SocialLinks.astro`

**Step 1: Replace the entire `<style>` block (lines 32-103)**

Replace with:
```css
<style>
	.social {
		padding: 2rem;
		display: flex;
		justify-content: center;
	}

	.social-links {
		display: flex;
		gap: 2rem;
		align-items: center;
	}

	.social-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--color-text);
		text-decoration: none;
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 1rem;
		transition: color 0.2s ease;
	}

	.social-link:hover {
		color: var(--color-accent);
	}

	@media (max-width: 768px) {
		.social {
			padding: 1.5rem;
		}

		.social-links {
			flex-direction: column;
			gap: 1rem;
		}

		.social-link {
			justify-content: center;
		}
	}
</style>
```

Key changes: removed all backgrounds, borders, backdrop-filter, shadows, scale/translate animations. Just plain text links with purple hover.

**Step 2: Commit**

```bash
git add src/components/SocialLinks.astro
git commit -m "feat: restyle social links as simple text links"
```

---

### Task 7: Restyle Footer.astro

**Files:**
- Modify: `src/components/Footer.astro`

**Step 1: Replace the entire `<style>` block (lines 15-43)**

Replace with:
```css
<style>
	.footer {
		padding: 2rem;
		text-align: center;
		border-top: 1px solid rgba(240, 237, 232, 0.1);
		margin-top: auto;
	}

	.footer-content {
		max-width: 1200px;
		margin: 0 auto;
	}

	.copyright {
		font-size: 0.875rem;
		color: var(--color-muted);
		font-weight: 400;
	}

	@media (max-width: 768px) {
		.footer {
			padding: 1.5rem;
		}

		.copyright {
			font-size: 0.75rem;
		}
	}
</style>
```

Key changes: border uses new off-white color, copyright uses muted variable, font-weight 400.

**Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: restyle footer with muted off-white tones"
```

---

### Task 8: Visual verification

**Step 1: Run dev server and verify**

Run: `npm run dev`

Check each section visually:
- [ ] Header: solid dark bg, Lexend semibold brand, purple-bordered button
- [ ] Hero: big bold Lexend title, purple tagline text (no pill), static logo bg
- [ ] Email form: clean bordered box, purple submit button, no glass effect
- [ ] YouTube: clean title, subtle video shadows, more spacing
- [ ] Social: plain text links, purple on hover
- [ ] Footer: muted copyright, thin border
- [ ] Mobile: all sections stack correctly at 768px

**Step 2: Final commit if any tweaks needed**

```bash
git add -A
git commit -m "fix: visual polish after redesign review"
```
