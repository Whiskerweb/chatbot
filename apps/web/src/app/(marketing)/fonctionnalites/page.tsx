import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

import { features } from "@/data/marketing/features";
import { HeroSection } from "@/components/marketing/hero-section";
import { SectionHeader } from "@/components/marketing/section-header";
import { CtaSection } from "@/components/marketing/cta-section";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { illustrationMap } from "@/components/marketing/illustrations";

export const metadata: Metadata = {
  title: "Fonctionnalités | Claudia",
  description:
    "Découvrez toutes les fonctionnalités de Claudia : agent IA, sources & RAG, analytics, widget personnalisable, API et sécurité.",
};

export default function FeaturesPage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <HeroSection
        title="Une plateforme complète"
        titleAccent="pour vos chatbots IA"
        subtitle="Agent IA, indexation de sources, analytics avancés, widget personnalisable, API REST et sécurité enterprise. Tout ce dont vous avez besoin pour déployer et piloter vos chatbots."
        primaryCta={{ label: "Commencer gratuitement", href: "/sign-up" }}
        secondaryCta={{ label: "Voir les tarifs", href: "/tarifs" }}
        note="100 crédits gratuits — Aucune carte bancaire requise"
      />

      {/* ─── Feature Cards Grid ─── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeader
          title="Tout ce qu'il vous faut"
          subtitle="Six piliers pour un chatbot IA performant, fiable et facile à gérer."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal key={feature.slug} delay={i * 100}>
                <Link
                  href={`/fonctionnalites/${feature.slug}`}
                  className="group rounded-3xl bg-card shadow-apple p-8 transition-all duration-200 hover:shadow-apple-hover hover:-translate-y-0.5 motion-safe:hover:scale-[1.02] block"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60 transition-transform duration-200 group-hover:scale-110">
                    <Icon className="h-5 w-5 text-foreground" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-4 text-base font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground group-hover:gap-2.5 transition-all duration-200">
                    En savoir plus
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* ─── Alternating Detail Sections with Animated Illustrations ─── */}
      <section className="mx-auto max-w-6xl px-6 py-24 space-y-32">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const isReversed = index % 2 === 1;
          const Illustration = illustrationMap[feature.slug];

          return (
            <ScrollReveal key={feature.slug}>
              <div
                className={`grid gap-12 lg:grid-cols-2 items-center ${
                  isReversed ? "lg:direction-rtl" : ""
                }`}
              >
                {/* Animated Illustration */}
                <div className={isReversed ? "lg:order-2" : ""}>
                  {Illustration ? (
                    <Illustration />
                  ) : (
                    <div className="rounded-2xl shadow-apple bg-card p-8 min-h-[360px] flex items-center justify-center">
                      <div className="text-center">
                        <Icon className="mx-auto h-16 w-16 text-muted-foreground/20" strokeWidth={1} />
                        <p className="mt-4 text-sm text-muted-foreground/60">Aperçu — {feature.title}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Text content */}
                <div className={isReversed ? "lg:order-1" : ""}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted/60 mb-4 group">
                    <Icon className="h-5 w-5 text-foreground" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight">
                    {feature.headline}
                  </h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {feature.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 mt-0.5">
                          <svg
                            className="h-3 w-3 text-emerald-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                        </div>
                        <span className="text-sm text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link
                      href={`/fonctionnalites/${feature.slug}`}
                      className="inline-flex h-11 items-center rounded-xl bg-foreground px-6 text-sm font-medium text-background hover:bg-foreground/90 transition-all duration-200 active:scale-[0.98] gap-2"
                    >
                      Découvrir {feature.label} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </section>

      {/* ─── CTA ─── */}
      <CtaSection
        title="Prêt à déployer votre chatbot IA ?"
        subtitle="Créez votre premier agent en quelques minutes. 100 crédits offerts, aucune carte bancaire requise."
      />
    </>
  );
}
