import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/lib/site";
import { services, benefits, testimonials, steps } from "@/lib/content";
import {
  Icon,
  ArrowRightIcon,
  PhoneIcon,
  CheckIcon,
  StarIcon,
  DropletIcon,
} from "@/components/Icons";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Water Filtration in Columbus, OH | Whole Home Systems & Softeners",
  description:
    "Columbus Water Filtration installs whole home filtration systems, water softeners, and reverse osmosis for homes across central Ohio. Book your free in-home water test today.",
  alternates: { canonical: "/" },
};

const heroStats = [
  { value: "2,500+", label: "Homes served" },
  { value: "4.9★", label: "Avg. rating" },
  { value: "100%", label: "Free water tests" },
];

const heroChecklist = [
  "Hardness & mineral content",
  "Chlorine, chloramine & odors",
  "Iron, sulfur & staining (well water)",
  "Total dissolved solids (TDS)",
  "pH balance & overall quality",
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-water-gradient">
        <div className="absolute inset-0 opacity-20">
          <svg
            className="h-full w-full"
            preserveAspectRatio="none"
            viewBox="0 0 1200 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M0 400c150-40 300-40 450 0s300 40 450 0 300-40 300-40v240H0V400Z"
              fill="#fff"
              fillOpacity="0.08"
            />
            <path
              d="M0 460c150-40 300-40 450 0s300 40 450 0 300-40 300-40v180H0V460Z"
              fill="#fff"
              fillOpacity="0.08"
            />
          </svg>
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-brand-100 ring-1 ring-white/20">
              <DropletIcon className="h-4 w-4" />
              Locally owned · Serving Columbus &amp; central Ohio
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl">
              Clean, healthy water for your whole home
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-brand-100">
              Columbus&apos; trusted experts in whole home filtration, water
              softeners, and reverse osmosis. Find out exactly what&apos;s in
              your water with a free, no-obligation in-home test.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/free-water-test"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-brand-800 shadow-lg transition-transform hover:-translate-y-0.5"
              >
                Get a Free Water Test
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <a
                href={site.phoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
              >
                <PhoneIcon className="h-5 w-5" />
                {site.phone}
              </a>
            </div>

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-2xl font-bold text-white">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-xs font-medium uppercase tracking-wide text-brand-200">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Card */}
          <div className="relative">
            <div className="rounded-3xl bg-white/95 p-7 shadow-2xl ring-1 ring-white/50 backdrop-blur sm:p-8">
              <h2 className="text-lg font-bold text-brand-950">
                What we&apos;ll check in your free test
              </h2>
              <ul className="mt-5 space-y-3.5">
                {heroChecklist.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                      <CheckIcon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium text-brand-900">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/free-water-test"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
              >
                Book your free test
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-brand-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 py-6 text-sm font-medium text-brand-700 sm:px-6">
          <span className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 text-teal-accent" /> Licensed &amp;
            insured
          </span>
          <span className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 text-teal-accent" /> Free in-home
            testing
          </span>
          <span className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 text-teal-accent" /> Financing
            available
          </span>
          <span className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 text-teal-accent" /> Satisfaction
            guaranteed
          </span>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-water-soft py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-accent">
              Why filter your water
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-950 sm:text-4xl">
              The benefits you&apos;ll feel every day
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-700">
              From softer skin to longer-lasting appliances, better water
              improves nearly every part of your home.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-brand-100 bg-white p-7 shadow-card transition-transform hover:-translate-y-1"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon name={b.icon} className="h-7 w-7" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-brand-950">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-700">
                  {b.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services overview */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-end justify-between gap-6 sm:flex-row">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-accent">
                Our services
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-950 sm:text-4xl">
                Complete water solutions for your home
              </h2>
              <p className="mt-4 text-base leading-relaxed text-brand-700">
                Whether you&apos;re on city water or a private well, we have the
                right system to fix your water problems for good.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              View all services
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {services.map((s) => (
              <Link
                key={s.id}
                href={`/services#${s.id}`}
                className="group flex gap-5 rounded-2xl border border-brand-100 bg-white p-7 shadow-card transition-all hover:border-brand-200 hover:shadow-lg"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-water-gradient text-white">
                  <Icon name={s.icon} className="h-8 w-8" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-brand-950">{s.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-700">
                    {s.short}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 group-hover:gap-2.5">
                    Learn more
                    <ArrowRightIcon className="h-4 w-4 transition-all" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-brand-950 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-accent">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Better water in four simple steps
            </h2>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number}>
                <span className="text-4xl font-bold text-teal-accent">
                  {step.number}
                </span>
                <h3 className="mt-3 text-lg font-bold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-200">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-water-soft py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-accent">
              Trusted by your neighbors
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-950 sm:text-4xl">
              What Columbus homeowners are saying
            </h2>
            <div className="mt-4 flex items-center justify-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className="h-5 w-5 text-amber-400" />
              ))}
              <span className="ml-2 text-sm font-semibold text-brand-800">
                {site.rating.value} from {site.rating.count} reviews
              </span>
            </div>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col rounded-2xl border border-brand-100 bg-white p-7 shadow-card"
              >
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4 text-amber-400" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-brand-800">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 border-t border-brand-100 pt-4">
                  <span className="block text-sm font-bold text-brand-950">
                    {t.name}
                  </span>
                  <span className="block text-xs text-brand-600">
                    {t.location}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
