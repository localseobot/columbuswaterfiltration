import type { MetadataRoute } from "next";
import { indexablePages } from "@/data/dataset";
import { site } from "@/lib/site";

const EXTRA = ["/about/", "/contact/", "/free-water-test/"];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    ...indexablePages().map((page) => page.path),
    ...EXTRA,
  ];
  return routes.map((path) => ({
    url: path === "/" ? `${site.url}/` : `${site.url}${path}`,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.split("/").filter(Boolean).length === 1 ? 0.8 : 0.6,
  }));
}
