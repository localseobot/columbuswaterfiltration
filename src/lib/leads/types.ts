export const OUTCOMES = {
  new: "New",
  contacted: "Contacted",
  booked: "Booked",
  won: "Closed won",
  lost: "Lost",
  spam: "Spam",
} as const;

export type OutcomeKey = keyof typeof OUTCOMES;

export const OUTCOME_KEYS = Object.keys(OUTCOMES) as OutcomeKey[];

export type DisputeState = "open" | "approved" | "denied";

export type LeadChannel = "web" | "phone";

export type LeadNote = {
  at: string;
  body: string;
};

/** The shape the dashboard renders. No internal credentials. */
export type Lead = {
  id: string;
  receivedAt: string;
  channel: LeadChannel;
  name: string;
  phone: string | null;
  email: string | null;
  service: string | null;
  place: string | null;
  detail: string | null;
  page: string | null;
  outcome: OutcomeKey;
  billable: boolean;
  duplicate: boolean;
  credited: boolean;
  dispute: DisputeState | null;
  contactKeys: string[];
  notes: LeadNote[];
};

export type LeadInput = {
  channel: LeadChannel;
  name: string;
  phone?: string;
  email?: string;
  service?: string;
  place?: string;
  detail?: string;
  page?: string;
};

export type RecordResult = {
  ok: boolean;
  lead: Lead | null;
  duplicate: boolean;
  billable: boolean;
  error?: string;
};

export interface LeadLedger {
  readonly driver: "file" | "redis" | "ghl";
  record(input: LeadInput): Promise<RecordResult>;
  list(limit?: number): Promise<Lead[]>;
  get(id: string): Promise<Lead | null>;
  setOutcome(id: string, outcome: OutcomeKey): Promise<Lead>;
  fileDispute(id: string, reason: string): Promise<Lead>;
  resolveDispute(
    id: string,
    decision: "approved" | "denied",
    note?: string,
  ): Promise<Lead>;
}
