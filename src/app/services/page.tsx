import Link from "next/link";
import type { Metadata } from "next";
import { services, steps } from "@/lib/content";
import { site } from "@/lib/site";
import { Icon, ArrowRightIcon, CheckIcon } from "@/components/Icons";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Water Filtration Services in Columbus, OH",
  description:
    "Whole home water filtration, water softeners, reverse osmosis drinking water, and well water treatment for Columbus, Ohio homes. Free water testing and professional installation.",
  alternates: { canonical: "/services" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: services.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Service",
      name: s.name,
      description: s.short,
      areaServed: `${site.address.city}, ${site.address.state}`,
      provider: { "@type": "LocalBusiness", name: site.name },
    },
  })),
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Hero */}
      <section className="bg-water-gradient">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-200">
            Our services
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Water treatment solutions for every home
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-brand-100">
            From whole home filtration to custom well water systems, we design
            and install the right solution for your water — backed by a free,
            professional in-home test.
          </p>
        </div>
      </section>

      {/* Quick nav */}
      <section className="border-b border-brand-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 px-4 py-5 sm:px-6">
          {services.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-full border border-brand-200 px-4 py-2 text-sm font-medium text-brand-800 transition-colors hover:border-brand-400 hover:bg-brand-50"
            >
              {s.name}
            </a>
          ))}
        </div>
      </section>

      {/* Service detail blocks */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {services.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            className="scroll-mt-24 border-b border-brand-100 py-16 last:border-0"
          >
            <div
              className={`grid items-center gap-10 lg:grid-cols-2 ${
                i % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div>
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-water-gradient text-white">
                  <Icon name={s.icon} className="h-8 w-8" />
                </span>
                <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-teal-accent">
                  {s.tagline}
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand-950">
                  {s.name}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-brand-700">
                  {s.short}
                </p>
                <Link
                  href="/free-water-test"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                >
                  Get a free water test
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>

              <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-8 shadow-card">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-900">
                  What&apos;s included
                </h3>
                <ul className="mt-5 space-y-4">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                        <CheckIcon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-medium text-brand-900">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Process */}
      <section className="bg-water-soft py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-accent">
              Our process
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-950 sm:text-4xl">
              Simple, honest, and done right
            </h2>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-brand-100 bg-white p-7 shadow-card"
              >
                <span className="text-3xl font-bold text-teal-accent">
                  {step.number}
                </span>
                <h3 className="mt-3 text-lg font-bold text-brand-950">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-700">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Not sure which system you need?"
        subtitle="That's exactly what our free water test is for. We'll test your water, explain the results in plain English, and recommend the right solution — with no pressure."
      />
    </>
  );
}
