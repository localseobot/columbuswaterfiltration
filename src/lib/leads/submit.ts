import { toE164 } from "@/lib/phone";
import { getLedger } from "./index";
import { buildLeadEmail, sendEmailResend, type SendEmail } from "./email";
import type { LeadInput, LeadLedger } from "./types";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export type SubmitBody = {
  name?: string;
  phone?: string;
  email?: string;
  service?: string;
  place?: string;
  message?: string;
  page?: string;
  website?: string;
  channel?: string;
};

function clip(v: unknown, max: number): string {
  return String(v ?? "").trim().slice(0, max);
}

export function parseLeadBody(body: SubmitBody): { error?: string; honeypot?: boolean; input?: LeadInput } {
  if (clip(body.website, 200)) return { honeypot: true };
  const name = clip(body.name, 120);
  const email = clip(body.email, 160).toLowerCase();
  const phoneRaw = clip(body.phone, 40);
  const phone = toE164(phoneRaw);
  if (!name) return { error: "Please tell us your name." };
  if (!email && !phoneRaw) {
    return { error: "Please give us a phone number or an email address." };
  }
  if (phoneRaw && !phone) return { error: "That phone number doesn't look right." };
  if (email && !EMAIL_RE.test(email)) return { error: "That email address doesn't look right." };
  const message = clip(body.message, 1500);
  const place = clip(body.place, 80);
  const page = clip(body.page, 160);
  const detail = [message, place ? `ZIP or town: ${place}` : "", page ? `Page: ${page}` : ""]
    .filter(Boolean)
    .join("\n");
  return {
    input: {
      channel: body.channel === "phone" ? "phone" : "web",
      name,
      phone: phone || undefined,
      email: email || undefined,
      service: clip(body.service, 80) || undefined,
      place: place || undefined,
      detail: detail || undefined,
      page: page || undefined,
    },
  };
}

export async function submitLead(
  input: LeadInput,
  deps?: { sendEmail?: SendEmail; ledger?: LeadLedger },
): Promise<{ ok: true; stored: boolean; duplicate: boolean; email: unknown }> {
  const ledger = deps?.ledger ?? getLedger();
  const send = deps?.sendEmail ?? sendEmailResend;
  let stored = false;
  let duplicate = false;
  let recordedLead = input;

  try {
    const recorded = await ledger.record(input);
    stored = recorded.ok;
    duplicate = recorded.duplicate;
    if (recorded.lead) {
      recordedLead = {
        ...input,
        detail: recorded.lead.detail || input.detail,
      };
    }
  } catch (err) {
    console.error(
      "LEAD_STORAGE_FAILED",
      JSON.stringify({
        error: err instanceof Error ? err.message : String(err),
        lead: input,
      }),
    );
  }

  const emailMessage = buildLeadEmail({ ...recordedLead, duplicate });
  let email: unknown;
  try {
    email = await send(emailMessage);
    const failed = email && typeof email === "object" && "error" in email && email.error;
    if (failed) {
      console.error("LEAD_EMAIL_FAILED", JSON.stringify({ email, lead: input }));
    }
  } catch (err) {
    email = { error: err instanceof Error ? err.message : String(err) };
    console.error("LEAD_EMAIL_FAILED", JSON.stringify({ email, lead: input }));
  }

  return { ok: true, stored, duplicate, email };
}
