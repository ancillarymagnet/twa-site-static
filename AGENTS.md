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
