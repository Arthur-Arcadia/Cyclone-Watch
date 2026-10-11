# Cyclone Watch
## Making cyclone information and essential supplies easier to explore

Cyclone Watch is a map-based web prototype that brings cyclone movement, illustrative impact areas, essential supply availability and preparedness information into one interface. It explores how people could find and interpret important information during a cyclone without moving between several separate sources.

**Status:** Interactive high-fidelity prototype using fictional cyclone and inventory data, with static archived news. Includes follow-up improvements to the original coursework prototype.

**Tools:** HTML, CSS, JavaScript, Google Maps JavaScript API, Figma, GitHub and Visual Studio Code.

> This is a design and interaction prototype. It does not provide live forecasts, calculated hazard boundaries, emergency alerts or current retailer inventory.

## The problem

During a cyclone, people need to understand where the storm is moving, which areas may be affected, what preparations to make and where essential supplies might be available. Information spread across weather reports, news pages and retailer channels can make these tasks harder, particularly when users are under pressure.

The project explored a single interface organised around four needs:

- Understand the cyclone’s position and movement.
- Explore potential areas of impact.
- Check the availability of essential supplies.
- Access updates and preparedness guidance.

These needs informed the team’s design direction. The prototype demonstrates possible interactions rather than delivering the real-time services originally envisioned.

## My contribution

My main responsibility in the original group project was **data integration and analysis**. I reviewed four public cyclone and wind-risk datasets and reports, extracted relevant information, and summarised it for the team to use during planning. This work concerned research synthesis rather than implementing a live data pipeline.

My individual project report also documented the design rationale, information priorities, technical constraints and ethical implications of the proposed system.

For the subsequent prototype refinement, I specified six changes: clearer sample-data disclosure, a draggable cyclone timeline, map-relative cyclone scaling, clearer inventory presentation, responsive shop details and markers, and more reliable map loading. These follow-up changes were implemented with AI assistance and are separate from the original coursework development.

Interviews, surveys, initial interface design, development and studio usability testing were team activities. They are described below as project context rather than claimed as my individual work.

## Research and design process

### 1. Reviewing cyclone and wind-risk information

I reviewed four sources used in the project:

| Source | What it contributed to the design discussion |
| --- | --- |
| Tropical Cyclone Hazard Assessment | Context for wind hazard and the difference between long-term risk information and an event-specific forecast. |
| Historical cyclone summaries | Examples of cyclone events, their locations and recorded movement. |
| Drivers of Wind Risk | Context for building vulnerability, local conditions and preparedness information. |
| Historical tropical cyclone tracks | Reference material for representing storm movement geographically. |

I condensed the material into key points for the team. The research informed the concept and information choices; the current simulation does not calculate its route or footprint from these datasets.

### 2. Prioritising information

The team used user research and a MoSCoW prioritisation exercise to focus the concept. The interface placed cyclone position and movement first, followed by severity information, supply availability and supporting updates.

A map-first layout made spatial information central to the experience. Supporting panels and secondary pages provided additional detail without placing every item directly on the map.

### 3. Building the coursework prototype

The original implementation connected a cyclone map, a grocery stock map, news pages, a safety guide and an about page. Google Maps provided the geographic interface, while cyclone and inventory content was manually defined.

This version established the navigation and interaction concept, but it also exposed limitations: the cyclone image used a fixed screen size, shop details relied on unstructured text, and map loading was not consistently reliable.

### 4. Learning from usability feedback

The team conducted think-aloud testing during a studio session. Reported findings included:

| Finding | Design implication |
| --- | --- |
| Users expected to swipe the information panel or dismiss it by tapping outside. | Panel behaviour should match familiar interaction patterns. |
| Some navigation icons suggested shopping or a personal profile. | Navigation needs clearer meanings and supporting labels. |
| News links were not immediately recognised as clickable. | Links need visible action cues. |
| The label “Guide” was ambiguous. | Labels should describe the information users will find. |

Some of these issues were addressed during the coursework iterations. The later review also identified scaling, layout and data-disclosure problems that informed the follow-up changes.

## Follow-up prototype improvements

| Area | Current implementation | Intended benefit |
| --- | --- | --- |
| Prototype disclosure | Pages identify the content as sample or archived material. | Clarify what users can and cannot infer from the demonstration. |
| Cyclone timeline | A draggable slider changes the example position, category, wind speed and footprint size. The solid route grows as time advances; the remaining route is dashed. | Let users explore movement over time. |
| Geographic scaling | The cyclone image is positioned using geographic bounds and resizes with map zoom. | Keep the illustrative footprint tied to the map rather than a fixed pixel size. |
| Inventory consistency | One dataset supplies shop markers, list cards and item details. Green means at least one item is available; red means all listed quantities are zero. | Make the overview and details agree. |
| Shop details | Structured item rows replace manually spaced text. The dialog uses a desktop layout and a mobile bottom-sheet layout with a scrollable body. | Make quantities and shortages easier to scan at different screen sizes. |
| Shop markers | Icon sizes adjust within limits according to map zoom and container width. | Preserve readability without allowing icons to become excessively large or small. |
| Map loading | Shared loading logic waits for the map API and provides timeout, error and retry handling. The inventory list remains accessible when the map is unavailable. | Support recovery from loading failures. |

These are implementation changes, not evidence of improved usability from a new participant study.

## Outcome and limitations

The current result is an interactive high-fidelity prototype suitable for demonstrating and evaluating the proposed experience. It shows how time-based map exploration and structured stock information could support the project’s core tasks.

The cyclone’s route, categories, wind speeds and radius are fictional. Its footprint is an approximate visual illustration, not a hazard model. Inventory quantities are invented, and news remains static archived content.

Code syntax, resource references, timeline logic, inventory consistency and simulated map-loading behaviour were checked. Actual desktop/mobile rendering, touch interactions and live Google Maps loading were not fully verified because the available browser preview could not complete. A further round of real-device testing is needed before claiming that the responsive and interaction changes have resolved the original usability issues.

The main lesson was that presenting information clearly also requires communicating its limits. A convincing map and precise-looking quantities can imply more certainty than a prototype’s data supports.

## Running the prototype

1. Open the project folder in Visual Studio Code.
2. Open `index.html` with Live Server, or run `python -m http.server 8000` from the project folder.
3. Use the local HTTP address rather than opening the HTML through `file://`.
4. Check the Google Maps configuration in `js/config.js`. The map requires internet access and an authorised Maps API configuration.

The scenario and inventory values are in `js/modules/demo-data.js`. The updated project also includes `VERIFICATION.md` and dependency-free logic checks, which can be run with `npm test` using Node.js 18 or later.

<!-- Add verified live-demo and portfolio links here once their final URLs are available. -->
