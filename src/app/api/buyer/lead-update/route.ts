import { buyerAuthError, tokenFromRequest, verifyBuyerToken } from "@/lib/leads/auth";
import { getLedger } from "@/lib/leads";
import { OUTCOME_KEYS, type OutcomeKey } from "@/lib/leads/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    verifyBuyerToken(tokenFromRequest(req));
  } catch (err) {
    const { status, body } = buyerAuthError(err);
    return Response.json(body, { status });
  }
  let body: { id?: string; outcome?: string; dispute?: boolean; reason?: string } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const id = String(body.id || "").trim();
  if (!id) return Response.json({ error: "Missing lead id." }, { status: 400 });
  try {
    const ledger = getLedger();
    if (body.dispute) {
      const reason = String(body.reason || "").trim().slice(0, 500);
      if (!reason) {
        return Response.json(
          { error: "Please tell us what was wrong with this lead." },
          { status: 400 },
        );
      }
      const lead = await ledger.fileDispute(id, reason);
      return Response.json({ ok: true, dispute: lead.dispute });
    }
    const outcome = String(body.outcome || "") as OutcomeKey;
    if (!OUTCOME_KEYS.includes(outcome)) {
      return Response.json(
        { error: `Outcome must be one of: ${OUTCOME_KEYS.join(", ")}` },
        { status: 400 },
      );
    }
    const lead = await ledger.setOutcome(id, outcome);
    return Response.json({ ok: true, outcome: lead.outcome });
  } catch (err) {
    return Response.json(
      { error: "Could not save that.", detail: err instanceof Error ? err.message : "" },
      { status: 502 },
    );
  }
}
