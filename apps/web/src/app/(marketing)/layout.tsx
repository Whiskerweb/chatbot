import Script from "next/script";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Grid pattern — concentrated at top, fades out */}
      <div
        className="absolute inset-x-0 top-0 h-[900px] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 100%)",
        }}
      />
      <Header />
      <main>{children}</main>
      <Footer />
      <Script
        src="https://www.helloclaudia.fr/widget.js"
        data-agent-id="cmn4hivu70001l804k2w0gohi"
        strategy="afterInteractive"
      />
    </div>
  );
}
