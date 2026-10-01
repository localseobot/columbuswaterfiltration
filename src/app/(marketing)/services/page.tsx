import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/data/services";
import { Icon } from "@/components/Icons";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Water Filtration Services in Columbus, OH",
  description:
    "Whole-home filtration, water softeners, reverse osmosis, well water treatment, iron and sulfur removal, and free water testing for Columbus and central Ohio.",
  path: "/services",
});

export default function ServicesIndexPage() {
  return (
    <>
      <section className="bg-water-gradient">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-200">
            Services
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Water treatment for Columbus homes
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-brand-100">
            Each service has its own page, and each city has a version of that
            page with the local water supplier and hardness notes. Start with
            the problem, or start with a free test if you are not sure.
          </p>
        </div>
      </section>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-2">
        {services.map((service) => (
          <Link
            key={service.slug}
            href={`/services/${service.slug}`}
            className="flex gap-5 rounded-2xl border border-brand-100 bg-white p-7 shadow-card hover:border-brand-300"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-water-gradient text-white">
              <Icon name={service.icon} className="h-8 w-8" />
            </span>
            <span>
              <span className="block text-lg font-bold text-brand-950">
                {service.name}
              </span>
              <span className="mt-1.5 block text-sm leading-relaxed text-brand-700">
                {service.keyword} in Columbus and nearby cities.
              </span>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
