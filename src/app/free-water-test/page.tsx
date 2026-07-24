import type { Metadata } from "next";
import { site } from "@/lib/site";
import LeadForm from "@/components/LeadForm";
import { Icon, CheckIcon, StarIcon, PhoneIcon, BeakerIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Free In-Home Water Test in Columbus, OH | Book Today",
  description:
    "Book your free, no-obligation in-home water test in Columbus, OH. We'll test your water on the spot and show you exactly what's in it. Schedule online in seconds.",
  alternates: { canonical: "/free-water-test" },
  robots: { index: true, follow: true },
};

const included = [
  "Complete on-site water analysis",
  "Hardness, chlorine & TDS testing",
  "Iron, sulfur & staining check (wells)",
  "Plain-English explanation of results",
  "Personalized recommendations",
  "Upfront pricing — zero obligation",
];

const assurances = [
  {
    icon: "ClockIcon" as const,
    title: "Takes about 30 minutes",
    body: "A quick, convenient appointment at a time that works for you.",
  },
  {
    icon: "BeakerIcon" as const,
    title: "Real, on-the-spot results",
    body: "See exactly what's in your water — no samples mailed to a lab.",
  },
  {
    icon: "ShieldIcon" as const,
    title: "No pressure, ever",
    body: "Just honest information. The test is free whether you buy or not.",
  },
];

export default function FreeWaterTestPage() {
  return (
    <section className="relative overflow-hidden bg-water-gradient">
      <div className="absolute inset-0 opacity-15" aria-hidden="true">
        <svg
          className="h-full w-full"
          preserveAspectRatio="none"
          viewBox="0 0 1200 800"
          fill="none"
        >
          <path
            d="M0 500c150-40 300-40 450 0s300 40 450 0 300-40 300-40v340H0V500Z"
            fill="#fff"
            fillOpacity="0.08"
          />
        </svg>
      </div>

      <div className="relative mx-auto grid max-w-6xl items-start gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2">
        {/* Left: pitch */}
        <div className="text-white">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-brand-100 ring-1 ring-white/20">
            <BeakerIcon className="h-4 w-4" />
            100% free · No obligation
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
            Get your free in-home water test
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-brand-100">
            Find out exactly what&apos;s in your Columbus water. Our specialist
            comes to you, tests your water on the spot, and shows you the results
            — completely free, with no pressure to buy anything.
          </p>

          <div className="mt-8 rounded-2xl bg-white/10 p-6 ring-1 ring-white/15">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-100">
              Your free test includes
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-accent text-white">
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm font-medium text-white">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className="h-5 w-5 text-amber-300" />
              ))}
              <span className="ml-1 text-sm font-semibold text-white">
                {site.rating.value}/5 · {site.rating.count} reviews
              </span>
            </div>
            <a
              href={site.phoneHref}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-brand-100"
            >
              <PhoneIcon className="h-5 w-5" />
              Prefer to call? {site.phone}
            </a>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {assurances.map((a) => (
              <div key={a.title} className="rounded-xl bg-white/5 p-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-teal-accent">
                  <Icon name={a.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-3 text-sm font-bold text-white">{a.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-brand-200">
                  {a.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: form */}
        <div className="lg:sticky lg:top-24">
          <div className="rounded-3xl bg-white p-2 shadow-2xl">
            <div className="rounded-[1.25rem] bg-white p-4 sm:p-5">
              <div className="mb-4 text-center">
                <h2 className="text-xl font-bold text-brand-950">
                  Book your free water test
                </h2>
                <p className="mt-1 text-sm text-brand-600">
                  Takes less than a minute to request.
                </p>
              </div>
              <LeadForm variant="test" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
