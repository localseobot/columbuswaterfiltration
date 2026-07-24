# Columbus Water Filtration

Marketing website for **Columbus Water Filtration** — a home water filtration company serving Columbus, Ohio and surrounding communities. Built with Next.js (App Router), TypeScript, and Tailwind CSS.

## Pages

| Route | Description |
| --- | --- |
| `/` | Homepage — hero, benefits, services overview, process, testimonials, CTA |
| `/services` | Whole home filtration, water softeners, reverse osmosis, well water treatment |
| `/about` | Company story, values, why choose us, service area |
| `/contact` | Contact form, phone, hours, and service area |
| `/free-water-test` | Lead-generation landing page with booking form |

## Features

- **Responsive & fast** — static-generated pages, mobile-first Tailwind layout
- **SEO optimized** — per-page title tags & meta descriptions, semantic H1/H2 structure, Open Graph & Twitter cards
- **Structured data** — `LocalBusiness` (HomeAndConstructionBusiness) JSON-LD, plus Service and ContactPage schema
- **Sitemap & robots** — generated at `/sitemap.xml` and `/robots.txt`
- **Water-themed design** — blue/teal palette, custom SVG icon set, gradient hero

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm run start
```

## Configuration

Business details (name, phone, address, service areas, ratings) live in a single file:
[`src/lib/site.ts`](src/lib/site.ts). Page content (services, benefits, testimonials, process
steps) lives in [`src/lib/content.ts`](src/lib/content.ts).

> **Note:** The lead/contact forms currently show a client-side success state and are not yet
> wired to a backend. Connect `src/components/LeadForm.tsx` to your CRM, email service, or a
> Next.js route handler to capture submissions.

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
