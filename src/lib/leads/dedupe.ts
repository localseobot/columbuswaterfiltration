import type { Lead, LeadInput } from "./types";

export function contactKeys(input: {
  phone?: string | null;
  email?: string | null;
}): string[] {
  const keys: string[] = [];
  const digits = String(input.phone || "").replace(/\D/g, "");
  const ten =
    digits.length === 11 && digits.startsWith("1")
      ? digits.slice(1)
      : digits.length >= 10
        ? digits.slice(-10)
        : "";
  if (ten.length === 10) keys.push(`p:${ten}`);
  const email = String(input.email || "").trim().toLowerCase();
  if (email.includes("@")) keys.push(`e:${email}`);
  return keys;
}

export function dedupeDays(env: NodeJS.ProcessEnv = process.env): number {
  const n = Number(env.LEAD_DEDUPE_DAYS);
  if (Number.isFinite(n) && n >= 0) return n;
  return 30;
}

/** True when any contact key already produced a lead inside the window. */
export function isRecentDuplicate(
  existing: Pick<Lead, "receivedAt" | "contactKeys">[],
  keys: string[],
  withinDays: number,
  now = Date.now(),
): boolean {
  if (!keys.length || withinDays <= 0) return false;
  const set = new Set(keys);
  const cutoff = now - withinDays * 86_400_000;
  return existing.some((lead) => {
    const t = new Date(lead.receivedAt).getTime();
    if (!Number.isFinite(t) || t < cutoff) return false;
    return lead.contactKeys.some((key) => set.has(key));
  });
}

export function buildLead(
  input: LeadInput,
  opts: { id: string; now: Date; duplicate: boolean },
): Lead {
  const keys = contactKeys(input);
  return {
    id: opts.id,
    receivedAt: opts.now.toISOString(),
    channel: input.channel === "phone" ? "phone" : "web",
    name: input.name,
    phone: input.phone || null,
    email: input.email || null,
    service: input.service || null,
    place: input.place || null,
    detail: input.detail || null,
    page: input.page || null,
    outcome: "new",
    billable: !opts.duplicate,
    duplicate: opts.duplicate,
    credited: false,
    dispute: null,
    contactKeys: keys,
    notes: [
      {
        at: opts.now.toISOString(),
        body: opts.duplicate
          ? `Recorded as a repeat inside ${dedupeDays()} days. Delivered, not billable.`
          : "Lead recorded.",
      },
    ],
  };
}
