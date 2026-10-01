import type { Metadata } from "next";
import Link from "next/link";
import { locationsByCounty } from "@/data/locations";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Water Filtration Service Area | Columbus and Central Ohio",
  description:
    "Cities, suburbs, and townships where Columbus Water Filtration schedules free in-home water tests. Each page lists the local water supplier, hardness notes, and ZIP codes.",
  path: "/service-area",
});

export default function ServiceAreaPage() {
  const groups = locationsByCounty();
  return (
    <>
      <section className="bg-water-gradient">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-200">
            Service area
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Columbus and central Ohio
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-brand-100">
            We test water at the house. The supplier, the hardness, and whether
            a street is on a well change from town to town. Pick a place to see
            the facts we are willing to cite.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-16 sm:px-6">
        {groups.map((group) => (
          <section key={group.county}>
            <h2 className="text-2xl font-bold text-brand-950">
              {group.county} County
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {group.locations.map((loc) => (
                <li key={loc.slug}>
                  <Link
                    href={`/service-area/${loc.slug}`}
                    className="block h-full rounded-2xl border border-brand-100 bg-white p-6 shadow-card hover:border-brand-300"
                  >
                    <span className="text-lg font-bold text-brand-950">
                      {loc.name}
                    </span>
                    <span className="mt-2 block text-sm leading-relaxed text-brand-700">
                      {loc.utility}. ZIP {loc.zips.join(", ")}.
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
