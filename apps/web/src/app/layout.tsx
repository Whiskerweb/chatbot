import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://helloclaudia.fr"),
  title: "HelloClaudia — Déployez votre chatbot IA en 10 minutes",
  description: "HelloClaudia est la plateforme SaaS pour créer et déployer des chatbots IA entraînés sur votre documentation. Support client, ventes et opérations automatisés.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "HelloClaudia",
    title: "HelloClaudia — Déployez votre chatbot IA en 10 minutes",
    description: "Plateforme SaaS pour créer des chatbots IA entraînés sur votre documentation.",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={jakarta.variable} suppressHydrationWarning>
      <head>
        <script
          defer
          src="https://track.helloclaudia.fr/trac.js"
          data-key="pk_OIe8Q70sI3QqNYAMa4Xun2um"
        />
      </head>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "HelloClaudia",
              url: "https://helloclaudia.fr",
              logo: "https://helloclaudia.fr/logo.png",
              description: "Plateforme SaaS pour créer et déployer des chatbots IA entraînés sur votre documentation.",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "HelloClaudia",
              url: "https://helloclaudia.fr",
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
