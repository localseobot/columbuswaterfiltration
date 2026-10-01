const BASE = process.env.GHL_BASE_URL || "https://services.leadconnectorhq.com";

export async function ghl({
  method,
  path,
  query,
  body,
}: {
  method: string;
  path: string;
  query?: Record<string, string | number | undefined>;
  body?: unknown;
}): Promise<Record<string, unknown>> {
  const token = process.env.GHL_PIT;
  if (!token) throw new Error("GHL_PIT is not set");
  const url = new URL(BASE + path);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Version: "2021-07-28",
    Accept: "application/json",
  };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const parsed = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  if (!res.ok) {
    throw new Error(`GHL ${method} ${path} -> ${res.status}: ${text.slice(0, 400)}`);
  }
  return parsed;
}
