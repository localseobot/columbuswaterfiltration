import Footer from "@/components/Footer";
import Header from "@/components/Header";
import QuoteSection from "@/components/QuoteSection";
import StickyCta from "@/components/StickyCta";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <QuoteSection />
      <Footer />
      <div className="h-16 md:hidden" aria-hidden="true" />
      <StickyCta />
    </>
  );
}
