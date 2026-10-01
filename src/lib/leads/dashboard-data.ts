import type { Lead } from "./types";
import { getPricing, priceLeads, type MonthBilling } from "./pricing";

export type MonthRollup = {
  key: string;
  label: string;
  total: number;
  web: number;
  phone: number;
  won: number;
  billing: MonthBilling | null;
};

function monthLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleString("en-US", {
    timeZone: "UTC",
    month: "long",
    year: "numeric",
  });
}

export function groupByMonth(leads: Lead[]): [string, Lead[]][] {
  const months = new Map<string, Lead[]>();
  for (const lead of leads) {
    const d = new Date(lead.receivedAt);
    if (Number.isNaN(d.getTime())) continue;
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    const list = months.get(key) ?? [];
    list.push(lead);
    months.set(key, list);
  }
  return [...months.entries()].sort((a, b) => b[0].localeCompare(a[0]));
}

export function buildDashboard(leads: Lead[]) {
  const pricing = getPricing();
  const months: MonthRollup[] = groupByMonth(leads).map(([key, rows]) => ({
    key,
    label: monthLabel(key),
    total: rows.length,
    web: rows.filter((l) => l.channel === "web").length,
    phone: rows.filter((l) => l.channel === "phone").length,
    won: rows.filter((l) => l.outcome === "won").length,
    billing: priceLeads(rows, pricing),
  }));
  const worked = leads.filter((l) => l.outcome !== "new" && l.outcome !== "spam").length;
  const won = leads.filter((l) => l.outcome === "won").length;
  return {
    ok: true as const,
    pricing: pricing.configured
      ? {
          mode: pricing.mode,
          perLead: pricing.perLead,
          flatMonthly: pricing.flatMonthly,
          includedPerMonth: pricing.includedPerMonth,
        }
      : null,
    totals: {
      leads: leads.length,
      won,
      worked,
      closeRate: worked ? won / worked : null,
      openDisputes: leads.filter((l) => l.dispute === "open").length,
    },
    thisMonth: months[0] || null,
    months,
    leads,
  };
}
