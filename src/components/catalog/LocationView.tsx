import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqList from "@/components/FaqList";
import LeadForm from "@/components/LeadForm";
import SourcesList from "@/components/SourcesList";
import { getLocation, locations } from "@/data/locations";
import { hardnessStatement, services, type LocationRecord } from "@/data/catalog";

export default function LocationView({ location }: { location: LocationRecord }) {
  const hard = hardnessStatement(location);
  const nearby = location.nearby
    .map((slug) => getLocation(slug))
    .filter((loc): loc is LocationRecord => Boolean(loc));
  const faqs = [
    {
      q: `Who supplies drinking water in ${location.name}?`,
      a: `${location.utility}. ${location.utilityDetail}`,
    },
    {
      q: `How hard is the water in ${location.name}?`,
      a: hard.text,
    },
    {
      q: `Do you test wells in ${location.name}?`,
      a:
        location.wellLikelihood === "rare"
          ? `Almost every house in ${location.name} is on public water. If you are one of the rare exceptions, or you are just outside the city, we will say so after we see the house. The free visit is a field test, not a certified bacteria lab sample.`
          : `Yes, when the house is actually on a well. In ${location.name}, ${location.wellLikelihood === "common" ? "wells are common outside newer subdivisions" : "wells are mostly on the edges"}. We test hardness, iron, TDS, and odor on site and tell you when a lab sample is the right next step.`,
    },
  ];
  return (
    <>
      <div className="border-b border-brand-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <Breadcrumbs
            items={[
              { name: "Service area", path: "/service-area" },
              { name: location.name, path: `/service-area/${location.slug}` },
            ]}
          />
        </div>
      </div>
      <section className="bg-water-gradient">
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-200">
              {location.county} County · {location.kind}
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Water filtration in {location.name}, Ohio
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-brand-100">
              Free in-home water tests for {location.name} houses on{" "}
              {location.utility}. ZIP codes {location.zips.join(", ")}.
            </p>
          </div>
          <LeadForm variant="hero" pagePath={`/service-area/${location.slug}`} />
        </div>
      </section>
      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <section>
              <h2 className="text-2xl font-bold tracking-tight text-brand-950">
                Who supplies the water
              </h2>
              <p className="mt-4 text-base leading-relaxed text-brand-800">
                {location.utilityDetail}
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold tracking-tight text-brand-950">
                Hardness
              </h2>
              <p className="mt-4 text-base leading-relaxed text-brand-800">
                {hard.text}
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold tracking-tight text-brand-950">
                What shows up in {location.name}
              </h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-800">
                {location.notes.map((note) => (
                  <p key={note}>{note}</p>
                ))}
              </div>
              <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                {location.commonIssues.map((issue) => (
                  <li
                    key={issue}
                    className="rounded-xl border border-brand-100 bg-white px-4 py-3 text-sm font-medium text-brand-900"
                  >
                    {issue}
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <aside className="h-fit rounded-2xl border border-brand-100 bg-brand-50/70 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-900">
              Local facts
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
                <dt className="font-semibold text-brand-950">Nearby places</dt>
                <dd className="mt-1 text-brand-800">
                  {location.nearbyPlaces.join(", ")}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-brand-950">County</dt>
                <dd className="mt-1 text-brand-800">{location.county} County</dd>
              </div>
            </dl>
          </aside>
        </div>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-brand-950">
            Services in {location.name}
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}/${location.slug}`}
                  className="block rounded-2xl border border-brand-100 bg-white p-5 shadow-card hover:border-brand-300"
                >
                  <span className="text-base font-bold text-brand-950">
                    {service.shortName} in {location.name}
                  </span>
                  <span className="mt-1 block text-sm text-brand-700">
                    {service.keyword}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {nearby.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight text-brand-950">
              Nearby areas
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {nearby.map((loc) => (
                <li key={loc.slug}>
                  <Link
                    href={`/service-area/${loc.slug}`}
                    className="inline-block rounded-full border border-brand-200 px-4 py-2 text-sm font-medium text-brand-800 hover:bg-brand-50"
                  >
                    {loc.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <FaqList faqs={faqs} />
        <SourcesList
          items={
            hard.source ? [...location.sources, hard.source] : location.sources
          }
        />
        <p className="mt-6 text-xs text-brand-500">
          {locations.length} service-area pages are generated from the location
          file. Figures are cited on this page or left out.
        </p>
      </article>
    </>
  );
}
