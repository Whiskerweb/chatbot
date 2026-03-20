import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

import { useCases } from "@/data/marketing/use-cases";
import { HeroSection } from "@/components/marketing/hero-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";

export function generateMetadata(): Metadata {
  return {
    title: "Cas d'utilisation | HelloClaudia",
    description:
      "Découvrez comment les entreprises utilisent HelloClaudia pour automatiser leur support client, générer des leads, guider l'onboarding et bien plus.",
  };
}

export default function UseCasesPage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <HeroSection
        title="Comment les entreprises utilisent HelloClaudia"
        subtitle="Du support client à la génération de leads, découvrez comment un chatbot IA entraîné sur vos données transforme chaque interaction."
        primaryCta={{ label: "Commencer gratuitement", href: "/sign-up" }}
        secondaryCta={{ label: "Réserver une démo", href: "#cta" }}
        note="100 crédits gratuits · Aucune carte bancaire requise"
      />

      {/* ─── Use Cases Grid ─── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {useCases.map((uc, i) => (
            <ScrollReveal key={uc.slug} delay={i * 100}>
              <Link
                href={`/cas-utilisation/${uc.slug}`}
                className="group rounded-3xl bg-card shadow-apple p-8 transition-all duration-200 hover:shadow-apple-hover hover:-translate-y-0.5 block"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60">
                  <uc.icon className="h-6 w-6 text-foreground" strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 text-base font-semibold tracking-tight">
                  {uc.shortTitle}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {uc.description}
                </p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                  En savoir plus
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <div id="cta">
        <CtaSection
          title="Prêt à automatiser avec l'IA ?"
          subtitle="Créez votre premier chatbot en quelques minutes et découvrez l'impact sur votre activité."
        />
      </div>
    </>
  );
}
