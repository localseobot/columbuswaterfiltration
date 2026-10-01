import JsonLd from "./JsonLd";
import { faqJsonLd } from "@/lib/seo";

export default function FaqList({ faqs }: { faqs: { q: string; a: string }[] }) {
  if (!faqs.length) return null;
  return (
    <section className="mt-14">
      <JsonLd data={faqJsonLd(faqs)} />
      <h2 className="text-2xl font-bold tracking-tight text-brand-950">
        Questions people ask
      </h2>
      <div className="mt-6 divide-y divide-brand-100 rounded-2xl border border-brand-100 bg-white">
        {faqs.map((faq) => (
          <details key={faq.q} className="group px-6 py-4">
            <summary className="cursor-pointer text-base font-semibold text-brand-950">
              {faq.q}
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-brand-700">{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
