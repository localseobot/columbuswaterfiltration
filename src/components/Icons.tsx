import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function DropletIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2.5c3.5 4.2 6.5 7.5 6.5 11a6.5 6.5 0 0 1-13 0c0-3.5 3-6.8 6.5-11Z" />
      <path d="M9 13.5a3 3 0 0 0 3 3" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2.5 5 5.2v5.6c0 4.4 3 8.3 7 9.7 4-1.4 7-5.3 7-9.7V5.2L12 2.5Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6 9.5V20h12V9.5" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v18M3 12h18M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function LeafIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20c0-8 6-14 16-14 0 10-6 16-16 14Z" />
      <path d="M4 20c4-6 8-8 12-9" />
    </svg>
  );
}

export function BeakerIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 3h6M10 3v6l-4.5 8A2 2 0 0 0 7.3 20h9.4a2 2 0 0 0 1.8-3L14 9V3" />
      <path d="M7.5 14h9" />
    </svg>
  );
}

export function GearIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" />
    </svg>
  );
}

export function WavesIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5c0 8.3 6.7 15 15 15a1.6 1.6 0 0 0 1.6-1.6v-2.3a1.3 1.3 0 0 0-1-1.3l-3-.7a1.3 1.3 0 0 0-1.3.4l-1 1a11.5 11.5 0 0 1-5-5l1-1a1.3 1.3 0 0 0 .4-1.3l-.7-3A1.3 1.3 0 0 0 8.7 3H6.4A1.6 1.6 0 0 0 4 5Z" />
    </svg>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s7-5.7 7-11a7 7 0 0 0-14 0c0 5.3 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m4 12 5 5L20 6" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.9 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9L12 2.5Z" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export const iconMap = {
  DropletIcon,
  ShieldIcon,
  HomeIcon,
  SparkleIcon,
  LeafIcon,
  BeakerIcon,
  GearIcon,
  WavesIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  MailIcon,
  CheckIcon,
  StarIcon,
  ArrowRightIcon,
} as const;

export type IconName = keyof typeof iconMap;

export function Icon({
  name,
  ...props
}: { name: IconName } & IconProps) {
  const Cmp = iconMap[name];
  return <Cmp {...props} />;
}
