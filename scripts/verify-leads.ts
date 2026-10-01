/**
 * Local check: a submission is stored, the email sender is called, a storage
 * failure still attempts email, and the dashboard payload includes the lead.
 *
 *   LEAD_DATA_FILE=/tmp/cwf-leads-test.json npx tsx scripts/verify-leads.ts
 */
import fs from "node:fs";
import { locations } from "../src/data/locations";
import { services } from "../src/data/services";
import { catalogPaths } from "../src/data/catalog";
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

const details = new Set(locations.map((l) => l.utilityDetail));
assert(details.size === locations.length, "each location needs a unique utility detail");
for (const loc of locations) {
  assert(loc.zips.length > 0, `${loc.slug} missing zips`);
  assert(loc.nearbyPlaces.length > 0, `${loc.slug} missing nearby places`);
  assert(loc.notes.length > 0, `${loc.slug} missing notes`);
  assert(loc.utility.length > 10, `${loc.slug} missing utility`);
}

const paths = catalogPaths();
const combo = services.length * locations.length;
assert(
  paths.some((p) => p.path === `/services/${services[0].slug}/${locations[0].slug}`),
  "sitemap paths include a service × city URL",
);
assert(
  paths.filter((p) => p.path.split("/").length === 4).length === combo,
  `expected ${combo} combo paths`,
);

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
      pages: paths.length,
      services: services.length,
      locations: locations.length,
      combos: combo,
    },
    null,
    2,
  ),
);
}

main();
