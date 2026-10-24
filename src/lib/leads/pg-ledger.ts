import crypto from "node:crypto";
import { Pool } from "pg";
import type { Lead, LeadInput, LeadLedger, OutcomeKey, RecordResult } from "./types";
import { OUTCOMES } from "./types";
import { buildLead, contactKeys, dedupeDays, isRecentDuplicate } from "./dedupe";
import { leadRecipients } from "./email";

// Leads live in public.rr_leads in the Local Web Builders Supabase DB.
// The full dashboard Lead is kept in `raw`; flat columns make the table readable.
const SITE = "columbuswaterfiltration.com";
let pool: Pool | null = null;

function db(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.LEADS_DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 1,
      connectionTimeoutMillis: 5000,
    });
  }
  return pool;
}

function addNote(lead: Lead, body: string): Lead {
  return { ...lead, notes: [{ at: new Date().toISOString(), body }, ...lead.notes] };
}

async function load(id: string): Promise<Lead | null> {
  const { rows } = await db().query(
    "select raw from public.rr_leads where site = $1 and raw->>'id' = $2 limit 1",
    [SITE, id],
  );
  return (rows[0]?.raw as Lead) || null;
}

async function save(lead: Lead): Promise<Lead> {
  await db().query(
    "update public.rr_leads set raw = $3, status = $4 where site = $1 and raw->>'id' = $2",
    [SITE, lead.id, lead, lead.outcome],
  );
  return lead;
}

export function createPgLedger(): LeadLedger {
  return {
    driver: "pg",
    async record(input: LeadInput): Promise<RecordResult> {
      const keys = contactKeys(input);
      const { rows } = keys.length
        ? await db().query(
            "select raw from public.rr_leads where site = $1 and raw->'contactKeys' ?| $2::text[]",
            [SITE, keys],
          )
        : { rows: [] as { raw: Lead }[] };
      const duplicate = isRecentDuplicate(rows.map((r) => r.raw as Lead), keys, dedupeDays());
      const lead = buildLead(input, {
        id: `lead_${crypto.randomBytes(8).toString("hex")}`,
        now: new Date(),
        duplicate,
      });
      await db().query(
        `insert into public.rr_leads
           (created_at, site, page, name, phone, email, service, town, message, recipients, status, raw)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
        [lead.receivedAt, SITE, lead.page, lead.name, lead.phone, lead.email, lead.service,
          lead.place, lead.detail, leadRecipients(), lead.outcome, lead],
      );
      return { ok: true, lead, duplicate, billable: lead.billable };
    },
    async list(limit = 250): Promise<Lead[]> {
      const { rows } = await db().query(
        "select raw from public.rr_leads where site = $1 order by created_at desc limit $2",
        [SITE, limit],
      );
      return rows.map((r) => r.raw as Lead);
    },
    get: load,
    async setOutcome(id: string, outcome: OutcomeKey): Promise<Lead> {
      const current = await load(id);
      if (!current) throw new Error("lead not found");
      return save(addNote({ ...current, outcome }, `Status set to ${OUTCOMES[outcome]}.`));
    },
    async fileDispute(id: string, reason: string): Promise<Lead> {
      const current = await load(id);
      if (!current) throw new Error("lead not found");
      return save(addNote({ ...current, dispute: "open" }, `Dispute filed.\nReason: ${reason || "(none)"}`));
    },
    async resolveDispute(id, decision, note): Promise<Lead> {
      const current = await load(id);
      if (!current) throw new Error("lead not found");
      const approved = decision === "approved";
      return save(
        addNote(
          {
            ...current,
            dispute: approved ? "approved" : "denied",
            credited: approved ? true : current.credited,
            billable: approved ? false : current.billable,
          },
          approved
            ? `Dispute approved. Lead credited and no longer billable.${note ? `\n${note}` : ""}`
            : `Dispute denied. Lead still stands.${note ? `\n${note}` : ""}`,
        ),
      );
    },
  };
}
