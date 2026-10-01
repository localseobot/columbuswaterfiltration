import { submitLead } from "@/lib/leads/submit";
import { toE164 } from "@/lib/phone";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Future call-tracking webhook. Header: x-webhook-secret = CALL_WEBHOOK_SECRET. */
export async function POST(req: Request) {
  const secret = process.env.CALL_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json({ error: "Phone lead webhook is not configured." }, { status: 503 });
  }
  if (req.headers.get("x-webhook-secret") !== secret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { name?: string; phone?: string; email?: string; message?: string } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const phone = toE164(body.phone);
  if (!phone) return Response.json({ error: "Phone is required." }, { status: 400 });
  await submitLead({
    channel: "phone",
    name: String(body.name || "Phone lead").slice(0, 120),
    phone,
    email: body.email,
    detail: body.message,
    service: "Phone call",
  });
  return Response.json({ ok: true });
}
