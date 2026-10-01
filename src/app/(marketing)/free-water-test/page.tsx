import type { Metadata } from "next";
import LeadForm from "@/components/LeadForm";
import PhoneLink from "@/components/PhoneLink";
import { CheckIcon, BeakerIcon } from "@/components/Icons";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Free Water Test in Columbus, OH | In-Home Hardness & Iron Check",
  description:
    "Book a free in-home water test in Columbus, Ohio. Hardness, chlorine, TDS, iron, and odor on the spot. Not a certified lab sample for bacteria or PFAS.",
  path: "/free-water-test",
});

const included = [
  "Hardness in grains per gallon",
  "Chlorine and smell",
  "Total dissolved solids",
  "Iron and sulfur odor, including wells",
  "A plain explanation",
  "No obligation to buy a system",
];

export default function FreeWaterTestPage() {
  return (
    <section className="bg-water-gradient">
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
        <div className="text-white">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-brand-100 ring-1 ring-white/20">
            <BeakerIcon className="h-4 w-4" />
            Free · No obligation
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            Free water testing in Columbus, Ohio
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-brand-100">
            We come to the house, test the water, and tell you what it means.
            The visit is a field test for treatment decisions. It is not a
            certified laboratory report.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-teal-accent" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm">
            Prefer to call? <PhoneLink className="font-semibold underline" />
          </p>
        </div>
        <LeadForm variant="hero" pagePath="/free-water-test" />
      </div>
    </section>
  );
}
