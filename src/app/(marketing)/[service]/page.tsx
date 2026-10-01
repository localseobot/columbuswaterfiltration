import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GeneratedPage from "@/components/catalog/GeneratedPage";
import { buildPageModel } from "@/data/copy";
import { getPage, singleSegmentPages } from "@/data/dataset";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return singleSegmentPages()
    .filter((page) => page.serviceSlug && page.path !== "/service-area/")
    .map((page) => ({ service: page.serviceSlug as string }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}): Promise<Metadata> {
  const { service } = await params;
  const page = getPage(`/${service}/`);
  if (!page) return {};
  const model = buildPageModel(page);
  return pageMetadata({
    title: model.title,
    description: model.description,
    path: page.path,
    index: page.indexable,
  });
}

export default async function ServiceHubPage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service } = await params;
  const page = getPage(`/${service}/`);
  if (!page || page.path === "/service-area/") notFound();
  return <GeneratedPage page={page} />;
}
