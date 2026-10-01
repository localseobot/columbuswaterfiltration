"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

type Phone = { href: string; display: string };

const fallback: Phone = { href: site.phoneHref, display: site.phone };

let pending: Promise<Phone> | null = null;

function loadPhone(): Promise<Phone> {
  if (!pending) {
    pending = fetch("/api/site-config")
      .then((r) => (r.ok ? r.json() : null))
      .then((cfg) => {
        if (cfg?.trackingHref && cfg?.trackingDisplay) {
          return { href: cfg.trackingHref, display: cfg.trackingDisplay };
        }
        return fallback;
      })
      .catch(() => fallback);
  }
  return pending;
}

/**
 * Click-to-call link. The HTML starts with the number in src/lib/site.ts.
 * /api/site-config replaces it when TRACKING_NUMBER is set, so a renter's
 * tracking line can change without a code edit.
 */
export default function PhoneLink({
  className,
  label,
  prefix,
}: {
  className?: string;
  /** Visible label. Defaults to the formatted number. */
  label?: string;
  prefix?: string;
}) {
  const [phone, setPhone] = useState<Phone>(fallback);

  useEffect(() => {
    let active = true;
    loadPhone().then((next) => {
      if (active) setPhone(next);
    });
    return () => {
      active = false;
    };
  }, []);

  const text = label ?? phone.display;
  return (
    <a href={phone.href} className={className}>
      {prefix ? `${prefix} ` : ""}
      {text}
      {label ? <span className="sr-only"> at {phone.display}</span> : null}
    </a>
  );
}
