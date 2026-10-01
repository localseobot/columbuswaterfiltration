import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LocationView from "@/components/catalog/LocationView";
import { getLocation, locationParams } from "@/data/catalog";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return locationParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) return {};
  const keywordTitle =
    location.keyword.charAt(0).toUpperCase() + location.keyword.slice(1);
  return pageMetadata({
    title: `${keywordTitle} | Free Water Test`,
    description: `Water filtration, softeners, and reverse osmosis in ${location.name}, Ohio. ${location.utility}. ZIP ${location.zips.join(", ")}. Free in-home water test.`,
    path: `/service-area/${location.slug}`,
  });
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) notFound();
  return <LocationView location={location} />;
}
