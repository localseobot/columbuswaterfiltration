/**
 * Renter NAP — the only place business identity is defined.
 *
 * Change `name`, `phone`, `email`, and `hours` here and they flow through
 * page copy, the footer, and JSON-LD. The public click-to-call number can
 * also be overridden at runtime with the TRACKING_NUMBER env var
 * (see /api/site-config) so a call-tracking line can be swapped without a
 * code change.
 *
 * This is a service-area business. Do not add a street address unless it is
 * a real storefront the renter wants published. Do not add ratings,
 * review counts, license numbers, or years in business here.
 *
 * The phone number below was already in the repo. It has not been verified
 * as a live tracking line. Set TRACKING_NUMBER in Vercel to replace it.
 */
export const site = {
  name: "Columbus Water Filtration",
  domain: "columbuswaterfiltration.com",
  url: "https://www.columbuswaterfiltration.com",
  description:
    "Whole-home water filtration, water softeners, and reverse osmosis for Columbus, Ohio and central Ohio. Schedule a free in-home water test.",
  phone: "(614) 490-2100",
  phoneHref: "tel:+16144902100",
  email: "info@columbuswaterfiltration.com",
  /** City and state only. There is no published street address. */
  area: {
    city: "Columbus",
    state: "OH",
    stateName: "Ohio",
    region: "Central Ohio",
  },
  hours: {
    display: "Mon–Sat: 8:00 AM – 6:00 PM",
    opens: "08:00",
    closes: "18:00",
    days: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
  },
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/service-area/", label: "Service Area" },
  { href: "/columbus-water-hardness/", label: "Hardness" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
] as const;
