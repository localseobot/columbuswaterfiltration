# Page plan: columbuswaterfiltration.com

Machine-readable version: **`page_matrix.csv`** (one row per URL). Columns:
- url, page_type, tier, cluster, location, location_type, county
- primary_kw, kw_basis
- water_utility_verified, hardness_verified, zips
- publish_gate

Inputs: `clusters.json`, `keywords.csv`, `locations.csv`, `local_facts.md`.
Regenerate the matrix with `python3 scripts/build_page_matrix.py`.

## Phase 1 total: 243 pages

| Block | Pages |
|---|---|
| Core: home + 12 service hubs + water-softener guide + 2 local-data pages + service-area index | 17 |
| Tier A cities (22): location hub + 4 service pages each (Heath: 2, see below) | 108 |
| Tier A2 towns (12): location hub + 2 service pages each | 36 |
| Tier B towns/CDPs (15): location hub only | 15 |
| Counties (7): county hub + well-water-treatment + well-water-testing | 21 |
| Columbus neighborhoods / planning areas: one page each | 46 |
| **Total programmatic + core** | **243** |

Phase 2 (+~60 pages, about 300 total) is **gated on evidence**. See the Phase 2 section below.
Separately, plan about 25 hand-written blog/guide articles from the informational tail in keywords.csv. They aren't programmatic, so they aren't counted above.

Why not 500+: **suburb-level autocomplete was empty.** Queries like "water softener installation dublin ohio" and "reverse osmosis westerville" returned no suggestions; only "worthington water softener" appeared. There is no volume source either. So every page beyond Columbus level is justified by:
1. strong service-level "near me" demand (Google localizes "near me"), and
2. real per-location data that makes the page different.

Pushing every service across every township or village would produce near-duplicate pages, which is exactly what Google's doorway policy targets.

---

## URL patterns

| Page type | Pattern | Example |
|---|---|---|
| Home (Columbus, all services) | `/` | `/` |
| Service hub (targets "<service> columbus ohio") | `/{service}/` | `/water-softener-installation/` |
| Service × location | `/{service}/{place-slug}/` | `/water-softener-installation/dublin-oh/` |
| Location hub (all services for one place) | `/service-area/{place-slug}/` | `/service-area/westerville-oh/` |
| Columbus neighborhood | `/service-area/columbus-oh/{neighborhood}/` | `/service-area/columbus-oh/clintonville/` |
| County hub | `/service-area/{county}-county-oh/` | `/service-area/licking-county-oh/` |
| Well water × county | `/well-water-treatment/{county}-county-oh/`, `/well-water-testing/{county}-county-oh/` | `/well-water-testing/delaware-county-oh/` |
| Local data | `/columbus-water-hardness/`, `/columbus-water-quality/` | |
| Blog | `/blog/{slug}/` | `/blog/does-columbus-ohio-have-hard-water/` |

The place slug comes from `locations.csv.slug` (e.g. `dublin-oh`, `grove-city-oh`, `lewis-center-oh`).

**Service slugs (localized):**
- `water-softener-installation`
- `water-softener-repair`
- `whole-house-water-filtration`
- `reverse-osmosis-installation`
- `well-water-treatment` and `well-water-testing` (county level only)

**Service slugs (hub only):**
- `water-testing`
- `iron-sulfur-removal`
- `uv-water-purification`
- `pfas-water-filtration`
- `salt-free-water-conditioners`
- `under-sink-water-filters`
- `water-softeners` (buyer guide)
- `commercial-water-treatment` (optional; weak evidence, not counted)

## Matrix

| Service ↓ / Location tier → | Columbus (root hub) | Tier A (22) | Tier A2 (12) | Tier B (15) | County (7) | Neighborhood (46) |
|---|---|---|---|---|---|---|
| Location hub ("water treatment {place}") | home | ✔ | ✔ | ✔ | ✔ county hub | ✔ (single page) |
| Water softener installation | ✔ | ✔ (not Heath) | ✔ | section on hub | – | section |
| Water softener repair/service | ✔ | ✔ (not Heath) | Phase 2 | section | – | section |
| Whole-house filtration | ✔ | ✔ | ✔ | section | – | section |
| Reverse osmosis installation | ✔ | ✔ | Phase 2 | section | – | section |
| Well water treatment | ✔ | section, outer-ring places only | section | section | ✔ | – |
| Well water testing | ✔ | – | – | – | ✔ | – |
| Water testing (municipal) | ✔ | section | section | section | – | section |
| Iron/sulfur, UV, PFAS, salt-free, under-sink | ✔ hub | link | link | link | link from well pages | link |
| Hard-water data | `/columbus-water-hardness/` | hardness figure on page | same | same | – | system range |

**Tier definitions** (from `locations.csv`, ≤33 mi straight-line from downtown):
- **Tier A:** cities with 2020 pop ≥ 10,000, plus Lewis Center (a large unincorporated postal community in Orange Twp):
  Bexley, Circleville, Delaware, Dublin, Gahanna, Grove City, Heath, Hilliard, Lancaster, Lewis Center, London, Marysville, New Albany, Newark, Pataskala, Pickerington, Powell, Reynoldsburg, Upper Arlington, Westerville, Whitehall, Worthington.
- **Tier A2:** cities and villages with 4,000-9,999 pop, plus the Galloway and Blacklick postal communities:
  Ashville, Blacklick, Canal Winchester, Galloway, Grandview Heights, Granville, Groveport, Johnstown, Obetz, Plain City, Sunbury, West Jefferson.
- **Tier B:** remaining places with pop ≥ 4,000 (CDPs) or 1,500-3,999 within 30 mi; location hub only:
  Baltimore, Beechwood Trails, Blacklick Estates, Buckeye Lake, Choctaw Lake, Commercial Point, Harbor Hills, Hebron, Huber Ridge, Lake Darby, Lincoln Village, Lithopolis, Minerva Park, Mount Sterling, South Bloomfield.
- **No page:**
  - Villages and CDPs under 1,500. They are listed on their county hub with a "we serve" mention; no standalone page.
  - Townships (70 rows in locations.csv). People don't search by township name. Use them as data for county well-water pages, and as "also serving" text on nearby city pages.
- **Heath exception:** Heath's 2025 CCR says the city softens to 145 mg/L, "making home water softeners unnecessary." So Heath gets no softener installation or repair pages, only the hub, whole-house filtration, and RO pages.
- **Neighborhoods (46):** Columbus neighborhoods that have their own Wikipedia article and a ZIP (33), plus 13 outer City of Columbus planning areas with no overlapping named neighborhood:
  East Columbus, Far East, Far North, Far Northwest, Far South, Far West, Hayden Run, Mid East, Northeast, Northwest, Rocky Fork-Blacklick, South East, Westland.
  - **Excluded:** Arena District (commercial), Flytown (historic/demolished), East Broad Street Historic District and Northwood Park (micro-areas), and the 26 list entries without their own article or ZIP (e.g. Merion Village, Schumacher Place, Old Oaks, Beechwold). Mention those inside their parent page: Beechwold → Clintonville, Merion Village / Schumacher Place → German Village/South Side, Old Oaks → Near East/Driving Park.
  - **Overlapping planning areas dropped:** Downtown, North/South Linden, North Central, South Side, Southwest, West Scioto, Livingston Ave Area. They're covered by named neighborhoods.

## Phase 2 (gated, about +60 pages to ~300)

Add only after at least 8-12 weeks of Search Console data showing impressions for the location or service pair. Possible additions:
- RO and softener repair pages for Tier A2 (+24).
- Location hubs for villages of 1,000-1,499 that show impressions (about 6-8).
- City-level well-water pages for outer-ring places, **only after** verifying the place is largely on private wells. Use the Ohio DNR water well log database or the county health department. Possible candidates: Pataskala-area townships, Johnstown/Jersey, Ashville/Commercial Point, Galena/Berlin Twp, Jerome Twp. About 15-20 pages.
- Water-testing pages for counties or cities only if "water testing {place}" impressions appear.

Real search volume (Keyword Planner / DataForSEO) should re-rank Phase 2 if it becomes available.

---

## Uniqueness rules (enforced by the generator)

Each page type has a **minimum data contract**. If the fields are missing, don't publish the page; `publish_gate` in page_matrix.csv flags this.

**1. Location hub and service × location pages must include:**
- **Water utility name and source**, from `locations.csv.water_utility` and `water_source_note`, with a citation link (`utility_source_url`). If it isn't verified, the page may still publish, but it must not make utility claims. It falls back to the county and well-water context. 36 rows are currently gated: Pataskala, Lewis Center, Galloway, Blacklick, West Jefferson, Ashville, and most Tier B places.
- **Hardness figure**, where verified (`hardness_value` + `hardness_source_url`), shown in both mg/L and gpg with the data year. If it isn't verified, say "{utility} doesn't publish a hardness figure in its CCR; we test on site." Never use third-party estimates.
- **ZIP codes served** (`zips`), county, and distance or drive area from Columbus. Nearby places come from `lat`/`lon` (3-5 nearest locations in the same tier set) and are used for internal links.
- **Service-specific local angle,** generated from the data rather than a name swap:
  - Softener pages: hardness of the utility's water. Circleville at 25 gpg is very different from Columbus-served suburbs at about 6-7 gpg.
  - RO pages: sodium, sulfate, nitrate, or PFAS context from that utility's CCR when available.
  - Whole-house pages: surface water vs groundwater source, plus disinfection.
- **At least 2 unique FAQ answers** using local data, e.g. "Is Dublin water hard?" answered from Columbus CCR plant data, or "Do I need a softener in Heath?" with the honest answer.
- A **real job, photo, or review** from the area when the renter supplies one. Never fabricate reviews, addresses, license numbers, or "local office" claims.

**2. Neighborhood pages** (single page, no per-service children):
- Columbus system hardness range (5.7-7.3 gpg; plant-specific only if a utility map confirms it), lead-line program info (2040 goal), free lead-testing info, housing-age context **only if sourced**, ZIPs, and the parent area.
- Neighborhood pages cover all services in sections and link to the Columbus service hubs. Don't create `/water-softener-installation/clintonville/`-style pages unless Search Console later shows neighborhood × service impressions.

**3. County pages:**
- ODH private-well rules (coliform, E. coli and nitrate permit sampling; iron 0.3 mg/L; greensand filters), the list of incorporated places and their utilities, which townships are covered, and links to city pages.
- Licking County can cite the USGS arsenic work linked by ODH.

**4. Template variation:**
- At least 40% of each page's main content should come from location-specific data and copy, not boilerplate.
- Rotate section order and FAQ sets by page type.
- Write the opening paragraph from data, for example: utility name + source + hardness + one distinctive fact.
- Run a near-duplicate check: shingle/Jaccard similarity under 0.6 between any two same-service pages. Block publishing above that.

**5. No keyword-stuffed city lists:**
- No footers listing 100 towns. Use one service-area index page plus county hubs.
- Internal links go from hub to child and to 3-5 nearest siblings.

**6. Canonicals and indexing:**
- Every page self-canonicalizes.
- Thin or gated pages get `noindex` until their data contract is met.
- Roll out sitemaps in waves: core + Tier A first, then A2/B/neighborhoods/counties after 4-6 weeks. Watch "Crawled – currently not indexed" in Search Console as the signal to stop expanding.

**7. Honesty constraints from the data:**
- Columbus says home filters aren't required for safety. Don't write "Columbus water is unsafe."
- Frame services as taste, odor, scale, comfort, and specific contaminant reduction, with NSF/ANSI-certified equipment.
- PFAS copy: say "low-level detections, in compliance" for Columbus.
- Heath: city water is already softened, so make no softener pitch.
- Rank-and-rent specifics: if the site isn't the service provider, don't claim licenses or certifications or a physical address it doesn't have. Google Business Profile requires a real business at a real location or service area. Keep the lead form honest about who will contact the user.

## How this maps to Google's spam policies

- **Doorway abuse** (Google Search spam policies, "Doorway abuse"): pages "created to rank for specific, similar search queries." Google's own examples include "having multiple websites with slight variations to the URL and home page" and "having multiple domain names or pages targeted at specific regions or cities that funnel users to one page," as well as "substantially similar pages that are closer to search results than a clearly defined, browseable hierarchy."
  - Mitigations: limited service × place pairs (4 services for Tier A only), a real hierarchy (hub → county → place → service), unique data per page, and no funnel pages that just redirect to a form.
  - Source: https://developers.google.com/search/docs/essentials/spam-policies#doorways
- **Scaled content abuse:** "many pages are generated for the primary purpose of manipulating search rankings and not helping users," no matter how they're made (AI, templates, or people). Google's examples include pages that stitch or template content without adding value.
  - Mitigations: the data contract, the similarity threshold, gating unverified places, and Phase 2 only on evidence.
  - Source: https://developers.google.com/search/docs/essentials/spam-policies#scaled-content
- **Keyword stuffing:** Google's examples include "Blocks of text that list cities and regions that a web page is trying to rank for." So: no town-list footers or paragraphs.
  - Source: https://developers.google.com/search/docs/essentials/spam-policies#keyword-stuffing
- **Scam and fraud:** this includes "intentionally displaying false information about a business or service." That matters for rank-and-rent. Don't show fake addresses, licenses, reviews, or "family-owned since…" claims for a business that isn't the actual provider.
  - Source: same spam-policies page.
- **Helpful, people-first content** (paraphrased guidance; see https://developers.google.com/search/docs/fundamentals/creating-helpful-content): write pages for people, not mainly for search traffic. Each page here answers the practical local questions people actually search, which autocomplete confirms at the Columbus level: hardness, water source, and whether the water is safe.

## Keyword targeting per page (summary; details in clusters.json)

| Page | Primary | Secondary examples |
|---|---|---|
| `/` | water treatment columbus ohio | water filtration columbus ohio, water filtration system columbus ohio, water treatment near me |
| `/water-softener-installation/` | water softener installation (columbus ohio) | water softener columbus ohio, water softener installation cost, water softener companies columbus ohio, water softener near me |
| `/water-softener-repair/` | water softener repair near me | water softener repair cost, water softener service near me, water softener maintenance near me |
| `/whole-house-water-filtration/` | whole house water filter installation | whole house water filter installation cost/near me, water filter installation near me (merged cluster) |
| `/reverse-osmosis-installation/` | reverse osmosis installation | reverse osmosis columbus ohio, ro system installation cost, reverse osmosis repair near me |
| `/water-testing/` | water testing columbus ohio | water testing labs columbus ohio, is columbus water safe to drink |
| `/well-water-testing/` | well water testing columbus ohio | well water testing ohio, {county} county ohio well water testing |
| `/well-water-treatment/` | well water filtration system | well water filtration installation, well water filtration system cost |
| `/columbus-water-hardness/` | hard water columbus ohio | does columbus ohio have hard water, columbus water hardness, is columbus water hard |
| `/columbus-water-quality/` | columbus ohio water quality report | columbus water quality, columbus ohio tap water quality |
| `/iron-sulfur-removal/` | iron filter for well water | iron filter installation near me, sulfur smell in water, rotten egg smell water heater |
| City page (e.g. Dublin) | water softener installation dublin oh *(templated)* | water softener near me (localized), plus hardness and utility FAQs |

City-level primary keywords are **templated**, which `kw_basis` records. No city-level query showed up in autocomplete. Validate them with Search Console after launch.

## Suggested blog articles (from the informational tail; not counted)
- Does Columbus, Ohio have hard water? (2025 CCR numbers)
- Is Columbus tap water safe to drink?
- Columbus water: Scioto vs Hoover vs Parsons Ave plant differences
- Nitrate in the Scioto River and what Columbus does about it
- PFAS in Columbus water: what's known
- Lead service lines in Columbus (2040 program)
- Water softener installation cost in Central Ohio
- Salt-free conditioner vs softener for ~7 gpg water
- Is reverse osmosis water bad for you?
- RO system installation cost
- Iron filter for well water in Ohio
- Sulfur/rotten-egg smell in well water or a water heater
- Ohio private well testing requirements (ODH)
- Arsenic in Licking County wells (USGS)
- UV for well water
- Whole-house filter vs softener
- Water softener maintenance checklist
- Signs your softener needs repair
- Under-sink filter vs RO
- Circleville's 25 gpg water
- Heath's softened water: do you still need anything?
