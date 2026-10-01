"use client";

import { useId, useState, type FormEvent } from "react";
import { formOptions } from "@/data/catalog";
import { CheckIcon } from "./Icons";
import PhoneLink from "./PhoneLink";

type Props = {
  variant?: "hero" | "quote" | "contact";
  defaultService?: string;
  pagePath?: string;
};

const inputClass =
  "w-full rounded-lg border border-brand-200 bg-white px-4 py-3 text-sm text-brand-950 shadow-sm outline-none transition-colors placeholder:text-brand-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-200";

const labelClass = "mb-1.5 block text-sm font-medium text-brand-900";

const options = formOptions();

export default function LeadForm({
  variant = "quote",
  defaultService = "Free water test",
  pagePath,
}: Props) {
  const uid = useId();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const serviceDefault = options.includes(defaultService)
    ? defaultService
    : "Free water test";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      phone: String(data.get("phone") || ""),
      email: String(data.get("email") || ""),
      service: String(data.get("service") || ""),
      place: String(data.get("place") || ""),
      message: String(data.get("message") || ""),
      website: String(data.get("website") || ""),
      page:
        pagePath ||
        (typeof window !== "undefined" ? window.location.pathname : ""),
    };

    setPending(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(body.error || "Something went wrong. Please call us.");
        setPending(false);
        return;
      }
      const detail = {
        page: payload.page,
        service: payload.service,
      };
      window.dispatchEvent(new CustomEvent("cwf:lead-submitted", { detail }));
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "generate_lead", ...detail });
      window.cwfTrackLead?.(detail);
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please call us.");
      setPending(false);
    }
  }

  if (submitted) {
    return (
      <div
        className="rounded-2xl border border-brand-100 bg-brand-50 p-8 text-center shadow-card"
        role="status"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white">
          <CheckIcon className="h-8 w-8" />
        </div>
        <h3 className="mt-5 text-xl font-bold text-brand-950">
          Thanks — we have your request.
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-brand-700">
          We will contact you within one business day. If you would rather talk
          now, call{" "}
          <PhoneLink className="font-semibold text-brand-700 underline" />.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={
        variant === "hero"
          ? "relative rounded-3xl bg-white p-6 shadow-2xl sm:p-7"
          : "relative rounded-2xl border border-brand-100 bg-white p-6 shadow-card sm:p-8"
      }
    >
      <div className="mb-4">
        <h2 className="text-xl font-bold text-brand-950">
          {variant === "contact" ? "Send a message" : "Free water test"}
        </h2>
        <p className="mt-1 text-sm text-brand-600">
          Name and phone or email. We will follow up. No prices on this form.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={`${uid}-name`} className={labelClass}>
            Name
          </label>
          <input
            id={`${uid}-name`}
            name="name"
            type="text"
            required
            autoComplete="name"
            className={inputClass}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor={`${uid}-phone`} className={labelClass}>
            Phone
          </label>
          <input
            id={`${uid}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            className={inputClass}
            placeholder="(614) 555-0123"
          />
        </div>
        <div>
          <label htmlFor={`${uid}-email`} className={labelClass}>
            Email <span className="font-normal text-brand-500">(optional)</span>
          </label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            autoComplete="email"
            className={inputClass}
            placeholder="you@email.com"
          />
        </div>
        <div>
          <label htmlFor={`${uid}-service`} className={labelClass}>
            What do you need?
          </label>
          <select
            id={`${uid}-service`}
            name="service"
            defaultValue={serviceDefault}
            className={inputClass}
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${uid}-place`} className={labelClass}>
            ZIP or town{" "}
            <span className="font-normal text-brand-500">(optional)</span>
          </label>
          <input
            id={`${uid}-place`}
            name="place"
            type="text"
            autoComplete="postal-code"
            className={inputClass}
            placeholder="43017 or Dublin"
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor={`${uid}-message`} className={labelClass}>
          Message <span className="font-normal text-brand-500">(optional)</span>
        </label>
        <textarea
          id={`${uid}-message`}
          name="message"
          rows={variant === "hero" ? 3 : 4}
          className={inputClass}
          placeholder="Spots on glass, chlorine taste, well water, rotten-egg smell…"
        />
      </div>

      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input
          id={`${uid}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 w-full rounded-full bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Request my free water test"}
      </button>
      <p className="mt-3 text-center text-xs text-brand-500">
        By submitting, you agree to be contacted about this request. We do not
        sell your information.
      </p>
    </form>
  );
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    cwfTrackLead?: (detail: { page?: string; service?: string }) => void;
  }
}
