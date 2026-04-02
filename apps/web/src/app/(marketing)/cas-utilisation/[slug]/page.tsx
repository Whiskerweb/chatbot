import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";
import type { Metadata } from "next";

import { useCases } from "@/data/marketing/use-cases";
import { CtaSection } from "@/components/marketing/cta-section";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";

/* ─── Static params ─── */

export function generateStaticParams() {
  return useCases.map((uc) => ({ slug: uc.slug }));
}

/* ─── Metadata ─── */

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const useCase = useCases.find((uc) => uc.slug === params.slug);
  if (!useCase) return {};

  return {
    title: `${useCase.shortTitle} | Cas d'utilisation | HelloClaudia`,
    description: useCase.metaDescription,
    openGraph: {
      title: `${useCase.shortTitle} | Cas d'utilisation | HelloClaudia`,
      description: useCase.metaDescription,
      type: "website",
      url: `/cas-utilisation/${useCase.slug}`,
    },
  };
}

/* ─── Page ─── */

export default function UseCaseDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const useCase = useCases.find((uc) => uc.slug === params.slug);
  if (!useCase) notFound();

  return (
    <>
      {/* ─── Breadcrumb ─── */}
      <nav className="mx-auto max-w-6xl px-6 pt-8">
        <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              Accueil
            </Link>
          </li>
          <li>
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li>
            <Link
              href="/cas-utilisation"
              className="hover:text-foreground transition-colors"
            >
              Cas d&apos;utilisation
            </Link>
          </li>
          <li>
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li className="text-foreground font-medium">{useCase.shortTitle}</li>
        </ol>
      </nav>

      {/* ─── Hero ─── */}
      <section className="mx-auto max-w-6xl px-6 pt-12 pb-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 motion-safe:animate-scale-in">
            <useCase.icon
              className="h-7 w-7 text-foreground"
              strokeWidth={1.5}
            />
          </div>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl leading-[1.1]">
          {useCase.headline}
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {useCase.description}
        </p>
        <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/sign-up"
            className="inline-flex h-12 items-center rounded-2xl bg-foreground px-7 text-sm font-medium text-background hover:bg-foreground/90 transition-all duration-200 active:scale-[0.98] gap-2"
          >
            Commencer gratuitement <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/cas-utilisation"
            className="inline-flex h-12 items-center rounded-2xl border border-border bg-card px-7 text-sm font-medium hover:bg-muted transition-all duration-200"
          >
            Tous les cas d&apos;utilisation
          </Link>
        </div>
      </section>

      {/* ─── Le problème ─── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight">Le problème</h2>
        </div>
        <ScrollReveal>
          <div className="rounded-3xl bg-red-50/50 dark:bg-destructive/5 border border-red-100/60 dark:border-destructive/10 p-10 md:p-12 max-w-3xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-destructive/10 motion-safe:animate-pulse-soft">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" strokeWidth={1.5} />
              </div>
              <p className="text-base text-foreground/80 leading-relaxed">
                {useCase.problem}
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── La solution ─── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight">
            La solution avec HelloClaudia
          </h2>
        </div>
        <ScrollReveal>
          <div className="rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/60 dark:border-emerald-900/20 p-10 md:p-12 max-w-3xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/20">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
              </div>
              <p className="text-base text-foreground/80 leading-relaxed">
                {useCase.solution}
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── Avant vs Après ─── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight">Avant vs Après</h2>
          <p className="mt-3 text-muted-foreground">
            Les résultats concrets observés par nos clients.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {useCase.metrics.map((metric, i) => (
            <ScrollReveal key={metric.label} delay={i * 100}>
              <div
                className="rounded-3xl bg-card shadow-apple p-8 text-center transition-all duration-200 hover:shadow-apple-hover"
              >
                <p className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </p>
                <p className="mt-4 text-base text-muted-foreground/60 line-through">
                  {metric.before}
                </p>
                <p className="mt-1 text-2xl font-semibold text-emerald-600">
                  {metric.after}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ─── Comment démarrer ─── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold tracking-tight">
            Comment démarrer
          </h2>
          <p className="mt-3 text-muted-foreground">
            Trois étapes pour être opérationnel.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {useCase.steps.map((step, index) => (
            <ScrollReveal key={step.title} delay={index * 120}>
              <div
                className="rounded-3xl bg-card shadow-apple p-8 text-center transition-all duration-200 hover:shadow-apple-hover hover:-translate-y-0.5"
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background text-sm font-semibold">
                  {index + 1}
                </div>
                <h3 className="mt-5 text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <CtaSection
        title={`Prêt à transformer votre ${useCase.shortTitle.toLowerCase()} ?`}
        subtitle="Créez votre chatbot IA en quelques minutes et mesurez l'impact dès la première semaine."
      />
    </>
  );
}
