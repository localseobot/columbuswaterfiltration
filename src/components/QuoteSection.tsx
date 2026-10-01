import LeadForm from "./LeadForm";
import PhoneLink from "./PhoneLink";
import { site } from "@/lib/site";

export default function QuoteSection() {
  return (
    <section id="quote" className="scroll-mt-20 bg-water-soft py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brick">
            Free water test
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-950 sm:text-4xl">
            Tell us where you are. We will test the water.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-700">
            The visit covers hardness, chlorine, TDS, iron, and odor. You get a
            plain explanation and a recommendation only if the water needs one.
            There is no price list on this site.
          </p>
          <p className="mt-6 text-sm text-brand-800">
            Prefer the phone? Call{" "}
            <PhoneLink className="font-semibold text-brand-700 underline" />.
            <span className="mt-1 block text-brand-600">{site.hours.display}</span>
          </p>
        </div>
        <LeadForm variant="quote" />
      </div>
    </section>
  );
}
