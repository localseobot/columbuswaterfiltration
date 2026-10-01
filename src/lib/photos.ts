/**
 * Photos of people and places, stored in public/photos/.
 *
 * These are free Unsplash photos (https://unsplash.com/license). Run
 * scripts/fetch-photos.sh to download them. A photo whose file is missing is
 * skipped on the page instead of showing a broken image.
 *
 * They are stock photos, not our crew or our customers. Captions and alt text
 * describe the scene only. Swap in real job photos when you have them by
 * dropping a file in public/photos/ with the same name.
 */
export type SitePhoto = {
  file: string;
  alt: string;
  credit: string;
  /** Unsplash photo page; also used by the download script. */
  source: string;
};

export const photos = {
  technician: {
    file: "technician-under-sink.jpg",
    alt: "A technician working on the plumbing under a kitchen sink",
    credit: "Kateryna Hliznitsova / Unsplash",
    source: "https://unsplash.com/photos/hoIQtR0NoQE",
  },
  kitchen: {
    file: "glass-of-water-kitchen.jpg",
    alt: "A woman holding a glass of water in her kitchen",
    credit: "Unsplash",
    source: "https://unsplash.com/photos/qzJ_DjEs-5M",
  },
  skyline: {
    file: "columbus-skyline.jpg",
    alt: "Downtown Columbus and a bridge over the Scioto River",
    credit: "Oz Seyrek / Unsplash",
    source: "https://unsplash.com/photos/EOAy-v9Njbs",
  },
} satisfies Record<string, SitePhoto>;
