import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import type { Lead, LeadInput, LeadLedger, OutcomeKey, RecordResult } from "./types";
import { OUTCOMES } from "./types";
import { buildLead, dedupeDays, isRecentDuplicate } from "./dedupe";

type FileShape = { leads: Lead[] };

function filePath(): string {
  if (process.env.LEAD_DATA_FILE) return process.env.LEAD_DATA_FILE;
  // Keep tracing off the rest of the repo. Leads on Vercel belong in Redis.
  return path.join(/*turbopackIgnore: true*/ process.cwd(), ".data", "leads.json");
}

let chain: Promise<unknown> = Promise.resolve();

function locked<T>(fn: () => Promise<T>): Promise<T> {
  const run = chain.then(fn, fn);
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readFile(): Promise<FileShape> {
  try {
    const raw = await fs.readFile(filePath(), "utf8");
    const parsed = JSON.parse(raw) as FileShape;
    if (!parsed || !Array.isArray(parsed.leads)) return { leads: [] };
    return parsed;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return { leads: [] };
    throw err;
  }
}

async function writeFile(data: FileShape): Promise<void> {
  const file = filePath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data), "utf8");
  await fs.rename(tmp, file);
}

function addNote(lead: Lead, body: string): Lead {
  return {
    ...lead,
    notes: [{ at: new Date().toISOString(), body }, ...lead.notes],
  };
}

export function createFileLedger(): LeadLedger {
  return {
    driver: "file",
    async record(input: LeadInput): Promise<RecordResult> {
      return locked(async () => {
        const data = await readFile();
        const keys = buildLead(input, {
          id: "tmp",
          now: new Date(),
          duplicate: false,
        }).contactKeys;
        const duplicate = isRecentDuplicate(data.leads, keys, dedupeDays());
        const lead = buildLead(input, {
          id: `lead_${crypto.randomBytes(8).toString("hex")}`,
          now: new Date(),
          duplicate,
        });
        data.leads.unshift(lead);
        await writeFile(data);
        return { ok: true, lead, duplicate, billable: lead.billable };
      });
    },
    async list(limit = 250): Promise<Lead[]> {
      const data = await readFile();
      return data.leads
        .slice()
        .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))
        .slice(0, limit);
    },
    async get(id: string): Promise<Lead | null> {
      const data = await readFile();
      return data.leads.find((l) => l.id === id) || null;
    },
    async setOutcome(id: string, outcome: OutcomeKey): Promise<Lead> {
      return locked(async () => {
        const data = await readFile();
        const i = data.leads.findIndex((l) => l.id === id);
        if (i < 0) throw new Error("lead not found");
        const next = addNote(data.leads[i], `Status set to ${OUTCOMES[outcome]}.`);
        next.outcome = outcome;
        data.leads[i] = next;
        await writeFile(data);
        return next;
      });
    },
    async fileDispute(id: string, reason: string): Promise<Lead> {
      return locked(async () => {
        const data = await readFile();
        const i = data.leads.findIndex((l) => l.id === id);
        if (i < 0) throw new Error("lead not found");
        let next = addNote(
          data.leads[i],
          `Dispute filed.\nReason: ${reason || "(none)"}`,
        );
        next = { ...next, dispute: "open" };
        data.leads[i] = next;
        await writeFile(data);
        return next;
      });
    },
    async resolveDispute(id, decision, note): Promise<Lead> {
      return locked(async () => {
        const data = await readFile();
        const i = data.leads.findIndex((l) => l.id === id);
        if (i < 0) throw new Error("lead not found");
        const approved = decision === "approved";
        let next = addNote(
          data.leads[i],
          approved
            ? `Dispute approved. Lead credited and no longer billable.${note ? `\n${note}` : ""}`
            : `Dispute denied. Lead still stands.${note ? `\n${note}` : ""}`,
        );
        next = {
          ...next,
          dispute: approved ? "approved" : "denied",
          credited: approved ? true : next.credited,
          billable: approved ? false : next.billable,
        };
        data.leads[i] = next;
        await writeFile(data);
        return next;
      });
    },
  };
}
