import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GeneratedPage from "@/components/catalog/GeneratedPage";
import { buildPageModel } from "@/data/copy";
import { getPage, neighborhoodPages } from "@/data/dataset";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return neighborhoodPages().map((page) => ({
    neighborhood: page.placeSlug as string,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ neighborhood: string }>;
}): Promise<Metadata> {
  const { neighborhood } = await params;
  const page = getPage(`/service-area/columbus-oh/${neighborhood}/`);
  if (!page) return {};
  const model = buildPageModel(page);
  return pageMetadata({
    title: model.title,
    description: model.description,
    path: page.path,
    index: page.indexable,
  });
}

export default async function NeighborhoodPage({
  params,
}: {
  params: Promise<{ neighborhood: string }>;
}) {
  const { neighborhood } = await params;
  const page = getPage(`/service-area/columbus-oh/${neighborhood}/`);
  if (!page) notFound();
  return <GeneratedPage page={page} />;
}
