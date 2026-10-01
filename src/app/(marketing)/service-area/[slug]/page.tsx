import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GeneratedPage from "@/components/catalog/GeneratedPage";
import { buildPageModel } from "@/data/copy";
import { getPage, locationHubs } from "@/data/dataset";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return locationHubs()
    .filter((page) => page.placeSlug && page.placeSlug !== "columbus-oh")
    .map((page) => ({ slug: page.placeSlug as string }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(`/service-area/${slug}/`);
  if (!page) return {};
  const model = buildPageModel(page);
  return pageMetadata({
    title: model.title,
    description: model.description,
    path: page.path,
    index: page.indexable,
  });
}

export default async function LocationHubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getPage(`/service-area/${slug}/`);
  if (!page) notFound();
  return <GeneratedPage page={page} />;
}
