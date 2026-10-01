# Columbus Water Filtration

Marketing site for water treatment in Columbus, Ohio and central Ohio. Next.js App Router, TypeScript, Tailwind CSS.

## Pages

The page list is `data/page_matrix.csv` (243 URLs). Places, suppliers, hardness, and ZIP codes are `data/locations.csv`. Service clusters are `data/clusters.json`. Keyword notes are `data/keywords.csv`. Cited water facts are `data/local_facts.md`. The spec is `data/page_plan.md`.

A row with `publish_gate` other than `ok` is generated as `noindex` and left out of the sitemap. ZIP codes whose source starts with `approx` are not shown.

| Pattern | Example |
| --- | --- |
| `/` | Homepage |
| `/{service}/` | `/water-softener-installation/` |
| `/{service}/{place}/` | `/water-softener-installation/dublin-oh/` |
| `/service-area/` | Index by county |
| `/service-area/{place}/` | `/service-area/westerville-oh/` |
| `/service-area/columbus-oh/{neighborhood}/` | `/service-area/columbus-oh/clintonville/` |
| `/service-area/{county}-county-oh/` | `/service-area/licking-county-oh/` |
| `/well-water-treatment/{county}-county-oh/` | County well pages |
| `/columbus-water-hardness/`, `/columbus-water-quality/` | Cited local data |
| `/dashboard` | Lead dashboard (noindex) |

There is no Heath softener URL. Circleville’s 25 gpg well water is called out from the city report. Columbus pages do not say the water is unsafe.

## Business details

Name, phone, email, and hours: [`src/lib/site.ts`](src/lib/site.ts).

`TRACKING_NUMBER` overrides the click-to-call number via `/api/site-config`. There is no street address.

## Leads

Forms post to `POST /api/lead`. See [`.env.example`](.env.example) for Resend, Upstash Redis, the dashboard secret, and the optional GoHighLevel ledger.

```bash
npm install
npm run dev
```

```bash
npx tsx scripts/verify-leads.ts
npm run build
```
