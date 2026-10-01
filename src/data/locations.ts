import { sources, columbusSupply } from "@/lib/water-facts";

/**
 * Location catalog. One object per city, township, or Columbus neighborhood.
 *
 * Adding a row publishes:
 *   /service-area/[slug]
 *   /services/[service]/[slug] for every service
 * and adds both to the sitemap.
 *
 * Required unique facts: utility, utilityDetail, zips, nearbyPlaces, notes.
 * Set hardnessKey only when a cited public figure applies. Leave it null
 * rather than copying Columbus plant numbers onto a different supplier.
 * kind: "neighborhood" is for future Columbus neighborhoods in the same file.
 */
export type HardnessKey =
  | "dublin-road"
  | "hap-cremean"
  | "parsons"
  | "columbus-average";

export type WellLikelihood = "rare" | "some" | "common";

export type SourceLink = { label: string; href: string };

export type LocationRecord = {
  slug: string;
  name: string;
  kind: "city" | "suburb" | "township" | "neighborhood";
  county: string;
  /** Primary query for the location page. */
  keyword: string;
  zips: string[];
  /** Other location slugs in this file. */
  nearby: string[];
  /** Real places in town, not other cities. */
  nearbyPlaces: string[];
  utility: string;
  /** Two or three sentences that are true of this place and not a neighbor. */
  utilityDetail: string;
  hardnessKey: HardnessKey | null;
  /** Extra sentence. Use when the plant map is only a best fit. */
  hardnessNote: string;
  wellLikelihood: WellLikelihood;
  /** Housing, plumbing, or supply notes that do not apply to the next town. */
  notes: string[];
  commonIssues: string[];
  sources: SourceLink[];
};

const citywide = columbusSupply.hardnessIntro;

export const hardnessCopy: Record<
  HardnessKey,
  { text: string; source: SourceLink }
> = {
  "dublin-road": {
    text: `${columbusSupply.dublinRoad} ${citywide}`,
    source: sources.ccr2025,
  },
  "hap-cremean": {
    text: `${columbusSupply.hapCremean} ${citywide}`,
    source: sources.ccr2025,
  },
  parsons: {
    text: `${columbusSupply.parsons} ${citywide}`,
    source: sources.ccr2025,
  },
  "columbus-average": {
    text: `${citywide} ${columbusSupply.scale}`,
    source: sources.hardness,
  },
};

export const locations: LocationRecord[] = [
  {
    slug: "dublin",
    name: "Dublin",
    kind: "suburb",
    county: "Franklin",
    keyword: "water filtration Dublin OH",
    zips: ["43016", "43017"],
    nearby: ["hilliard", "worthington", "powell", "upper-arlington"],
    nearbyPlaces: ["Bridge Park", "Historic Dublin", "Muirfield", "the Scioto River"],
    utility: "Columbus Water & Power, under contract to the City of Dublin",
    utilityDetail:
      "Dublin does not run a treatment plant. Its community plan says Columbus supplies the city's drinking water through February 1, 2043, and Columbus maintains the distribution system inside Dublin. Muirfield and the older core drink that same purchased supply. A few occupied properties at the edge of the planning area are still outside the public mains.",
    hardnessKey: "dublin-road",
    hardnessNote:
      "Dublin sits in the northwestern area the city associates with the Dublin Road plant. Distribution can be valved differently street to street, so the plant average is a guide, not a promise about one address.",
    wellLikelihood: "some",
    notes: [
      "Bridge Park and the newer multifamily buildings along the river are on public water. The well question shows up on larger lots toward the Concord and Washington Township edges, not in Historic Dublin.",
      "Homeowners here usually call about spots on glass and a chlorine smell, not orange well water. The housing mix runs from 1970s subdivisions to new construction that was plumbed for a softener and never given one.",
    ],
    commonIssues: [
      "Moderate hardness from the Dublin Road supply",
      "Chlorine taste on city water",
      "Occasional private wells on the rural edge",
    ],
    sources: [sources.dublin, sources.ccr2025, sources.hardness],
  },
  {
    slug: "westerville",
    name: "Westerville",
    kind: "suburb",
    county: "Franklin",
    keyword: "water softener Westerville OH",
    zips: ["43081", "43082"],
    nearby: ["worthington", "gahanna", "new-albany", "sunbury"],
    nearbyPlaces: ["Uptown Westerville", "Otterbein University", "Alum Creek", "Inniswood"],
    utility: "the City of Westerville's own water plant",
    utilityDetail:
      "Westerville treats its own drinking water from Alum Creek. That is not Hoover Reservoir. Hoover, just to the east, is a Columbus supply for the Hap Cremean plant. Blendon and Genoa township pockets around the city limits are a different map again and may be Columbus water or private wells.",
    hardnessKey: null,
    hardnessNote:
      "We do not publish a Westerville hardness number. The Columbus plant averages do not describe Alum Creek water. A test at the house is the figure that matters, and the city's own consumer confidence report is the public record.",
    wellLikelihood: "some",
    notes: [
      "Uptown and the Otterbein area are on the municipal plant. The rotten-egg and iron calls we hear are almost always township wells, not Westerville city water.",
      "Older colonials near the State Street corridor have the usual scale complaints. Newer subdivisions north of County Line Road should be checked against which supplier actually serves the street before anyone quotes a Columbus grains number.",
    ],
    commonIssues: [
      "Hardness on a supply that is not Columbus water",
      "Chlorine taste from the local plant",
      "Iron and sulfur on nearby township wells",
    ],
    sources: [sources.reservoirs, sources.ccr2025],
  },
  {
    slug: "worthington",
    name: "Worthington",
    kind: "suburb",
    county: "Franklin",
    keyword: "water filtration Worthington OH",
    zips: ["43085"],
    nearby: ["dublin", "westerville", "upper-arlington", "powell"],
    nearbyPlaces: ["the Village Green", "High Street", "the Olentangy River", "Worthington Hills"],
    utility: "Columbus Water & Power",
    utilityDetail:
      "Worthington is inside the Columbus system. The city describes its northern service, including the Ohio State area, as the Hap Cremean plant on Hoover Reservoir water. Worthington sits in that northern band. There is essentially no private-well inventory inside the old village.",
    hardnessKey: "hap-cremean",
    hardnessNote:
      "Hap Cremean is the softest of the three Columbus plants in the 2025 report, and it is still moderately hard. Worthington's mid-century houses show that as scale on heaters and shower doors, not as well-water staining.",
    wellLikelihood: "rare",
    notes: [
      "The housing stock is mostly 1950s through 1970s ranches and colonials with water heaters and dishwashers that have been drinking moderately hard water for decades.",
      "Chlorine taste is a common reason people ask about a whole-home carbon filter. Iron filters are rarely the right first conversation inside the city limits.",
    ],
    commonIssues: [
      "Moderate hardness from Hap Cremean",
      "Chlorine taste and smell",
      "Scale in older water heaters",
    ],
    sources: [sources.ccr2025, sources.hardness, sources.reservoirs],
  },
  {
    slug: "hilliard",
    name: "Hilliard",
    kind: "suburb",
    county: "Franklin",
    keyword: "water softener Hilliard OH",
    zips: ["43026"],
    nearby: ["dublin", "upper-arlington", "grove-city", "grandview-heights"],
    nearbyPlaces: ["Old Hilliard", "Heritage Trail", "Hilliard Station Park", "the Norwich area"],
    utility: "Columbus Water & Power",
    utilityDetail:
      "Hilliard is on the west side of the Columbus system. The utility associates northwestern and southwestern Columbus with the Dublin Road plant, which takes Scioto River water from Griggs and O'Shaughnessy reservoirs. Newer Norwich Township subdivisions are on that public supply. A handful of older rural parcels west of the city are still on wells.",
    hardnessKey: "dublin-road",
    hardnessNote:
      "Dublin Road's 2025 average was 7.3 grains. Hilliard taps in that service area tend to track it. Confirm at the house, especially near a pressure boundary.",
    wellLikelihood: "some",
    notes: [
      "Old Hilliard and the tract housing east of Leap Road are city water. The well conversations are further out, where lot sizes jump and the main has not been extended.",
      "Callers usually want spots off the glass and a longer life out of a water heater. Sulfur odor is a well complaint, not a Hilliard city-water complaint.",
    ],
    commonIssues: [
      "Hardness around the Dublin Road average",
      "Chlorine taste",
      "Wells only on the rural western edge",
    ],
    sources: [sources.ccr2025, sources.reservoirs],
  },
  {
    slug: "gahanna",
    name: "Gahanna",
    kind: "suburb",
    county: "Franklin",
    keyword: "water filtration Gahanna OH",
    zips: ["43230"],
    nearby: ["westerville", "new-albany", "reynoldsburg", "bexley"],
    nearbyPlaces: ["Creekside", "Big Walnut Creek", "Royal Manor", "the Academy area"],
    utility: "Columbus Water & Power",
    utilityDetail:
      "Gahanna is a Columbus water customer. Hoover Reservoir sits on Big Walnut Creek just north of town and feeds the Hap Cremean plant, which the city describes as serving northern Columbus. Gahanna is in that northeast geography. Jefferson Township lots east of the city still include private wells.",
    hardnessKey: "hap-cremean",
    hardnessNote:
      "Treat the Hap Cremean average as the closest published Columbus figure, not as a guarantee for every Gahanna street. The test settles it.",
    wellLikelihood: "some",
    notes: [
      "Creekside and the older Royal Manor streets are public water. Chlorine taste and moderate hardness are the pattern. Iron staining shows up when the house is actually on a township well.",
      "A lot of 1970s and 1980s houses here have original water heaters that have been scaling quietly. That is a softener conversation, not a PFAS conversation, unless the homeowner has a separate drinking-water question.",
    ],
    commonIssues: [
      "Moderate hardness from the Hoover supply",
      "Chlorine taste",
      "Wells east of the city in Jefferson Township",
    ],
    sources: [sources.ccr2025, sources.reservoirs],
  },
  {
    slug: "grove-city",
    name: "Grove City",
    kind: "suburb",
    county: "Franklin",
    keyword: "water softener Grove City OH",
    zips: ["43123"],
    nearby: ["hilliard", "upper-arlington", "grandview-heights"],
    nearbyPlaces: ["Town Center", "Beulah Park", "the Broadway corridor", "Jackson Township"],
    utility: "Columbus Water & Power",
    utilityDetail:
      "Grove City is southwest Franklin County and on the Columbus system. The utility assigns southwestern Columbus to the Dublin Road plant on Scioto River water. Jackson Township, past the city utilities, still has private wells and is a different water conversation from Town Center.",
    hardnessKey: "dublin-road",
    hardnessNote:
      "Southwestern Columbus tracks the Dublin Road hardness average in the 2025 report. Jackson Township wells do not.",
    wellLikelihood: "some",
    notes: [
      "The rebuilt Beulah Park neighborhood and the commercial strip along Broadway are city water. Homeowners there ask about spots and chlorine.",
      "Drive southwest into Jackson Township and the questions change to iron, sediment, and hardness that no Columbus plant average describes.",
    ],
    commonIssues: [
      "City-water hardness in Grove City proper",
      "Chlorine taste",
      "Well water in Jackson Township",
    ],
    sources: [sources.ccr2025, sources.reservoirs],
  },
  {
    slug: "upper-arlington",
    name: "Upper Arlington",
    kind: "suburb",
    county: "Franklin",
    keyword: "water filtration Upper Arlington OH",
    zips: ["43220", "43221"],
    nearby: ["grandview-heights", "hilliard", "worthington", "dublin"],
    nearbyPlaces: ["Kingsdale", "Lane Avenue", "Griggs Reservoir", "Northam Park"],
    utility: "Columbus Water & Power",
    utilityDetail:
      "Upper Arlington is fully on Columbus water. Griggs Reservoir, one of the two Scioto River sources for the Dublin Road plant, borders the city. There is no meaningful private-well stock inside Upper Arlington. The houses are the story: a large share were built from the 1920s through the 1960s.",
    hardnessKey: "dublin-road",
    hardnessNote:
      "Dublin Road water is the relevant Columbus figure. Older copper and galvanized lines make scale and a chlorine smell more obvious than they are in new construction.",
    wellLikelihood: "rare",
    notes: [
      "Kingsdale, the Lane Avenue apartments, and the side streets of Tremont and Northwest are the same public supply. Nobody needs an iron filter because of the ZIP code.",
      "The practical complaints are spots, dry skin, and water heaters full of sediment in houses that have never had a softener. Drinking-water questions, when they come up, are usually about taste or older plumbing, which is a reverse osmosis conversation after a test.",
    ],
    commonIssues: [
      "Moderate hardness on Dublin Road water",
      "Chlorine taste in older homes",
      "Scale, not iron or sulfur",
    ],
    sources: [sources.ccr2025, sources.reservoirs, sources.hardness],
  },
  {
    slug: "powell",
    name: "Powell",
    kind: "suburb",
    county: "Delaware",
    keyword: "well water filtration Powell OH",
    zips: ["43065"],
    nearby: ["dublin", "worthington", "delaware", "lewis-center"],
    nearbyPlaces: ["downtown Powell", "Liberty Park", "the Zoo corridor", "Liberty Township acreage"],
    utility: "a mix of Del-Co Water and Columbus water",
    utilityDetail:
      "Powell is not one supply. Del-Co Water serves much of Delaware County from the Olentangy River, O'Shaughnessy Reservoir, and Alum Creek. Streets closer to the Franklin County line are often Columbus water. Larger lots in Liberty Township are frequently still on private wells. The Olentangy school district covers all three.",
    hardnessKey: null,
    hardnessNote:
      "Do not apply a Columbus grains number to a Del-Co tap or a Liberty Township well. Del-Co publishes its own consumer confidence report. Wells have no report until someone tests them.",
    wellLikelihood: "common",
    notes: [
      "Downtown Powell and the newer village-center buildings should be checked against the actual supplier. The acreage north and west of the village is where iron, sulfur, and high hardness show up.",
      "O'Shaughnessy Reservoir is just north of town. It is a Del-Co and Columbus source, not a sign that every Powell house drinks Columbus water.",
    ],
    commonIssues: [
      "Hardness that varies by supplier",
      "Private wells with iron or sulfur on larger lots",
      "City-water chlorine only where Columbus actually serves the street",
    ],
    sources: [sources.delco, sources.ccr2025],
  },
  {
    slug: "delaware",
    name: "Delaware",
    kind: "city",
    county: "Delaware",
    keyword: "water filtration Delaware OH",
    zips: ["43015"],
    nearby: ["powell", "lewis-center", "sunbury", "dublin"],
    nearbyPlaces: ["downtown Delaware", "Ohio Wesleyan", "the Olentangy River", "the county fairgrounds"],
    utility: "the City of Delaware water plant, or Del-Co / wells outside the city",
    utilityDetail:
      "The City of Delaware's primary source is the Olentangy River, and the city can blend that with groundwater from wells drilled more than 200 feet deep. The city says the plant treats about 3.65 million gallons a day for more than 12,000 customers. Outside the city limits, Del-Co and private wells take over. Those are not the same water.",
    hardnessKey: null,
    hardnessNote:
      "Delaware's plant is not a Columbus plant. We do not cite a Columbus hardness average for Sandusky Street or for a township well north of town.",
    wellLikelihood: "common",
    notes: [
      "In-town houses near Ohio Wesleyan and the courthouse are on the municipal plant. The complaint there is usually hardness and chlorine from that plant, which has its own water-quality report.",
      "Township properties in Delaware County are the iron, sulfur, and bacteria conversations. Limestone and glacial aquifers in this county are why hardness on wells is a routine finding. We still test rather than assume a number.",
    ],
    commonIssues: [
      "Separate city-plant water inside Delaware",
      "Wells and Del-Co outside the city",
      "Iron, sulfur, and hardness on groundwater",
    ],
    sources: [sources.delaware, sources.delco, sources.odh],
  },
  {
    slug: "lewis-center",
    name: "Lewis Center",
    kind: "township",
    county: "Delaware",
    keyword: "well water treatment Lewis Center OH",
    zips: ["43035"],
    nearby: ["powell", "delaware", "sunbury", "westerville"],
    nearbyPlaces: ["Orange Township", "Alum Creek Reservoir", "Evans Farm", "the Olentangy schools corridor"],
    utility: "mostly Del-Co Water, with private wells on older parcels",
    utilityDetail:
      "Lewis Center is not an incorporated city and it does not run a water plant. Public water in Orange Township is largely Del-Co, whose sources include Alum Creek Reservoir, the Olentangy River, and O'Shaughnessy. Alum Creek State Park is the eastern landmark. Older parcels that were never tied to Del-Co are on wells.",
    hardnessKey: null,
    hardnessNote:
      "There is no Lewis Center hardness average to quote. Del-Co's report covers its customers. A well needs its own test.",
    wellLikelihood: "common",
    notes: [
      "Evans Farm and the other new Orange Township subdivisions are planned around public water. The treatment question there is whatever Del-Co delivers, plus chlorine taste.",
      "Established homes on larger lots still deal with iron staining and sulfur. Those systems are specified per well. A softener alone is rarely the whole answer when the water smells or stains orange.",
    ],
    commonIssues: [
      "Del-Co water in newer subdivisions",
      "Iron and sulfur on private wells",
      "Hardness with no Columbus plant number attached",
    ],
    sources: [sources.delco, sources.odh],
  },
  {
    slug: "new-albany",
    name: "New Albany",
    kind: "suburb",
    county: "Franklin",
    keyword: "water filtration New Albany OH",
    zips: ["43054"],
    nearby: ["gahanna", "westerville", "reynoldsburg"],
    nearbyPlaces: ["Market Street", "the New Albany Country Club", "Plain Township", "the business park"],
    utility: "Columbus Water & Power, under contract to New Albany",
    utilityDetail:
      "New Albany owns the water mains inside the city and contracts with Columbus to supply water and maintain those mains. Columbus also handles billing. Rusty-water and main-break calls go to the Columbus Division of Water, which is what the city tells residents. Estate lots on the Plain Township fringe are the places a well still shows up.",
    hardnessKey: "hap-cremean",
    hardnessNote:
      "Northeast Columbus is closest to the Hap Cremean service the utility describes for northern residents. Use that 2025 average as context for city-water houses, then confirm with a test. It does not describe a Plain Township well.",
    wellLikelihood: "some",
    notes: [
      "A lot of New Albany houses were built with a softener loop and never had the equipment installed. The water is still Columbus water.",
      "Market Street and the club neighborhoods are not well-water problems. If someone on a multi-acre lot east of the village has orange stains, test for iron before talking about a carbon filter.",
    ],
    commonIssues: [
      "Columbus hardness on a purchased supply",
      "Chlorine taste",
      "Wells on the township fringe",
    ],
    sources: [sources.newAlbany, sources.ccr2025],
  },
  {
    slug: "reynoldsburg",
    name: "Reynoldsburg",
    kind: "suburb",
    county: "Franklin",
    keyword: "water softener Reynoldsburg OH",
    zips: ["43068"],
    nearby: ["gahanna", "bexley", "pickerington", "new-albany"],
    nearbyPlaces: ["Brice Road", "Blacklick", "the civic center", "Huber Ridge"],
    utility: "Columbus Water & Power",
    utilityDetail:
      "Reynoldsburg is on the Columbus system, on the east side of Franklin County where Licking County starts. The southeast of that system is the Parsons Avenue plant, a groundwater plant in the Scioto River valley. Northern parts of the east side are closer to Hoover Reservoir water. How a given Reynoldsburg street is fed depends on the distribution system, not on the city limit sign.",
    hardnessKey: "columbus-average",
    hardnessNote:
      "Use the city's about-120-ppm figure as the honest summary. Parsons Avenue averaged 7.2 grains in 2025 and Hap Cremean averaged 5.7. Reynoldsburg can sit toward either, so we do not pin one plant average on the whole ZIP code.",
    wellLikelihood: "some",
    notes: [
      "The Brice Road commercial corridor and the older streets west of town are city water. Chlorine taste and spots are the normal complaints.",
      "Past the city utilities toward Licking County, private wells appear and the Columbus report stops being relevant. Pickerington, next door, is a different utility entirely.",
    ],
    commonIssues: [
      "Columbus hardness without a single plant identity",
      "Chlorine taste",
      "Wells only beyond the public mains",
    ],
    sources: [sources.ccr2025, sources.hardness],
  },
  {
    slug: "pickerington",
    name: "Pickerington",
    kind: "city",
    county: "Fairfield",
    keyword: "water filtration Pickerington OH",
    zips: ["43147"],
    nearby: ["reynoldsburg", "gahanna"],
    nearbyPlaces: ["downtown Pickerington", "Sycamore Creek", "Diley Road", "Violet Township"],
    utility: "the City of Pickerington's own wells",
    utilityDetail:
      "Pickerington does not buy Columbus water as its normal supply. The city's 2025 drinking-water report says the water comes from five wells at the plant west of Diley Road, in the Newark River aquifer. There is an emergency interconnect with Fairfield County Utilities. Violet Township outside the city is a mix of that public water and private wells.",
    hardnessKey: null,
    hardnessNote:
      "Groundwater from the Newark River aquifer is not Dublin Road or Hap Cremean water. We do not reprint a Columbus grains number for Pickerington. The city's report and a test at the tap are the two sources that count.",
    wellLikelihood: "some",
    notes: [
      "Because the municipal supply is already groundwater, hardness and minerals behave differently than they do on Columbus river water. People still get spots and scale. The number is local.",
      "Private wells in Violet Township add iron and sulfur to the list. A softener sized for Columbus river water is the wrong assumption until the test says otherwise.",
    ],
    commonIssues: [
      "Groundwater hardness from the city's own wells",
      "No Columbus chlorine residual to assume",
      "Iron and sulfur on Violet Township wells",
    ],
    sources: [sources.pickerington, sources.odh],
  },
  {
    slug: "sunbury",
    name: "Sunbury",
    kind: "city",
    county: "Delaware",
    keyword: "well water filtration Sunbury OH",
    zips: ["43074"],
    nearby: ["westerville", "lewis-center", "delaware", "new-albany"],
    nearbyPlaces: ["Sunbury square", "State Route 36/37", "Galena", "Berkshire Township"],
    utility: "Del-Co Water for most public connections, plus private wells",
    utilityDetail:
      "Public water around Sunbury is largely Del-Co, which draws from the Olentangy River, O'Shaughnessy Reservoir, Alum Creek Reservoir, and a wellfield in Knox County. Berkshire Township and the Galena side of the ZIP still have many private wells, especially outside the newer subdivisions along 36/37.",
    hardnessKey: null,
    hardnessNote:
      "Sunbury is not on a Columbus plant. Hardness is whatever Del-Co publishes for its system, or whatever a well test shows. We keep those separate.",
    wellLikelihood: "common",
    notes: [
      "Growth along 36/37 has added houses on public water. The older township lots are where orange staining and rotten-egg odor are still the reason someone calls.",
      "A drinking-water system and a whole-home iron filter solve different problems here. The test decides which one, or whether both are wasted money.",
    ],
    commonIssues: [
      "Del-Co water in town and in new subdivisions",
      "Iron, sulfur, and hardness on township wells",
      "No Columbus plant average to borrow",
    ],
    sources: [sources.delco, sources.odh],
  },
  {
    slug: "grandview-heights",
    name: "Grandview Heights",
    kind: "suburb",
    county: "Franklin",
    keyword: "water filtration Grandview Heights OH",
    zips: ["43212"],
    nearby: ["upper-arlington", "hilliard"],
    nearbyPlaces: ["Grandview Avenue", "Grandview Yard", "First Avenue", "the Fifth by Northwest streets"],
    utility: "Columbus Water & Power",
    utilityDetail:
      "Grandview Heights is a small, fully built city between the Olentangy and Upper Arlington, and it is on Columbus water. The Dublin Road plant is the west-side supply. Lots are small, basements are common, and there is no well inventory to plan around.",
    hardnessKey: "dublin-road",
    hardnessNote:
      "West-side Columbus water is the Dublin Road figure, 7.3 grains on average in 2025. In a 1920s house that shows up as scale and a chlorine smell, not as iron.",
    wellLikelihood: "rare",
    notes: [
      "Grandview Yard is new construction on the same public supply as the cottages off Grandview Avenue. The equipment closet is smaller in the older houses, which matters for where a softener can physically go.",
      "Drinking-water taste is the other request, usually from people who can smell chlorine in the kitchen. That is carbon or reverse osmosis, decided after the test, not a well package.",
    ],
    commonIssues: [
      "Dublin Road hardness",
      "Chlorine taste in older houses",
      "Tight utility spaces, not well water",
    ],
    sources: [sources.ccr2025, sources.reservoirs],
  },
  {
    slug: "bexley",
    name: "Bexley",
    kind: "suburb",
    county: "Franklin",
    keyword: "water filtration Bexley OH",
    zips: ["43209"],
    nearby: ["gahanna", "reynoldsburg"],
    nearbyPlaces: ["Capital University", "East Main Street", "the Drexel circle area", "Jeffrey Park nearby in Columbus"],
    utility: "Columbus Water & Power",
    utilityDetail:
      "Bexley is surrounded by Columbus and served by Columbus water. It is an inner-east suburb of older houses, not a township with wells. Which Columbus plant feeds a given street is a distribution question. The citywide finished-water hardness is the honest public figure to start from.",
    hardnessKey: "columbus-average",
    hardnessNote:
      "Bexley is not cleanly one plant in the way Upper Arlington is Dublin Road or Worthington is Hap Cremean. The city's stated average, about 120 ppm or 7 grains, is the number we will stand behind without pretending to know the valve map.",
    wellLikelihood: "rare",
    notes: [
      "Capital University and the streets of large older homes are on public water. Chlorine taste and spots are the complaints. Iron and sulfur are not the local pattern.",
      "Many houses have older plumbing and water heaters that make moderate hardness obvious. A whole-home carbon filter is a separate decision from a softener, and a lot of Bexley calls are really about taste.",
    ],
    commonIssues: [
      "Columbus moderate hardness",
      "Chlorine taste",
      "Older plumbing, not private wells",
    ],
    sources: [sources.hardness, sources.ccr2025],
  },
];

export function getLocation(slug: string): LocationRecord | undefined {
  return locations.find((l) => l.slug === slug);
}

export function locationsByCounty(): { county: string; locations: LocationRecord[] }[] {
  const map = new Map<string, LocationRecord[]>();
  for (const loc of locations) {
    const list = map.get(loc.county) ?? [];
    list.push(loc);
    map.set(loc.county, list);
  }
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([county, list]) => ({
      county,
      locations: list.slice().sort((a, b) => a.name.localeCompare(b.name)),
    }));
}
