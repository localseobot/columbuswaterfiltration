import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Icon, CheckIcon } from "@/components/Icons";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "About Us | Local Water Filtration Experts in Columbus, OH",
  description:
    "Columbus Water Filtration is a locally owned water treatment company serving Columbus and central Ohio. Learn our story and why homeowners trust us for clean water.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    icon: "BeakerIcon" as const,
    title: "Testing, not guessing",
    body: "Every recommendation starts with a real water test. We diagnose your water before we ever talk about a system.",
  },
  {
    icon: "ShieldIcon" as const,
    title: "Honest advice",
    body: "No high-pressure sales, no scare tactics. We recommend what your water actually needs — and nothing it doesn't.",
  },
  {
    icon: "GearIcon" as const,
    title: "Quality installations",
    body: "Licensed, insured technicians and premium equipment mean your system is installed to last and built to perform.",
  },
  {
    icon: "PhoneIcon" as const,
    title: "Local support",
    body: "We live and work here in central Ohio. When you need service or have a question, you're talking to a neighbor.",
  },
];

const reasons = [
  "Locally owned and operated in Columbus",
  "Free, no-obligation in-home water testing",
  "Licensed, insured, and background-checked technicians",
  "Premium, NSF-certified filtration equipment",
  "Transparent pricing with financing options",
  "Satisfaction guarantee on every installation",
  "Ongoing maintenance and filter replacement",
  "Hundreds of 5-star reviews from local homeowners",
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-water-gradient">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-200">
            About us
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Central Ohio&apos;s water is our specialty
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-brand-100">
            We&apos;re a local team on a simple mission: give every home in
            Columbus cleaner, safer, better water — with honest advice and
            expert installation.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-brand-950">
              Our story
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-brand-700">
              <p>
                Columbus Water Filtration was founded by local homeowners who
                got tired of hard water spots, chlorine taste, and the endless
                cost of bottled water. After seeing how much of a difference the
                right filtration system made in their own homes, they set out to
                bring that same clean water to families across central Ohio.
              </p>
              <p>
                Central Ohio has some of the hardest water in the Midwest, and
                homes on private wells face their own challenges — iron,
                sulfur, sediment, and more. We know this water because we live
                with it too. That local knowledge lets us diagnose problems
                quickly and recommend systems that actually solve them.
              </p>
              <p>
                Today we&apos;ve helped thousands of Columbus-area households
                enjoy cleaner, softer, better-tasting water. But our approach
                hasn&apos;t changed: test first, explain honestly, install
                right, and stand behind our work.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon name={v.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-base font-bold text-brand-950">
                  {v.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-brand-700">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-water-soft py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-accent">
                Why choose us
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-950 sm:text-4xl">
                The trusted choice for Columbus homeowners
              </h2>
              <p className="mt-4 text-base leading-relaxed text-brand-700">
                We combine premium equipment, expert installation, and genuinely
                local service. Here&apos;s what you can expect when you work with
                us.
              </p>
            </div>
            <ul className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {reasons.map((r) => (
                <li key={r} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-brand-900">
                    {r}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Service area */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-accent">
              Where we work
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-950 sm:text-4xl">
              Proudly serving Columbus &amp; central Ohio
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-700">
              We provide free water testing, installation, and service
              throughout the greater Columbus area, including:
            </p>
          </div>
          <div className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3">
            {site.serviceAreas.map((city) => (
              <span
                key={city}
                className="rounded-full border border-brand-100 bg-white px-5 py-2.5 text-sm font-medium text-brand-800 shadow-sm"
              >
                {city}
              </span>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-brand-600">
            Don&apos;t see your town? Give us a call — we likely serve your area
            too.
          </p>
        </div>
      </section>

      <CTASection />
    </>
  );
}
