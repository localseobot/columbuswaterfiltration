/**
 * Brand shapes shared by the header logo, footer, favicon, and social image.
 *
 * The mark is a simplified outline of Ohio with a water drop sitting roughly
 * where Columbus is. Both paths use a 100 x 100 viewBox.
 */
export const OHIO_PATH =
  "M9 8 L43 10 C47 14 51 17 55 15 C60 13 64 13 68 11 C75 8 82 6 88 3 L90 47 C89 52 87 56 87 60 C85 64 82 66 80 70 C79 75 77 79 73 81 C70 84 69 88 65 90 C61 93 57 96 53 93 C49 91 45 95 41 95 C36 95 32 91 27 92 C21 94 15 91 11 88 Z";

/** Water drop centred near Columbus (about 48, 52 on the outline). */
export const DROP_PATH =
  "M48 33 C53 40 58 46 58 52 A10 10 0 0 1 38 52 C38 46 43 40 48 33 Z";

export const brandColors = {
  navy: "#12304f",
  brick: "#b23a2c",
  cream: "#faf6ef",
} as const;
