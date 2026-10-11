# Cyclone Watch — high-fidelity prototype

A coursework prototype built from the original HTML, CSS and JavaScript project. All cyclone positions, routes, wind speeds, categories, footprints and inventory quantities are invented demonstration data. News articles are static archived content. This application does not issue forecasts, emergency alerts or current retailer reports.

## Run locally

Open the folder in VS Code and launch `index.html` with Live Server. Alternatively, run `python -m http.server 8000` in this folder and open `http://localhost:8000`. Use an HTTP server: ES modules do not work reliably from `file://`.

The Google Maps browser key from the original project is now configured once in `js/config.js`. Map display still requires internet access and a valid Google Maps project with Maps JavaScript API enabled, applicable billing and allowed HTTP referrers. Browser map keys are visible to visitors by design; restrict this key to the required API and authorised development/deployment domains. Replace it with your own authorised key if necessary. Moving the key to this file is configuration centralisation, not concealment.

If Google Maps cannot load, the page provides an error and retry button. The timeline and inventory list remain usable. Authentication failures may require the owner to correct project/key settings; retry cannot bypass them.

## Changes

- Persistent prototype/sample-data notices across the main and secondary pages.
- Native accessible timeline slider with continuous interpolation across ten invented keyframes. Arrow keys, Home/End and Earlier/Later controls are supported.
- Timeline changes the cyclone's centre, illustrative radius, displayed category and wind speed. The solid line shows the elapsed route, and the dashed line shows the remaining example route. Follow cyclone keeps the centre in view without resetting zoom; Show full route reveals the entire route.
- The original cyclone image is now an OverlayView positioned using latitude/longitude bounds. Its screen dimensions follow map projection and zoom, instead of remaining at a fixed pixel size. The radius-to-bounds conversion is approximate and intended only for a visual prototype, not hazard modelling.
- Inventory cards and map markers use the same structured example data. Green means one or more items have stock. Red means all three quantities are zero. Individual shortages remain visible in the details. Yellow stock icons are no longer used by the active page.
- Responsive inventory list and native modal dialog: centred on desktop and a bottom sheet on phones, with a scrollable body, persistent close/footer controls, Escape dismissal and focus return.
- Shop marker sizes respond to map zoom and container size, bounded to remain readable. They represent selectable locations, not geographic area.
- A shared Maps loader waits for its registered callback before constructing maps. It handles network failure, timeout, retry and authentication errors. The broken global `initMap` callback and non-module storage script import have been removed from active pages.

## Main files

- `index.html`, `js/index.js`, `js/modules/map.js`: cyclone map and timeline.
- `storage.html`, `js/storage.js`: shop list, map and details dialog.
- `js/modules/demo-data.js`: all invented scenario and inventory values; edit these to alter the demonstration.
- `js/modules/maps-loader.js`, `js/config.js`: shared map loading and API configuration.
- `css/prototype.css`: responsive styles for the two updated pages.
- The original guide, news, about pages and image assets are retained; their content has a prototype notice. Legacy CSS/modules are retained for reference but are not loaded by the rewritten main pages.

## Suggested case-study wording

“Cyclone Watch is a high-fidelity interactive prototype using fictional cyclone and inventory data. A draggable timeline demonstrates changes in storm position and illustrative footprint, while an example stock map supports exploration of shop availability. These interactions were designed for usability evaluation; no live forecasting, hazard modelling or retailer integration is implemented.”

## Verification scope

See `VERIFICATION.md` for the checks performed and external-service limitations.
