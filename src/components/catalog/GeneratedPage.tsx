import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqList from "@/components/FaqList";
import JsonLd from "@/components/JsonLd";
import LeadForm from "@/components/LeadForm";
import SourcesList from "@/components/SourcesList";
import { buildPageModel, type PageModel } from "@/data/copy";
import type { CatalogPage } from "@/data/dataset";
import { serviceJsonLd } from "@/lib/seo";

function Groups({ model }: { model: PageModel }) {
  if (!model.linkGroups.length) return null;
  return (
    <div className="mt-14 space-y-8">
      {model.linkGroups.map((group) => (
        <section key={group.heading}>
          <h2 className="text-xl font-bold text-brand-950">{group.heading}</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {group.items.map((item) => (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-2 rounded-full border border-brand-200 px-4 py-2 text-sm font-medium text-brand-800 hover:bg-brand-50"
                >
                  {item.label}
                  {item.note ? (
                    <span className="text-xs font-normal text-brand-500">{item.note}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export default function GeneratedPage({ page }: { page: CatalogPage }) {
  const model = buildPageModel(page);
  const areaName = page.locationName || (page.pageType === "county-hub" || page.pageType === "service-x-county" ? page.county : "");
  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: model.h1,
          description: model.description,
          path: page.path,
          area: areaName
            ? {
                name: areaName,
                kind: page.county && !page.locationName ? "county" : undefined,
              }
            : undefined,
        })}
      />
      <div className="border-b border-brand-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <Breadcrumbs items={model.crumbs} />
        </div>
      </div>
      <section className="bg-water-gradient">
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-200">
              {page.county || "Columbus and central Ohio"}
              {page.indexable ? "" : " · Supplier not confirmed"}
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {model.h1}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-brand-100">{model.lede}</p>
          </div>
          <LeadForm variant="hero" defaultService={model.formOption} pagePath={page.path} />
        </div>
      </section>
      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            {model.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-bold tracking-tight text-brand-950">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-800">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
          {model.facts.length > 0 && (
            <aside className="h-fit rounded-2xl border border-brand-100 bg-brand-50/70 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-900">
                Local facts
              </h2>
              <dl className="mt-4 space-y-4 text-sm">
                {model.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="font-semibold text-brand-950">{fact.label}</dt>
                    <dd className="mt-1 text-brand-800">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          )}
        </div>
        <Groups model={model} />
        <FaqList faqs={model.faqs} />
        <SourcesList items={model.sources} />
        {!page.indexable && (
          <p className="mt-8 text-sm text-brand-600">
            This page is noindex until the water supplier is confirmed from a utility
            source. It does not state a utility name or a hardness number.
          </p>
        )}
      </article>
    </>
  );
}
