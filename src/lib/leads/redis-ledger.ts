import crypto from "node:crypto";
import { Redis } from "@upstash/redis";
import type { Lead, LeadInput, LeadLedger, OutcomeKey, RecordResult } from "./types";
import { OUTCOMES } from "./types";
import { buildLead, contactKeys, dedupeDays, isRecentDuplicate } from "./dedupe";

const INDEX = "cwf:leads";

function client() {
  return Redis.fromEnv();
}

function addNote(lead: Lead, body: string): Lead {
  return { ...lead, notes: [{ at: new Date().toISOString(), body }, ...lead.notes] };
}

async function leadsForKeys(redis: Redis, keys: string[]): Promise<Lead[]> {
  if (!keys.length) return [];
  const ids = new Set<string>();
  for (const key of keys) {
    const members = await redis.smembers<string[]>(`cwf:contact:${key}`);
    for (const id of members || []) ids.add(id);
  }
  if (!ids.size) return [];
  const rows = await redis.mget<(Lead | null)[]>(...[...ids].map((id) => `cwf:lead:${id}`));
  return (rows || []).filter((row): row is Lead => Boolean(row));
}

export function createRedisLedger(): LeadLedger {
  return {
    driver: "redis",
    async record(input: LeadInput): Promise<RecordResult> {
      const redis = client();
      const keys = contactKeys(input);
      const prior = await leadsForKeys(redis, keys);
      const duplicate = isRecentDuplicate(prior, keys, dedupeDays());
      const lead = buildLead(input, {
        id: `lead_${crypto.randomBytes(8).toString("hex")}`,
        now: new Date(),
        duplicate,
      });
      const score = Date.parse(lead.receivedAt);
      await redis.set(`cwf:lead:${lead.id}`, lead);
      await redis.zadd(INDEX, { score, member: lead.id });
      for (const key of lead.contactKeys) {
        await redis.sadd(`cwf:contact:${key}`, lead.id);
      }
      return { ok: true, lead, duplicate, billable: lead.billable };
    },
    async list(limit = 250): Promise<Lead[]> {
      const redis = client();
      const ids = await redis.zrange<string[]>(INDEX, 0, limit - 1, { rev: true });
      if (!ids?.length) return [];
      const rows = await redis.mget<(Lead | null)[]>(...ids.map((id) => `cwf:lead:${id}`));
      return (rows || []).filter((row): row is Lead => Boolean(row));
    },
    async get(id: string): Promise<Lead | null> {
      return (await client().get<Lead>(`cwf:lead:${id}`)) || null;
    },
    async setOutcome(id: string, outcome: OutcomeKey): Promise<Lead> {
      const redis = client();
      const current = await redis.get<Lead>(`cwf:lead:${id}`);
      if (!current) throw new Error("lead not found");
      const next = addNote({ ...current, outcome }, `Status set to ${OUTCOMES[outcome]}.`);
      await redis.set(`cwf:lead:${id}`, next);
      return next;
    },
    async fileDispute(id: string, reason: string): Promise<Lead> {
      const redis = client();
      const current = await redis.get<Lead>(`cwf:lead:${id}`);
      if (!current) throw new Error("lead not found");
      const next = addNote(
        { ...current, dispute: "open" },
        `Dispute filed.\nReason: ${reason || "(none)"}`,
      );
      await redis.set(`cwf:lead:${id}`, next);
      return next;
    },
    async resolveDispute(id, decision, note): Promise<Lead> {
      const redis = client();
      const current = await redis.get<Lead>(`cwf:lead:${id}`);
      if (!current) throw new Error("lead not found");
      const approved = decision === "approved";
      const next = addNote(
        {
          ...current,
          dispute: approved ? "approved" : "denied",
          credited: approved ? true : current.credited,
          billable: approved ? false : current.billable,
        },
        approved
          ? `Dispute approved. Lead credited and no longer billable.${note ? `\n${note}` : ""}`
          : `Dispute denied. Lead still stands.${note ? `\n${note}` : ""}`,
      );
      await redis.set(`cwf:lead:${id}`, next);
      return next;
    },
  };
}
