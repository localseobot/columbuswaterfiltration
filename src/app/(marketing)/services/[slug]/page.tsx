import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceView from "@/components/catalog/ServiceView";
import { fill, getService, serviceParams } from "@/data/catalog";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return serviceParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return pageMetadata({
    title: `${fill(service.h1)} | Columbus Water Filtration`,
    description: fill(service.description),
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  return <ServiceView service={service} />;
}
