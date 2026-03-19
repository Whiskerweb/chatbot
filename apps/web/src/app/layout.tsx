import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ChatBot AI — Déployez votre chatbot IA en 10 minutes",
  description: "Plateforme SaaS pour créer et déployer des chatbots IA entraînés sur votre documentation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={jakarta.variable} suppressHydrationWarning>
      <body className="font-sans">{children}</body>
    </html>
  );
}
