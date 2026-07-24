export const site = {
  name: "Columbus Water Filtration",
  legalName: "Columbus Water Filtration LLC",
  domain: "columbuswaterfiltration.com",
  url: "https://columbuswaterfiltration.com",
  description:
    "Whole home water filtration, softeners, and reverse osmosis systems for Columbus, Ohio and surrounding areas. Get a free in-home water test.",
  phone: "(614) 490-2100",
  phoneHref: "tel:+16144902100",
  email: "info@columbuswaterfiltration.com",
  address: {
    street: "1234 Clean Water Way, Suite 200",
    city: "Columbus",
    state: "OH",
    zip: "43215",
    country: "US",
  },
  geo: {
    lat: 39.9612,
    lng: -82.9988,
  },
  hours: "Mon–Sat: 8:00 AM – 6:00 PM",
  rating: {
    value: "4.9",
    count: "312",
  },
  serviceAreas: [
    "Columbus",
    "Dublin",
    "Westerville",
    "Hilliard",
    "Powell",
    "Gahanna",
    "New Albany",
    "Grove City",
    "Worthington",
    "Upper Arlington",
    "Bexley",
    "Pickerington",
    "Reynoldsburg",
    "Delaware",
  ],
  social: {
    facebook: "https://facebook.com/columbuswaterfiltration",
    instagram: "https://instagram.com/columbuswaterfiltration",
    google: "https://g.page/columbuswaterfiltration",
  },
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
