"use client";

import Link from "next/link";
import { useState } from "react";
import { nav } from "@/lib/site";
import { DropletIcon } from "./Icons";
import PhoneLink from "./PhoneLink";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-water-gradient text-white shadow-sm">
            <DropletIcon className="h-6 w-6" />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-bold tracking-tight text-brand-950">
              Columbus Water
            </span>
            <span className="block text-xs font-medium uppercase tracking-[0.16em] text-teal-accent">
              Filtration
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-brand-900 transition-colors hover:text-brand-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <PhoneLink className="text-sm font-semibold text-brand-800" />
          <Link
            href="/free-water-test"
            className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
          >
            Free Water Test
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-brand-900 hover:bg-brand-50 md:hidden"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {open ? (
              <path d="M6 6l12 12M18 6 6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-brand-100 bg-white md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3 sm:px-6">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-base font-medium text-brand-900 hover:bg-brand-50"
              >
                {item.label}
              </Link>
            ))}
            <PhoneLink className="rounded-lg px-2 py-3 text-base font-semibold text-brand-800" />
            <Link
              href="/free-water-test"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-brand-600 px-5 py-3 text-center text-base font-semibold text-white"
            >
              Get a Free Water Test
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
