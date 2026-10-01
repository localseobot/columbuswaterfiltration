import { buildDashboard } from "@/lib/leads/dashboard-data";
import { buyerAuthError, tokenFromRequest, verifyBuyerToken } from "@/lib/leads/auth";
import { getLedger } from "@/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    verifyBuyerToken(tokenFromRequest(req));
  } catch (err) {
    const { status, body } = buyerAuthError(err);
    return Response.json(body, { status });
  }
  const url = new URL(req.url);
  const id = url.searchParams.get("id") || "";
  try {
    const ledger = getLedger();
    if (id) {
      const lead = await ledger.get(id);
      if (!lead) return Response.json({ error: "Lead not found." }, { status: 404 });
      return Response.json({ ok: true, lead });
    }
    const leads = await ledger.list(250);
    return Response.json(buildDashboard(leads));
  } catch (err) {
    return Response.json(
      { error: "Could not load leads.", detail: err instanceof Error ? err.message : "" },
      { status: 502 },
    );
  }
}
