import Link from "next/link";
import type { Metadata } from "next";
import LeadForm from "@/components/LeadForm";
import PhoneLink from "@/components/PhoneLink";
import { serviceHubs } from "@/data/dataset";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { ArrowRightIcon } from "@/components/Icons";

export const metadata: Metadata = pageMetadata({
  title: "Water Treatment in Columbus, Ohio | Free In-Home Test",
  description:
    "Water treatment in Columbus, Ohio. Softeners, whole-house filters, and reverse osmosis sized from a free in-home test. Columbus already softens to about 7 grains per gallon.",
  path: "/",
});

const checks = [
  "Hardness, in grains per gallon",
  "Chlorine taste and odor",
  "Iron and sulfur on a well",
  "Total dissolved solids",
];

export default function HomePage() {
  const services = serviceHubs();
  return (
    <>
      <section className="bg-water-gradient">
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-200">
              Columbus and central Ohio
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Water treatment in Columbus, Ohio
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-brand-100">
              Columbus Water &amp; Power already softens tap water to about 7
              grains per gallon and says a home filter is not required for
              safety. We test at the house for taste, scale, and the occasional
              well, then recommend a softener, a filter, reverse osmosis, or
              nothing.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-brand-50">
              {checks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-brand-100">
              Prefer to call? <PhoneLink className="font-semibold text-white underline" />
            </p>
          </div>
          <LeadForm variant="hero" pagePath="/" />
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-brand-950">
          What the 2025 Columbus report actually says
        </h2>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-brand-800">
          <p>
            Three plants serve the city. Dublin Road (Scioto River) averaged
            7.3 grains per gallon in 2025, Hap Cremean (Hoover Reservoir) 5.7,
            and Parsons Avenue (wells) 7.2. The system summary is 115 mg/L.
            The city calls that moderately hard.
          </p>
          <p>
            Nitrate ran higher at Dublin Road, where the utility added anion
            exchange. Lead’s 2023 90th percentile was 1.3 ppb, with none of 50
            sites over the action level. PFAS results the city publishes are
            low-level detections, and the city says they would meet the
            standards it cites. None of that is a reason to imply the water is
            unsafe.
          </p>
          <p>
            <Link href="/columbus-water-hardness/" className="font-semibold text-brand-700 underline">
              Hardness by plant
            </Link>
            {" · "}
            <Link href="/columbus-water-quality/" className="font-semibold text-brand-700 underline">
              Water quality report
            </Link>
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {services.map((service) => (
            <Link
              key={service.path}
              href={service.path}
              className="rounded-2xl border border-brand-100 bg-white p-5 shadow-card hover:border-brand-300"
            >
              <span className="flex items-center justify-between gap-3 text-base font-bold text-brand-950">
                {service.primaryKw}
                <ArrowRightIcon className="h-4 w-4 shrink-0 text-brand-600" />
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-10 text-sm text-brand-700">
          City, village, and neighborhood pages are grouped by county on the{" "}
          <Link href="/service-area/" className="font-semibold underline">
            service area
          </Link>
          . Each one uses that place’s supplier and hardness, or says the
          supplier is not confirmed.
        </p>
      </section>
      <section className="bg-brand-950 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold">How a visit works</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            <li>
              <p className="text-lg font-bold">1. Free water test</p>
              <p className="mt-2 text-sm leading-relaxed text-brand-100">
                Hardness, chlorine, TDS, iron, and odor at the house. No prices on this site.
              </p>
            </li>
            <li>
              <p className="text-lg font-bold">2. A straight recommendation</p>
              <p className="mt-2 text-sm leading-relaxed text-brand-100">
                Softener, filter, reverse osmosis, well treatment, or nothing. The test decides.
              </p>
            </li>
            <li>
              <p className="text-lg font-bold">3. Install at the house</p>
              <p className="mt-2 text-sm leading-relaxed text-brand-100">
                {site.hours.display}. There is no showroom address.
              </p>
            </li>
          </ol>
        </div>
      </section>
    </>
  );
}
