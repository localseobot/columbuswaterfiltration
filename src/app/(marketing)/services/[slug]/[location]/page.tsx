import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ComboView from "@/components/catalog/ComboView";
import { comboParams, fill, getLocation, getService } from "@/data/catalog";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return comboParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; location: string }>;
}): Promise<Metadata> {
  const { slug, location: locationSlug } = await params;
  const service = getService(slug);
  const location = getLocation(locationSlug);
  if (!service || !location) return {};
  return pageMetadata({
    title: `${fill(service.h1, location)} | Columbus Water Filtration`,
    description: fill(service.description, location),
    path: `/services/${service.slug}/${location.slug}`,
  });
}

export default async function ComboPage({
  params,
}: {
  params: Promise<{ slug: string; location: string }>;
}) {
  const { slug, location: locationSlug } = await params;
  const service = getService(slug);
  const location = getLocation(locationSlug);
  if (!service || !location) notFound();
  return <ComboView service={service} location={location} />;
}
