"use client";

import PhoneLink from "./PhoneLink";

export default function StickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-brand-100 bg-white/95 p-3 backdrop-blur md:hidden">
      <div className="grid grid-cols-2 gap-2">
        <PhoneLink
          label="Call"
          className="inline-flex items-center justify-center rounded-full border border-brand-300 px-4 py-3 text-sm font-semibold text-brand-800"
        />
        <a
          href="#quote"
          className="inline-flex items-center justify-center rounded-full bg-brand-600 px-4 py-3 text-sm font-semibold text-white"
        >
          Free water test
        </a>
      </div>
    </div>
  );
}
