import type { Metadata } from "next";
import { site } from "@/lib/site";
import LeadForm from "@/components/LeadForm";
import { PhoneIcon, MailIcon, MapPinIcon, ClockIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Contact Us | Columbus Water Filtration",
  description:
    "Contact Columbus Water Filtration for whole home water systems, softeners, and reverse osmosis. Call (614) 490-2100 or send a message. Serving Columbus and surrounding areas.",
  alternates: { canonical: "/contact" },
};

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Columbus Water Filtration",
  url: `${site.url}/contact`,
  mainEntity: {
    "@type": "LocalBusiness",
    name: site.name,
    telephone: site.phone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
    },
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />

      {/* Hero */}
      <section className="bg-water-gradient">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-200">
            Contact us
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Let&apos;s get you better water
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-brand-100">
            Have a question or ready to book your free water test? Reach out and
            our Columbus team will get right back to you.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-5">
          {/* Info */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold tracking-tight text-brand-950">
              Get in touch
            </h2>
            <p className="mt-3 text-base leading-relaxed text-brand-700">
              We&apos;re here to help six days a week. Call us for the fastest
              response, or send a message and we&apos;ll reply within one
              business day.
            </p>

            <ul className="mt-8 space-y-6">
              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <PhoneIcon className="h-6 w-6" />
                </span>
                <div>
                  <span className="block text-sm font-semibold text-brand-950">
                    Phone
                  </span>
                  <a
                    href={site.phoneHref}
                    className="text-base text-brand-700 hover:text-brand-600"
                  >
                    {site.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <MailIcon className="h-6 w-6" />
                </span>
                <div>
                  <span className="block text-sm font-semibold text-brand-950">
                    Email
                  </span>
                  <a
                    href={`mailto:${site.email}`}
                    className="text-base text-brand-700 hover:text-brand-600"
                  >
                    {site.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <MapPinIcon className="h-6 w-6" />
                </span>
                <div>
                  <span className="block text-sm font-semibold text-brand-950">
                    Office
                  </span>
                  <span className="text-base text-brand-700">
                    {site.address.street}
                    <br />
                    {site.address.city}, {site.address.state}{" "}
                    {site.address.zip}
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <ClockIcon className="h-6 w-6" />
                </span>
                <div>
                  <span className="block text-sm font-semibold text-brand-950">
                    Hours
                  </span>
                  <span className="text-base text-brand-700">{site.hours}</span>
                </div>
              </li>
            </ul>

            <div className="mt-8 rounded-2xl border border-brand-100 bg-brand-50/60 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-900">
                Service area
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-700">
                Proudly serving Columbus and surrounding communities including
                Dublin, Westerville, Hilliard, Powell, Gahanna, New Albany, Grove
                City, Worthington, Upper Arlington, Delaware, and more.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold tracking-tight text-brand-950">
              Send us a message
            </h2>
            <p className="mt-3 text-base leading-relaxed text-brand-700">
              Fill out the form below and we&apos;ll be in touch shortly.
            </p>
            <div className="mt-6">
              <LeadForm variant="contact" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
