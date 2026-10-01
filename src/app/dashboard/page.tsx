import type { Metadata } from "next";
import DashboardApp from "@/components/DashboardApp";

export const metadata: Metadata = {
  title: { absolute: "Lead dashboard | Columbus Water Filtration" },
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <DashboardApp />;
}
