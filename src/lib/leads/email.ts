import { site } from "@/lib/site";
import { DEFAULT_OWNER_EMAIL, signBuyerToken } from "./auth";
import type { LeadInput } from "./types";

export const DEFAULT_FROM = `Columbus Water Filtration <leads@localwebbuilders.io>`;

export type EmailMessage = {
  to: string[];
  from: string;
  subject: string;
  html: string;
  text: string;
};

export type SendEmail = (message: EmailMessage) => Promise<{
  id?: string;
  skipped?: boolean;
  reason?: string;
  error?: string;
}>;

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Recipients for every lead. Defaults to the Local Web Builders inbox. */
export function leadRecipients(env: NodeJS.ProcessEnv = process.env): string[] {
  const raw = [
    ...(env.LEAD_NOTIFY_EMAILS
      ? env.LEAD_NOTIFY_EMAILS.split(/[,;\s]+/)
      : [env.OWNER_EMAIL || DEFAULT_OWNER_EMAIL]),
    env.BUYER_EMAIL || "",
  ];
  const seen = new Set<string>();
  for (const v of raw) {
    const e = v.trim().toLowerCase();
    if (e.includes("@")) seen.add(e);
  }
  if (!seen.size) seen.add(DEFAULT_OWNER_EMAIL);
  return [...seen];
}

export function fromAddress(env: NodeJS.ProcessEnv = process.env): string {
  return (env.RESEND_FROM || DEFAULT_FROM).trim();
}

function siteBase(): string {
  return (process.env.SITE_BASE_URL || site.url).replace(/\/$/, "");
}

function dashboardUrl(): string | null {
  try {
    return `${siteBase()}/dashboard?t=${signBuyerToken()}`;
  } catch {
    return null;
  }
}

export function buildLeadEmail(
  input: LeadInput & { duplicate?: boolean },
): EmailMessage {
  const place = input.place ? ` (${input.place})` : "";
  const subject = `New water lead: ${input.name}${place}`;
  const lines = [
    `Name: ${input.name}`,
    `Phone: ${input.phone || "—"}`,
    `Email: ${input.email || "—"}`,
    `Need: ${input.service || "—"}`,
    `ZIP or town: ${input.place || "—"}`,
    `Source: ${input.channel}`,
    `Page: ${input.page || "—"}`,
    input.duplicate ? "Dedupe: repeat contact inside the window (delivered, not billable)." : "",
    "",
    input.detail || "",
  ].filter((line) => line !== "");
  const dash = dashboardUrl();
  if (dash) lines.push("", `Dashboard: ${dash}`);
  const text = lines.join("\n");
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#0c2847">
    <p style="margin:0 0 12px"><strong>${esc(subject)}</strong></p>
    <pre style="white-space:pre-wrap;font-family:inherit">${esc(text)}</pre>
  </div>`;
  return { to: leadRecipients(), from: fromAddress(), subject, html, text };
}

/** Resend HTTPS API. Skips (and logs) when RESEND_API_KEY is missing. */
export async function sendEmailResend(message: EmailMessage) {
  const key = process.env.RESEND_API_KEY || process.env.RESEND_API;
  if (!key) {
    console.info(
      "LEAD_EMAIL_SKIPPED",
      JSON.stringify({ to: message.to, subject: message.subject, text: message.text }),
    );
    return { skipped: true, reason: "RESEND_API_KEY not set" };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: message.from,
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
    }),
  });
  const body = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
  if (!res.ok) {
    return { error: body.message || `Resend ${res.status}` };
  }
  return { id: body.id };
}
