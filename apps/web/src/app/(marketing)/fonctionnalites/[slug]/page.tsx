import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import type { Metadata } from "next";

import { features } from "@/data/marketing/features";
import { CtaSection } from "@/components/marketing/cta-section";
import { SectionHeader } from "@/components/marketing/section-header";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { illustrationMap } from "@/components/marketing/illustrations";

/* ─── Static Params ─── */

export function generateStaticParams() {
  return features.map((feature) => ({ slug: feature.slug }));
}

/* ─── Metadata ─── */

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const feature = features.find((f) => f.slug === params.slug);
  if (!feature) return { title: "Fonctionnalité introuvable | Claudia" };

  return {
    title: `${feature.title} | Claudia`,
    description: feature.metaDescription,
  };
}

/* ─── Use-case label mapping ─── */

const useCaseLabels: Record<string, string> = {
  "support-client": "Support client",
  "generation-leads": "Génération de leads",
  onboarding: "Onboarding",
  ventes: "Ventes",
  "base-connaissances": "Base de connaissances",
};

/* ─── Page ─── */

export default function FeatureDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const feature = features.find((f) => f.slug === params.slug);
  if (!feature) notFound();

  const Icon = feature.icon;

  return (
    <>
      {/* ─── Breadcrumb ─── */}
      <nav className="mx-auto max-w-6xl px-6 pt-8">
        <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link
              href="/"
              className="hover:text-foreground transition-colors"
            >
              Accueil
            </Link>
          </li>
          <li>
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li>
            <Link
              href="/fonctionnalites"
              className="hover:text-foreground transition-colors"
            >
              Fonctionnalités
            </Link>
          </li>
          <li>
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li className="text-foreground font-medium">{feature.title}</li>
        </ol>
      </nav>

      {/* ─── Hero ─── */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 mb-6 motion-safe:animate-scale-in">
          <Icon className="h-7 w-7 text-foreground" strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl leading-[1.1]">
          {feature.headline}
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {feature.description}
        </p>
        <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/sign-up"
            className="inline-flex h-12 items-center rounded-2xl bg-foreground px-7 text-sm font-medium text-background hover:bg-foreground/90 transition-all duration-200 active:scale-[0.98] gap-2"
          >
            Essayer gratuitement <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/fonctionnalites"
            className="inline-flex h-12 items-center rounded-2xl border border-border bg-card px-7 text-sm font-medium hover:bg-muted transition-all duration-200"
          >
            Toutes les fonctionnalités
          </Link>
        </div>
      </section>

      {/* ─── Feature List ─── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Text */}
          <div>
            <SectionHeader
              title="Ce qui est inclus"
              className="text-left mb-8"
            />
            <ul className="space-y-4">
              {feature.features.map((f, i) => (
                <ScrollReveal key={f} delay={i * 80}>
                  <li className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 mt-0.5">
                      <Check
                        className="h-3.5 w-3.5 text-emerald-600"
                        strokeWidth={2.5}
                      />
                    </div>
                    <span className="text-muted-foreground leading-relaxed">
                      {f}
                    </span>
                  </li>
                </ScrollReveal>
              ))}
            </ul>
          </div>

          {/* Animated illustration */}
          <div>
            {(() => {
              const Illustration = illustrationMap[feature.slug];
              return Illustration ? (
                <Illustration />
              ) : (
                <div className="rounded-2xl shadow-apple bg-card p-8 min-h-[360px] flex items-center justify-center">
                  <Icon className="h-16 w-16 text-muted-foreground/20" strokeWidth={1} />
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* ─── Sub-features Grid ─── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeader
          title="Fonctionnalités détaillées"
          subtitle={`Tout ce que ${feature.title} met à votre disposition.`}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          {feature.subFeatures.map((sub, i) => {
            const SubIcon = sub.icon;
            return (
              <ScrollReveal key={sub.title} delay={i * 100}>
                <div
                  className="rounded-3xl bg-card shadow-apple p-8 transition-all duration-200 hover:shadow-apple-hover hover:-translate-y-0.5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60">
                    <SubIcon
                      className="h-5 w-5 text-foreground"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="mt-4 text-base font-semibold">{sub.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {sub.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* ─── Related Use Cases ─── */}
      {feature.useCases.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-24">
          <SectionHeader
            title="Cas d'utilisation associés"
            subtitle="Découvrez comment cette fonctionnalité s'applique à votre métier."
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {feature.useCases.map((slug, i) => (
              <ScrollReveal key={slug} delay={i * 100}>
                <Link
                  href={`/cas-utilisation/${slug}`}
                  className="group rounded-3xl bg-card shadow-apple p-8 transition-all duration-200 hover:shadow-apple-hover hover:-translate-y-0.5 block"
                >
                  <h3 className="text-base font-semibold">
                    {useCaseLabels[slug] ?? slug}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Voyez comment Claudia aide les équipes à transformer leur{" "}
                    {(useCaseLabels[slug] ?? slug).toLowerCase()}.
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground group-hover:gap-2.5 transition-all duration-200">
                    En savoir plus
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* ─── CTA ─── */}
      <CtaSection
        title={`Prêt à utiliser ${feature.title} ?`}
        subtitle="Créez votre premier agent en quelques minutes. 100 crédits offerts, aucune carte bancaire requise."
      />
    </>
  );
}
