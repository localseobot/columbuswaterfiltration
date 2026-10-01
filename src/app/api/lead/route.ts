import { clientIp, rateLimit } from "@/lib/leads/rate-limit";
import { parseLeadBody, submitLead } from "@/lib/leads/submit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = parseLeadBody(body);
  if (parsed.honeypot) return Response.json({ ok: true });
  if (parsed.error || !parsed.input) {
    return Response.json({ error: parsed.error || "Check the form and try again." }, { status: 400 });
  }

  if (!rateLimit(`lead:${clientIp(req)}`)) {
    return Response.json(
      { error: "Please wait a few minutes and try again, or call us." },
      { status: 429 },
    );
  }

  await submitLead(parsed.input);
  return Response.json({ ok: true });
}
