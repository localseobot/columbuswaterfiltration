import type { LeadLedger } from "./types";
import { createFileLedger } from "./file-ledger";
import { createGhlLedger } from "./ghl-ledger";
import { createRedisLedger } from "./redis-ledger";
import { createPgLedger } from "./pg-ledger";

let cached: LeadLedger | null = null;

export function ledgerDriver(): LeadLedger["driver"] {
  const requested = (process.env.LEDGER_DRIVER || "auto").toLowerCase();
  if (requested === "ghl" || requested === "redis" || requested === "file" || requested === "pg") {
    return requested;
  }
  if (process.env.LEADS_DATABASE_URL) return "pg";
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return "redis";
  }
  return "file";
}

export function getLedger(): LeadLedger {
  if (cached) return cached;
  const driver = ledgerDriver();
  if (driver === "ghl") cached = createGhlLedger();
  else if (driver === "pg") cached = createPgLedger();
  else if (driver === "redis") cached = createRedisLedger();
  else cached = createFileLedger();
  if (process.env.VERCEL && driver === "file") {
    console.warn(
      "LEAD_LEDGER_EPHEMERAL: file storage on Vercel does not persist. Set LEADS_DATABASE_URL.",
    );
  }
  return cached;
}

export function resetLedgerForTests() {
  cached = null;
}
