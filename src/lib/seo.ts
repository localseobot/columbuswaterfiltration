import type { Metadata } from "next";
import { indexablePages } from "@/data/dataset";
import { site } from "./site";

/** Indexable cities and counties only. Neighborhoods stay on their own pages. */
export function areaServedPlaces(only?: { name: string; kind?: string }) {
  if (only) {
    return [
      {
        "@type": only.kind === "county" ? "AdministrativeArea" : "City",
        name: only.name.includes("County") ? only.name : `${only.name}, ${site.area.state}`,
      },
    ];
  }
  const places = indexablePages().filter(
    (page) => page.pageType === "location-hub" || page.pageType === "county-hub",
  );
  return [
    { "@type": "City", name: `${site.area.city}, ${site.area.state}` },
    ...places.map((page) => ({
      "@type": page.pageType === "county-hub" ? "AdministrativeArea" : "City",
      name: page.pageType === "county-hub" ? page.county : `${page.locationName}, ${site.area.state}`,
    })),
  ];
}

export function pageMetadata({
  title,
  description,
  path,
  index = true,
}: {
  title: string;
  description: string;
  path: string;
  index?: boolean;
}): Metadata {
  const canonical = path === "/" ? "/" : path.endsWith("/") ? path : `${path}/`;
  const url = canonical === "/" ? site.url : `${site.url}${canonical}`;
  return {
    title: { absolute: title },
    description,
    robots: index ? { index: true, follow: true } : { index: false, follow: true },
    alternates: { canonical },
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
  area?: { name: string; kind?: string };
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
