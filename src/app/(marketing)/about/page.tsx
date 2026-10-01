import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { columbusSupply, sources } from "@/lib/water-facts";

export const metadata: Metadata = pageMetadata({
  title: "About Columbus Water Filtration | Central Ohio Water Tests",
  description:
    "Columbus Water Filtration schedules free in-home water tests for Columbus and central Ohio. No showroom address. Recommendations follow the test, not a package.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <section className="bg-water-gradient">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-200">
            About
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            A water test, then a system that matches it
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-brand-100">
            {site.name} schedules free in-home water tests for houses in
            Columbus and central Ohio. There is no showroom address. The work
            happens at the house.
          </p>
        </div>
      </section>
      <article className="mx-auto max-w-3xl space-y-6 px-4 py-16 text-base leading-relaxed text-brand-800 sm:px-6">
        <p>
          Columbus water is moderately hard after the utility softens it, and it
          carries a chlorine residual. Private wells around the city are a
          different supply: iron, sulfur, and higher hardness are the usual
          reasons to test them. {columbusSupply.hardnessIntro}
        </p>
        <p>
          The visit checks hardness, chlorine, TDS, iron, and odor. That is
          enough to choose between a softener, a whole-home carbon filter, a
          reverse osmosis drinking-water system, a well-water setup, or no
          equipment. It is not a certified lab report for bacteria, nitrate,
          lead, or PFAS. When those are the question, we say so.
        </p>
        <p>
          We do not publish star ratings, review counts, a license number, or
          years in business on this site. The useful record is your own test
          and your utility&apos;s water report.
        </p>
        <p>
          Hours are {site.hours.display}. Email{" "}
          <a className="underline" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          . The phone number is in the header and can be swapped for a tracking
          line without editing every page.
        </p>
        <p>
          <Link href="/service-area" className="font-semibold text-brand-700 underline">
            See the service area
          </Link>{" "}
          or read the{" "}
          <a className="underline" href={sources.ccr2025.href}>
            2025 Columbus water report
          </a>
          .
        </p>
      </article>
    </>
  );
}
