type Item = { label: string; href: string };

export default function SourcesList({ items }: { items: Item[] }) {
  const unique = items.filter(
    (item, i) => items.findIndex((o) => o.href === item.href) === i,
  );
  if (!unique.length) return null;
  return (
    <aside className="mt-12 rounded-2xl border border-brand-100 bg-brand-50/50 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-900">
        Sources
      </h2>
      <ul className="mt-3 space-y-2 text-sm">
        {unique.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="text-brand-700 underline decoration-brand-200 underline-offset-2 hover:text-brand-600"
              rel="noopener noreferrer"
              target="_blank"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
