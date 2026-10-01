import type { LeadLedger } from "./types";
import { createFileLedger } from "./file-ledger";
import { createGhlLedger } from "./ghl-ledger";
import { createRedisLedger } from "./redis-ledger";

let cached: LeadLedger | null = null;

export function ledgerDriver(): LeadLedger["driver"] {
  const requested = (process.env.LEDGER_DRIVER || "auto").toLowerCase();
  if (requested === "ghl" || requested === "redis" || requested === "file") {
    return requested;
  }
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return "redis";
  }
  return "file";
}

export function getLedger(): LeadLedger {
  if (cached) return cached;
  const driver = ledgerDriver();
  if (driver === "ghl") cached = createGhlLedger();
  else if (driver === "redis") cached = createRedisLedger();
  else cached = createFileLedger();
  if (process.env.VERCEL && driver === "file") {
    console.warn(
      "LEAD_LEDGER_EPHEMERAL: file storage on Vercel does not persist. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.",
    );
  }
  return cached;
}

export function resetLedgerForTests() {
  cached = null;
}
