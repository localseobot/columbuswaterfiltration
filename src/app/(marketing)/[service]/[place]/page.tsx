import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GeneratedPage from "@/components/catalog/GeneratedPage";
import { buildPageModel } from "@/data/copy";
import { getPage, servicePlacePages } from "@/data/dataset";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return servicePlacePages().map((page) => ({
    service: page.serviceSlug as string,
    place: page.placeSlug as string,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string; place: string }>;
}): Promise<Metadata> {
  const { service, place } = await params;
  const record = getPage(`/${service}/${place}/`);
  if (!record) return {};
  const model = buildPageModel(record);
  return pageMetadata({
    title: model.title,
    description: model.description,
    path: record.path,
    index: record.indexable,
  });
}

export default async function ServicePlacePage({
  params,
}: {
  params: Promise<{ service: string; place: string }>;
}) {
  const { service, place } = await params;
  const record = getPage(`/${service}/${place}/`);
  if (!record) notFound();
  return <GeneratedPage page={record} />;
}
