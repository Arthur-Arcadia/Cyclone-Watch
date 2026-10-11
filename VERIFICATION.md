# Verification

Checked on 9 October 2026.

## Passed

- JavaScript syntax checks and local HTML resource references.
- Every slider step (0–900): finite coordinates and positive radius; elapsed and remaining path meet at the cyclone centre; exact keyframes and endpoint clamping.
- Map projection test double: the footprint doubles in screen width after one zoom level and grows when the simulated radius grows. Timeline updates the centre and route sections. Full-route control includes all ten points and turns off follow mode.
- Controlled loader failure/retry and timeout: map construction waits for readiness; a network failure exposes recovery; a successful retry initialises once.
- Inventory DOM test double: all seven shops appear; five green shops have stock, two red shops have none; modal item values reflect the selected shop; individual shortages remain visible; close returns focus; marker sizes stay bounded.
- ZIP integrity check.

Run the dependency-free checks with `npm test` (Node.js 18+). They use small DOM and Google Maps test doubles, not the real Google service.

## Not verified in a real browser

The available browser preview timed out, and a local Chromium download did not produce a usable browser. Desktop/mobile rendering, native dialog focus behaviour, actual touch dragging, browser zoom at 200%, and live Google Maps authorisation/tile rendering have therefore not been visually or end-to-end verified here. The code includes responsive breakpoints and error handling, but these still need real-device confirmation.

Suggested manual pass: open with Live Server; drag the slider from start to end; zoom the map; compare green and red shop details; repeat at phone/tablet/desktop widths and 200% browser zoom; use Tab/Escape; block the Maps request temporarily to check fallback and retry.
