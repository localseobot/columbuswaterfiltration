import { site } from "./site";

/** Normalize a US phone number to E.164, or "" if it is not a phone number. */
export function toE164(raw: unknown): string {
  const s = raw === null || raw === undefined ? "" : String(raw).trim();
  if (!s) return "";
  const digits = s.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (s.startsWith("+") && digits.length >= 10) return `+${digits}`;
  return "";
}

/** +16144902100 → "(614) 490-2100". */
export function formatUsDisplay(e164: string): string {
  const normalized = toE164(e164) || e164;
  const digits = String(normalized).replace(/\D/g, "");
  const ten = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (ten.length !== 10) return String(e164 || "");
  return `(${ten.slice(0, 3)}) ${ten.slice(3, 6)}-${ten.slice(6)}`;
}

export type TrackingNumber = {
  e164: string;
  href: string;
  display: string;
};

/**
 * The number homeowners should dial.
 * TRACKING_NUMBER wins, then the number in src/lib/site.ts.
 */
export function getTrackingNumber(
  env: NodeJS.ProcessEnv = process.env,
): TrackingNumber {
  const raw = String(env.TRACKING_NUMBER || "").trim();
  const e164 = toE164(raw) || toE164(site.phone) || "";
  return {
    e164,
    href: e164 ? `tel:${e164}` : site.phoneHref,
    display: e164 ? formatUsDisplay(e164) : site.phone,
  };
}
