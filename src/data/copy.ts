import { formOptionForService } from "./form-options";
import {
  allPages,
  type CatalogPage,
  type Place,
  countyHubPages,
  displayZips,
  formatPop,
  getPage,
  getPlace,
  isColumbusSupply,
  nearbyHubs,
  nearbyNeighborhoods,
  neighborhoodPages,
  pagesForService,
  pagesInCounty,
  placesInCounty,
  usesSharedColumbusNote,
} from "./dataset";

export type LinkItem = { href: string; label: string; note?: string };
export type SourceLink = { label: string; href: string };
export type Section = { heading: string; paragraphs: string[] };
export type PageModel = {
  h1: string;
  title: string;
  description: string;
  crumbs: { name: string; path: string }[];
  lede: string;
  sections: Section[];
  faqs: { q: string; a: string }[];
  sources: SourceLink[];
  facts: { label: string; value: string }[];
  linkGroups: { heading: string; items: LinkItem[] }[];
  formOption: string;
  indexable: boolean;
};

const CCR =
  "https://www.columbus.gov/files/sharedassets/city/v/8/services/public-utilities/water-reports/consumer-confidence-water-quality-report/consumer-confidence-report.pdf";
const COLUMBUS_HARDNESS =
  "https://www.columbus.gov/Services/Columbus-Water-Power/About-Columbus-Water-Power/The-Division-of-Water/Water-Facts/Water-Hardness";
const COLUMBUS_PFAS =
  "https://www.columbus.gov/Services/Columbus-Water-Power/About-Columbus-Water-Power/The-Division-of-Water/Water-Resources-for-Customers/PFAS-and-Drinking-Water";
const ODH =
  "https://odh.ohio.gov/know-our-programs/private-water-systems-program/water-quality-treatment/quality";
const ODH_PROGRAM = "https://odh.ohio.gov/know-our-programs/private-water-systems-program";

const COLUMBUS_SAFETY =
  "Columbus Water & Power says a home filter is not required to make the water safe to drink. On this supply, a softener or filter is a choice about taste, odor, scale, and how appliances wear, not a safety fix.";

function cap(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function milesLabel(n: number): string {
  if (n < 10) return n.toFixed(1);
  return String(Math.round(n));
}

export function pageH1(page: CatalogPage): string {
  if (page.path === "/") return "Water treatment in Columbus, Ohio";
  if (page.path === "/columbus-water-quality/") return "Columbus, Ohio water quality report";
  if (page.path === "/columbus-water-hardness/") return "Hard water in Columbus, Ohio";
  if (page.path === "/water-softeners/") return "Water softener systems";
  if (page.path === "/service-area/") return "Water treatment across central Ohio";
  if (page.locationName) {
    const kw = page.primaryKw;
    const idx = kw.toLowerCase().lastIndexOf(page.locationName.toLowerCase());
    if (idx >= 0) {
      const before = kw.slice(0, idx).replace(/[\s,]+$/, "");
      let after = kw.slice(idx + page.locationName.length).trim();
      after = after.replace(/\bohio\b/i, "Ohio").replace(/\boh\b/i, "Ohio");
      const head = before ? cap(before) : "";
      return `${head}${head ? " in " : ""}${page.locationName}${after ? `, ${after}` : ""}`.replace(
        /\s+/g,
        " ",
      );
    }
  }
  if (page.county) {
    const short = page.county.replace(/ County$/, "");
    const kw = page.primaryKw;
    if (kw.toLowerCase().startsWith(short.toLowerCase())) {
      const rest = kw
        .slice(short.length)
        .replace(/county/i, "")
        .replace(/\bohio\b/i, "")
        .replace(/\boh\b/i, "")
        .trim();
      return `${cap(rest)} in ${page.county}, Ohio`;
    }
    const idx = kw.toLowerCase().indexOf(short.toLowerCase());
    if (idx > 0) {
      return `${cap(kw.slice(0, idx).trim())} in ${page.county}, Ohio`;
    }
  }
  if (/columbus ohio/i.test(page.primaryKw)) {
    const before = page.primaryKw.replace(/columbus ohio/i, "").trim();
    return `${cap(before)} in Columbus, Ohio`;
  }
  return cap(page.primaryKw);
}

function clip(s: string, n: number): string {
  if (s.length <= n) return s;
  return `${s.slice(0, n - 1).replace(/\s+\S*$/, "")}.`;
}

function placeFor(page: CatalogPage): Place | undefined {
  if (!page.placeSlug) return undefined;
  return getPlace(page.placeSlug);
}

function utilitySentence(place: Place, page: CatalogPage): string | null {
  if (page.utilityVerified !== "yes" || !place.utility) return null;
  if (usesSharedColumbusNote(place) || isColumbusSupply(place)) {
    return `${place.name} is supplied by Columbus Water & Power as a contract community. Columbus treats Scioto River and Big Walnut Creek surface water, and Scioto Valley groundwater at the Parsons Avenue plant. The 2025 report lists finished-water hardness of 5.7–7.3 grains per gallon by plant (98–125 mg/L) and a system summary of 115 mg/L. The city does not publish which plant feeds a single ${place.name} address, so that range is the number we use, and we still test at the house. ${COLUMBUS_SAFETY}`;
  }
  const note = place.sourceNote ? ` ${place.sourceNote}` : "";
  return `Drinking water in ${place.name} comes from ${place.utility}.${note}`;
}

function hardnessSentence(place: Place, page: CatalogPage): string {
  if (page.utilityVerified !== "yes") {
    return `We have not confirmed a public water supplier for ${place.name} from a utility page or consumer confidence report. This page does not name a utility or a hardness number. The test at the house is what tells us whether the tap is on a public main or a private well.`;
  }
  if (page.hardnessVerified === "yes" && place.hardness) {
    return `${place.utility} publishes a hardness figure for this supply: ${place.hardness}.`;
  }
  return `${place.utility} does not publish a hardness figure in the report we reviewed. We test hardness on site in ${place.name} rather than borrow a number from a neighboring utility.`;
}

function zipSentence(place: Place): string | null {
  const zips = displayZips(place);
  if (!zips.length) return null;
  return `ZIP codes on file for ${place.name} are ${zips.join(", ")}.`;
}

function popSentence(place: Place): string | null {
  if (!place.population) return null;
  const counties = place.countyNames.length
    ? place.countyNames.join(" and ")
    : place.parent;
  const miles =
    place.miles != null ? ` It is about ${milesLabel(place.miles)} miles from downtown Columbus.` : "";
  return `The 2020 census counted ${formatPop(place.population)} people in ${place.name}, in ${counties}.${miles}`;
}

type Neighbor = { place: Place; page: CatalogPage; miles: number };

function neighborSentences(place: Place, neighbors: Neighbor[]): string[] {
  if (!neighbors.length) return [];
  return neighbors.map((n) => {
    const dist = `${milesLabel(n.miles)} miles from ${place.name}`;
    const verified = n.page.utilityVerified === "yes" && n.place.utility;
    const supply = verified
      ? `Water there is ${n.place.utility}.`
      : `We have not confirmed ${n.place.name}'s public supplier, so that page does not state one.`;
    const hard =
      n.page.hardnessVerified === "yes" && n.place.hardness
        ? ` Published hardness: ${n.place.hardness}.`
        : "";
    return `${n.place.name} is ${dist}, in ${n.place.countyNames[0] || n.page.county || "central Ohio"}. ${supply}${hard}`;
  });
}

function serviceAngle(page: CatalogPage, place: Place): string {
  const slug = page.serviceSlug;
  if (place.slug === "heath-oh") {
    return `Heath's 2025 consumer confidence report says the city softens its water to 145 mg/L and that home water softeners are unnecessary. We do not pitch a softener as the default in Heath. Whole-house filtration and reverse osmosis are the useful questions: taste and drinking water, not hardness the plant already lowered.`;
  }
  if (place.slug === "circleville-oh" && page.utilityVerified === "yes") {
    return `Circleville draws from four wells about 130 feet deep in the Teays aquifer and treats for iron and manganese without softening. The city calls the water hard at 25 grains per gallon, about 428 mg/L, the hardest verified figure in this set. A softener and a drinking-water reverse osmosis system answer different parts of that: scale versus what you cook and drink. Ohio EPA has also awarded Circleville a grant to design a reverse-osmosis treatment plant.`;
  }
  if (page.utilityVerified !== "yes") {
    return `Until a supplier is confirmed, equipment for ${place.name} starts with the test. A softener, a carbon filter, and reverse osmosis solve different problems, and guessing from a nearby city's report is how people buy the wrong one.`;
  }
  if (slug === "water-softener-installation" || slug === "water-softener-repair") {
    if (page.hardnessVerified === "yes") {
      return `A softener in ${place.name} is justified by the published hardness above, not by a statewide map. It reduces scale and spotting. It does not take out chlorine, PFAS, or nitrate. Repair calls usually follow salt bridges, resin that is exhausted, or a unit sized for a different hardness than ${place.name} actually has.`;
    }
    return `Because ${place.name}'s supplier has not published hardness, a softener quote here starts with a grains-per-gallon test. Installing from a Columbus or Del-Co number would be a guess.`;
  }
  if (slug === "whole-house-water-filtration") {
    return `A whole-house filter in ${place.name} treats water where it enters the house: sediment and the taste of disinfectant on a public supply, or a first stage ahead of other equipment on a well. It does not soften water. ${isColumbusSupply(place) ? COLUMBUS_SAFETY : "Match the media to the supplier's source, which is described above, instead of a stock carbon tank."}`;
  }
  if (slug === "reverse-osmosis-installation") {
    const extra = isColumbusSupply(place)
      ? ` On Columbus water, the 2025 report shows higher sodium and sulfate at the Parsons Avenue plant and higher nitrate at Dublin Road, before the city's nitrate removal process. Those are drinking-water details, and the city does not pin them to one ${place.name} street.`
      : "";
    return `Reverse osmosis in ${place.name} belongs at the kitchen sink, for cooking and drinking. It is not a whole-house softener. A unit should be certified for the reductions you actually want.${extra}`;
  }
  return `The free visit in ${place.name} checks hardness, chlorine, total dissolved solids, iron, and odor. It is a field test for choosing equipment. It is not a certified lab sample for bacteria, nitrate, lead, or PFAS.`;
}

function localFaqs(page: CatalogPage, place: Place, neighbors: Neighbor[]): { q: string; a: string }[] {
  const faqs: { q: string; a: string }[] = [];
  if (page.utilityVerified === "yes" && place.utility) {
    faqs.push({
      q: `Who supplies drinking water in ${place.name}?`,
      a: `${place.utility}. ${place.slug === "heath-oh" ? "Heath softens at the plant to 145 mg/L and says home softeners are unnecessary." : hardnessSentence(place, page)}`,
    });
  } else {
    faqs.push({
      q: `Why doesn't this page name a water utility for ${place.name}?`,
      a: `The supplier was not confirmed from a utility page or consumer confidence report when this dataset was compiled. Publishing a utility name or a hardness number here would be a guess. We test at the house instead.`,
    });
  }
  faqs.push({
    q: `Is the water in ${place.name} hard?`,
    a:
      page.hardnessVerified === "yes" && place.hardness
        ? `${place.hardness}. That is the published figure, in the units the utility used. Spots on glass and scale in a water heater are the household signs. The test confirms the number at the address.`
        : `${place.name} does not have a hardness figure we are willing to cite. ${page.utilityVerified === "yes" ? "The supplier's report does not list one." : "We also have not confirmed the supplier."} A grains-per-gallon test at the house is the number that matters.`,
  });
  if (neighbors[0]) {
    const n = neighbors[0];
    faqs.push({
      q: `How is ${place.name} different from ${n.place.name}?`,
      a: neighborSentences(place, [n])[0],
    });
  }
  if (page.serviceSlug === "water-softener-installation" && place.slug !== "heath-oh") {
    faqs.push({
      q: `Do I need a water softener in ${place.name}?`,
      a:
        page.hardnessVerified === "yes"
          ? `Only if the hardness at the house matches the problem you see. The published figure for this supply is ${place.hardness}. A softener addresses that mineral hardness. It will not fix chlorine taste or a well-water sulfur smell.`
          : `Not from a borrowed number. ${place.name} needs its own hardness test before anyone sizes a softener.`,
    });
  }
  const zips = displayZips(place);
  if (zips.length) {
    faqs.push({
      q: `Which ZIP codes does the ${place.name} page cover?`,
      a: `${zips.join(", ")}. Those come from ${place.zipsDisplay ? "a named place source, not a guessed centroid" : "the location file"}. Houses just outside the city limits may be on a different supplier.`,
    });
  }
  return faqs.slice(0, 4);
}

function sourcesFor(place: Place | undefined, page: CatalogPage): SourceLink[] {
  const items: SourceLink[] = [];
  const add = (label: string, href: string) => {
    if (!href || items.some((s) => s.href === href)) return;
    items.push({ label, href });
  };
  if (place && page.utilityVerified === "yes") {
    if (place.utilityUrl) add(place.utility || "Water supplier", place.utilityUrl);
    if (page.hardnessVerified === "yes" && place.hardnessUrl) add("Hardness figure", place.hardnessUrl);
    if (isColumbusSupply(place) || usesSharedColumbusNote(place)) {
      add("Columbus 2025 water quality report", CCR);
      add("Columbus water hardness", COLUMBUS_HARDNESS);
    }
  }
  if (place?.slug === "circleville-oh") {
    add("Circleville water treatment", "https://circlevilleoh.gov/public_utilities/wtp/");
  }
  if (place?.slug === "heath-oh") {
    add("Heath utilities", "https://www.heathohio.gov/utilities");
  }
  if (
    page.serviceSlug === "well-water-treatment" ||
    page.serviceSlug === "well-water-testing" ||
    page.pageType === "county-hub"
  ) {
    add("Ohio Department of Health — private water systems", ODH);
  }
  if (page.serviceSlug === "pfas-water-filtration" || page.path === "/columbus-water-quality/") {
    add("Columbus PFAS and drinking water", COLUMBUS_PFAS);
  }
  return items;
}

function factsFor(place: Place, page: CatalogPage): { label: string; value: string }[] {
  const facts: { label: string; value: string }[] = [];
  if (page.county || place.countyNames[0]) {
    facts.push({ label: "County", value: page.county || place.countyNames.join(", ") });
  }
  if (place.population) {
    facts.push({ label: "Population (2020)", value: formatPop(place.population) });
  }
  if (place.miles != null) {
    facts.push({ label: "Miles from downtown", value: milesLabel(place.miles) });
  }
  if (page.utilityVerified === "yes" && place.utility) {
    facts.push({ label: "Water supplier", value: place.utility });
  } else {
    facts.push({ label: "Water supplier", value: "Not confirmed in our notes" });
  }
  if (page.hardnessVerified === "yes" && place.hardness) {
    facts.push({ label: "Published hardness", value: place.hardness });
  }
  const zips = displayZips(place);
  if (zips.length) facts.push({ label: "ZIP codes", value: zips.join(", ") });
  return facts;
}

const HUB_SECTIONS: Record<string, Section[]> = {
  "water-softener-installation": [
    {
      heading: "What installation includes",
      paragraphs: [
        "A softener is sized from a hardness test and the number of people in the house, then set where the water enters. We do not publish prices. The visit is free if you do not buy a system.",
        "People search for water softener installation cost and for water softener companies in Columbus. Cost follows grains per gallon, pipe size, and whether a drain and an outlet are already there. The Columbus-area hook is real hardness from the utility report, not a national map.",
        COLUMBUS_SAFETY,
      ],
    },
  ],
  "water-softener-repair": [
    {
      heading: "Repair, service, and maintenance",
      paragraphs: [
        "Repair is for a softener you already have: no soft water, a salt bridge, a stuck valve, or resin that no longer keeps up. Maintenance is the same visit when the unit is simply due for a check.",
        "Searches for water softener repair are mostly “near me,” with no Columbus-specific autocomplete behind them. We still limit city pages to larger cities, where a technician can describe the local hardness instead of repeating one script.",
      ],
    },
  ],
  "whole-house-water-filtration": [
    {
      heading: "Whole-house filters versus softeners",
      paragraphs: [
        "A whole-house filter treats sediment and the taste of chlorine or other disinfectant at the point of entry. It does not remove hardness. Many houses on treated water end up discussing both, and only after a test.",
        "General “water filter installation near me” searches point at this page and at reverse osmosis. They are different jobs: every tap, or the kitchen sink.",
      ],
    },
  ],
  "reverse-osmosis-installation": [
    {
      heading: "Where reverse osmosis belongs",
      paragraphs: [
        "Reverse osmosis is a drinking-water system, usually under the sink. It is the right conversation for dissolved solids, and for certified reductions of specific contaminants. It is a poor whole-house softener.",
        "Columbus-modified search shows “reverse osmosis columbus ohio.” On Columbus water, sodium and sulfate run higher at the Parsons Avenue plant, and nitrate runs higher at Dublin Road. The city is still in compliance, and it says a home filter is not required for safety.",
      ],
    },
  ],
  "well-water-treatment": [
    {
      heading: "Wells are a county question",
      paragraphs: [
        "Most incorporated cities in this area are on a public supply. Private wells show up in townships and on the edges. City pages are the wrong place to pretend every house is on a well, so well-water treatment is localized by county.",
        "Ohio requires total coliform, E. coli, and nitrate sampling when a private water system is permitted or altered. Iron at 0.3 mg/L is a secondary, aesthetic standard. A field test can point at iron or sulfur. It does not replace that lab sample.",
      ],
    },
  ],
  "water-testing": [
    {
      heading: "A field test is not a lab",
      paragraphs: [
        "The free visit measures hardness, chlorine, total dissolved solids, iron, and odor so we can recommend equipment, or no equipment. It is not a certified report for bacteria, nitrate, lead, or PFAS.",
        "“Is Columbus water safe to drink?” is a question the city’s own report answers. Columbus says customers do not need a home filter for safety. Use the water-quality page for the 2025 figures, and a lab when you need a compliance sample.",
      ],
    },
  ],
  "well-water-testing": [
    {
      heading: "What Ohio asks of a private well",
      paragraphs: [
        "For a new or altered private water system, Ohio samples total coliform, E. coli, and nitrate. The health department also recommends routine tests for those, plus arsenic. Our visit does not substitute for that sample.",
        "County pages cover the township pattern. “Well water testing columbus ohio” is this hub; the county pages pick up the rural part of the same question.",
      ],
    },
  ],
  "iron-sulfur-removal": [
    {
      heading: "Iron filters and rotten-egg odor",
      paragraphs: [
        "Orange staining and a rotten-egg smell are groundwater problems. Ohio notes that manganese greensand filters are a common treatment for iron, often cited for levels up to about 10–15 mg/L. A softener is not an iron filter, and a carbon tank will not stop sulfur.",
        "Circleville’s wells are treated for iron and manganese at the plant and are still very hard. A house on a private well needs its own test. Finished Columbus water is not that problem: the city’s plant averages for iron are non-detect.",
      ],
    },
  ],
  "uv-water-purification": [
    {
      heading: "UV is for wells, and only after the lab says so",
      paragraphs: [
        "Ultraviolet disinfection is discussed when a private well has a bacteria hit, or when a lab recommends it. It does not soften water, and it does not remove iron, sulfur, or nitrate. Sediment has to be handled first or the lamp does little.",
        "Columbus already disinfects, including UV at its surface-water plants. A home UV on city water is not the default recommendation.",
      ],
    },
  ],
  "pfas-water-filtration": [
    {
      heading: "PFAS, without the scare language",
      paragraphs: [
        "Columbus has tested for PFAS since 2019. The city reports low-level detections near the detection limit and says its plants would meet the federal standards as described in its materials. That is not a claim that PFAS is absent, and it is not a claim that tap water is unsafe.",
        "A drinking-water system certified for PFAS reduction is the equipment conversation. A softener does not remove PFAS. Ohio EPA’s statewide sampling and the Circleville and Columbus treatment grants are linked from this page’s sources. Private wells are a separate lab question.",
      ],
    },
  ],
  "salt-free-water-conditioners": [
    {
      heading: "Conditioners are not softeners",
      paragraphs: [
        "Salt-free conditioners are marketed as scale control without ion exchange. They do not remove hardness minerals the way a softener does. On Columbus water, already softened to about 7 grains per gallon, many houses do not need either one. The test is how you tell.",
        "We will not call a conditioner a softener, and we will not promise a grains-per-gallon drop it cannot deliver.",
      ],
    },
  ],
  "under-sink-water-filters": [
    {
      heading: "Under the sink, not the whole house",
      paragraphs: [
        "An under-sink filter or a reverse osmosis unit serves the kitchen tap. It does not treat showers or the water heater. Installation searches overlap with reverse osmosis; if the goal is dissolved solids or a certified reduction, start on the reverse osmosis page.",
        "Carbon under the sink is a taste and odor option on a public supply. It is the wrong single answer for a well with iron or bacteria.",
      ],
    },
  ],
  "water-softeners": [
    {
      heading: "How to compare a system",
      paragraphs: [
        "A softener and a whole-house filter do different jobs. Hard water is calcium and magnesium. Chlorine taste is a filter question. Salt-free conditioners do not exchange those minerals out of the water.",
        "Sizing uses hardness in grains per gallon and daily water use. Columbus finishes around 7 grains after the utility softens. Circleville’s wells are cited at 25 grains, with no softening at the plant. Heath softens to 145 mg/L and says a home softener is unnecessary. Those three facts are why one “best softener” article does not fit central Ohio.",
      ],
    },
  ],
};

const HUB_FAQS: Record<string, { q: string; a: string }[]> = {
  "water-softener-installation": [
    {
      q: "How much does water softener installation cost in Columbus?",
      a: "We do not list prices on this site. The cost follows the hardness test, the plumbing at the house, and the size of the unit. The visit to measure hardness is free if you do not buy anything.",
    },
    {
      q: "Is Columbus water hard enough to need a softener?",
      a: "Columbus softens to about 120 ppm, roughly 7 grains per gallon, and calls that moderately hard. The 2025 plant averages run from 5.7 to 7.3 grains. Some people want the rest of the hardness removed for spots and scale. The city does not say you need a softener for safety.",
    },
  ],
  "water-softener-repair": [
    {
      q: "What does water softener repair usually involve?",
      a: "A unit that stopped softening: salt problems, a failed seal or piston, or resin that is worn out. We test hardness before and after the unit so the repair matches the symptom.",
    },
    {
      q: "Do you service softeners you did not install?",
      a: "Yes, when we can get parts and the test shows the unit is the problem. If the water was never hard enough to need it, we will say that too.",
    },
  ],
  "whole-house-water-filtration": [
    {
      q: "Will a whole-house filter make water soft?",
      a: "No. Carbon and sediment filters do not remove calcium and magnesium. Scale and spots are a softener question.",
    },
    {
      q: "Is a home filter required on Columbus water?",
      a: "Columbus says no, not for safety. People still add carbon for chlorine taste. That is a preference, and the test includes a chlorine check.",
    },
  ],
  "reverse-osmosis-installation": [
    {
      q: "Is reverse osmosis the same as a water softener?",
      a: "No. Reverse osmosis treats a drinking-water tap. A softener treats hardness for the whole house. Many kitchens have one without the other.",
    },
    {
      q: "Does Columbus water need reverse osmosis?",
      a: "The city says a home filter is not required for safety. Reverse osmosis is optional for taste and for certified reductions. Sodium, sulfate, and nitrate vary by plant in the 2025 report.",
    },
  ],
  "well-water-treatment": [
    {
      q: "Do Columbus suburbs need well-water equipment?",
      a: "Most houses inside the cities on this site are on public water. Wells are a township and edge-of-town question. County pages are where that is spelled out.",
    },
    {
      q: "What should a private well be tested for?",
      a: "Ohio’s permit sample is total coliform, E. coli, and nitrate. Iron and sulfur are the usual treatment clues. Our visit does not replace the lab sample.",
    },
  ],
  "water-testing": [
    {
      q: "Is the free test a certified lab report?",
      a: "No. It is a field test for hardness, chlorine, TDS, iron, and odor. Bacteria, nitrate, lead, and PFAS need a lab.",
    },
    {
      q: "Is Columbus tap water safe to drink?",
      a: "Columbus publishes a consumer confidence report and says customers do not need a home filter for safety. Read the water-quality page for the 2025 numbers and the city’s own links.",
    },
  ],
  "well-water-testing": [
    {
      q: "What does Ohio require when a well is drilled or altered?",
      a: "A private water system that serves fewer than 15 connections and fewer than 25 people falls under the state program. Permits call for total coliform, E. coli, and nitrate samples.",
    },
    {
      q: "Can you test a well for PFAS on site?",
      a: "No. PFAS is a laboratory method. The free visit will not pretend otherwise.",
    },
  ],
  "iron-sulfur-removal": [
    {
      q: "Will a softener remove iron and sulfur?",
      a: "Not as its job. Iron staining and rotten-egg odor need treatment chosen for those, often after a well test. Ohio describes greensand iron filters as a common approach for higher iron.",
    },
    {
      q: "Why does hot water smell and cold water does not?",
      a: "A water-heater anode can make a rotten-egg smell in the hot side only. That is not always the well. We check which taps are affected before selling a filter.",
    },
  ],
  "uv-water-purification": [
    {
      q: "Does UV replace a bacteria test?",
      a: "No. UV is a treatment you consider after a lab finds bacteria, or when a sanitarian recommends it. We do not install UV because a house is on a well.",
    },
  ],
  "pfas-water-filtration": [
    {
      q: "Are there PFAS in Columbus water?",
      a: "Columbus reports low-level detections near detection limits and says results would meet the federal standards described in its materials. There is no basis on this site for saying the water is unsafe.",
    },
    {
      q: "Does a water softener remove PFAS?",
      a: "No. PFAS reduction is a certified carbon or reverse osmosis question, not a softener question.",
    },
  ],
  "salt-free-water-conditioners": [
    {
      q: "Is a salt-free conditioner a water softener?",
      a: "No. It does not ion-exchange hardness out of the water. If you want a lower grains-per-gallon number, that is a softener.",
    },
  ],
  "under-sink-water-filters": [
    {
      q: "Under-sink filter or reverse osmosis?",
      a: "Carbon is for taste and chlorine. Reverse osmosis is for a broader drinking-water reduction, with a certified claim for what it removes. The kitchen tap is the right location for either.",
    },
  ],
  "water-softeners": [
    {
      q: "What is the difference between hard and soft water?",
      a: "Hard water has more calcium and magnesium. Soft water has had most of that exchanged out. Columbus already softens to the moderately hard range. Circleville’s well water is much harder. Heath softens further and tells residents a home softener is unnecessary.",
    },
    {
      q: "Whole-house filter or softener?",
      a: "Filter for sediment and disinfectant taste. Softener for hardness. They are often installed together, and only when the test shows both jobs exist.",
    },
  ],
};

function hubModel(page: CatalogPage): PageModel {
  const h1 = pageH1(page);
  const slug = page.serviceSlug || "";
  const children = pagesForService(slug).filter((p) => p.pageType === "service-x-location" || p.pageType === "service-x-county");
  const byCounty = new Map<string, CatalogPage[]>();
  for (const child of children) {
    const key = child.county || "Central Ohio";
    const list = byCounty.get(key) || [];
    list.push(child);
    byCounty.set(key, list);
  }
  const linkGroups = [...byCounty.entries()].map(([county, list]) => ({
    heading: county,
    items: list.map((child) => ({
      href: child.path,
      label: child.locationName || child.county,
      note: child.indexable ? undefined : "Supplier not confirmed",
    })),
  }));
  if (slug === "well-water-treatment" || slug === "well-water-testing" || slug === "iron-sulfur-removal" || slug === "uv-water-purification") {
    linkGroups.unshift({
      heading: "County well pages",
      items: countyHubPages().flatMap((hub) => {
        const treatment = getPage(`/well-water-treatment/${hub.placeSlug}/`);
        const testing = getPage(`/well-water-testing/${hub.placeSlug}/`);
        return [treatment, testing].filter((p): p is CatalogPage => Boolean(p)).map((p) => ({
          href: p.path,
          label: p.primaryKw,
          note: undefined,
        }));
      }),
    });
  }
  return {
    h1,
    title: `${h1} | Columbus Water Filtration`,
    description: clip(
      `${h1}. Free in-home water test for Columbus and central Ohio. Recommendations follow the test and the utility report, not a package.`,
      160,
    ),
    crumbs: [{ name: h1.replace(/ in Columbus, Ohio$/, ""), path: page.path }],
    lede: `This page covers ${page.primaryKw}. City pages linked below use that place’s own supplier and hardness notes. Pages still missing a confirmed supplier are marked and kept out of the sitemap.`,
    sections: HUB_SECTIONS[slug] || [
      {
        heading: h1,
        paragraphs: [
          "Schedule a free in-home test. We measure hardness, chlorine, TDS, iron, and odor, then say whether any equipment is warranted.",
        ],
      },
    ],
    faqs: HUB_FAQS[slug] || [],
    sources: sourcesFor(undefined, page),
    facts: [],
    linkGroups,
    formOption: formOptionForService(slug),
    indexable: page.indexable,
  };
}

function countySections(page: CatalogPage): Section[] {
  const county = page.county;
  const inCounty = placesInCounty(county);
  const hubs = pagesInCounty(county);
  const towns = inCounty.filter((p) => p.type === "township");
  const small = inCounty.filter(
    (p) =>
      (p.type === "village" || p.type === "cdp") &&
      !hubs.some((h) => h.placeSlug === p.slug),
  );
  const listed = hubs
    .map((h) => {
      const place = h.placeSlug ? getPlace(h.placeSlug) : undefined;
      if (!place) return h.locationName;
      if (h.utilityVerified === "yes" && place.utility) {
        return `${place.name} (${place.utility})`;
      }
      return `${place.name} (supplier not confirmed)`;
    })
    .join("; ");
  const sections: Section[] = [
    {
      heading: `Public water in ${county}`,
      paragraphs: [
        listed
          ? `Places in ${county} with their own page: ${listed}.`
          : `${county} does not have a separate city page in this set yet.`,
        small.length
          ? `Smaller villages and census places in ${county} are served from this county page rather than a page of their own: ${small
              .map((p) => p.name)
              .slice(0, 18)
              .join(", ")}.`
          : "",
        towns.length
          ? `Townships in the location file for ${county} include ${towns
              .map((p) => p.name.replace(` (${county})`, ""))
              .slice(0, 16)
              .join(", ")}. Township names are rarely searched, so they do not get standalone pages. Private wells are more common there than inside the cities.`
          : "",
      ].filter(Boolean),
    },
  ];
  if (page.pageType === "county-hub" || page.serviceSlug?.startsWith("well-water")) {
    sections.push({
      heading: "Private wells",
      paragraphs: [
        `A private water system in Ohio serves fewer than 15 connections and fewer than 25 people. Permits for a new or altered system require total coliform, E. coli, and nitrate samples. The secondary standard for iron is 0.3 mg/L. Manganese greensand filters are a common iron treatment. Nothing on this page claims a specific ${county} township well contains a contaminant without a sample from that well.`,
        county === "Licking County"
          ? "The Ohio Department of Health links USGS work on arsenic in Licking County groundwater. That is a reason to ask a lab about arsenic on a Licking County well. It is not a finding about every well in the county."
          : "",
      ].filter(Boolean),
    });
  }
  if (page.serviceSlug === "well-water-testing") {
    sections.push({
      heading: `Well water testing in ${county}`,
      paragraphs: [
        `The field visit checks hardness, iron, TDS, and odor at the house. Coliform, E. coli, nitrate, arsenic, lead, and PFAS are laboratory tests. If you are inside a city on a public supply, start with that city’s page instead of assuming a well.`,
      ],
    });
  }
  if (page.serviceSlug === "well-water-treatment") {
    sections.push({
      heading: `Well water treatment in ${county}`,
      paragraphs: [
        `Treatment follows the sample: iron and sulfur equipment when those show up, ultraviolet only when bacteria are the issue, and a softener only when hardness is the issue. Public-water cities in ${county} are a different job and are linked below.`,
      ],
    });
  }
  return sections;
}

function dataModel(page: CatalogPage): PageModel {
  const h1 = pageH1(page);
  if (page.path === "/columbus-water-hardness/") {
    return {
      h1,
      title: `${h1} | Columbus Water Filtration`,
      description:
        "Columbus softens water to about 7 grains per gallon. 2025 plant averages: Dublin Road 7.3 gpg, Hap Cremean 5.7 gpg, Parsons Avenue 7.2 gpg. Figures cited from the city report.",
      crumbs: [{ name: "Water hardness", path: page.path }],
      lede: "Does Columbus, Ohio have hard water? The city softens it and still calls the result moderately hard. The figures below are from the 2025 consumer confidence report and the city’s hardness page, not from a third-party estimator.",
      sections: [
        {
          heading: "2025 hardness by plant",
          paragraphs: [
            "Dublin Road Water Plant, Scioto River via Griggs and O'Shaughnessy, northwest and southwest: 125 mg/L average (122–132), 7.3 grains per gallon (7.1–7.7).",
            "Hap Cremean Water Plant, Hoover Reservoir on Big Walnut Creek, OSU and the north: 98 mg/L (85–118), 5.7 grains (5.0–6.9).",
            "Parsons Avenue Water Plant, groundwater wells, southeast: 123 mg/L (122–127), 7.2 grains (7.1–7.4).",
            "The report’s system summary lists hardness as CaCO3 at 115 mg/L. The city’s hardness page says Columbus softens on average to 120 ppm, about 7 grains per gallon, and describes that as moderately hard. Seventeen point one mg/L equals one grain per gallon.",
            "Neighborhood and suburb pages on Columbus water use this system range. They do not assign a plant to a street. The city does not publish that map in a form we can cite address by address.",
            COLUMBUS_SAFETY,
          ],
        },
        {
          heading: "Other verified hardness nearby",
          paragraphs: [
            "Westerville softens at its own plant to about 125 mg/L, about 7 grains. Del-Co, which serves Powell and Sunbury, publishes about 7–8 grains (120–140 mg/L). Newark reports about 119 mg/L, about 7 grains, from the North Fork of the Licking River.",
            "Circleville’s wells are not softened. The city says the water is hard at 25 grains per gallon. Heath softens to 145 mg/L and says home softeners are unnecessary. Delaware, Lancaster, Marysville, Pickerington, and Granville did not publish a hardness figure in the reports we reviewed.",
          ],
        },
      ],
      faqs: [
        {
          q: "Does Columbus, Ohio have hard water?",
          a: "After treatment, yes, in the moderately hard range. The city cites about 120 ppm, or 7 grains per gallon. Plant averages in 2025 were 5.7, 7.3, and 7.2 grains.",
        },
        {
          q: "Should I use a third-party hardness map?",
          a: "No. This page only uses utility reports. If a supplier did not publish hardness, the city pages say so and we test at the house.",
        },
      ],
      sources: [
        { label: "Columbus 2025 consumer confidence report", href: CCR },
        { label: "Columbus water hardness", href: COLUMBUS_HARDNESS },
        { label: "Westerville water", href: "https://www.westerville.org/services/water" },
        { label: "Del-Co hardness", href: "https://delcowater.org/water-hardness/" },
        { label: "Circleville water treatment", href: "https://circlevilleoh.gov/public_utilities/wtp/" },
      ],
      facts: [
        { label: "System summary", value: "115 mg/L as CaCO3 (2025 CCR)" },
        { label: "City hardness page", value: "About 120 ppm / 7 gpg, moderately hard" },
        { label: "Dublin Road 2025", value: "125 mg/L · 7.3 gpg" },
        { label: "Hap Cremean 2025", value: "98 mg/L · 5.7 gpg" },
        { label: "Parsons Avenue 2025", value: "123 mg/L · 7.2 gpg" },
      ],
      linkGroups: [
        {
          heading: "Use this on a city page",
          items: [
            { href: "/water-softener-installation/", label: "Water softener installation" },
            { href: "/water-softeners/", label: "Softener guide" },
            { href: "/columbus-water-quality/", label: "Water quality report" },
          ],
        },
      ],
      formOption: "Free water test",
      indexable: true,
    };
  }
  return {
    h1,
    title: `${h1} | Columbus Water Filtration`,
    description:
      "Columbus 2025 water quality: three plants, chlorine disinfection, nitrate removal at Dublin Road, lead 90th percentile 1.3 ppb, low-level PFAS detections. Home filters are not required for safety.",
    crumbs: [{ name: "Water quality", path: page.path }],
    lede: "This is a reading of the City of Columbus 2025 consumer confidence report and the city’s PFAS page. It is not a scare sheet. Columbus says customers do not need a home filter for safety.",
    sections: [
      {
        heading: "Sources and plants",
        paragraphs: [
          "Columbus uses surface water from the Scioto River and Big Walnut Creek, plus groundwater from sand and gravel in the Scioto River valley at Parsons Avenue. Dublin Road serves the northwest and southwest from Griggs and O'Shaughnessy. Hap Cremean serves the OSU area and the north from Hoover Reservoir. Parsons Avenue serves the southeast from wells.",
          "Treatment includes lime softening, filtration, and disinfection. The surface-water plants also use UV. Iron in the finished-water discussion is not a reason to buy a well-style iron filter for a Columbus tap.",
        ],
      },
      {
        heading: "Nitrate, sodium, and sulfate in 2025",
        paragraphs: [
          "Nitrate MCL is 10 ppm. Dublin Road reached 6.3 ppm (range ND–6.3). Hap Cremean was 1.4 ppm. Parsons Avenue was non-detect. The report ties elevated Scioto nitrate to agricultural runoff. Columbus added anion-exchange nitrate removal at Dublin Road.",
          "Sodium averages: Dublin Road 69.2 ppm, Hap Cremean 19.2 ppm, Parsons Avenue 86.7 ppm. Sulfate averages: 129.3, 54.5, and 207.8 ppm. The sulfate secondary standard is 250. These are drinking-water details for reverse osmosis conversations, not proof the water fails a standard.",
        ],
      },
      {
        heading: "Lead and PFAS",
        paragraphs: [
          "Lead, 2023 sampling: 90th percentile 1.3 ppb, action level 15. Zero of 50 sites were over the action level. Water leaving the plants is below detection. Columbus offers free drinking-water lead testing and, in 2024, a lead service line program to remove public and private lead and galvanized lines by 2040.",
          "PFAS: tested since 2019, with some results near detection limits. The city says the plants would meet the federal standards described in its materials. Monitoring and compliance dates in the 2025 report were 2027 and 2029. A home softener does not remove PFAS. Certified reverse osmosis or carbon is the equipment topic, as an option, not a requirement.",
        ],
      },
      {
        heading: "Disinfection byproducts and the filter question",
        paragraphs: [
          "2025 plant-average TTHM was 58.4, 64.1, and 27.6 ppb (MCL 80). HAA5 was 22.4, 37, and 4.7 ppb (MCL 60). Atrazine showed up at Dublin Road and Hap Cremean well under the 3 ppb MCL. Cryptosporidium was detected in 2 of 12 raw Scioto source samples in 2025, before treatment.",
          "Asked whether customers need a home filter, Columbus says no, and points people who still want one toward NSF/ANSI or WQA certified equipment. That is the line this site follows.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is Columbus tap water safe to drink?",
        a: "The city’s report is the document that answers that, and the city says a home filter is not required for safety. This page quotes the 2025 figures and links the PDF.",
      },
      {
        q: "Where is the Columbus water quality report?",
        a: "The 2025 consumer confidence report is published by Columbus Water & Power. The source list on this page links the PDF.",
      },
    ],
    sources: [
      { label: "Columbus 2025 consumer confidence report", href: CCR },
      { label: "Columbus PFAS and drinking water", href: COLUMBUS_PFAS },
      { label: "Columbus water hardness", href: COLUMBUS_HARDNESS },
      {
        label: "Ohio EPA PFAS",
        href: "https://epa.ohio.gov/monitor-pollution/pollution-issues/per-and-polyfluoroalkyl-substances-pfas",
      },
    ],
    facts: [
      { label: "Lead 90th percentile", value: "1.3 ppb (2023, 0 of 50 over 15)" },
      { label: "Nitrate, Dublin Road", value: "Up to 6.3 ppm in 2025 (MCL 10)" },
      { label: "PFAS", value: "Low-level detections; city cites compliance" },
    ],
    linkGroups: [
      {
        heading: "Related",
        items: [
          { href: "/columbus-water-hardness/", label: "Hardness by plant" },
          { href: "/pfas-water-filtration/", label: "PFAS filtration" },
          { href: "/water-testing/", label: "Water testing" },
          { href: "/reverse-osmosis-installation/", label: "Reverse osmosis" },
        ],
      },
    ],
    formOption: "Free water test",
    indexable: true,
  };
}

function areaIndexModel(page: CatalogPage): PageModel {
  const counties = countyHubPages();
  return {
    h1: pageH1(page),
    title: "Water treatment service area | Central Ohio",
    description:
      "Central Ohio cities, villages, and Columbus neighborhoods where we test water at the house. Each page uses that place’s supplier and hardness notes, or says the supplier is not confirmed.",
    crumbs: [{ name: "Service area", path: page.path }],
    lede: "Pick a county, then a city. Neighborhoods inside Columbus share the city’s system hardness range. Pages without a confirmed supplier are published for navigation and marked noindex until the utility is checked.",
    sections: [
      {
        heading: "How the area is organized",
        paragraphs: [
          "Larger cities have a location page plus the services that match their water. Smaller places have a location page only. Villages under 1,500 people and townships are mentioned on the county page instead of getting a thin page of their own.",
          "Heath has no softener pages: the city already softens and says home softeners are unnecessary. Circleville’s 25-grain well water is called out on its own pages because that report is nothing like Columbus.",
        ],
      },
    ],
    faqs: [],
    sources: [],
    facts: [],
    linkGroups: [
      {
        heading: "Counties",
        items: counties.map((c) => ({ href: c.path, label: c.county })),
      },
      ...counties.map((c) => ({
        heading: c.county,
        items: pagesInCounty(c.county).map((p) => ({
          href: p.path,
          label: p.locationName,
          note: p.indexable ? undefined : "Supplier not confirmed",
        })),
      })),
      {
        heading: "Columbus neighborhoods",
        items: neighborhoodPages().map((p) => ({ href: p.path, label: p.locationName })),
      },
    ],
    formOption: "Free water test",
    indexable: true,
  };
}

export function buildPageModel(page: CatalogPage): PageModel {
  if (page.pageType === "service-hub" || page.pageType === "guide-hub") return hubModel(page);
  if (page.pageType === "local-data") return dataModel(page);
  if (page.pageType === "service-area-index") return areaIndexModel(page);
  if (page.pageType === "county-hub" || page.pageType === "service-x-county") {
    return countyModel(page);
  }
  const place = placeFor(page);
  if (!place) {
    return hubModel(page);
  }
  if (page.pageType === "neighborhood") return neighborhoodModel(page, place);
  return placeModel(page, place);
}

function countyModel(page: CatalogPage): PageModel {
  const h1 = pageH1(page);
  const hubs = pagesInCounty(page.county);
  const wellT = getPage(`/well-water-treatment/${page.placeSlug}/`);
  const wellTest = getPage(`/well-water-testing/${page.placeSlug}/`);
  const items: LinkItem[] = [
    ...hubs.map((h) => ({
      href: h.path,
      label: h.locationName,
      note: h.indexable ? undefined : "Supplier not confirmed",
    })),
  ];
  const extraCandidates = [
    wellT,
    wellTest,
    page.pageType === "county-hub" ? undefined : getPage(`/service-area/${page.placeSlug}/`),
  ];
  const extras: CatalogPage[] = [];
  for (const candidate of extraCandidates) {
    if (candidate && candidate.path !== page.path) extras.push(candidate);
  }
  return {
    h1,
    title: `${h1} | Columbus Water Filtration`,
    description: clip(
      `${h1}. Public suppliers are named only when a utility page or CCR confirms them. Private wells follow Ohio Department of Health sampling rules.`,
      170,
    ),
    crumbs: [
      { name: "Service area", path: "/service-area/" },
      { name: page.county, path: page.pageType === "county-hub" ? page.path : `/service-area/${page.placeSlug}/` },
      ...(page.pageType === "service-x-county" ? [{ name: h1, path: page.path }] : []),
    ],
    lede: `${h1}. Incorporated places are linked with the supplier we can cite. Townships stay on this page because a separate township URL would repeat the same well-water advice.`,
    sections: countySections(page),
    faqs: [
      {
        q: `Do you test private wells in ${page.county}?`,
        a: `Yes, at the house. The visit covers hardness, iron, TDS, and odor. Coliform, E. coli, and nitrate are lab samples Ohio already requires for permitted private water systems.`,
      },
      {
        q: `Which cities in ${page.county} have their own pages?`,
        a: hubs.length
          ? hubs.map((h) => h.locationName).join(", ") + "."
          : `City pages for ${page.county} are listed on the service-area index.`,
      },
    ],
    sources: sourcesFor(undefined, page),
    facts: [{ label: "County", value: page.county }],
    linkGroups: [
      { heading: "Places", items },
      {
        heading: "Also",
        items: extras.map((p) => ({ href: p.path, label: pageH1(p) })),
      },
    ],
    formOption: formOptionForService(page.serviceSlug),
    indexable: page.indexable,
  };
}

function samePlaceLinks(page: CatalogPage, place: Place): LinkItem[] {
  return allPages()
    .filter((p) => p.placeSlug === place.slug && p.path !== page.path && p.pageType !== "service-x-county")
    .map((p) => ({ href: p.path, label: pageH1(p) }));
}

function placeModel(page: CatalogPage, place: Place): PageModel {
  const h1 = pageH1(page);
  const neighbors = nearbyHubs(place, page.tier, 4);
  const supply = utilitySentence(place, page);
  const sections: Section[] = [
    {
      heading: `Water in ${place.name}`,
      paragraphs: [popSentence(place), supply, hardnessSentence(place, page), zipSentence(place)].filter(
        (p): p is string => Boolean(p),
      ),
    },
    {
      heading: page.serviceSlug ? `${h1.split(" in ")[0]} here` : `What we test in ${place.name}`,
      paragraphs: [serviceAngle(page, place)],
    },
  ];
  if (neighbors.length) {
    sections.push({
      heading: `Nearby ${page.tier === "A" ? "cities" : "places"}`,
      paragraphs: neighborSentences(place, neighbors),
    });
  }
  const siblingService =
    page.serviceSlug && neighbors.length
      ? neighbors
          .map((n) => {
            const child = getPage(`/${page.serviceSlug}/${n.place.slug}/`);
            return child ? { href: child.path, label: `${pageH1(child).split(" in ")[0]} in ${n.place.name}` } : null;
          })
          .filter((item): item is LinkItem => Boolean(item))
      : [];
  const hub = getPage(`/service-area/${place.slug}/`);
  const crumbs = [
    { name: "Service area", path: "/service-area/" },
    ...(page.pageType === "service-x-location" && hub
      ? [
          { name: place.name, path: hub.path },
          { name: h1.split(" in ")[0], path: page.path },
        ]
      : [{ name: place.name, path: page.path }]),
  ];
  const descBits = [
    h1,
    page.utilityVerified === "yes" && place.utility ? place.utility : "supplier not confirmed",
    page.hardnessVerified === "yes" && place.hardness ? place.hardness : "",
  ].filter(Boolean);
  return {
    h1,
    title: `${h1} | Columbus Water Filtration`,
    description: clip(`${descBits.join(". ")}. Free in-home water test.`, 165),
    crumbs,
    lede: sections[0].paragraphs[0] || h1,
    sections,
    faqs: localFaqs(page, place, neighbors),
    sources: sourcesFor(place, page),
    facts: factsFor(place, page),
    linkGroups: [
      { heading: `More in ${place.name}`, items: samePlaceLinks(page, place) },
      { heading: "Nearby", items: siblingService.length ? siblingService : neighbors.map((n) => ({ href: n.page.path, label: n.place.name })) },
    ].filter((g) => g.items.length),
    formOption: formOptionForService(page.serviceSlug),
    indexable: page.indexable,
  };
}

function neighborhoodModel(page: CatalogPage, place: Place): PageModel {
  const h1 = pageH1(page);
  const neighbors = nearbyNeighborhoods(place, 5);
  const zips = displayZips(place);
  const parent = place.parent.replace(/;\s*Franklin County\s*$/i, "").trim();
  const miles =
    place.miles != null ? `${milesLabel(place.miles)} miles from downtown` : "inside Columbus";
  const nearest = neighbors[0];
  const neighborLine = neighbors
    .map((n) => {
      const area = n.place.parent.replace(/;\s*Franklin County\s*$/i, "").trim();
      return `${n.place.name} (${milesLabel(n.miles)} mi, ${area})`;
    })
    .join("; ");
  const sections: Section[] = [
    {
      heading: `${place.name}`,
      paragraphs: [
        `${place.name} is ${miles}. File path in the location table: ${parent}.`,
        zips.length
          ? `${place.name} ZIP codes from a named source: ${zips.join(", ")}.`
          : `${place.name} has no ZIP on this page. Approximate centroid codes are omitted.`,
        neighborLine
          ? `Closest neighborhood pages to ${place.name}: ${neighborLine}.`
          : "",
        `${place.name} is on Columbus city water. Hardness and lead-line details live on the city hardness and quality pages, not as a ${place.name}-specific plant assignment. Softener and reverse osmosis URLs stay on the Columbus hubs.`,
      ].filter(Boolean),
    },
  ];
  return {
    h1,
    title: `${h1} | Columbus Water Filtration`,
    description: clip(
      `${h1}. ${parent}. Columbus system hardness 5.7–7.3 gpg. ${zips.length ? `ZIPs ${zips.join(", ")}.` : ""} Free in-home test.`,
      165,
    ),
    crumbs: [
      { name: "Service area", path: "/service-area/" },
      { name: place.name, path: page.path },
    ],
    lede: `${place.name} — ${parent}. ${miles}.`,
    sections,
    faqs: [
      {
        q: `Is ${place.name} on Columbus water?`,
        a: `Yes. ${place.name} is filed as ${parent}, and that row is Columbus Water & Power rather than a suburban utility.`,
      },
      {
        q: `How hard is the water in ${place.name}?`,
        a: `${place.name} (${miles}) uses the Columbus system range published on the hardness page. There is no separate ${place.name} hardness figure.`,
      },
      {
        q: nearest
          ? `How is ${place.name} different from ${nearest.place.name}?`
          : `Where is ${place.name}?`,
        a: nearest
          ? `${place.name} is filed under ${parent}. ${nearest.place.name} is ${milesLabel(nearest.miles)} miles away under ${nearest.place.parent.replace(/;\s*Franklin County\s*$/i, "").trim()}. Both are Columbus water. The pages stay separate so the planning area is not swapped.`
          : `${place.name} is ${miles}, under ${parent}.`,
      },
    ],
    sources: [
      { label: "Columbus 2025 consumer confidence report", href: CCR },
      { label: "Columbus water hardness", href: COLUMBUS_HARDNESS },
    ],
    facts: factsFor(place, { ...page, utilityVerified: "yes", hardnessVerified: "yes" }),
    linkGroups: [
      {
        heading: "Columbus services",
        items: [
          { href: "/water-softener-installation/", label: "Water softener installation" },
          { href: "/whole-house-water-filtration/", label: "Whole-house filtration" },
          { href: "/reverse-osmosis-installation/", label: "Reverse osmosis" },
          { href: "/columbus-water-hardness/", label: "Hardness by plant" },
          { href: "/columbus-water-quality/", label: "Water quality" },
        ],
      },
      {
        heading: "Nearby neighborhoods",
        items: neighbors.map((n) => ({ href: n.page.path, label: n.place.name })),
      },
    ],
    formOption: "Free water test",
    indexable: page.indexable,
  };
}

export function pagePlainText(model: PageModel): string {
  return [
    model.h1,
    model.lede,
    ...model.sections.flatMap((s) => [s.heading, ...s.paragraphs]),
    ...model.faqs.flatMap((f) => [f.q, f.a]),
    ...model.facts.map((f) => `${f.label} ${f.value}`),
  ].join(" ");
}

export { ODH, ODH_PROGRAM };
