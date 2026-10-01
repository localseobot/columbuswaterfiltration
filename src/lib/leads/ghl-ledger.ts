/**
 * GoHighLevel adapter. Not the default. Set LEDGER_DRIVER=ghl plus:
 *   GHL_PIT, GHL_LOCATION_ID, GHL_PIPELINE_ID, GHL_STAGE_NEW
 * Optional stage ids: GHL_STAGE_CONTACTED, GHL_STAGE_BOOKED, GHL_STAGE_WON, GHL_STAGE_LOST
 *
 * The lead document is stored in a contact note prefixed with CWF_LEAD.
 * Outcome, dispute, and credit live on that JSON so the dashboard shape
 * matches the file and Redis ledgers.
 */
import crypto from "node:crypto";
import { ghl } from "./ghl";
import type { Lead, LeadInput, LeadLedger, OutcomeKey, RecordResult } from "./types";
import { OUTCOMES } from "./types";
import { buildLead, dedupeDays } from "./dedupe";

const MARKER = "CWF_LEAD ";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

function stageFor(outcome: OutcomeKey): string | undefined {
  const map: Record<OutcomeKey, string | undefined> = {
    new: process.env.GHL_STAGE_NEW,
    contacted: process.env.GHL_STAGE_CONTACTED || process.env.GHL_STAGE_NEW,
    booked: process.env.GHL_STAGE_BOOKED || process.env.GHL_STAGE_NEW,
    won: process.env.GHL_STAGE_WON || process.env.GHL_STAGE_NEW,
    lost: process.env.GHL_STAGE_LOST || process.env.GHL_STAGE_NEW,
    spam: process.env.GHL_STAGE_LOST || process.env.GHL_STAGE_NEW,
  };
  return map[outcome];
}

function statusFor(outcome: OutcomeKey): string {
  if (outcome === "won") return "won";
  if (outcome === "lost") return "lost";
  if (outcome === "spam") return "abandoned";
  return "open";
}

async function addNote(contactId: string, body: string) {
  await ghl({
    method: "POST",
    path: `/contacts/${contactId}/notes`,
    body: { body },
  });
}

function parseLead(notes: { body?: string }[]): Lead | null {
  for (const note of notes) {
    const body = String(note.body || "");
    const idx = body.indexOf(MARKER);
    if (idx >= 0) {
      try {
        return JSON.parse(body.slice(idx + MARKER.length)) as Lead;
      } catch {
        return null;
      }
    }
  }
  return null;
}

async function notesFor(contactId: string): Promise<{ body?: string }[]> {
  const res = await ghl({ method: "GET", path: `/contacts/${contactId}/notes` });
  const notes = res.notes;
  return Array.isArray(notes) ? (notes as { body?: string }[]) : [];
}

async function saveLead(contactId: string, lead: Lead) {
  await addNote(contactId, `${MARKER}${JSON.stringify(lead)}`);
  const stage = stageFor(lead.outcome);
  if (stage && process.env.GHL_PIPELINE_ID) {
    await ghl({
      method: "PUT",
      path: `/opportunities/${lead.id}`,
      body: {
        pipelineId: process.env.GHL_PIPELINE_ID,
        pipelineStageId: stage,
        status: statusFor(lead.outcome),
      },
    }).catch(() => {});
  }
}

export function createGhlLedger(): LeadLedger {
  return {
    driver: "ghl",
    async record(input: LeadInput): Promise<RecordResult> {
      const locationId = requireEnv("GHL_LOCATION_ID");
      const pipelineId = requireEnv("GHL_PIPELINE_ID");
      const stage = requireEnv("GHL_STAGE_NEW");
      const name = input.name;
      const space = name.indexOf(" ");
      const upsert = await ghl({
        method: "POST",
        path: "/contacts/upsert",
        body: {
          locationId,
          email: input.email || undefined,
          phone: input.phone || undefined,
          firstName: (space > 0 ? name.slice(0, space) : name) || undefined,
          lastName: space > 0 ? name.slice(space + 1) : undefined,
          country: "US",
          source: input.channel === "phone" ? "Inbound call" : "Website — quote form",
        },
      });
      const contact = (upsert.contact || upsert) as { id?: string };
      const contactId = contact.id;
      if (!contactId) throw new Error("GHL contact upsert returned no id");

      const existingNotes = await notesFor(contactId);
      const prior = parseLead(existingNotes);
      const duplicate = Boolean(
        prior &&
          Date.now() - new Date(prior.receivedAt).getTime() < dedupeDays() * 86_400_000,
      );

      const opp = await ghl({
        method: "POST",
        path: "/opportunities/",
        body: {
          pipelineId,
          pipelineStageId: stage,
          locationId,
          contactId,
          name: input.name,
          status: "open",
          monetaryValue: 0,
        },
      });
      const opportunity = (opp.opportunity || opp) as { id?: string };
      const id = opportunity.id || `lead_${crypto.randomBytes(6).toString("hex")}`;
      const lead = buildLead(input, { id, now: new Date(), duplicate });
      await saveLead(contactId, lead);
      return { ok: true, lead, duplicate, billable: lead.billable };
    },
    async list(limit = 100): Promise<Lead[]> {
      const locationId = requireEnv("GHL_LOCATION_ID");
      const pipelineId = process.env.GHL_PIPELINE_ID;
      const res = await ghl({
        method: "GET",
        path: "/opportunities/search",
        query: { location_id: locationId, pipeline_id: pipelineId, limit },
      });
      const opps = (res.opportunities as { id: string; contactId?: string }[]) || [];
      const leads: Lead[] = [];
      for (const opp of opps) {
        if (!opp.contactId) continue;
        const parsed = parseLead(await notesFor(opp.contactId));
        if (parsed) leads.push({ ...parsed, id: parsed.id || opp.id });
      }
      return leads.sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
    },
    async get(id: string): Promise<Lead | null> {
      const rows = await this.list(100);
      return rows.find((l) => l.id === id) || null;
    },
    async setOutcome(id: string, outcome: OutcomeKey): Promise<Lead> {
      const lead = await this.get(id);
      if (!lead) throw new Error("lead not found");
      const opp = await ghl({ method: "GET", path: `/opportunities/${id}` });
      const opportunity = (opp.opportunity || opp) as { contactId?: string };
      if (!opportunity.contactId) throw new Error("lead not found");
      const next: Lead = {
        ...lead,
        outcome,
        notes: [
          { at: new Date().toISOString(), body: `Status set to ${OUTCOMES[outcome]}.` },
          ...lead.notes,
        ],
      };
      await saveLead(opportunity.contactId, next);
      return next;
    },
    async fileDispute(id: string, reason: string): Promise<Lead> {
      const lead = await this.get(id);
      if (!lead) throw new Error("lead not found");
      const opp = await ghl({ method: "GET", path: `/opportunities/${id}` });
      const opportunity = (opp.opportunity || opp) as { contactId?: string };
      if (!opportunity.contactId) throw new Error("lead not found");
      const next: Lead = {
        ...lead,
        dispute: "open",
        notes: [
          { at: new Date().toISOString(), body: `Dispute filed.\nReason: ${reason}` },
          ...lead.notes,
        ],
      };
      await saveLead(opportunity.contactId, next);
      return next;
    },
    async resolveDispute(id, decision, note): Promise<Lead> {
      const lead = await this.get(id);
      if (!lead) throw new Error("lead not found");
      const opp = await ghl({ method: "GET", path: `/opportunities/${id}` });
      const opportunity = (opp.opportunity || opp) as { contactId?: string };
      if (!opportunity.contactId) throw new Error("lead not found");
      const approved = decision === "approved";
      const next: Lead = {
        ...lead,
        dispute: approved ? "approved" : "denied",
        credited: approved ? true : lead.credited,
        billable: approved ? false : lead.billable,
        notes: [
          {
            at: new Date().toISOString(),
            body: approved ? `Dispute approved. ${note || ""}` : `Dispute denied. ${note || ""}`,
          },
          ...lead.notes,
        ],
      };
      await saveLead(opportunity.contactId, next);
      return next;
    },
  };
}
