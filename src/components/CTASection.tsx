import Link from "next/link";
import { site } from "@/lib/site";
import { PhoneIcon, ArrowRightIcon } from "./Icons";

type Props = {
  title?: string;
  subtitle?: string;
};

export default function CTASection({
  title = "Ready for cleaner, healthier water?",
  subtitle = "Schedule your free in-home water test today. No pressure, no obligation — just a clear picture of what's in your water and the best way to fix it.",
}: Props) {
  return (
    <section className="bg-water-gradient">
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-brand-100">
          {subtitle}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/free-water-test"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-brand-800 shadow-lg transition-transform hover:-translate-y-0.5"
          >
            Get a Free Water Test
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
          <a
            href={site.phoneHref}
            className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
          >
            <PhoneIcon className="h-5 w-5" />
            {site.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
