import type { Metadata } from "next";
import Link from "next/link";
import LeadForm from "@/components/LeadForm";
import PhoneLink from "@/components/PhoneLink";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact Columbus Water Filtration | Free Water Test",
  description: `Contact ${site.name} for a free in-home water test in Columbus and central Ohio. Call ${site.phone} or send a message. ${site.hours.display}.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <section className="bg-water-gradient">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Contact us
          </h1>
          <p className="mt-4 text-lg text-brand-100">
            Call, email, or send the form. We cover Columbus and the cities on
            the service-area page. There is no street address to visit.
          </p>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold text-brand-950">Reach us</h2>
          <dl className="mt-6 space-y-4 text-brand-800">
            <div>
              <dt className="text-sm font-semibold text-brand-950">Phone</dt>
              <dd>
                <PhoneLink className="text-lg font-semibold text-brand-700" />
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-brand-950">Email</dt>
              <dd>
                <a className="text-brand-700" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-brand-950">Hours</dt>
              <dd>{site.hours.display}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-brand-950">Service area</dt>
              <dd>
                Columbus and central Ohio.{" "}
                <Link href="/service-area" className="underline">
                  See cities
                </Link>
                .
              </dd>
            </div>
          </dl>
        </div>
        <LeadForm variant="contact" pagePath="/contact" />
      </section>
    </>
  );
}
