import { site } from "@/lib/site";
import { columbusSupply, sources } from "@/lib/water-facts";
import {
  getLocation,
  hardnessCopy,
  locations,
  type LocationRecord,
} from "./locations";
import { getService, services, type ServiceRecord } from "./services";

export type PageVars = {
  city: string;
  county: string;
  utility: string;
  region: string;
};

export function varsFor(location?: LocationRecord): PageVars {
  if (!location) {
    return {
      city: "Columbus",
      county: "Franklin",
      utility: "Columbus Water & Power",
      region: "central Ohio",
    };
  }
  return {
    city: location.name,
    county: location.county,
    utility: location.utility,
    region: "central Ohio",
  };
}

export function fill(template: string, location?: LocationRecord): string {
  const v = varsFor(location);
  return template
    .replaceAll("{city}", v.city)
    .replaceAll("{county}", v.county)
    .replaceAll("{utility}", v.utility)
    .replaceAll("{region}", v.region);
}

export type CatalogPath = {
  path: string;
  priority: number;
  changeFrequency: "weekly" | "monthly";
};

/** Every indexable URL derived from the data files. Sitemap reads this. */
export function catalogPaths(): CatalogPath[] {
  const paths: CatalogPath[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/service-area", priority: 0.8, changeFrequency: "monthly" },
    { path: "/free-water-test", priority: 0.9, changeFrequency: "monthly" },
    { path: "/about", priority: 0.5, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  ];
  for (const service of services) {
    paths.push({
      path: `/services/${service.slug}`,
      priority: 0.8,
      changeFrequency: "monthly",
    });
    for (const location of locations) {
      paths.push({
        path: `/services/${service.slug}/${location.slug}`,
        priority: 0.6,
        changeFrequency: "monthly",
      });
    }
  }
  for (const location of locations) {
    paths.push({
      path: `/service-area/${location.slug}`,
      priority: 0.7,
      changeFrequency: "monthly",
    });
  }
  return paths;
}

export function serviceParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function locationParams() {
  return locations.map((l) => ({ slug: l.slug }));
}

export function comboParams() {
  return services.flatMap((s) =>
    locations.map((l) => ({ slug: s.slug, location: l.slug })),
  );
}

export function hardnessStatement(location: LocationRecord): {
  text: string;
  source: { label: string; href: string } | null;
} {
  if (location.hardnessKey) {
    const cited = hardnessCopy[location.hardnessKey];
    return {
      text: `${cited.text} ${location.hardnessNote}`,
      source: cited.source,
    };
  }
  return {
    text: location.hardnessNote,
    source: null,
  };
}

const wellSentence: Record<LocationRecord["wellLikelihood"], string> = {
  rare: "Private wells are rare here. Almost every house is on the public supply, so iron and sulfur equipment is usually the wrong starting point.",
  some: "Most streets are on public water. Wells show up on the edges and on older parcels the mains never reached. We confirm which one you have before talking about equipment.",
  common: "Private wells are common outside the newer subdivisions. Iron, sulfur, and hardness on those wells are a different job from whatever the public supplier delivers in town.",
};

/** Local module for a service × city page. Built only from that location's facts. */
export function localServiceParagraphs(
  service: ServiceRecord,
  location: LocationRecord,
): string[] {
  const hard = hardnessStatement(location);
  const places = location.nearbyPlaces.join(", ");
  const zips = location.zips.join(", ");
  const paragraphs = [
    `${location.name} is in ${location.county} County. Water service is ${location.utility}. ${location.utilityDetail}`,
    hard.text,
    wellSentence[location.wellLikelihood],
    `ZIP codes for ${location.name} include ${zips}. Landmarks people use to describe the area: ${places}.`,
  ];

  if (service.emphasis === "hardness") {
    paragraphs.push(
      location.hardnessKey
        ? `A softener in ${location.name} is about finishing what the utility already started, or about scale in older heaters. It is not a guess from a statewide map.`
        : `Because ${location.name} is not on a Columbus plant we are willing to cite, a softener here starts with a hardness test. Borrowing a Columbus grains number would be the wrong quote.`,
    );
  } else if (service.emphasis === "chlorine") {
    paragraphs.push(
      location.hardnessKey
        ? `${columbusSupply.chlorine} That residual is why whole-home carbon comes up in ${location.name}. It will not soften the water.`
        : `${location.utility} disinfects its own way. Do not assume the Columbus chlorine residual applies in ${location.name}. The test includes a chlorine check.`,
    );
  } else if (service.emphasis === "wells" || service.emphasis === "iron") {
    paragraphs.push(
      location.wellLikelihood === "rare"
        ? `If a ${location.name} house on city water is staining orange, look at the plumbing and the water heater before assuming a well-water iron filter. ${columbusSupply.iron}`
        : `${location.notes[0]} Persistent orange water or a rotten-egg smell is a groundwater problem. ${columbusSupply.iron}`,
    );
  } else if (service.emphasis === "pfas" || service.emphasis === "drinking") {
    paragraphs.push(
      location.hardnessKey
        ? `${columbusSupply.pfas} A kitchen reverse osmosis system is the point-of-use option when someone in ${location.name} wants extra reduction for cooking and drinking. A softener does not do that job.`
        : `${location.utility} publishes its own water report. Columbus PFAS statements do not transfer. For a private well, a PFAS sample is a lab job, not a handheld meter.`,
    );
  } else {
    paragraphs.push(
      `The free visit in ${location.name} checks hardness, chlorine, TDS, iron, and odor. It is the right first step on ${location.utility}. It is not a certified lab report for bacteria, nitrate, lead, or PFAS.`,
    );
  }

  paragraphs.push(location.notes[location.notes.length - 1]);
  return paragraphs;
}

export function formOptions(): string[] {
  const opts = services.map((s) => s.formOption);
  if (!opts.includes("Not sure")) opts.push("Not sure");
  return opts;
}

export function defaultFormOption(service?: ServiceRecord): string {
  return service?.formOption ?? "Free water test";
}

export type { LocationRecord } from "./locations";
export type { ServiceRecord } from "./services";
export { getLocation, getService, locations, services, site, sources, columbusSupply };
