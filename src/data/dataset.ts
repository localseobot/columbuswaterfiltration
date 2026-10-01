import fs from "node:fs";
import path from "node:path";
import { parseCsv } from "./csv";

export type Place = {
  name: string;
  type: string;
  parent: string;
  population: number | null;
  populationSource: string;
  utility: string;
  sourceNote: string;
  hardness: string;
  hardnessUrl: string;
  utilityUrl: string;
  zips: string[];
  /** False when zips_source is an approximation. Those ZIPs must not be shown. */
  zipsDisplay: boolean;
  slug: string;
  lat: number | null;
  lon: number | null;
  miles: number | null;
  countyNames: string[];
};

export type CatalogPage = {
  path: string;
  pageType: string;
  tier: string;
  cluster: string;
  locationName: string;
  county: string;
  primaryKw: string;
  kwBasis: string;
  utilityVerified: "yes" | "no" | "n/a";
  hardnessVerified: "yes" | "no" | "n/a";
  indexable: boolean;
  gate: string;
  /** First URL segment for service routes. Null for home and /service-area/ pages. */
  serviceSlug: string | null;
  placeSlug: string | null;
};

const COLUMBUS_NOTE_MARKER = "3 plants: Dublin Road";

function readData(name: string): string {
  return fs.readFileSync(path.join(process.cwd(), "data", name), "utf8");
}

function flag(value: string): "yes" | "no" | "n/a" {
  if (value === "yes" || value === "no") return value;
  return "n/a";
}

function withSlash(url: string): string {
  if (url === "/") return "/";
  return url.endsWith("/") ? url : `${url}/`;
}

function loadPlaces(): Place[] {
  return parseCsv(readData("locations.csv")).map((row) => {
    const pop = Number(row.population);
    const lat = Number(row.lat);
    const lon = Number(row.lon);
    const miles = Number(row.miles_from_downtown);
    const zipsSource = row.zips_source || "";
    return {
      name: row.name,
      type: row.type,
      parent: row.parent_or_county,
      population: Number.isFinite(pop) && pop > 0 ? pop : null,
      populationSource: row.population_source,
      utility: row.water_utility.trim(),
      sourceNote: row.water_source_note.trim(),
      hardness: row.hardness_value.trim(),
      hardnessUrl: row.hardness_source_url.trim(),
      utilityUrl: row.utility_source_url.trim(),
      zips: row.zips.split(/\s+/).filter(Boolean),
      zipsDisplay: zipsSource.length > 0 && !zipsSource.toLowerCase().startsWith("approx"),
      slug: row.slug,
      lat: Number.isFinite(lat) ? lat : null,
      lon: Number.isFinite(lon) ? lon : null,
      miles: Number.isFinite(miles) ? miles : null,
      countyNames: (row.parent_or_county.match(/[A-Za-z .]+ County/g) || []).map((c) =>
        c.trim(),
      ),
    };
  });
}

function loadPages(): CatalogPage[] {
  return parseCsv(readData("page_matrix.csv")).map((row) => {
    const pathName = withSlash(row.url);
    const parts = pathName.split("/").filter(Boolean);
    const serviceSlug =
      parts.length >= 1 && parts[0] !== "service-area" ? parts[0] : null;
    let placeSlug: string | null = null;
    if (row.page_type === "neighborhood") placeSlug = parts[2] || null;
    else if (
      row.page_type === "location-hub" ||
      row.page_type === "county-hub" ||
      row.page_type === "service-x-location" ||
      row.page_type === "service-x-county"
    ) {
      placeSlug = parts[parts.length - 1] || null;
    }
    return {
      path: pathName,
      pageType: row.page_type,
      tier: row.tier,
      cluster: row.cluster,
      locationName: row.location,
      county: row.county,
      primaryKw: row.primary_kw,
      kwBasis: row.kw_basis,
      utilityVerified: flag(row.water_utility_verified),
      hardnessVerified: flag(row.hardness_verified),
      indexable: row.publish_gate === "ok",
      gate: row.publish_gate,
      serviceSlug,
      placeSlug,
    };
  });
}

const places = loadPlaces();
const pages = loadPages();

const placeBySlugMap = new Map(places.map((p) => [p.slug, p]));
const placeByNameMap = new Map(places.map((p) => [p.name, p]));
const pageByPathMap = new Map(pages.map((p) => [p.path, p]));

export function allPlaces(): Place[] {
  return places;
}

export function allPages(): CatalogPage[] {
  return pages;
}

export function indexablePages(): CatalogPage[] {
  return pages.filter((p) => p.indexable);
}

export function getPage(pathName: string): CatalogPage | undefined {
  return pageByPathMap.get(withSlash(pathName));
}

export function getPlace(slug: string): Place | undefined {
  return placeBySlugMap.get(slug);
}

export function getPlaceByName(name: string): Place | undefined {
  return placeByNameMap.get(name);
}

export function pagesForService(serviceSlug: string): CatalogPage[] {
  return pages.filter((p) => p.serviceSlug === serviceSlug && p.placeSlug);
}

export function locationHubs(): CatalogPage[] {
  return pages.filter((p) => p.pageType === "location-hub" || p.pageType === "county-hub");
}

export function serviceHubs(): CatalogPage[] {
  return pages.filter((p) => p.pageType === "service-hub" || p.pageType === "guide-hub");
}

export function isColumbusSupply(place: Place): boolean {
  return /Columbus Water/i.test(place.utility);
}

export function usesSharedColumbusNote(place: Place): boolean {
  return place.sourceNote.includes(COLUMBUS_NOTE_MARKER);
}

function toRad(n: number): number {
  return (n * Math.PI) / 180;
}

export function milesBetween(a: Place, b: Place): number | null {
  if (a.lat == null || a.lon == null || b.lat == null || b.lon == null) return null;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 3958.8 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/** 3–5 nearest places that have a location page in the same tier. */
export function nearbyHubs(place: Place, tier: string, limit = 4): { place: Place; page: CatalogPage; miles: number }[] {
  const hubs = pages.filter(
    (p) => p.pageType === "location-hub" && p.tier === tier && p.placeSlug && p.placeSlug !== place.slug,
  );
  const ranked = hubs
    .map((page) => {
      const other = page.placeSlug ? getPlace(page.placeSlug) : undefined;
      if (!other) return null;
      const miles = milesBetween(place, other);
      if (miles == null) return null;
      return { place: other, page, miles };
    })
    .filter((row): row is { place: Place; page: CatalogPage; miles: number } => Boolean(row))
    .sort((a, b) => a.miles - b.miles);
  return ranked.slice(0, limit);
}

export function nearbyNeighborhoods(place: Place, limit = 4): { place: Place; page: CatalogPage; miles: number }[] {
  const hubs = pages.filter((p) => p.pageType === "neighborhood" && p.placeSlug !== place.slug);
  return hubs
    .map((page) => {
      const other = page.placeSlug ? getPlace(page.placeSlug) : undefined;
      if (!other) return null;
      const miles = milesBetween(place, other);
      if (miles == null) return null;
      return { place: other, page, miles };
    })
    .filter((row): row is { place: Place; page: CatalogPage; miles: number } => Boolean(row))
    .sort((a, b) => a.miles - b.miles)
    .slice(0, limit);
}

export function placesInCounty(county: string): Place[] {
  const needle = county.toLowerCase();
  return places.filter((p) => p.parent.toLowerCase().includes(needle) || p.countyNames.some((c) => c.toLowerCase() === needle));
}

export function pagesInCounty(county: string): CatalogPage[] {
  return pages.filter((p) => p.county === county && p.pageType === "location-hub");
}

export function neighborhoodPages(): CatalogPage[] {
  return pages.filter((p) => p.pageType === "neighborhood");
}

export function countyHubPages(): CatalogPage[] {
  return pages.filter((p) => p.pageType === "county-hub");
}

export function singleSegmentPages(): CatalogPage[] {
  return pages.filter((p) => {
    const parts = p.path.split("/").filter(Boolean);
    return parts.length === 1;
  });
}

export function servicePlacePages(): CatalogPage[] {
  return pages.filter(
    (p) => p.pageType === "service-x-location" || p.pageType === "service-x-county",
  );
}

export function formatPop(n: number): string {
  return n.toLocaleString("en-US");
}

export function displayZips(place: Place): string[] {
  return place.zipsDisplay ? place.zips : [];
}
