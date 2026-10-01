import { getLedger } from "@/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const token = process.env.ADMIN_TOKEN;
  const auth = req.headers.get("authorization") || "";
  if (!token || auth !== `Bearer ${token}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { id?: string; decision?: string; note?: string } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const decision = body.decision === "approved" || body.decision === "denied" ? body.decision : null;
  if (!body.id || !decision) {
    return Response.json({ error: "id and decision (approved or denied) are required." }, { status: 400 });
  }
  try {
    const lead = await getLedger().resolveDispute(body.id, decision, body.note);
    return Response.json({ ok: true, lead });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Could not resolve dispute." },
      { status: 502 },
    );
  }
}
