/**
 * Local check: a submission is stored, the email sender is called, a storage
 * failure still attempts email, and the dashboard payload includes the lead.
 *
 *   LEAD_DATA_FILE=/tmp/cwf-leads-test.json npx tsx scripts/verify-leads.ts
 */
import fs from "node:fs";
import { buildPageModel, pagePlainText } from "../src/data/copy";
import { allPages, getPlace, indexablePages } from "../src/data/dataset";
import { buildDashboard } from "../src/lib/leads/dashboard-data";
import { resetLedgerForTests } from "../src/lib/leads";
import { parseLeadBody, submitLead } from "../src/lib/leads/submit";
import type { EmailMessage } from "../src/lib/leads/email";
import type { LeadLedger } from "../src/lib/leads/types";

const file = process.env.LEAD_DATA_FILE || "/tmp/cwf-leads-verify.json";
process.env.LEAD_DATA_FILE = file;
process.env.LEDGER_DRIVER = "file";
process.env.BUYER_SECRET = process.env.BUYER_SECRET || "verify-secret";
process.env.LEAD_NOTIFY_EMAILS = "devyn@localwebbuilders.io";
delete process.env.UPSTASH_REDIS_REST_URL;
delete process.env.LEAD_PRICE;
delete process.env.LEAD_PRICING_MODE;

fs.rmSync(file, { force: true });
resetLedgerForTests();

const sent: EmailMessage[] = [];
const sendEmail = async (message: EmailMessage) => {
  sent.push(message);
  return { id: "mock" };
};

function assert(cond: unknown, message: string) {
  if (!cond) {
    console.error("FAIL", message);
    process.exit(1);
  }
}

const pages = allPages();
const indexable = indexablePages();
assert(pages.length === 243, `expected 243 matrix pages, got ${pages.length}`);
assert(indexable.length === 207, `expected 207 indexable pages, got ${indexable.length}`);
assert(pages.length - indexable.length === 36, "expected 36 noindex gates");
assert(
  indexable.some((p) => p.path === "/water-softener-installation/dublin-oh/"),
  "dublin softener page is indexable",
);
assert(
  pages.some((p) => p.path === "/service-area/pataskala-oh/" && !p.indexable),
  "pataskala hub is noindex",
);
assert(!pages.some((p) => p.path.includes("/heath-oh/") && p.serviceSlug === "water-softener-installation"), "no Heath softener page");

for (const page of pages) {
  if (!page.placeSlug) continue;
  const place = getPlace(page.placeSlug);
  if (!place || place.zipsDisplay) continue;
  const text = pagePlainText(buildPageModel(page));
  for (const zip of place.zips) {
    assert(!text.includes(zip), `${page.path} displayed approximate ZIP ${zip}`);
  }
}

function shingles(text: string): Set<string> {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  const set = new Set<string>();
  for (let i = 0; i <= words.length - 5; i++) set.add(words.slice(i, i + 5).join(" "));
  return set;
}
function jaccard(a: Set<string>, b: Set<string>): number {
  let inter = 0;
  for (const item of a) if (b.has(item)) inter++;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

const byService = new Map<string, { path: string; text: string }[]>();
for (const page of pages.filter((p) => p.pageType === "service-x-location" || p.pageType === "neighborhood")) {
  const key = page.pageType === "neighborhood" ? "neighborhood" : page.serviceSlug || page.pageType;
  const list = byService.get(key) || [];
  list.push({ path: page.path, text: pagePlainText(buildPageModel(page)) });
  byService.set(key, list);
}
let worst = { score: 0, a: "", b: "" };
for (const list of byService.values()) {
  const grams = list.map((item) => ({ ...item, grams: shingles(item.text) }));
  for (let i = 0; i < grams.length; i++) {
    for (let j = i + 1; j < grams.length; j++) {
      const score = jaccard(grams[i].grams, grams[j].grams);
      if (score > worst.score) worst = { score, a: grams[i].path, b: grams[j].path };
      assert(score < 0.6, `near-duplicate ${grams[i].path} vs ${grams[j].path} (${score.toFixed(2)})`);
    }
  }
}

const paths = indexable.map((p) => p.path);

async function main() {
const honeypot = parseLeadBody({ name: "Bot", phone: "6145550100", website: "http://spam" });
assert(honeypot.honeypot, "honeypot detected");

const first = await submitLead(
  {
    channel: "web",
    name: "Test Homeowner",
    phone: "+16145550199",
    email: "test@example.com",
    service: "Water softener",
    place: "43017",
    page: "/services/water-softeners/dublin",
    detail: "Spots on glass",
  },
  { sendEmail },
);
assert(first.stored, "lead stored");
assert(sent.length === 1, "email sender called");
assert(sent[0].to.includes("devyn@localwebbuilders.io"), "default recipient");
assert(!sent[0].text.includes("$"), "lead email has no price");

const second = await submitLead(
  {
    channel: "web",
    name: "Test Homeowner",
    phone: "+16145550199",
    service: "Free water test",
    page: "/",
  },
  { sendEmail },
);
assert(second.duplicate, "dedupe window flagged the repeat");
assert(sent.length === 2, "duplicate still emailed");

const broken: LeadLedger = {
  driver: "file",
  async record() {
    throw new Error("disk full");
  },
  async list() {
    return [];
  },
  async get() {
    return null;
  },
  async setOutcome() {
    throw new Error("nope");
  },
  async fileDispute() {
    throw new Error("nope");
  },
  async resolveDispute() {
    throw new Error("nope");
  },
};
const fallback = await submitLead(
  {
    channel: "web",
    name: "Storage Down",
    email: "down@example.com",
    service: "Free water test",
    page: "/contact",
  },
  { sendEmail, ledger: broken },
);
assert(fallback.stored === false, "storage failure reported");
assert(sent.length === 3, "email still attempted when storage fails");
assert(sent[2].text.includes("Storage Down"), "email body kept the lead");

const { getLedger } = await import("../src/lib/leads/index");
const leads = await getLedger().list();
const dash = buildDashboard(leads);
assert(dash.leads.some((l) => l.name === "Test Homeowner"), "dashboard payload includes the lead");
assert(dash.pricing === null, "prices hidden until LEAD_PRICE is set");
assert(dash.thisMonth && dash.thisMonth.web >= 1, "month rollup counts web leads");

console.log(
  JSON.stringify(
    {
      ok: true,
      stored: leads.length,
      emails: sent.length,
      pages: pages.length,
      indexable: indexable.length,
      noindex: pages.length - indexable.length,
      sitemap: paths.length,
      worstSimilarity: Number(worst.score.toFixed(3)),
      worstPair: [worst.a, worst.b],
    },
    null,
    2,
  ),
);
}

main();
