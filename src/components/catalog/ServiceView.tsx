import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqList from "@/components/FaqList";
import JsonLd from "@/components/JsonLd";
import LeadForm from "@/components/LeadForm";
import SourcesList from "@/components/SourcesList";
import { locationsByCounty } from "@/data/locations";
import {
  defaultFormOption,
  fill,
  sources,
  type ServiceRecord,
} from "@/data/catalog";
import { serviceJsonLd } from "@/lib/seo";

export default function ServiceView({ service }: { service: ServiceRecord }) {
  const groups = locationsByCounty();
  const faqs = service.faqs.map((f) => ({
    q: fill(f.q),
    a: fill(f.a),
  }));
  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: service.name,
          description: fill(service.description),
          path: `/services/${service.slug}`,
        })}
      />
      <div className="border-b border-brand-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <Breadcrumbs
            items={[
              { name: "Services", path: "/services" },
              { name: service.shortName, path: `/services/${service.slug}` },
            ]}
          />
        </div>
      </div>
      <section className="bg-water-gradient">
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-200">
              Columbus and central Ohio
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {fill(service.h1)}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-brand-100">
              {fill(service.lede)}
            </p>
          </div>
          <LeadForm
            variant="hero"
            defaultService={defaultFormOption(service)}
            pagePath={`/services/${service.slug}`}
          />
        </div>
      </section>
      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            {service.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-bold tracking-tight text-brand-950">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-800">
                  {section.paragraphs.map((p) => (
                    <p key={p}>{fill(p)}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <aside className="rounded-2xl border border-brand-100 bg-brand-50/60 p-6 h-fit">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-900">
              What the visit covers
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-brand-800">
              {service.included.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
        <FaqList faqs={faqs} />
        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-brand-950">
            {service.shortName} by city
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-brand-700">
            Each city page uses that place&apos;s water supplier, hardness note,
            ZIP codes, and local conditions. The shared explanation above is the
            same. The local facts are not.
          </p>
          <div className="mt-8 space-y-8">
            {groups.map((group) => (
              <div key={group.county}>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-teal-accent">
                  {group.county} County
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {group.locations.map((loc) => (
                    <li key={loc.slug}>
                      <Link
                        href={`/services/${service.slug}/${loc.slug}`}
                        className="inline-block rounded-full border border-brand-200 px-4 py-2 text-sm font-medium text-brand-800 hover:border-brand-400 hover:bg-brand-50"
                      >
                        {loc.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
        <SourcesList items={[sources.ccr2025, sources.hardness, sources.odh, sources.pfas]} />
      </article>
    </>
  );
}
