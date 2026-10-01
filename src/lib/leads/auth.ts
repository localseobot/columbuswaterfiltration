import crypto from "node:crypto";

const PURPOSE = "buyer-dashboard";
const VERSION = 1;
export const SIGN_IN_TTL_DAYS = 30;
export const SIGN_IN_TTL_SECONDS = SIGN_IN_TTL_DAYS * 24 * 60 * 60;

export const DEFAULT_OWNER_EMAIL = "devyn@localwebbuilders.io";

function secret(): string {
  const s = process.env.BUYER_SECRET || process.env.DASHBOARD_SECRET;
  if (!s) throw new Error("BUYER_SECRET is not set");
  return s;
}

export function currentNonce(): string {
  return process.env.BUYER_ACCESS_NONCE || "v1";
}

function b64urlEncode(buf: Buffer | string): string {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function b64urlDecode(str: string): Buffer {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  return Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

function sign(payloadJson: string): Buffer {
  return crypto.createHmac("sha256", secret()).update(payloadJson).digest();
}

function withCode(err: Error, code: string): Error & { code: string } {
  return Object.assign(err, { code });
}

/** Mint a dashboard token. Default life is 30 days. */
export function signBuyerToken({
  ttlSeconds = SIGN_IN_TTL_SECONDS,
}: { ttlSeconds?: number } = {}): string {
  const payload = {
    sub: "buyer",
    nonce: currentNonce(),
    purpose: PURPOSE,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
    v: VERSION,
  };
  const payloadJson = JSON.stringify(payload);
  return `${b64urlEncode(payloadJson)}.${b64urlEncode(sign(payloadJson))}`;
}

/**
 * Verify signature, purpose, expiry, and the access nonce.
 * Changing BUYER_ACCESS_NONCE revokes every outstanding link.
 */
export function verifyBuyerToken(token: string): { sub: string; exp: number } {
  if (!token || !token.includes(".")) {
    throw withCode(new Error("malformed token"), "malformed");
  }
  const [payloadPart, sigPart] = token.split(".");
  if (!payloadPart || !sigPart) {
    throw withCode(new Error("malformed token"), "malformed");
  }

  let payloadJson: string;
  let payload: { purpose?: string; exp?: number; nonce?: string; sub?: string };
  try {
    payloadJson = b64urlDecode(payloadPart).toString("utf8");
    payload = JSON.parse(payloadJson);
  } catch {
    throw withCode(new Error("malformed token"), "malformed");
  }

  const expected = sign(payloadJson);
  const given = b64urlDecode(sigPart);
  if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) {
    throw withCode(new Error("bad signature"), "badsig");
  }
  if (payload.purpose !== PURPOSE) {
    throw withCode(new Error("wrong purpose"), "purpose");
  }
  if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) {
    throw withCode(new Error("token expired"), "expired");
  }
  if (String(payload.nonce ?? "") !== currentNonce()) {
    throw withCode(new Error("token revoked"), "revoked");
  }
  return { sub: payload.sub || "buyer", exp: payload.exp };
}

export function buyerAuthError(err: unknown): { status: number; body: { error: string } } {
  const code = (err as { code?: string })?.code;
  if (code === "expired" || code === "revoked") {
    return {
      status: 410,
      body: { error: "This dashboard link is no longer valid. Request a new one." },
    };
  }
  return { status: 401, body: { error: "Invalid dashboard link." } };
}

/** Who may request a magic link. The default owner is always included. */
export function dashboardLoginEmails(source: NodeJS.ProcessEnv = process.env): string[] {
  const raw = [
    DEFAULT_OWNER_EMAIL,
    source.OWNER_EMAIL,
    source.BUYER_EMAIL,
    ...String(source.DASHBOARD_EMAILS || "").split(/[,;\s]+/),
  ];
  const seen = new Set<string>();
  for (const v of raw) {
    const e = String(v || "").trim().toLowerCase();
    if (e.includes("@")) seen.add(e);
  }
  return [...seen];
}

export function canSignInToDashboard(
  email: string,
  source: NodeJS.ProcessEnv = process.env,
): boolean {
  const e = String(email || "").trim().toLowerCase();
  return e.length > 0 && dashboardLoginEmails(source).includes(e);
}

export function tokenFromRequest(req: Request): string {
  const auth = req.headers.get("authorization") || "";
  if (auth.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim();
  const url = new URL(req.url);
  return url.searchParams.get("t") || "";
}
