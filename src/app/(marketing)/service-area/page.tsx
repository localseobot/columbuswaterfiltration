import type { Metadata } from "next";
import GeneratedPage from "@/components/catalog/GeneratedPage";
import { getPage } from "@/data/dataset";
import { pageMetadata } from "@/lib/seo";

const page = getPage("/service-area/");

export const metadata: Metadata = pageMetadata({
  title: "Water treatment service area | Central Ohio",
  description:
    "Central Ohio cities, villages, and Columbus neighborhoods where we test water at the house. Supplier and hardness notes come from utility reports.",
  path: "/service-area/",
});

export default function ServiceAreaIndex() {
  if (!page) return null;
  return <GeneratedPage page={page} />;
}
