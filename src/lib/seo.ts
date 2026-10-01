import type { Metadata } from "next";
import { locations, type LocationRecord } from "@/data/locations";
import { site } from "./site";

function schemaPlace(location: LocationRecord) {
  const type =
    location.kind === "neighborhood"
      ? "Neighborhood"
      : location.kind === "township"
        ? "AdministrativeArea"
        : "City";
  return { "@type": type, name: `${location.name}, ${site.area.state}` };
}

/** Columbus plus every row in the location catalog. */
export function areaServedPlaces(only?: LocationRecord) {
  if (only) return [schemaPlace(only)];
  return [
    { "@type": "City", name: `${site.area.city}, ${site.area.state}` },
    ...locations.map(schemaPlace),
  ];
}

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = path === "/" ? site.url : `${site.url}${path}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path === "/" ? "/" : path },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: site.name,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function businessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${site.url}/#business`,
    name: site.name,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    description: site.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.area.city,
      addressRegion: site.area.state,
      addressCountry: "US",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [...site.hours.days],
      opens: site.hours.opens,
      closes: site.hours.closes,
    },
    areaServed: areaServedPlaces(),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.path === "/" ? site.url : `${site.url}${item.path}`,
    })),
  };
}

export function serviceJsonLd(service: {
  name: string;
  description: string;
  path: string;
  area?: LocationRecord;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: `${site.url}${service.path}`,
    serviceType: service.name,
    areaServed: areaServedPlaces(service.area),
    provider: { "@id": `${site.url}/#business` },
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}
