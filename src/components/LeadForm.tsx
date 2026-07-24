"use client";

import { useState, type FormEvent } from "react";
import { CheckIcon } from "./Icons";

type Props = {
  variant?: "test" | "contact";
};

const inputClass =
  "w-full rounded-lg border border-brand-200 bg-white px-4 py-3 text-sm text-brand-950 shadow-sm outline-none transition-colors placeholder:text-brand-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-200";

const labelClass = "mb-1.5 block text-sm font-medium text-brand-900";

export default function LeadForm({ variant = "test" }: Props) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    // No backend is wired up yet — prevent navigation and show a success state.
    // Connect this to your CRM, email service, or an API route when ready.
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-brand-100 bg-brand-50 p-8 text-center shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white">
          <CheckIcon className="h-8 w-8" />
        </div>
        <h3 className="mt-5 text-xl font-bold text-brand-950">
          Thank you — we&apos;ve got your request!
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-brand-700">
          A member of our Columbus team will reach out within one business day to
          confirm your appointment. Prefer to talk now? Call us any time.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className={labelClass}>
            First name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            autoComplete="given-name"
            className={inputClass}
            placeholder="Jane"
          />
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>
            Last name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            autoComplete="family-name"
            className={inputClass}
            placeholder="Doe"
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
            placeholder="jane@example.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className={inputClass}
            placeholder="(614) 555-0123"
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="address" className={labelClass}>
          Street address {variant === "test" && "(where we'll test your water)"}
        </label>
        <input
          id="address"
          name="address"
          type="text"
          autoComplete="street-address"
          className={inputClass}
          placeholder="123 Main St, Columbus, OH"
        />
      </div>

      {variant === "test" && (
        <div className="mt-4">
          <label htmlFor="waterSource" className={labelClass}>
            Water source
          </label>
          <select id="waterSource" name="waterSource" className={inputClass}>
            <option value="city">City / municipal water</option>
            <option value="well">Private well</option>
            <option value="unsure">Not sure</option>
          </select>
        </div>
      )}

      <div className="mt-4">
        <label htmlFor="message" className={labelClass}>
          {variant === "test"
            ? "What concerns you about your water? (optional)"
            : "How can we help?"}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={inputClass}
          placeholder={
            variant === "test"
              ? "Hard water spots, chlorine taste, dry skin, staining…"
              : "Tell us a little about what you're looking for."
          }
        />
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-full bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
      >
        {variant === "test" ? "Book My Free Water Test" : "Send Message"}
      </button>

      <p className="mt-3 text-center text-xs text-brand-500">
        By submitting, you agree to be contacted about your request. We respect
        your privacy and never sell your information.
      </p>
    </form>
  );
}
