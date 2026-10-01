import type { IconName } from "@/components/Icons";

/**
 * Service catalog. Add a row to publish a new service page and, for every
 * location in src/data/locations.ts, a service × city page.
 *
 * Copy may include {city}, {county}, {utility}, and {region}. The page
 * templates fill those from the location record (or from Columbus defaults
 * on the service-wide page). Keep the shared explanation useful on its own.
 * Local facts live on the location record, not in this file.
 */
export type ServiceEmphasis =
  | "hardness"
  | "chlorine"
  | "drinking"
  | "wells"
  | "iron"
  | "pfas"
  | "testing";

export type ServiceRecord = {
  slug: string;
  name: string;
  shortName: string;
  icon: IconName;
  /** Primary query, without the city. The template adds "in {City}, OH". */
  keyword: string;
  /** Meta description. Placeholders allowed. */
  description: string;
  h1: string;
  lede: string;
  sections: { heading: string; paragraphs: string[] }[];
  included: string[];
  faqs: { q: string; a: string }[];
  emphasis: ServiceEmphasis;
  related: string[];
  /** Value submitted with the lead form. */
  formOption: string;
};

export const services: ServiceRecord[] = [
  {
    slug: "whole-home-water-filtration",
    name: "Whole-home water filtration",
    shortName: "Whole-home filtration",
    icon: "HomeIcon",
    keyword: "whole home water filtration",
    description:
      "Whole-home water filtration in {city}, OH. A point-of-entry system treats chlorine taste, sediment, and odors for every tap in the house. Free in-home water test.",
    h1: "Whole-home water filtration in {city}, Ohio",
    lede: "A whole-home filter treats water where it enters the house, so showers, laundry, and every faucet get the same water. In {city}, the right setup depends on whether you are on {utility} or a private well.",
    sections: [
      {
        heading: "What a whole-home filter actually does",
        paragraphs: [
          "These are point-of-entry systems. Sediment filters catch sand and rust particles. Carbon filters reduce chlorine and many of the compounds that make treated water smell and taste off. They do not soften water, and they are not a substitute for reverse osmosis at the kitchen sink.",
          "Columbus Water & Power disinfects with chlorine and publishes a total-chlorine residual in its annual water report. Homes on that supply often want carbon for taste even when the water meets safety standards. If your supplier is not Columbus, do not assume the same chlorine level. The test at the house is the one that matters.",
        ],
      },
      {
        heading: "What it will not fix",
        paragraphs: [
          "Hardness is calcium and magnesium. Carbon does not remove them. Spots on glass and scale in a water heater are a softener question, not a filter question. Dissolved solids, many metals, and PFAS are drinking-water questions and usually belong on a reverse osmosis system certified for those reductions.",
          "A private well with iron, sulfur, or bacteria needs its own diagnosis. A carbon tank alone will not stop orange staining or a rotten-egg smell.",
        ],
      },
    ],
    included: [
      "Sediment and carbon matched to the test, not a stock package",
      "Point-of-entry installation so every tap is covered",
      "A walkthrough of filter changes and what the system does not do",
      "A recommendation only if the test shows a reason to filter",
    ],
    faqs: [
      {
        q: "Is a whole-home filter the same as a water softener?",
        a: "No. A filter targets chlorine, sediment, and odors. A softener targets hardness. Many {city} houses on treated water end up with both, but only after a test shows they need both.",
      },
      {
        q: "Will it make my water soft?",
        a: "No. Soft water is what you get when calcium and magnesium are removed. If spots and scale are the complaint in {city}, look at the softener page. If the complaint is taste or smell, start here.",
      },
    ],
    emphasis: "chlorine",
    related: ["water-softeners", "reverse-osmosis", "water-testing"],
    formOption: "Whole-home filtration",
  },
  {
    slug: "water-softeners",
    name: "Water softener installation",
    shortName: "Water softener",
    icon: "SparkleIcon",
    keyword: "water softener installation",
    description:
      "Water softener installation in {city}, OH. Ion-exchange softeners for hard central Ohio water, sized after a free in-home test. No package price on this site.",
    h1: "Water softener installation in {city}, Ohio",
    lede: "A water softener removes calcium and magnesium, the minerals that leave spots on glass, scale in the water heater, and a film on skin. {city} water from {utility} is the starting point. The setting belongs to your test, not a citywide guess.",
    sections: [
      {
        heading: "Why central Ohio talks about softeners so much",
        paragraphs: [
          "Columbus finishes its water moderately hard on purpose. The city says it softens to about 120 parts per million, roughly 7 grains per gallon, because very soft water can corrode plumbing. That is still hard enough to spot dishes and shorten water-heater life. The 2025 plant averages run from 5.7 grains at Hap Cremean to about 7.3 at Dublin Road and 7.2 at Parsons Avenue.",
          "Those figures describe Columbus finished water, not every supplier in {county}. If {utility} is a different utility, or the house is on a well, the Columbus report does not apply. We will not quote a grains number we cannot cite.",
        ],
      },
      {
        heading: "How a home softener fits with utility softening",
        paragraphs: [
          "A home softener is ion exchange. Hardness minerals stick to resin and are flushed with salt during regeneration. A metered unit regenerates based on water use instead of a clock, which wastes less salt.",
          "The city leaves hardness in the water for corrosion control. Taking a house all the way to zero is not automatically the goal. After the test we talk about a residual that deals with spots and scale without pretending the utility's corrosion control was pointless.",
        ],
      },
    ],
    included: [
      "Hardness test before any recommendation",
      "Metered ion-exchange softener sized to the household",
      "A clear explanation of salt use and what a softener does not remove",
      "Installation and a walkthrough at the house",
    ],
    faqs: [
      {
        q: "Does {city} water already come softened?",
        a: "Only if {utility} softens it. Columbus does, down to about 120 ppm, which the city calls moderately hard. Other suppliers and private wells are separate systems. A test is the only way to know the number at your tap.",
      },
      {
        q: "Will a softener remove chlorine, iron, or PFAS?",
        a: "No. Chlorine is a carbon-filter job. PFAS reduction belongs on certified drinking-water equipment. Low levels of clear-water iron can sometimes be handled by a softener, but staining and sulfur need their own treatment. The iron and sulfur page covers that.",
      },
    ],
    emphasis: "hardness",
    related: ["hard-water", "whole-home-water-filtration", "reverse-osmosis"],
    formOption: "Water softener",
  },
  {
    slug: "reverse-osmosis",
    name: "Reverse osmosis systems",
    shortName: "Reverse osmosis",
    icon: "BeakerIcon",
    keyword: "reverse osmosis system",
    description:
      "Reverse osmosis drinking water in {city}, OH. Under-sink RO for cooking and drinking, specified with NSF/ANSI 58 certification in mind. Free water test first.",
    h1: "Reverse osmosis systems in {city}, Ohio",
    lede: "Reverse osmosis is a drinking-water system, usually under the kitchen sink. It is how you get a separate tap for cooking and drinking when you want fewer dissolved solids than {utility} sends to the rest of the house.",
    sections: [
      {
        heading: "What RO is for",
        paragraphs: [
          "A typical under-sink system is sediment and carbon, then a membrane, then a storage tank and a small faucet. Look for NSF/ANSI 58 certification. That standard is a specific reduction list, not a slogan. Many certified membranes remove the large majority of total dissolved solids. We will not promise a percentage the equipment sheet does not back up.",
          "RO is a poor whole-home hardness solution. It wastes some water to the drain, and treating every shower that way is the wrong tool. Pair it with a softener or a whole-home filter only when those problems show up on the test.",
        ],
      },
      {
        heading: "Lead, PFAS, and taste",
        paragraphs: [
          "People in {city} usually ask about RO for taste, TDS, lead in older plumbing, or PFAS. Columbus reports a 2023 lead 90th percentile of 1.3 ppb at the sites it sampled, with none of those 50 sites over the action level. That is not a test of your pipes. If lead is the worry, say so and we will talk about a lab sample, not a field hardness kit.",
          "For PFAS, use equipment certified for PFAS reduction (NSF/ANSI 53 or 58 with that claim). A softener does not remove PFAS. The city's own PFAS page is the record for the Columbus supply. Other utilities publish their own reports.",
        ],
      },
    ],
    included: [
      "A look at TDS and whatever else you are actually trying to reduce",
      "Under-sink RO with a dedicated faucet, or a line to the refrigerator if the kitchen allows it",
      "Equipment chosen against NSF/ANSI 58, including PFAS claims when that is the goal",
      "An honest note about drain water and filter changes",
    ],
    faqs: [
      {
        q: "Can reverse osmosis replace a softener in {city}?",
        a: "No. RO treats the water you drink. A softener treats hardness for the whole house. They solve different problems and are often installed together.",
      },
      {
        q: "Is RO the same as bottled water?",
        a: "It is the usual home alternative to buying jugs. Quality depends on the membrane, the prefilters, and whether the unit is certified for the contaminants you care about. A test tells us whether you need it.",
      },
    ],
    emphasis: "drinking",
    related: ["pfas-drinking-water", "whole-home-water-filtration", "water-testing"],
    formOption: "Reverse osmosis",
  },
  {
    slug: "well-water",
    name: "Well water filtration",
    shortName: "Well water treatment",
    icon: "GearIcon",
    keyword: "well water filtration",
    description:
      "Well water filtration in {city}, OH and nearby townships. Iron, sulfur, hardness, sediment, and when a lab test for bacteria or nitrate is the right next step.",
    h1: "Well water filtration in {city}, Ohio",
    lede: "Private wells do not get a consumer confidence report. If your {city} house is on a well, you are the water system. Treatment starts with what is in that well, not with the Columbus plant averages.",
    sections: [
      {
        heading: "City water and well water are different problems",
        paragraphs: [
          "Most of built-out Columbus is on public water. Wells show up on larger lots, older parcels, and township ground around {city}. Ohio's private water systems are overseen by the Ohio Department of Health and the local health department. There is no utility adding chlorine for you unless you add disinfection yourself.",
          "The usual nuisance complaints in central Ohio groundwater are hardness, iron, manganese, sediment, and hydrogen sulfide, the rotten-egg smell. Health tests are a separate list. ODH points private-well owners toward coliform bacteria and nitrate, among other contaminants. A free in-home visit can check hardness, iron, TDS, and odor. It is not a certified bacteria or nitrate lab report, and we will say so.",
        ],
      },
      {
        heading: "Treatment follows the test",
        paragraphs: [
          "Sediment, iron, sulfur, and hardness rarely share one piece of equipment. Oxidizing filters and aeration are common for iron and sulfur. A softener handles hardness and only modest amounts of clear-water iron. UV is for bacteria after the water is clear enough for light to pass. pH sometimes has to be corrected before other equipment will work.",
          "If {utility} already serves the house, you may not need any of this. The visit confirms which supply you are on before anyone talks about a system.",
        ],
      },
    ],
    included: [
      "A check of whether the house is on a well or on public water",
      "Field tests for hardness, iron, TDS, and sulfur odor",
      "A straight answer when the next step is a lab sample, not a filter",
      "Equipment only for the problems the tests show",
    ],
    faqs: [
      {
        q: "Does {city} have a lot of wells?",
        a: "It depends on the street. Fully built cities on public water have very few. Township edges, acreage, and older parcels around {city} still have them. We do not guess from the ZIP code alone.",
      },
      {
        q: "Can you test my well for bacteria?",
        a: "The free visit is a field test for treatment decisions: hardness, iron, TDS, and odor. Coliform bacteria, nitrate, lead, and PFAS belong at a certified lab. We will tell you when that is the right sample.",
      },
    ],
    emphasis: "wells",
    related: ["iron-sulfur", "water-softeners", "water-testing"],
    formOption: "Well water treatment",
  },
  {
    slug: "water-testing",
    name: "Free water testing",
    shortName: "Water testing",
    icon: "BeakerIcon",
    keyword: "free water testing",
    description:
      "Free water testing in {city}, OH. An in-home look at hardness, chlorine, TDS, iron, and odor, with a clear line between a field test and a certified lab sample.",
    h1: "Free water testing in {city}, Ohio",
    lede: "The test is the product. We come to the house in {city}, run a field check, and tell you what the numbers mean for {utility} or for a well. You can stop there.",
    sections: [
      {
        heading: "What the free visit measures",
        paragraphs: [
          "Hardness, chlorine presence, total dissolved solids, iron, and whether the water smells like sulfur. Those are the results that decide between a softener, a carbon filter, an iron filter, or nothing.",
          "The visit is not a certified laboratory report. It will not replace a lead sample, a coliform bacteria test, a nitrate test, or a PFAS method 533 or 537.1 sample. If that is the question, we say so instead of pretending a handheld meter answered it.",
        ],
      },
      {
        heading: "How to read a utility report next to a home test",
        paragraphs: [
          "If you are on public water, read that utility's latest consumer confidence report. Columbus publishes plant-by-plant hardness, chlorine, and a lead summary. {utility} may be a different supplier with a different report. The home test tells you what is happening after the water has sat in your plumbing.",
          "Private wells have no report. The home test covers the nuisance side. Your local health department is the path for bacteria and nitrate.",
        ],
      },
    ],
    included: [
      "On-site hardness, chlorine, TDS, iron, and odor check",
      "A plain-language read of the results",
      "A recommendation, including no system if the water does not need one",
      "No obligation to buy anything",
    ],
    faqs: [
      {
        q: "Is the {city} water test actually free?",
        a: "Yes. The visit is free whether or not you install anything. We do not list equipment prices on this site. Any quote happens after the test, at the house.",
      },
      {
        q: "How long does it take?",
        a: "Plan on about half an hour. We test at the tap and walk through the results before we leave.",
      },
    ],
    emphasis: "testing",
    related: ["water-softeners", "well-water", "reverse-osmosis"],
    formOption: "Free water test",
  },
  {
    slug: "hard-water",
    name: "Hard water treatment",
    shortName: "Hard water treatment",
    icon: "DropletIcon",
    keyword: "hard water treatment",
    description:
      "Hard water treatment in {city}, OH. What moderate hardness from a public utility looks like versus well water, and when a softener is the right fix.",
    h1: "Hard water treatment in {city}, Ohio",
    lede: "Hard water is calcium and magnesium. It is the reason soap feels weak and glass dries with spots. In {city}, the number depends on {utility}, and on whether the house is even on that system.",
    sections: [
      {
        heading: "How hard is hard",
        paragraphs: [
          "The U.S. Geological Survey calls 61–120 mg/L moderately hard and 121–180 mg/L hard. Columbus says it softens finished water to about 120 ppm, about 7 grains per gallon, and calls that moderately hard. Plant averages in the 2025 report sit between 5.7 and 7.3 grains. That is a public-supply number. Wells in limestone and glacial deposits around central Ohio are often harder, and we will not invent a grains figure for a well we have not tested.",
          "Symptoms are ordinary and annoying: white scale on shower doors, crust in the kettle, film on skin, and a water heater that fills with sediment. None of those symptoms prove a health violation. They are a comfort and equipment problem.",
        ],
      },
      {
        heading: "Treatment that matches the mineral",
        paragraphs: [
          "Ion exchange is the standard home treatment for hardness. Filters and reverse osmosis do not replace it for whole-home scale. If the test also shows iron or sulfur, those get handled first or alongside the softener so the resin is not asked to do a job it is bad at.",
          "If the hardness reading is already low, we will say you do not need a softener. {city} houses on a supplier that softens more aggressively than Columbus sometimes fall in that group. The meter decides.",
        ],
      },
    ],
    included: [
      "A hardness test reported in grains per gallon",
      "A comparison with what {utility} publishes, when a published figure exists",
      "Softener recommendation only when the number justifies it",
      "A note on salt, regeneration, and residual hardness",
    ],
    faqs: [
      {
        q: "Is {city} water considered hard?",
        a: "If you are on Columbus water, the city itself calls the finished supply moderately hard, around 7 grains per gallon. Other utilities and wells need their own answer. The location page for {city} says which supplier we are talking about.",
      },
      {
        q: "Can a filter fix hard water?",
        a: "A carbon or sediment filter will not. Hardness minerals need ion exchange, or a drinking-water membrane if you only care about one tap. Whole-home scale is a softener.",
      },
    ],
    emphasis: "hardness",
    related: ["water-softeners", "water-testing", "iron-sulfur"],
    formOption: "Hard water",
  },
  {
    slug: "iron-sulfur",
    name: "Iron and sulfur removal",
    shortName: "Iron and sulfur removal",
    icon: "WavesIcon",
    keyword: "iron and sulfur water filter",
    description:
      "Iron and sulfur water treatment in {city}, OH. Orange staining and rotten-egg odor are usually well-water problems. City finished water is a different story.",
    h1: "Iron and sulfur water treatment in {city}, Ohio",
    lede: "Orange stains and a rotten-egg smell are classic groundwater complaints. On Columbus finished water they are uncommon. In and around {city}, the first question is whether the house is on {utility} or on a well.",
    sections: [
      {
        heading: "Iron",
        paragraphs: [
          "The Ohio Department of Health notes that iron is common in groundwater. The federal secondary standard is 0.3 mg/L, a taste and staining guideline, not a health maximum. Clear-water (ferrous) iron is invisible until it hits air and turns rust-colored. That is the staining on fixtures, laundry, and sidewalks.",
          "Columbus lists iron as not detected in its 2025 finished-water averages. If a {city} house on city water is staining, we look at the plumbing and the water heater before we blame the utility. Wells are the usual source of real iron.",
        ],
      },
      {
        heading: "Sulfur",
        paragraphs: [
          "Hydrogen sulfide is the rotten-egg gas. It is a different problem from iron and needs its own treatment, often aeration or an oxidizing filter. A softener is not a sulfur filter. Carbon can pick up some odor and then exhaust quickly if the gas is strong.",
          "We do not publish a count of how many {county} wells have sulfur. Smell at the tap, plus an iron and hardness test, is enough to choose a direction. Bacteria can also produce sulfur odors, which is one more reason a lab test belongs in the conversation when the smell is sudden or the well is old.",
        ],
      },
    ],
    included: [
      "Iron and odor check at the tap",
      "A distinction between city-water staining and well water",
      "Oxidizing filtration or aeration when sulfur or high iron is the problem",
      "No softener sold as a cure for rotten-egg smell",
    ],
    faqs: [
      {
        q: "Why is my {city} water orange?",
        a: "On a public supply, a one-time rusty flush is often a water-main disturbance or old galvanized pipe. Persistent orange water, especially on a well, is dissolved iron. We test before recommending a filter.",
      },
      {
        q: "Will a water softener remove sulfur?",
        a: "No. Sulfur gas needs oxidation or a filter built for it. A softener can handle limited clear-water iron and will ignore a rotten-egg smell.",
      },
    ],
    emphasis: "iron",
    related: ["well-water", "water-softeners", "water-testing"],
    formOption: "Iron or sulfur",
  },
  {
    slug: "pfas-drinking-water",
    name: "PFAS and drinking-water treatment",
    shortName: "PFAS drinking-water treatment",
    icon: "ShieldIcon",
    keyword: "PFAS water filter",
    description:
      "PFAS drinking-water filters in {city}, OH. What Columbus has published, what a private well owner should know, and which certifications actually cover PFAS reduction.",
    h1: "PFAS water filters in {city}, Ohio",
    lede: "PFAS are a large family of manufactured chemicals. A useful {city} conversation starts with your supplier's published results, or with a proper well sample, and ends with equipment certified for the reduction you want. We will not invent a parts-per-trillion number for your tap.",
    sections: [
      {
        heading: "What Columbus has said",
        paragraphs: [
          "Columbus Water & Power says it has tested for PFAS since 2019, that some compounds have been detected at very low levels near the detection limit, and that those results would meet the federal drinking-water standards. U.S. EPA finalized standards for six PFAS in April 2024. Required monitoring begins in 2027 and compliance is due in 2029. The city's PFAS page is the place to read the current tables.",
          "If {utility} is not Columbus, those sentences do not describe your water. Ask that utility for its consumer confidence report. Private wells are not required to test for PFAS. The Ohio Department of Health encourages well owners who are concerned to use a trained sampler and a lab method built for PFAS, because the chemicals are easy to contaminate a sample with.",
        ],
      },
      {
        heading: "Treatment that is actually certified",
        paragraphs: [
          "Look for NSF/ANSI 53 or NSF/ANSI 58 with a PFAS reduction claim. Reverse osmosis and some carbon filters carry that certification. A water softener does not. A whole-home carbon tank is not automatically a PFAS system unless the manufacturer has certified it for that reduction.",
          "Point-of-use treatment at the kitchen tap is the practical choice for drinking and cooking. We still start with a water test and a look at the utility report so the filter matches a reason, not a headline.",
        ],
      },
    ],
    included: [
      "A read of what your supplier has published, when one exists",
      "A clear split between a field test and a PFAS lab sample",
      "Point-of-use equipment with a PFAS certification when reduction is the goal",
      "No claim that a softener or a generic carbon block solves PFAS",
    ],
    faqs: [
      {
        q: "Does {city} water contain PFAS?",
        a: "We will not answer that with a number that is not on your utility's report. Columbus has published low-level detections and says its results would meet the federal standards. Other suppliers and wells are separate. Bring the question to the test and we will look at the right report.",
      },
      {
        q: "Is bottled water the only option?",
        a: "No. A certified reverse osmosis or carbon system at the kitchen sink is the usual home treatment for drinking and cooking water. Certification is the part that matters.",
      },
    ],
    emphasis: "pfas",
    related: ["reverse-osmosis", "water-testing", "whole-home-water-filtration"],
    formOption: "PFAS / drinking water",
  },
];

export function getService(slug: string): ServiceRecord | undefined {
  return services.find((s) => s.slug === slug);
}
