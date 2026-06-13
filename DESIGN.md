---
name: Third Wave
description: Making places playable. A near-black chassis built to frame a pure-white knockout wordmark — Lexend mark, Schibsted Grotesk system voice.
colors:
  bg-0: "#0a0a0a"
  bg-1: "#141414"
  bg-2: "#1e1e1e"
  bg-warm: "#272727"
  bg-deep-warm: "#150e08"
  bg-deep-cool: "#080b14"
  rule: "#1a1a1a"
  rule-strong: "#2a2a2a"
  fg-0: "#ffffff"
  fg-1: "#d4d4d4"
  fg-2: "#b3b3b3"
  fg-3: "#888888"
  fg-4: "#555555"
  inverse-bg: "#ffffff"
  inverse-fg: "#000000"
  status-yes: "#7ec87e"
  status-par: "#d4a847"
  status-no: "#f28b8b"
  status-warn: "#c87a5e"
typography:
  wordmark:
    fontFamily: "Lexend, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.02em"
  display:
    fontFamily: "Lexend, system-ui, sans-serif"
    fontSize: "clamp(40px, 7vw, 80px)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Lexend, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  lede:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.14em"
rounded:
  zero: "0"
  pill: "20px"
  card: "10px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "24px"
  "6": "32px"
  "7": "48px"
  "8": "64px"
  "9": "80px"
  page-x: "40px"
  page-x-sm: "22px"
components:
  button-primary:
    backgroundColor: "{colors.fg-0}"
    textColor: "{colors.inverse-fg}"
    rounded: "{rounded.zero}"
    padding: "0 28px"
    typography: "{typography.label}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.fg-0}"
    rounded: "{rounded.zero}"
    padding: "9px 15px"
    typography: "{typography.label}"
  button-outline-hover:
    backgroundColor: "{colors.fg-0}"
    textColor: "{colors.bg-0}"
  input-email:
    backgroundColor: "transparent"
    textColor: "{colors.fg-0}"
    rounded: "{rounded.zero}"
    padding: "16px 18px"
  nav-link:
    textColor: "{colors.fg-3}"
    typography: "{typography.label}"
  nav-link-hover:
    textColor: "{colors.fg-0}"
  ticker:
    backgroundColor: "{colors.inverse-bg}"
    textColor: "{colors.inverse-fg}"
    padding: "13px 0"
    typography: "{typography.label}"
---

# Design System: Third Wave

## 1. Overview

**Creative North Star: "The Knockout Wordmark"**

The entire system exists to frame one asset: the pure-white knockout lockup. Every other decision falls out of that. The text color is `#ffffff` (#fg-0), not an off-white — every off-white tried sat awkwardly next to the pure-white mark, so the foreground commits to the asset. The chassis is the only off-endpoint: a barely-warm off-black `#0a0a0a` (#bg-0) that avoids the optical buzz of pure `#000` on a glowing display. The brand *is* the mark; the page is the dark room that frames it.

The mood is **theater-marquee meets developer terminal**: nearly-black house lights, off-white type, and exactly one bright element per screen — the scrolling ticker, the live status pill, or a white CTA. Everything else is rules and gaps. The product is doing something genuinely new (venues become 100-player shared-screen games; phone is the controller; no goggles, no app), and the design refuses to over-explain it. Confidence is carried by restraint and cadence, never by color, glow, or motion.

This system explicitly rejects the four category reflexes named in PRODUCT.md: **loud arcade/gamer** (no neon, RGB, glow, Twitch-maximalism), **generic SaaS** (no cream backgrounds, soft cards, gradient-text heroes, per-section eyebrows), **web3/crypto** (no glassmorphism, holographic gradients, purple-glow), and **corporate/enterprise** (no stock photos, navy-gray, mascots, busy nav). Discipline is the differentiator: ~99% achromatic, square corners, hairline rules, no shadow system, no blur.

The homepage (`/`) is **image-led**: a full-bleed, heavily-treated black-and-white photographic hero — a deadpan low-poly cat-celebrity theater scene in the modern-streetwear register of Cav Empt / Brain Dead — carries the brand's edge, while the type stays a quiet chassis layered over it. **Quiet chassis, loud content**: the attitude comes from the treated imagery and the copy, not from an opinionated typeface. The subpages (`/dev`, `/platform`) wear the same chassis without the full-bleed plate.

**Key Characteristics:**
- Off-black chassis (`#0a0a0a`), pure-white type and CTAs (`#ffffff`) — the lockup sets the spec.
- Zero radii everywhere (the live-status dot and play button are the only circles; the capability matrix is the only 10px container).
- 1px hairline rules carry all structure; there is no shadow system.
- One bright thing per screen. Color lives *inside content frames*, never in the chassis.
- Two type roles by size/job: **Lexend** = display (wordmark + all headlines); **Schibsted Grotesk** = text (body, ledes, labels, ticker, CTAs). Lexend is a deliberately low-opinion display pick — a new company shouldn't bet identity on a charactered face; personality lives in copy, motion, and texture.
- The homepage is **image-led**: a heavily-treated B&W hero plate carries the edge; type stays quiet over it. Subpages keep the chassis without the plate.

## 2. Colors

The palette is monochrome by doctrine — an off-black surface ladder and a five-step off-white-to-near-invisible foreground ramp, with three editorial status hues that appear in exactly one place.

> **Token naming note.** The canonical scale below comes from the `tw-brand` system (`--bg-*` / `--fg-*`). The live Astro site (`src/layouts/Layout.astro`) currently tokenizes a **subset** under `--color-*` names: `--color-bg` = bg-0, `--color-text` = fg-0, `--color-muted` = fg-3, `--color-dim` = fg-4, `--color-rule` = rule, `--color-rule-strong` = rule-strong. The intermediate foreground steps (`#d4d4d4`, `#b3b3b3`) and the `#666` placeholder grey appear as **hardcoded hex** inside components (footer byline, reel CTA, form messages, input placeholder), not yet as named tokens. Treat the full scale as the system; promote hardcoded values to tokens when touching those files.

### Primary
There is no chromatic brand accent — and that is the point. The "primary" gesture is **inversion**: white-on-black flips to black-on-white for the single loudest element per screen.
- **Knockout White** (#ffffff / `--fg-0`): highest-emphasis text, the lockup wordmark, CTA fills, the ticker text-on-inverse. Matches the lockup exactly.
- **Marquee Black** (#0a0a0a / `--bg-0`): the primary backdrop and the ink that sits on inverted (white) surfaces. Slightly warm off-black, never pure `#000`.

### Neutral
A four-rung surface ladder and a five-rung foreground ramp do all the structural work.
- **Surface ladder** — Raised `#141414` (`--bg-1`, tiles before hover), Inner panel `#1e1e1e` (`--bg-2`, comparison-table interior), Warm long-form `#272727` (`--bg-warm`, docs pages only).
- **Foreground ramp** — Secondary `#d4d4d4` (`--fg-1`, body on dark), Tertiary `#b3b3b3` (`--fg-2`, footer copy, reel CTA, form status), Dim `#888888` (`--fg-3`, labels & metadata), Near-rule `#555555` (`--fg-4`).
- **Rules** — Hairline divider `#1a1a1a` (`--rule`), visible border `#2a2a2a` (`--rule-strong`, inputs & tiles).

### Tertiary (editorial only)
- **Cinema-curtain warm** `#150e08` (`--bg-deep-warm`) and **Projection-room midnight** `#080b14` (`--bg-deep-cool`): saturated darks for full-bleed section moments on long pages. Never the default chassis; never a card or rule. More than one per page is a misuse.
- **Status hues** — green `#7ec87e`, amber `#d4a847`, coral `#f28b8b`, and invalid-input outline `#c87a5e` (`--status-warn`). These live **only** inside the browser-vs-app capability matrix and the form's invalid state. They are content, not chassis.

### Named Rules
**The One Bright Thing Rule.** At most one element per screen is allowed to be loud — the ticker, the live pill, or a white CTA. If a content tile is vivid, the surrounding UI goes quiet so the loud thing can be loud without competing.

**The No Accent Rule.** There is no chromatic brand accent. If you find yourself reaching for a brand color, stop — the answer is almost always no. The primary CTA is white-on-black; the ticker is black-on-white. That inversion is the only "accent" the brand owns.

**The Color-In-Content Rule.** Saturation belongs to real show imagery, posters, and venue photography — never the chassis. Do not desaturate genuine show/venue content to "match," and never tint the chassis to decorate. The B&W frame is what makes the content pop.

**The Treated-Imagery Rule.** The brand's own marketing plates — the homepage hero and section graphics — are *deliberately* heavy black-and-white treatments (high-contrast, grain, streetwear print register; Cav Empt / Brain Dead). That treatment IS the aesthetic: it's the loud content the quiet type chassis frames. This is the one place B&W treatment is intended, and it does **not** contradict the Color-In-Content Rule — that rule governs genuine show footage and venue photography, which keep their saturation. Bake the treatment into the asset (grayscale/contrast/brightness), not runtime CSS `filter`s, so scroll stays GPU-smooth.

## 3. Typography

**Display Font:** Lexend (with system-ui, sans-serif) — `--font-display`, the wordmark *and* every headline
**Text Font:** Schibsted Grotesk (with system-ui, sans-serif) — `--font-sans` / `--font-label`, body, ledes, and labels

**Character:** Two roles, split by size/job — display vs text. **Lexend** is the *declaration* — the wordmark and every headline. Even and geometric; it reads as confident and built, and it's a **deliberately low-opinion** display choice. Third Wave is a new company, and a strongly-charactered display face is a near-permanent identity bet that ages fast — Lexend keeps the display flexible and lets the wordmark and headlines share one face (so they never clash). **Schibsted Grotesk** is the *text* voice — a clean, contemporary grotesque (drawn originally for Schibsted's newsrooms): neutral, highly legible, low-key. At body/label sizes it carries the copy without competing with the display; it does NOT set headlines. Its understatement is the point — an even more neutral body face than a charactered grotesque would be, which is exactly right while the brand is young: the wordmark, headlines, and content lead, and the body face stays out of the way. Both were chosen *off* the AI reflex-reject defaults (no Inter, no Newsreader, no editorial-serif-italic lane). Personality that wants a louder voice is carried by **copy, motion, and texture** — channels you can change any afternoon — not by betting the type identity on an opinionated face this early.

### Hierarchy
- **Wordmark** (Lexend 800, line-height 0.9, tracking -0.02em, uppercase): the lockup and the small top-bar wordmark. Prefer the PNG lockup (`src/assets/lockup.png`) at hero scale; use live Lexend for the small top-bar mark.
- **Display / Headline** (Lexend 800, `clamp(40px, 7vw, 80px)`, line-height ~0.95, tracking -0.025em, uppercase): page headlines — `BUILD ON THIRD WAVE.`, `YOUR SPACE. YOUR STORY. OUR PLATFORM.`. Shares the wordmark's face so the two never fight.
- **Section head** (Lexend 600, ~22–24px, line-height 1.1, tracking -0.01em): H2 / H3, the reel section title.
- **Lede** (Schibsted 400, ~20–22px, line-height 1.25, tracking -0.01em): the hero tagline and dev/platform ledes — the narrator voice lives in light-weight Schibsted, not a serif.
- **Body** (Schibsted 400, 15px, line-height 1.55): prose and form fields. Cap measure at 65–75ch; max prose width is 560px.
- **Label** (Schibsted 600–700, 12–13px, tracking 0.14em, uppercase): the workhorse — nav links, CTAs, ticker, status pills, footer credits, metadata, eyebrows. Top-bar metadata tracks wider (0.16em); footer cue text widest (0.18em).

### Named Rules
**The Display-Is-Lexend Rule.** Lexend (`--font-display`) sets the wordmark and every headline — and only those. Sharing one face across mark and headline is what keeps them from clashing. If Lexend shows up on a lede, a sentence of body, or a label, it's wrong; if a headline is set in Schibsted, that's also wrong.

**The Low-Opinion-Display Rule.** Keep the display face neutral and flexible while the brand is young. Don't swap Lexend for a charactered display (condensed-magazine, wonky-grotesque, vintage-sign) as a shortcut to "personality" — that's an identity bet you can't cheaply undo. Personality belongs in copy, motion, and texture first.

**The No-Costume-Mono Rule.** There is no decorative monospace. If genuine code or tabular data ever needs a mono, use a system `ui-monospace` stack for that content only — never as a "technical" styling flourish on labels or eyebrows.

## 4. Elevation

The brand has functionally **no shadow system**. Depth is conveyed entirely by surface color (the `#0a0a0a → #141414 → #1e1e1e` ladder) and hairline rule density. Surfaces are flat at rest and flat on hover; section breaks are 1px `border-top` rules, not drop shadows or extra margin. There is no glassmorphism, no `backdrop-filter`, no translucent layering anywhere in production — the brand is opaque-on-opaque.

### Shadow Vocabulary (the only exceptions)
- **Live-status glow** (`box-shadow: 0 0 10px rgba(255,255,255,0.6)`): the 6×6 white status dot only. Paired with the `tw-pulse` opacity animation.
- **Tile scrim** (`linear-gradient(to top, rgba(0,0,0,0.55), transparent)` over the bottom 50%): a readability scrim on video tiles, plus a `text-shadow: 0 1px 2px rgba(0,0,0,0.6)` on tile metadata. These are legibility tools over imagery, not elevation.

### Named Rules
**The Flat-By-Default Rule.** Surfaces never lift. If you are about to add a `box-shadow` to a card, button, or panel, stop — use a surface-ladder step or a hairline rule instead. The only `box-shadow` in the system is the status-dot glow.

## 5. Components

### Buttons
- **Shape:** square (radius 0). No exceptions.
- **Primary (inverse fill)** — the email submit button: solid white (`#ffffff`) fill, black (`#0a0a0a`) text, `padding: 0 28px`, label typography (Schibsted 600–700, 13px, tracking 0.14em, uppercase). Hover: `opacity → 0.85` (no color change, no transform). Disabled: `opacity 0.7`, `cursor: progress`.
- **Outline (header CTA)** — `GET INVITED` / `DEVELOPERS`: transparent fill, white text, 1px solid white border, `padding: 9px 15px`, `min-width: 180px` (150px mobile) so the nav doesn't reflow as the label changes. Hover: inverts to white fill + black text. Transition: `background 0.2s, color 0.2s` ease.
- **No transforms on press** — buttons do not scale or translate; the dev CTA's `translateY(-1px)` lift is the documented lone exception.

### Inputs / Fields
- **Style:** transparent background, 1px `--rule-strong` (`#2a2a2a`) border on the wrapping group, white text, `padding: 16px 18px`, square. Placeholder is `#666`. Font-size 16px (prevents iOS zoom-on-focus).
- **Focus:** no separate focus ring is designed — rely on the border. The `#signup:target` group flashes its border white once (`signup-flash`, 1.4s) when linked to.
- **Error:** invalid email gets a 1px coral outline (`#c87a5e`, `outline-offset: -1px`) plus an uppercase status message.
- **Mobile:** the inline group stacks vertically; each control takes a full-width border of its own.

### Navigation
- **Style:** uppercase tracked Schibsted (`--font-label`, 12px, 0.14em), `--fg-3` (`#888`) at rest, lifting to `--fg-0` (`#ffffff`) on hover and for the active route (`aria-current="page"`). The desktop nav sits behind a 1px left rule (`--rule-strong`).
- **Mobile (≤820px):** nav links collapse into a burger that toggles a `.mobile-menu` (links stacked with hairline separators, plus the live-status pill). The burger's three 1px bars animate into an X. The outline CTA stays visible in the bar.

### Ticker (signature component)
- A full-bleed inverted band: white (`#ffffff`) background, black text, uppercase tracked Schibsted (13px, 0.14em), `padding: 13px 0`. The copy is duplicated and scrolled `translateX(0 → -50%)` over **60s linear infinite** (40s on mobile) — the heartbeat of the site. A visually-hidden single copy carries the real text for screen readers. Respects `prefers-reduced-motion` (animation off).

### Video Tile (signature component)
- `aspect-ratio: 16/9`, `background #0a0a0a`, 1px `--rule` border, square, `overflow: hidden`. Thumbnail sits at `filter: brightness(0.7)` at rest, lifting to `1` with `scale(1.03)` on hover (the documented exception to "no transforms"). A circular play button (1px white-50% border) fills solid white on hover with its triangle going black. A bottom scrim keeps the uppercase duration legible. Click swaps the thumbnail for an autoplay YouTube iframe.

### Live-Status Pill
- A 6×6 pure-white circle (the lone `border-radius: 50%`) with a `0 0 10px rgba(255,255,255,0.6)` glow, pulsing opacity `1 → 0.35 → 1` over 1.8s, beside an uppercase tracked status label (`SIGNUPS OPEN`).

### Image-Led Hero (signature component)
- The homepage hero: a full-bleed treated-B&W photographic plate (`object-fit: cover`) with the tonal treatment **baked into the asset** — no runtime CSS `filter`s (baking keeps scroll GPU-smooth on mobile). A layered scrim (a radial over the lower-center plus a top/bottom linear) darkens the band where the centered Lexend wordmark sits, so it stays legible over bright content. Corner chrome: small Lexend wordmark top-left, uppercase meta top-right, the live-status pill bottom-left, an outline CTA bottom-right.
- **Mobile height is sized from viewport WIDTH** (`height: 150vw`, clamped `min 520px` / `max 700px`), **never `vh`/`svh`/`dvh`** — viewport-*height* units resize when iOS Safari and Firefox iOS collapse the address bar mid-scroll, which yanks the hero ~100px and reads as a scroll jump. Width is immune. (Desktop hero is a fixed `760px`.)
- **No `overflow-x: hidden` on `html`/`body`** — it silently forces iOS off GPU-accelerated scrolling (janky scroll). Contain wide children (e.g. the ticker track) on the element itself instead.

## 6. Do's and Don'ts

### Do:
- **Do** keep the chassis strictly monochrome — header, ticker, footer, type, CTAs, status pills, nav. Color discipline is the brand.
- **Do** let exactly **one bright thing** live per screen; quiet everything around a loud content tile.
- **Do** use square corners (radius 0) for buttons, inputs, tiles, and panels. The only circles are the status dot and play button; the only 10px radius is the capability-matrix outer container.
- **Do** carry structure with 1px hairline rules and the surface-color ladder (`#0a0a0a → #141414 → #1e1e1e`), not shadows.
- **Do** use **Lexend** (`--font-display`) for display — the wordmark *and* headlines — and **Schibsted** for text: body, ledes, and uppercase tracked labels/CTAs (`--font-label`). Sharing one face across mark + headline is what keeps them from clashing.
- **Do** let genuine content imagery (posters, show captures, venue photos) be as saturated as the source — the B&W frame makes it pop.
- **Do** treat the brand's own hero/marketing plates heavily (high-contrast B&W, grain, streetwear print register) — that treatment is the loud content the quiet chassis frames. Bake the treatment into the asset, not runtime CSS filters.
- **Do** use the brand's Unicode glyphs: `↗` (outbound), `↓` (scroll cue), `←` (back), `·` (separator), `—` (editorial pause), `//` (dev aside).
- **Do** ship a `prefers-reduced-motion` alternative for every animation (the ticker, status pulse, scroll-cue bob, and signup flash already do).

### Don't:
- **Don't** look like **loud arcade/gamer** — no neon, RGB gradients, glow, or Twitch-maximalism.
- **Don't** look like **generic SaaS** — no cream/sand backgrounds, soft cards, gradient-text heroes, hero-metric templates, or a tracked eyebrow above every section.
- **Don't** look like **web3/crypto** — no glassmorphism, holographic gradients, purple-glow dark mode, or 3D blobs.
- **Don't** look like **corporate/enterprise** — no stock photography, navy-and-gray, friendly mascots, or busy navigation.
- **Don't** introduce a chromatic brand accent. There isn't one. Inversion (white↔black) is the only accent.
- **Don't** add `box-shadow`, `backdrop-filter`, blur, or translucent layers (the status-dot glow is the sole exception).
- **Don't** use monospace as decorative "technical" shorthand — labels are tracked Schibsted; a `ui-monospace` stack is for genuine code/tabular data only.
- **Don't** reintroduce Inter or Newsreader, or set an editorial display-serif-italic headline — those are the reflex-reject defaults this system was chosen to avoid.
- **Don't** set body, ledes, or labels in Lexend, and don't set headlines in Schibsted — Lexend is display (wordmark + headlines), Schibsted is everything at text size. Don't swap Lexend for a charactered display face as a shortcut to personality while the brand is young.
- **Don't** desaturate content imagery with a blanket `grayscale()` to "match the brand," and don't tint the chassis to decorate.
- **Don't** use the editorial saturated darks (`#150e08`, `#080b14`) as default chassis, card backgrounds, or rules — full-bleed section moments only, at most one per page.
- **Don't** use exclamation marks or emoji in product copy (the favicon emoji is a known placeholder pending a wave-cube SVG).
