# Project: thirdwave.fun static site

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

## Image generation / editing (fal.ai)

The fal.ai API key lives in `.env` as `FAL_API_KEY` (gitignored — never commit it). Use that directly; you do **not** need the 1Password (`op`) CLI for this repo.

```bash
set -a; source .env; set +a   # exports FAL_API_KEY
```

Generated/edited site imagery lives in `public/gen/` (served as-is; mirrored into `dist/gen/` on build).

**Text-to-image:** the global `image-gen` CLI works (`image-gen "<prompt>" --model gpt-image-2 --out public/gen/foo.png`). It reads `FAL_KEY` from the env, so `export FAL_KEY="$FAL_API_KEY"` first.

**Image editing (image-to-image), e.g. gpt-image-2:** the `image-gen` CLI does *not* support edit/input-image mode. Call the fal endpoint directly:

- Endpoint: `https://fal.run/fal-ai/gpt-image-2/edit`
- Auth header: `Authorization: Key $FAL_API_KEY`
- Body: `{ "prompt": "...", "image_urls": ["data:image/...;base64,..."], "image_size": "square_hd", "input_fidelity": "high", "quality": "high", "num_images": 1 }`
- `image_size` must be a **preset literal** (`square_hd`, `square`, `portrait_4_3`, `portrait_16_9`, `landscape_4_3`, `landscape_16_9`, `auto`) — not `WxH`.
- Response: `images[0].url` (may be a data URI).
