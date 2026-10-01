export type Pricing = {
  configured: boolean;
  mode: "per_lead" | "flat";
  perLead: number;
  flatMonthly: number;
  includedPerMonth: number;
  dedupeDays: number;
};

function env(name: string, fallback = ""): string {
  const v = process.env[name];
  return v === undefined || v === null || v === "" ? fallback : String(v).trim();
}

function num(name: string, fallback: number): number {
  const v = Number(env(name));
  return Number.isFinite(v) && v >= 0 ? v : fallback;
}

/**
 * Billing figures stay off the public site. The dashboard shows dollars only
 * when LEAD_PRICE or LEAD_PRICING_MODE is set, so we never invent a rate.
 */
export function getPricing(): Pricing {
  const configured = Boolean(env("LEAD_PRICE") || env("LEAD_PRICING_MODE"));
  const mode = env("LEAD_PRICING_MODE", "per_lead") === "flat" ? "flat" : "per_lead";
  return {
    configured,
    mode,
    perLead: num("LEAD_PRICE", 0),
    flatMonthly: num("LEAD_FLAT_MONTHLY", 0),
    includedPerMonth: num("LEAD_MONTHLY_INCLUDED", 0),
    dedupeDays: num("LEAD_DEDUPE_DAYS", 30),
  };
}

export type MonthBilling = {
  mode: "per_lead" | "flat";
  billable: number;
  total: number;
  unitPrice?: number;
  included?: number;
  overage?: number;
  base?: number;
  overageCost?: number;
  costPerLead: number | null;
};

export function priceLeads(
  leads: { billable: boolean }[],
  pricing: Pricing = getPricing(),
): MonthBilling | null {
  if (!pricing.configured) return null;
  const billable = leads.filter((l) => l.billable).length;
  if (pricing.mode === "flat") {
    const overage = Math.max(0, billable - pricing.includedPerMonth);
    const overageCost = overage * pricing.perLead;
    const total = pricing.flatMonthly + overageCost;
    return {
      mode: "flat",
      billable,
      included: pricing.includedPerMonth,
      overage,
      base: pricing.flatMonthly,
      overageCost,
      total,
      costPerLead: billable ? total / billable : null,
    };
  }
  const total = billable * pricing.perLead;
  return {
    mode: "per_lead",
    billable,
    unitPrice: pricing.perLead,
    total,
    costPerLead: billable ? pricing.perLead : null,
  };
}
