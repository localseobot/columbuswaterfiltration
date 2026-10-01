import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqList from "@/components/FaqList";
import JsonLd from "@/components/JsonLd";
import LeadForm from "@/components/LeadForm";
import SourcesList from "@/components/SourcesList";
import { getLocation, getService } from "@/data/catalog";
import {
  defaultFormOption,
  fill,
  hardnessStatement,
  localServiceParagraphs,
} from "@/data/catalog";
import type { LocationRecord } from "@/data/locations";
import type { ServiceRecord } from "@/data/services";
import { serviceJsonLd } from "@/lib/seo";

export default function ComboView({
  service,
  location,
}: {
  service: ServiceRecord;
  location: LocationRecord;
}) {
  const path = `/services/${service.slug}/${location.slug}`;
  const local = localServiceParagraphs(service, location);
  const hard = hardnessStatement(location);
  const faqs = service.faqs.map((f) => ({
    q: fill(f.q, location),
    a: fill(f.a, location),
  }));
  const related = service.related
    .map((slug) => getService(slug))
    .filter((s): s is ServiceRecord => Boolean(s));
  const nearby = location.nearby
    .map((slug) => getLocation(slug))
    .filter((l): l is LocationRecord => Boolean(l));

  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: `${service.name} in ${location.name}, OH`,
          description: fill(service.description, location),
          path,
          area: location,
        })}
      />
      <div className="border-b border-brand-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <Breadcrumbs
            items={[
              { name: "Services", path: "/services" },
              { name: service.shortName, path: `/services/${service.slug}` },
              { name: location.name, path },
            ]}
          />
        </div>
      </div>
      <section className="bg-water-gradient">
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-200">
              {location.name}, {location.county} County
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {fill(service.h1, location)}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-brand-100">
              {fill(service.lede, location)}
            </p>
          </div>
          <LeadForm
            variant="hero"
            defaultService={defaultFormOption(service)}
            pagePath={path}
          />
        </div>
      </section>
      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <section>
              <h2 className="text-2xl font-bold tracking-tight text-brand-950">
                Water in {location.name}
              </h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-800">
                {local.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>
            {service.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-bold tracking-tight text-brand-950">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-800">
                  {section.paragraphs.map((p) => (
                    <p key={p}>{fill(p, location)}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <aside className="h-fit rounded-2xl border border-brand-100 bg-brand-50/70 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-900">
              {location.name} facts
            </h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="font-semibold text-brand-950">Utility</dt>
                <dd className="mt-1 text-brand-800">{location.utility}</dd>
              </div>
              <div>
                <dt className="font-semibold text-brand-950">ZIP codes</dt>
                <dd className="mt-1 text-brand-800">{location.zips.join(", ")}</dd>
              </div>
              <div>
                <dt className="font-semibold text-brand-950">Nearby</dt>
                <dd className="mt-1 text-brand-800">
                  {location.nearbyPlaces.join(", ")}
                </dd>
              </div>
            </dl>
            <Link
              href={`/service-area/${location.slug}`}
              className="mt-5 inline-block text-sm font-semibold text-brand-700 underline"
            >
              All water services in {location.name}
            </Link>
          </aside>
        </div>
        <FaqList faqs={faqs} />
        <section className="mt-14 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold text-brand-950">
              Other services in {location.name}
            </h2>
            <ul className="mt-4 space-y-2">
              {related.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}/${location.slug}`}
                    className="text-sm font-medium text-brand-700 hover:text-brand-600"
                  >
                    {s.shortName} in {location.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold text-brand-950">
              {service.shortName} nearby
            </h2>
            <ul className="mt-4 space-y-2">
              {nearby.map((loc) => (
                <li key={loc.slug}>
                  <Link
                    href={`/services/${service.slug}/${loc.slug}`}
                    className="text-sm font-medium text-brand-700 hover:text-brand-600"
                  >
                    {service.shortName} in {loc.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <SourcesList
          items={hard.source ? [...location.sources, hard.source] : location.sources}
        />
      </article>
    </>
  );
}
