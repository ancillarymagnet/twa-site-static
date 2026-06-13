# Product

## Register

brand

## Users

Three audiences read the same site, and the design has to hold all three without softening for any:

- **Players** — moviegoers, parkgoers, arcade-goers who show up to play. They arrive curious, often on a phone, wanting to know what this *is*. Their job: understand the new medium fast enough to want in ("GET INVITED").
- **Developers / studios** — people building interactive experiences who might build for shared-screen / phone-as-controller. They want signal that this is real, technical, and worth their time ("REQUEST DEV KIT ACCESS"). They read the dev and platform pages.
- **Venue operators** — theater and park operators evaluating the licensed hardware + booking program. They want confidence and proof, not hype.

Context: short attention, mixed devices, often first contact with the brand. The site is the pitch.

## Product Purpose

Third Wave makes physical venues — movie theaters, amusement parks, arcades — into **shared-screen multiplayer environments**. Up to 100 players use their own phones as the controller; the big screen is the game. No goggles, no controllers.

The company sells three things at once: an audience-facing brand, a developer platform (SDK + publishing pipeline), and a venue program (licensed hardware + automated booking). The site's job is to make a genuinely new medium legible and desirable in seconds, and to route each audience to the right next step. Success = the visitor *gets it* and signs up / requests access without needing it over-explained.

## Brand Personality

**Voice:** dry, confident, short. Cinema-marquee bold, developer-doc precise, arcade-flyer punchy. Sentences end before you expect them to.

- **Declarative, not promotional.** "Making places playable." — never "We're excited to announce…"
- **Aggressive minimalism.** A handful of words doing a lot of work (the ticker is the purest expression).
- **Negative definitions.** The medium lives in the gap: *NOT A GAME, NOT A MOVIE / NO GOGGLES / NO CONTROLLERS.*
- **Slightly snotty, in a good way.** "blow some wigs back", "IRL 4 EVER". There's a face behind the brand and it's allowed to be wry. The footer byline ("A production of Your Free Call Will End Soon, Co.") is the one place it winks.
- **No exclamation marks.** Excitement comes from being right, not loud.

Three-word personality: **bold, dry, new.** Emotional goal: the confident thrill of being early to something real.

## Anti-references

The site must NOT look like any of these:

- **Loud arcade / gamer.** No neon, RGB gradients, glow, "epic" gamer energy, or Twitch-maximalism. This is the energetic-arcade look the brand deliberately moved away from — the new medium is cooler and more composed than that.
- **Generic SaaS / AI-startup.** No cream/sand backgrounds, soft cards, gradient-text heroes, tiny tracked eyebrows on every section, or the hero-metric template.
- **Web3 / crypto.** No glassmorphism, holographic gradients, purple-glow dark mode, 3D blobs, or "the future" clichés.
- **Corporate / enterprise.** No stock photography, navy-and-gray palettes, friendly mascots, busy navigation, or marketing-deck polish.

The brand's own discipline is the strongest anti-reference: ~99% achromatic, square corners, hairline rules, no shadows, no blur, one bright thing per screen.

## Design Principles

1. **The medium is new, so the design refuses precedent.** It defines itself by what it isn't. When a choice looks like a category cliché (gamer, SaaS, crypto, corporate), it's wrong.
2. **Theater-marquee meets developer terminal.** Nearly-black chassis, off-white type, one bright element per screen (a ticker, a pill, a white CTA). Everything else is rules and gaps.
3. **Restraint is the brand.** Hype is implied through cadence and confidence, not adjectives, color, or motion. If you're reaching for a brand accent color, you almost certainly don't need one.
4. **Color lives in content, not chassis.** The B&W chassis exists to make real show imagery, posters, and venue photography pop. Don't desaturate content to "match"; don't tint the chassis to decorate.
5. **One voice, three audiences.** Player, developer, and operator all read the same dry confidence — never dumbed down for players or over-jargoned for devs. Route, don't pander.

## Accessibility & Inclusion

- **WCAG AA.** Body text ≥4.5:1 against its background; large text (≥18px / bold ≥14px) ≥3:1. The off-black (`#0a0a0a`) / pure-white (`#ffffff`) chassis clears this comfortably; watch the dim foreground steps (`--fg-3` `#888`, `--fg-4` `#555`) — `#555` on `#0a0a0a` fails body contrast, so reserve it for non-text rules, never for reading copy.
- **Reduced motion is mandatory.** Every animation needs a `prefers-reduced-motion: reduce` alternative. The two signature motions (ticker scroll, live-status pulse) and the scroll-bob arrow already respect it; anything new must too.
- **No information by color alone.** The capability-matrix status colors (green / amber / coral) must always pair with a glyph or label, never carry meaning on hue alone.
