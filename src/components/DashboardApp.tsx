"use client";

import { useCallback, useEffect, useState } from "react";
import { OUTCOMES, type OutcomeKey } from "@/lib/leads/types";

const TOKEN_KEY = "cwfDashToken";

type LeadRow = {
  id: string;
  receivedAt: string;
  channel: "web" | "phone";
  name: string;
  phone: string | null;
  email: string | null;
  service: string | null;
  place: string | null;
  detail: string | null;
  page: string | null;
  outcome: OutcomeKey;
  billable: boolean;
  duplicate: boolean;
  credited: boolean;
  dispute: "open" | "approved" | "denied" | null;
  notes: { at: string; body: string }[];
};

type Month = {
  key: string;
  label: string;
  total: number;
  web: number;
  phone: number;
  won: number;
  billing: { total: number; billable: number; costPerLead: number | null } | null;
};

type Payload = {
  pricing: { mode: string; perLead: number } | null;
  totals: { leads: number; won: number; worked: number; closeRate: number | null; openDisputes: number };
  thisMonth: Month | null;
  months: Month[];
  leads: LeadRow[];
};

function money(n: number | null | undefined) {
  if (n === null || n === undefined) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function when(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function DashboardApp() {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [signinMsg, setSigninMsg] = useState("");
  const [paste, setPaste] = useState("");
  const [showPaste, setShowPaste] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [rowMsg, setRowMsg] = useState<Record<string, string>>({});

  const load = useCallback(async (t: string) => {
    setError("");
    const res = await fetch("/api/buyer/leads", {
      headers: { Authorization: `Bearer ${t}` },
      cache: "no-store",
    });
    const body = (await res.json().catch(() => ({}))) as Payload & { error?: string };
    if (res.status === 401 || res.status === 410) {
      localStorage.removeItem(TOKEN_KEY);
      setToken("");
      setError(body.error || "That link is no longer valid.");
      return;
    }
    if (!res.ok) {
      setError(body.error || "Could not load leads.");
      return;
    }
    setData(body);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("t");
    if (fromUrl) {
      localStorage.setItem(TOKEN_KEY, fromUrl);
      window.history.replaceState(null, "", window.location.pathname);
      setToken(fromUrl);
    } else {
      setToken(localStorage.getItem(TOKEN_KEY) || "");
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (token) load(token);
  }, [token, load]);

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setSigninMsg("Sending…");
    const res = await fetch("/api/buyer/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const body = (await res.json().catch(() => ({}))) as { message?: string; error?: string };
    setSigninMsg(body.error || body.message || "Check your inbox.");
  }

  async function update(id: string, payload: Record<string, unknown>) {
    if (!token) return;
    setRowMsg((m) => ({ ...m, [id]: "Saving…" }));
    const res = await fetch("/api/buyer/lead-update", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...payload }),
    });
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setRowMsg((m) => ({ ...m, [id]: body.error || "Could not save." }));
      return;
    }
    setRowMsg((m) => ({ ...m, [id]: "Saved." }));
    await load(token);
  }

  if (!ready) {
    return <main className="mx-auto max-w-5xl px-6 py-16 text-brand-800">Loading…</main>;
  }

  if (!token) {
    return (
      <main className="mx-auto max-w-xl px-6 py-16">
        <div className="rounded-2xl border border-brand-100 bg-white p-8 text-center shadow-card">
          <h1 className="text-2xl font-bold text-brand-950">Lead dashboard</h1>
          <p className="mt-2 text-sm text-brand-700">
            {error || "Enter the email on the account. We will send a sign-in link that lasts 30 days."}
          </p>
          <form onSubmit={sendLink} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Email address"
              className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm"
            />
            <button className="rounded-full bg-brand-800 px-5 py-2 text-sm font-semibold text-white" type="submit">
              Email me a link
            </button>
          </form>
          {signinMsg && <p className="mt-3 text-sm text-brand-700">{signinMsg}</p>}
          <button
            type="button"
            className="mt-6 text-xs text-brand-500 underline"
            onClick={() => setShowPaste((v) => !v)}
          >
            Already have a dashboard link? Paste it
          </button>
          {showPaste && (
            <div className="mt-3 flex gap-2">
              <input
                value={paste}
                onChange={(e) => setPaste(e.target.value)}
                className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm"
                placeholder="Paste the link"
              />
              <button
                type="button"
                className="rounded-full bg-brand-800 px-4 py-2 text-sm font-semibold text-white"
                onClick={() => {
                  const m = /[?&]t=([^&]+)/.exec(paste.trim());
                  const t = m ? decodeURIComponent(m[1]) : paste.trim();
                  if (!t) return;
                  localStorage.setItem(TOKEN_KEY, t);
                  setToken(t);
                }}
              >
                Open
              </button>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-brand-950">Lead dashboard</h1>
          <p className="text-sm text-brand-600">Columbus Water Filtration</p>
        </div>
        <button
          type="button"
          className="text-sm text-brand-700 underline"
          onClick={() => {
            localStorage.removeItem(TOKEN_KEY);
            setToken("");
            setData(null);
          }}
        >
          Sign out
        </button>
      </header>

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      {!data && !error && <p className="mt-8 text-brand-700">Loading your leads…</p>}

      {data && (
        <>
          <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Tile n={String(data.thisMonth?.total ?? 0)} label="Leads this month" />
            <Tile
              n={`${data.thisMonth?.web ?? 0} / ${data.thisMonth?.phone ?? 0}`}
              label="Web / phone this month"
            />
            <Tile
              n={data.totals.closeRate === null ? "—" : `${Math.round(data.totals.closeRate * 100)}%`}
              label={`Closed won (${data.totals.won} of ${data.totals.worked} worked)`}
            />
            <Tile n={String(data.totals.openDisputes)} label="Open disputes" />
          </section>

          <section className="mt-8 rounded-2xl border border-brand-100 bg-white p-5">
            <h2 className="text-lg font-bold text-brand-950">Month by month</h2>
            <p className="mt-1 text-sm text-brand-600">
              Teal is website forms. Blue is phone.{" "}
              {data.pricing
                ? "Billing uses the lead price set in the environment."
                : "Dollar amounts stay hidden until LEAD_PRICE is set."}
            </p>
            <ul className="mt-4 space-y-3">
              {data.months.slice(0, 6).map((month) => {
                const max = Math.max(1, ...data.months.slice(0, 6).map((m) => m.total));
                return (
                  <li key={month.key} className="grid items-center gap-2 sm:grid-cols-[9rem_1fr_auto]">
                    <span className="text-sm font-medium text-brand-900">{month.label}</span>
                    <span className="flex h-3 overflow-hidden rounded bg-brand-50">
                      <span
                        className="bg-teal-accent"
                        style={{ width: `${(month.web / max) * 100}%` }}
                      />
                      <span
                        className="bg-brand-500"
                        style={{ width: `${(month.phone / max) * 100}%` }}
                      />
                    </span>
                    <span className="text-xs text-brand-600">
                      {month.web} web · {month.phone} phone
                      {month.billing ? ` · ${money(month.billing.total)}` : ""}
                    </span>
                  </li>
                );
              })}
              {!data.months.length && <li className="text-sm text-brand-600">No leads yet.</li>}
            </ul>
          </section>

          <section className="mt-8 overflow-x-auto rounded-2xl border border-brand-100 bg-white">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-brand-50 text-xs uppercase tracking-wide text-brand-600">
                <tr>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Lead</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.leads.map((lead) => (
                  <tr key={lead.id} className="border-t border-brand-100 align-top">
                    <td className="px-4 py-3 whitespace-nowrap">{when(lead.receivedAt)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-bold uppercase text-white ${
                          lead.channel === "phone" ? "bg-brand-500" : "bg-teal-accent"
                        }`}
                      >
                        {lead.channel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-brand-950">{lead.name}</div>
                      <div className="text-brand-700">{lead.phone || lead.email || "—"}</div>
                      <div className="text-brand-600">
                        {[lead.service, lead.place].filter(Boolean).join(" · ") || "—"}
                      </div>
                      {!lead.billable && (
                        <div className="mt-1 text-xs text-teal-accent">
                          {lead.credited ? "Credited" : lead.duplicate ? "Duplicate, not billable" : "Not billable"}
                        </div>
                      )}
                      {lead.dispute && (
                        <div className="text-xs text-amber-700">Dispute: {lead.dispute}</div>
                      )}
                      <button
                        type="button"
                        className="mt-1 text-xs text-brand-500 underline"
                        onClick={() => setOpenId(openId === lead.id ? null : lead.id)}
                      >
                        {openId === lead.id ? "Hide details" : "Details"}
                      </button>
                      {openId === lead.id && (
                        <div className="mt-2 whitespace-pre-wrap rounded-lg bg-brand-50 p-3 text-xs text-brand-800">
                          {lead.detail || "No message."}
                          {lead.page ? `\nPage: ${lead.page}` : ""}
                          {lead.notes.map((n) => `\n${when(n.at)} — ${n.body}`).join("")}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        aria-label={`Status for ${lead.name}`}
                        className="rounded-lg border border-brand-200 px-2 py-1"
                        value={lead.outcome}
                        onChange={(e) => update(lead.id, { outcome: e.target.value })}
                      >
                        {(Object.keys(OUTCOMES) as OutcomeKey[]).map((key) => (
                          <option key={key} value={key}>
                            {OUTCOMES[key]}
                          </option>
                        ))}
                      </select>
                      {lead.dispute !== "open" && lead.dispute !== "approved" && (
                        <DisputeButton
                          onSubmit={(reason) => update(lead.id, { dispute: true, reason })}
                        />
                      )}
                      {rowMsg[lead.id] && <p className="mt-1 text-xs text-brand-600">{rowMsg[lead.id]}</p>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </main>
  );
}

function Tile({ n, label }: { n: string; label: string }) {
  return (
    <div className="rounded-2xl border border-brand-100 bg-white p-4">
      <div className="text-2xl font-bold text-brand-950">{n}</div>
      <div className="mt-1 text-xs text-brand-600">{label}</div>
    </div>
  );
}

function DisputeButton({ onSubmit }: { onSubmit: (reason: string) => void }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  if (!open) {
    return (
      <button type="button" className="mt-2 block text-xs text-brand-500 underline" onClick={() => setOpen(true)}>
        Dispute this lead
      </button>
    );
  }
  return (
    <div className="mt-2">
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={2}
        className="w-full rounded border border-brand-200 p-2 text-xs"
        placeholder="What was wrong?"
      />
      <button
        type="button"
        className="mt-1 text-xs font-semibold text-brand-800"
        onClick={() => {
          if (!reason.trim()) return;
          onSubmit(reason.trim());
          setOpen(false);
        }}
      >
        File dispute
      </button>
    </div>
  );
}
