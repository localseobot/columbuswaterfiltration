import { DROP_PATH, OHIO_PATH } from "@/lib/brand";

type LogoMarkProps = {
  className?: string;
  /** Fill for the Ohio outline. */
  fill?: string;
  /** Fill for the drop. */
  dropFill?: string;
};

export function LogoMark({
  className,
  fill = "currentColor",
  dropFill = "#ffffff",
}: LogoMarkProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d={OHIO_PATH} fill={fill} />
      <path d={DROP_PATH} fill={dropFill} />
    </svg>
  );
}

type LogoProps = {
  /** "light" for white backgrounds, "dark" for the navy footer. */
  tone?: "light" | "dark";
};

export default function Logo({ tone = "light" }: LogoProps) {
  const dark = tone === "dark";
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark
        className="h-10 w-10 shrink-0"
        fill={dark ? "#ffffff" : "var(--color-navy)"}
        dropFill={dark ? "var(--color-navy)" : "#ffffff"}
      />
      <span className="leading-none">
        <span
          className={`block font-display text-[1.35rem] font-bold tracking-tight ${
            dark ? "text-white" : "text-navy"
          }`}
        >
          Columbus
        </span>
        <span className="mt-1 block text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-brick">
          Water Filtration
        </span>
      </span>
    </span>
  );
}
