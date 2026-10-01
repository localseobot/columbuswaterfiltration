/** Lead-form choices. Kept out of the CSV loader so the client form does not pull Node. */
export const FORM_OPTIONS = [
  "Free water test",
  "Water softener installation",
  "Water softener repair",
  "Whole-house water filtration",
  "Reverse osmosis",
  "Well water treatment",
  "Well water testing",
  "Iron or sulfur",
  "Not sure",
] as const;

export function formOptionForService(slug: string | null): string {
  switch (slug) {
    case "water-softener-installation":
    case "water-softeners":
      return "Water softener installation";
    case "water-softener-repair":
      return "Water softener repair";
    case "whole-house-water-filtration":
      return "Whole-house water filtration";
    case "reverse-osmosis-installation":
    case "under-sink-water-filters":
      return "Reverse osmosis";
    case "well-water-treatment":
      return "Well water treatment";
    case "well-water-testing":
    case "water-testing":
      return "Well water testing";
    case "iron-sulfur-removal":
      return "Iron or sulfur";
    default:
      return "Free water test";
  }
}
