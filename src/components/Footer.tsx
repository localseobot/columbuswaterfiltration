import Link from "next/link";
import { site, nav } from "@/lib/site";
import {
  DropletIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  ClockIcon,
} from "./Icons";

const services = [
  { href: "/services#whole-home", label: "Whole Home Filtration" },
  { href: "/services#softeners", label: "Water Softeners" },
  { href: "/services#reverse-osmosis", label: "Reverse Osmosis" },
  { href: "/services#well-water", label: "Well Water Treatment" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-950 text-brand-100">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                <DropletIcon className="h-6 w-6" />
              </span>
              <span className="leading-tight">
                <span className="block text-base font-bold text-white">
                  Columbus Water
                </span>
                <span className="block text-xs font-medium uppercase tracking-[0.16em] text-teal-accent">
                  Filtration
                </span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-brand-200">
              Cleaner, safer, better-tasting water for homes across Columbus and
              central Ohio. Locally owned and operated.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-brand-200 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/free-water-test"
                  className="text-brand-200 transition-colors hover:text-white"
                >
                  Free Water Test
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Services
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="text-brand-200 transition-colors hover:text-white"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Get In Touch
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={site.phoneHref}
                  className="flex items-center gap-2.5 text-brand-200 transition-colors hover:text-white"
                >
                  <PhoneIcon className="h-4 w-4 shrink-0 text-teal-accent" />
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-2.5 text-brand-200 transition-colors hover:text-white"
                >
                  <MailIcon className="h-4 w-4 shrink-0 text-teal-accent" />
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-brand-200">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-teal-accent" />
                <span>
                  {site.address.street}
                  <br />
                  {site.address.city}, {site.address.state} {site.address.zip}
                </span>
              </li>
              <li className="flex items-center gap-2.5 text-brand-200">
                <ClockIcon className="h-4 w-4 shrink-0 text-teal-accent" />
                {site.hours}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-brand-300 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <p>
            Proudly serving Columbus, OH &amp; surrounding communities · Licensed
            &amp; insured
          </p>
        </div>
      </div>
    </footer>
  );
}
