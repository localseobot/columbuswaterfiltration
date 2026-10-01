import Link from "next/link";
import { locations } from "@/data/locations";
import { services } from "@/data/services";
import { columbusSupply, sources } from "@/lib/water-facts";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import LeadForm from "@/components/LeadForm";
import PhoneLink from "@/components/PhoneLink";
import { Icon, ArrowRightIcon, CheckIcon, DropletIcon } from "@/components/Icons";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata({
  title: "Water Filtration in Columbus, OH | Whole Home Systems & Softeners",
  description:
    "Whole-home water filtration, water softeners, and reverse osmosis for Columbus, Ohio. Free in-home water test. City water is moderately hard — about 7 grains per gallon after the utility softens it.",
  path: "/",
});

const checks = [
  "Hardness, in grains per gallon",
  "Chlorine and odor",
  "Iron and sulfur, if you are on a well",
  "Total dissolved solids",
];

const steps = [
  {
    number: "01",
    title: "Free water test",
    body: "We test at the house: hardness, chlorine, TDS, iron, and odor. The visit is free if you do not buy anything.",
  },
  {
    number: "02",
    title: "A straight recommendation",
    body: "Softener, carbon filter, reverse osmosis, well treatment, or nothing. The test decides. We do not list prices on this site.",
  },
  {
    number: "03",
    title: "Install at the house",
    body: "The system goes in at the house, usually in one visit, and you get a walkthrough of what it does and what it does not do.",
  },
  {
    number: "04",
    title: "Someone local to call",
    body: "Filter changes and questions stay with the same service area. Hours and the phone number are on every page.",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-water-gradient">
        <div className="relative mx-auto grid max-w-6xl items-start gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-brand-100 ring-1 ring-white/20">
              <DropletIcon className="h-4 w-4" />
              Serving Columbus and central Ohio
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl">
              Whole-home water filtration in Columbus, Ohio
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-brand-100">
              Softeners, reverse osmosis, and well-water systems for houses on
              Columbus water and on private wells. Start with a free test.{" "}
              {site.hours.display}.
            </p>
            <div className="mt-6">
              <PhoneLink
                prefix="Or call"
                className="inline-flex items-center text-base font-semibold text-white underline decoration-white/40"
              />
            </div>
            <ul className="mt-8 space-y-2 text-sm text-brand-100">
              {checks.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-teal-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <LeadForm variant="hero" pagePath="/" />
        </div>
      </section>

      <section className="bg-water-soft py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-brand-950">
            What Columbus water is actually like
          </h2>
          <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-brand-800">
            <p>{columbusSupply.overview}</p>
            <p>{columbusSupply.hardnessIntro}</p>
            <p>{columbusSupply.scale}</p>
            <p>{columbusSupply.chlorine}</p>
          </div>
          <p className="mt-4 text-sm text-brand-600">
            Sources:{" "}
            <a className="underline" href={sources.hardness.href}>
              {sources.hardness.label}
            </a>
            {" · "}
            <a className="underline" href={sources.ccr2025.href}>
              {sources.ccr2025.label}
            </a>
          </p>
          <Link
            href="/services/hard-water"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-700"
          >
            Hard water treatment
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-bold tracking-tight text-brand-950">
              Services
            </h2>
            <Link href="/services" className="text-sm font-semibold text-brand-700">
              All services
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="flex gap-4 rounded-2xl border border-brand-100 bg-white p-6 shadow-card hover:border-brand-300"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-water-gradient text-white">
                  <Icon name={service.icon} className="h-7 w-7" />
                </span>
                <span>
                  <span className="block font-bold text-brand-950">{service.name}</span>
                  <span className="mt-1 block text-sm text-brand-700">
                    {service.keyword} in Columbus, OH
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-950 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-white">How a visit works</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number}>
                <span className="text-3xl font-bold text-teal-accent">{step.number}</span>
                <h3 className="mt-2 text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-200">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-bold tracking-tight text-brand-950">
              Cities we cover
            </h2>
            <Link href="/service-area" className="text-sm font-semibold text-brand-700">
              Full service area
            </Link>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2">
            {locations.map((loc) => (
              <li key={loc.slug}>
                <Link
                  href={`/service-area/${loc.slug}`}
                  className="inline-block rounded-full border border-brand-200 px-4 py-2 text-sm text-brand-800 hover:bg-brand-50"
                >
                  {loc.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
