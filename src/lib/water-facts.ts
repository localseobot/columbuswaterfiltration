/**
 * Figures below are copied from public City of Columbus / Ohio sources.
 * Do not add a number here unless it can be checked against the citation.
 */

export const sources = {
  hardness: {
    label: "City of Columbus — Water Hardness",
    href: "https://www.columbus.gov/Services/Columbus-Water-Power/About-Columbus-Water-Power/The-Division-of-Water/Water-Facts/Water-Hardness",
  },
  ccr2025: {
    label: "Columbus Water & Power — 2025 Water for Living report",
    href: "https://www.columbus.gov/files/sharedassets/city/v/8/services/public-utilities/water-reports/consumer-confidence-water-quality-report/consumer-confidence-report.pdf",
  },
  reservoirs: {
    label: "City of Columbus — facts on the drinking-water reservoirs",
    href: "https://www.columbus.gov/files/sharedassets/city/v/3/utilities/documents/water-publications/facts-on-columbus-water-reservoirs-brochure.pdf",
  },
  pfas: {
    label: "City of Columbus — PFAS and drinking water",
    href: "https://www.columbus.gov/Services/Columbus-Water-Power/About-Columbus-Water-Power/The-Division-of-Water/Water-Resources-for-Customers/PFAS-and-Drinking-Water",
  },
  odh: {
    label: "Ohio Department of Health — private water system quality",
    href: "https://odh.ohio.gov/know-our-programs/private-water-systems-program/water-quality-treatment/quality",
  },
  dublin: {
    label: "City of Dublin community plan — water service agreement",
    href: "https://communityplan.dublinohiousa.gov/utilities/municipal-service-agreements",
  },
  delaware: {
    label: "City of Delaware — public utilities",
    href: "https://www.delawareohio.net/government/departments/public-utilities/our-utilities",
  },
  newAlbany: {
    label: "City of New Albany — water and sewers",
    href: "https://newalbanyohio.org/public-service/water-sewers/",
  },
  pickerington: {
    label: "City of Pickerington — 2025 drinking water report",
    href: "https://www.ci.pickerington.oh.us/cdn/CCR-Report-2025-1.pdf",
  },
  delco: {
    label: "Del-Co Water Company — water sources",
    href: "https://delcowater.org/del-cos-water-sources/",
  },
  usgs: {
    label: "USGS — hardness of water",
    href: "https://www.usgs.gov/special-topics/water-science-school/science/hardness-water",
  },
} as const;

export const columbusSupply = {
  overview:
    "Columbus Water & Power treats drinking water at three plants. The Dublin Road plant uses the Scioto River, stored in Griggs and O'Shaughnessy reservoirs, and serves northwestern and southwestern Columbus. The Hap Cremean plant uses Hoover Reservoir on Big Walnut Creek and serves the Ohio State area and northern Columbus. The Parsons Avenue plant pumps groundwater from sand and gravel along the Scioto River valley and serves the southeast.",
  hardnessIntro:
    "The City of Columbus says it softens finished water to about 120 parts per million (about 7 grains per gallon) on average, and calls that moderately hard. The city leaves some hardness in on purpose, because very soft water can corrode home plumbing.",
  dublinRoad:
    "In the 2025 Water for Living report, Dublin Road Water Plant hardness averaged 125 ppm, or 7.3 grains per gallon (range 7.1–7.7).",
  hapCremean:
    "The same report lists Hap Cremean Water Plant hardness at an average of 98 ppm, or 5.7 grains per gallon (range 5.0–6.9).",
  parsons:
    "Parsons Avenue Water Plant hardness averaged 123 ppm, or 7.2 grains per gallon (range 7.1–7.4).",
  scale:
    "The U.S. Geological Survey treats 61–120 mg/L as calcium carbonate as moderately hard and 121–180 mg/L as hard. Columbus finished water sits on that line. It is not soft water, and it is usually not as hard as untreated well water in the limestone and glacial deposits around the city.",
  chlorine:
    "The plants finish disinfection with chlorine. The 2025 report lists total chlorine around 1 to 1.5 ppm depending on the plant. That residual is why a lot of Columbus taps smell like a pool even when the water meets safety standards.",
  iron:
    "Iron in the city's finished-water averages for 2025 is listed as not detected. Orange or brown staining on city water is uncommon and is more often a private-well problem or old household plumbing, not the Columbus supply.",
  lead:
    "The 2025 report's lead figure is from 2023 sampling: the 90th percentile was 1.3 parts per billion, and none of the 50 sites were over the 15 ppb action level. That is a system result, not a test of every house. Older private plumbing can still contribute lead, which is why a house-specific question belongs in a lab test rather than a guess.",
  pfas:
    "Columbus says it has tested source water and the plants for PFAS since 2019, that some compounds have shown up at very low levels near the test's detection limit, and that those results would meet the federal drinking-water standards. U.S. EPA's PFAS rule, finalized in April 2024, starts required monitoring in 2027 and compliance in 2029. We do not publish a parts-per-trillion number here because the city's own tables are the record, and they can change.",
} as const;
