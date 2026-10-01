import Link from "next/link";
import { pageH1 } from "@/data/copy";
import { countyHubPages, serviceHubs } from "@/data/dataset";
import { site, nav } from "@/lib/site";
import { DropletIcon, MailIcon, ClockIcon } from "./Icons";
import PhoneLink from "./PhoneLink";

export default function Footer() {
  const services = serviceHubs();
  const counties = countyHubPages();
  return (
    <footer className="bg-brand-950 text-brand-100">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                <DropletIcon className="h-6 w-6" />
              </span>
              <span className="text-base font-bold text-white">{site.name}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-brand-200">
              Free in-home water tests for Columbus and central Ohio. Taste,
              scale, and well-water problems. City water is treated to meet
              safety standards.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white">
              Company
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-brand-200 hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/free-water-test/" className="text-brand-200 hover:text-white">
                  Free water test
                </Link>
              </li>
              <li>
                <Link href="/columbus-water-quality/" className="text-brand-200 hover:text-white">
                  Water quality
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white">
              Services
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.map((service) => (
                <li key={service.path}>
                  <Link href={service.path} className="text-brand-200 hover:text-white">
                    {pageH1(service).replace(/ in Columbus, Ohio$/, "")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white">
              Counties
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {counties.map((county) => (
                <li key={county.path}>
                  <Link href={county.path} className="text-brand-200 hover:text-white">
                    {county.county}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/service-area/" className="text-white underline">
                  All places
                </Link>
              </li>
            </ul>
            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <PhoneLink className="text-brand-200 hover:text-white" />
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2 text-brand-200 hover:text-white"
                >
                  <MailIcon className="h-4 w-4 text-teal-accent" />
                  {site.email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-brand-200">
                <ClockIcon className="h-4 w-4 text-teal-accent" />
                {site.hours.display}
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-12 border-t border-white/10 pt-6 text-xs text-brand-300">
          © {new Date().getFullYear()} {site.name}. Service-area business. No published street address.
        </p>
      </div>
    </footer>
  );
}
