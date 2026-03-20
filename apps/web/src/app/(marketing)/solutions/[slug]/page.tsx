import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  AlertTriangle,
  ChevronRight,
  Globe,
  ChevronDown,
} from "lucide-react";
import { solutions, type Solution } from "@/data/marketing/solutions";
import { testimonials } from "@/data/marketing/testimonials";
import { TestimonialCard } from "@/components/marketing/testimonial-card";
import { CtaSection } from "@/components/marketing/cta-section";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";

/* ─── Static Params ─── */

export function generateStaticParams() {
  return solutions.map((s: Solution) => ({ slug: s.slug }));
}

/* ─── Metadata ─── */

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const solution = solutions.find((s: Solution) => s.slug === slug);
  if (!solution) return {};
  return {
    title: `${solution.title} | Claudia`,
    description: solution.metaDescription,
  };
}

/* ─── Page ─── */

export default async function SolutionPage({ params }: PageProps) {
  const { slug } = await params;
  const solution = solutions.find((s: Solution) => s.slug === slug);
  if (!solution) notFound();

  const testimonial = testimonials.find((t) => t.industry === solution.slug);

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
              href="/solutions"
              className="hover:text-foreground transition-colors"
            >
              Solutions
            </Link>
          </li>
          <li>
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li className="text-foreground font-medium">
            {solution.shortTitle}
          </li>
        </ol>
      </nav>

      {/* ─── Hero ─── */}
      <section className="mx-auto max-w-6xl px-6 pt-12 pb-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 mb-6 motion-safe:animate-scale-in">
          <solution.icon
            className="h-6 w-6 text-foreground"
            strokeWidth={1.5}
          />
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl leading-[1.1]">
          {solution.headline}
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {solution.description}
        </p>
        <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/sign-up"
            className="inline-flex h-12 items-center rounded-2xl bg-foreground px-7 text-sm font-medium text-background hover:bg-foreground/90 transition-all duration-200 active:scale-[0.98] gap-2"
          >
            Essayer gratuitement <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="#use-cases"
            className="inline-flex h-12 items-center rounded-2xl border border-border bg-card px-7 text-sm font-medium hover:bg-muted transition-all duration-200"
          >
            Voir les cas d&apos;usage
          </Link>
        </div>
      </section>

      {/* ─── Pain Points ─── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight">
            Les défis du secteur {solution.shortTitle}
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Des problèmes concrets que Claudia résout pour vous.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {solution.painPoints.map((pain, i) => (
            <ScrollReveal key={pain} delay={i * 100}>
              <div
                className="rounded-3xl bg-card shadow-apple p-8 transition-all duration-200 hover:shadow-apple-hover"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/30 motion-safe:animate-pulse-soft">
                  <AlertTriangle
                    className="h-5 w-5 text-red-500"
                    strokeWidth={1.5}
                  />
                </div>
                <p className="mt-4 text-sm text-foreground leading-relaxed">
                  {pain}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ─── Use Cases ─── */}
      <section id="use-cases" className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight">
            Cas d&apos;usage concrets
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Découvrez comment Claudia s&apos;intègre dans votre quotidien.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {solution.useCases.map((uc, idx) => (
            <ScrollReveal key={uc.title} delay={idx * 100}>
              <div
                className="rounded-3xl bg-card shadow-apple p-8 transition-all duration-200 hover:shadow-apple-hover hover:-translate-y-0.5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                  {idx + 1}
                </div>
                <h3 className="mt-4 text-base font-semibold">{uc.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {uc.scenario}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ─── KPIs ─── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="rounded-3xl bg-muted/30 p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight">
              Résultats mesurables
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Des métriques concrètes observées par nos clients.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {solution.kpis.map((kpi, i) => (
              <ScrollReveal key={kpi.label} delay={i * 100}>
                <div
                  className="rounded-3xl bg-card shadow-apple p-8 text-center"
                >
                  <p className="text-4xl font-light tracking-tight text-foreground">
                    {kpi.value}
                  </p>
                  <p className="mt-2 text-sm font-semibold">{kpi.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {kpi.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonial ─── */}
      {testimonial && (
        <section className="mx-auto max-w-2xl px-6 py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight">
              Retour client
            </h2>
          </div>
          <ScrollReveal>
            <TestimonialCard {...testimonial} />
          </ScrollReveal>
        </section>
      )}

      {/* ─── Integrations ─── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight">
            Intégrations compatibles
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Connectez Claudia à vos outils existants.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {solution.integrations.map((name, i) => (
            <ScrollReveal key={name} delay={i * 60}>
              <span
                className="inline-flex items-center gap-2 rounded-2xl bg-card shadow-apple px-5 py-3 text-sm font-medium text-muted-foreground"
              >
                <Globe className="h-4 w-4" strokeWidth={1.5} />
                {name}
              </span>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="mx-auto max-w-3xl px-6 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight">
            Questions fréquentes
          </h2>
        </div>
        <div className="space-y-3">
          {solution.faqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-2xl bg-card shadow-apple"
            >
              <summary className="flex cursor-pointer items-center justify-between p-6 text-sm font-medium [&::-webkit-details-marker]:hidden list-none">
                {faq.q}
                <ChevronDown
                  className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                  strokeWidth={1.5}
                />
              </summary>
              <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <CtaSection
        title={`Prêt à automatiser votre support ${solution.shortTitle} ?`}
        subtitle="Créez votre chatbot IA personnalisé en quelques minutes. 100 crédits offerts, sans carte bancaire."
      />
    </>
  );
}
