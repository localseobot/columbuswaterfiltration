import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import { getTrackingNumber } from "@/lib/phone";
import { businessJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Water Filtration in Columbus, OH | Whole Home Systems & Softeners",
    template: "%s",
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const phone = getTrackingNumber();
  const schema = {
    ...businessJsonLd(),
    telephone: phone.e164 || phone.display,
  };
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-brand-950">
        <JsonLd data={schema} />
        {children}
      </body>
    </html>
  );
}
