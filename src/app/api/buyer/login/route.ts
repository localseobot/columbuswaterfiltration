import { site } from "@/lib/site";
import {
  canSignInToDashboard,
  SIGN_IN_TTL_DAYS,
  signBuyerToken,
} from "@/lib/leads/auth";
import { fromAddress, sendEmailResend } from "@/lib/leads/email";
import { rateLimit } from "@/lib/leads/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GENERIC = {
  ok: true,
  message:
    "If that address can open the dashboard, a sign-in link is on its way. Check spam if it has not arrived in a minute.",
};

export async function POST(req: Request) {
  let body: { email?: string } = {};
  try {
    body = (await req.json()) as { email?: string };
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const email = String(body.email || "").trim().toLowerCase();
  if (!email.includes("@")) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!canSignInToDashboard(email)) return Response.json(GENERIC);
  if (!rateLimit(`login:${email}`, 1, 60_000)) return Response.json(GENERIC);

  let url: string;
  try {
    const base = (process.env.SITE_BASE_URL || site.url).replace(/\/$/, "");
    url = `${base}/dashboard?t=${signBuyerToken()}`;
  } catch {
    return Response.json(
      { error: "Sign-in is not switched on yet. Set BUYER_SECRET." },
      { status: 503 },
    );
  }

  const subject = "Your Columbus Water Filtration dashboard link";
  const text = `Open the lead dashboard (this link signs you in for ${SIGN_IN_TTL_DAYS} days):\n\n${url}\n\nIf you did not ask for this, ignore it.`;
  const html = `<p style="font-family:Arial,sans-serif">Open the lead dashboard. This link signs you in for ${SIGN_IN_TTL_DAYS} days.</p><p><a href="${url}">Open my dashboard</a></p><p style="font-size:13px;word-break:break-all">${url}</p>`;
  const sent = await sendEmailResend({
    to: [email],
    from: fromAddress(),
    subject,
    html,
    text,
  });
  if (sent.error || sent.skipped) {
    return Response.json(
      { error: "We could not send the email just now. Try again in a minute." },
      { status: 502 },
    );
  }
  return Response.json(GENERIC);
}
