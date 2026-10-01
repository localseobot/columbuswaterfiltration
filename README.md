# Columbus Water Filtration

Marketing site for water filtration in Columbus, Ohio and central Ohio. Next.js App Router, TypeScript, Tailwind CSS.

## Pages

Routes are generated from `src/data/services.ts` and `src/data/locations.ts`. Adding a service or a city publishes the new URLs and adds them to the sitemap. Service × city pages live at `/services/[service]/[city]`.

| Route | Description |
| --- | --- |
| `/` | Homepage and lead form |
| `/services` | Service index |
| `/services/[slug]` | One service, plus links to every city |
| `/services/[slug]/[location]` | That service in one city, using that city's water facts |
| `/service-area` | Location index |
| `/service-area/[slug]` | One city, township, or neighborhood |
| `/free-water-test` | Lead form |
| `/about`, `/contact` | Company and contact |
| `/dashboard` | Lead dashboard (noindex). Magic-link sign-in. |

Location records carry the unique facts (utility, hardness key, ZIP codes, nearby places, notes). Do not copy Columbus plant numbers onto a different supplier. Leave `hardnessKey` null when there is no cited figure.

## Business details

Name, phone, email, and hours: [`src/lib/site.ts`](src/lib/site.ts).

The public click-to-call number can be overridden with `TRACKING_NUMBER` (see `/api/site-config`) without editing pages. There is no street address.

## Leads

Forms post to `POST /api/lead`. Leads are stored and emailed. See [`.env.example`](.env.example) for Resend, Upstash Redis, the dashboard secret, and the optional GoHighLevel ledger.

```bash
npm install
npm run dev
```

```bash
npx tsx scripts/verify-leads.ts
npm run build
```
