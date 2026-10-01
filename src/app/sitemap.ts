import type { MetadataRoute } from "next";
import { catalogPaths } from "@/data/catalog";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return catalogPaths().map((route) => ({
    url: route.path === "/" ? site.url : `${site.url}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
