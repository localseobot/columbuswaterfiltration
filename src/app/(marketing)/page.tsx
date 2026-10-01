import Link from "next/link";
import type { Metadata } from "next";
import LeadForm from "@/components/LeadForm";
import PhoneLink from "@/components/PhoneLink";
import Photo, { photoExists } from "@/components/Photo";
import Skyline from "@/components/Skyline";
import { allPages, serviceHubs } from "@/data/dataset";
import { photos } from "@/lib/photos";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { ArrowRightIcon } from "@/components/Icons";

export const metadata: Metadata = pageMetadata({
  title: "Water Treatment in Columbus, Ohio | Free In-Home Test",
  description:
    "Water treatment in Columbus, Ohio. Softeners, whole-house filters, and reverse osmosis sized from a free in-home test. Columbus already softens to about 7 grains per gallon.",
  path: "/",
});

/** Neighborhoods and suburbs shown in the "Around Columbus" strip, in rough north-to-south order. */
const localPlaces = [
  "Worthington",
  "Westerville",
  "Dublin",
  "Clintonville",
  "Upper Arlington",
  "Short North",
  "Victorian Village",
  "Grandview Heights",
  "Gahanna",
  "Bexley",
  "German Village",
  "Hilliard",
  "Canal Winchester",
];

function localLinks() {
  const pages = allPages();
  return localPlaces.flatMap((name) => {
    const page = pages.find(
      (p) =>
        !p.serviceSlug &&
        p.indexable &&
        p.locationName === name &&
        (p.pageType === "neighborhood" || p.pageType === "location-hub"),
    );
    return page ? [{ name, href: page.path }] : [];
  });
}

const checks = [
  "Hardness, in grains per gallon",
  "Chlorine taste and odor",
  "Iron and sulfur on a well",
  "Total dissolved solids",
];

export default function HomePage() {
  const services = serviceHubs();
  const places = localLinks();
  const hasPeoplePhotos = photoExists(photos.technician) || photoExists(photos.kitchen);
  return (
    <>
      <section className="relative overflow-hidden bg-water-gradient">
        <Skyline className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full text-white/[0.07] sm:h-32" />
        <div className="relative mx-auto grid max-w-6xl items-start gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-200">
              Serving the 614 · Columbus and central Ohio
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
      <section className="bg-cream py-16">
        <div
          className={`mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 ${
            hasPeoplePhotos ? "lg:grid-cols-2" : ""
          }`}
        >
          {hasPeoplePhotos && (
            <div className="grid grid-cols-5 gap-3">
              <Photo
                photo={photos.technician}
                className="col-span-3 aspect-[4/5] rounded-2xl shadow-card"
                sizes="(min-width: 1024px) 30vw, 60vw"
              />
              <Photo
                photo={photos.kitchen}
                className="col-span-2 mt-12 aspect-[3/4] rounded-2xl shadow-card"
                sizes="(min-width: 1024px) 20vw, 40vw"
              />
            </div>
          )}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brick">
              At your kitchen sink
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-950">
              A person at the house, not a showroom
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-brand-800">
              <p>
                Someone comes to your house, runs the water, and tests it in
                front of you. You see the hardness number and the chlorine
                reading yourself, and you can ask whatever you want.
              </p>
              <p>
                Whether it is a brick double in German Village, a ranch in
                Hilliard, or a farmhouse on a well out past Delaware, the
                answer comes from your water, not a package deal.
              </p>
            </div>
            <Link
              href="/free-water-test/"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brick px-6 py-3 text-sm font-semibold text-white hover:bg-[#962f23]"
            >
              Book a free water test
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brick">
              Around Columbus
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-950">
              Your neighborhood, your water
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-800">
              Most of the city drinks from the Scioto, Hoover Reservoir, or the
              south-side wells. The suburbs and the countryside around them can
              be on a different supplier entirely. Pick your area to see what
              comes out of the tap there.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {places.map((place) => (
                <li key={place.href}>
                  <Link
                    href={place.href}
                    className="inline-block rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-900 hover:border-brick hover:text-brick"
                  >
                    {place.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/service-area/"
                  className="inline-block rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white"
                >
                  All areas
                </Link>
              </li>
            </ul>
          </div>
          <Photo
            photo={photos.skyline}
            className="aspect-[4/3] rounded-2xl shadow-card lg:col-span-2"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
        </div>
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
