# Bold Mono Redesign

Reskin the Third Wave Arcade static site from an energetic arcade aesthetic to a clean, off-black/off-white, typography-driven look using Lexend Semibold.

## Design Tokens

```
--color-bg:        #111111                     off-black
--color-text:      #f0ede8                     warm off-white
--color-accent:    #b3a0cd                     purple (used sparingly)
--color-muted:     rgba(240, 237, 232, 0.5)    dimmed text
```

**Typography:** Single family — Lexend from Google Fonts.
- Headings: Lexend 600 (Semibold), `line-height: 0.95`, `letter-spacing: -0.02em`
- Body: Lexend 400 (Regular), `line-height: 1.5`
- No uppercase transforms. Let weight do the talking.

Replace both Bowlby One and Inter.

## What Gets Removed

- Glassmorphism / backdrop-filter blur on form and header
- Floating background animation (backgroundFloat keyframes)
- Staggered fadeInUp entrance animations
- Lime-yellow accent (#d1ef53) entirely
- Semi-transparent backgrounds on social links
- Hover scale/translate animations on social links

## Component Changes

### Header
- Fixed, solid #111111 background (no transparency/blur)
- Brand name: Lexend Semibold, off-white
- "SIGN UP" button: 1px #b3a0cd border, Lexend Semibold, off-white text
- Hover: solid purple fill, off-black text
- Same layout (brand left, button right)

### Hero
- hero-bg.png stays — static, no animation (remove float/rotate keyframes)
- Title: Lexend Semibold, same fluid clamp() sizing
- Tagline: no pill/background. Lexend Semibold in #b3a0cd purple text
- Subtitle: Lexend Regular, muted color
- No fade-in animation

### Email Signup
- No glassmorphism or blur
- 1px rgba(240, 237, 232, 0.2) border, 8px border-radius
- Input: transparent background, off-white text, Lexend Regular
- Submit button: solid #b3a0cd background, off-black text, Lexend Semibold
- Inline on desktop, stacked on mobile

### YouTube Section
- Title: Lexend Semibold
- Videos: subtle shadow (0 4px 12px rgba(0,0,0,0.3)), 12px radius
- More whitespace between videos

### Social Links
- No background cards
- Text links in Lexend Semibold
- Purple color on hover
- Simple and flat

### Footer
- 1px top border at rgba(240, 237, 232, 0.1)
- Copyright in muted text, Lexend Regular

## What Stays

- Page structure: hero -> signup -> youtube -> social -> footer
- All content from site.md
- Responsive behavior (768px breakpoint)
- Fixed header
- hero-bg.png (it's the logo)
- Web3Forms integration
