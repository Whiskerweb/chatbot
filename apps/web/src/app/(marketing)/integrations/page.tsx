import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe, Check, Code } from "lucide-react";

import { HeroSection } from "@/components/marketing/hero-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { SectionHeader } from "@/components/marketing/section-header";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { IntegrationGrid } from "@/components/marketing/integration-grid";
import {
  integrations,
  categoryLabels,
  type IntegrationCategory,
} from "@/data/marketing/integrations";

/* ─── Metadata ─── */
export const metadata: Metadata = {
  title: "Intégrations | Claudia",
  description:
    "Connectez votre chatbot IA partout : WhatsApp, Slack, WordPress, Shopify, Zapier et 20+ intégrations. Déployez Claudia sur tous vos canaux en quelques clics.",
};

/* ─── Featured integrations (top 6) ─── */
const featured = integrations.filter((i) => i.featured).slice(0, 6);

/* ─── Page ─── */
export default function IntegrationsPage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <HeroSection
        badge="20+ intégrations disponibles"
        title="Connectez Claudia partout"
        titleAccent="sur tous vos canaux"
        subtitle="Déployez votre chatbot IA sur WhatsApp, Slack, WordPress, Shopify et bien plus. Plus de 20 intégrations natives pour connecter Claudia à vos outils existants."
        primaryCta={{ label: "Commencer gratuitement", href: "/sign-up" }}
        secondaryCta={{ label: "Voir la documentation API", href: "/fonctionnalites/api-integrations" }}
        note="100 crédits gratuits &bull; Aucune carte bancaire requise"
      />

      {/* ─── Filterable integration grid (client component) ─── */}
      <IntegrationGrid />

      {/* ─── Featured integrations details ─── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeader
          title="Intégrations phares"
          subtitle="Nos intégrations les plus populaires, conçues pour une mise en route instantanée."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((integration, i) => (
            <ScrollReveal key={integration.name} delay={i * 100}>
            <div
              className="rounded-3xl bg-card shadow-apple p-8 transition-all duration-200 hover:shadow-apple-hover hover:-translate-y-0.5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background">
                <Globe className="h-5 w-5 motion-safe:animate-float" strokeWidth={1.5} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {integration.name}
              </h3>
              <span className="mt-1 inline-block text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {categoryLabels[integration.category]}
              </span>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {integration.description}
              </p>
              <div className="mt-5">
                {integration.status === "disponible" ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                    Disponible maintenant
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600">
                    Bient&ocirc;t disponible
                  </span>
                )}
              </div>
            </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ─── API / Build your own integration ─── */}
      <ScrollReveal>
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="rounded-3xl bg-card shadow-apple p-12 md:p-16">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-4 py-1.5 text-sm text-muted-foreground mb-6">
                <Code className="h-3.5 w-3.5" strokeWidth={2} />
                API REST
              </div>
              <h2 className="text-3xl font-semibold tracking-tight">
                Construisez votre propre int&eacute;gration
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Notre API REST complète vous permet d&apos;intégrer Claudia dans
                n&apos;importe quel système. Envoyez des messages, gérez vos
                agents et récupérez les conversations de manière programmatique.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "API REST documentée avec OpenAPI",
                  "Streaming SSE en temps réel",
                  "Webhooks pour les événements",
                  "SDKs JavaScript & Python",
                  "Limite de 1 000 requêtes/min",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 mt-0.5 dark:bg-emerald-950/40">
                      <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
                    </div>
                    <span className="text-sm text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href="/fonctionnalites/api-integrations"
                  className="inline-flex h-11 items-center rounded-xl bg-foreground px-6 text-sm font-medium text-background hover:bg-foreground/90 transition-all duration-200 active:scale-[0.98] gap-2"
                >
                  Explorer l&apos;API <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Code snippet */}
            <div className="rounded-2xl bg-[#1e1e2e] p-6 overflow-x-auto">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
                </div>
                <span className="ml-2 text-xs text-white/40">Terminal</span>
              </div>
              <pre className="text-sm leading-relaxed">
                <code className="text-white/80">
                  <span className="text-emerald-400">curl</span>{" "}
                  <span className="text-amber-300">-X POST</span>{" "}
                  <span className="text-sky-300">
                    https://api.claudia.ai/v1/chat
                  </span>{" "}
                  \{"\n"}
                  {"  "}<span className="text-amber-300">-H</span>{" "}
                  <span className="text-orange-300">
                    &quot;Authorization: Bearer YOUR_API_KEY&quot;
                  </span>{" "}
                  \{"\n"}
                  {"  "}<span className="text-amber-300">-H</span>{" "}
                  <span className="text-orange-300">
                    &quot;Content-Type: application/json&quot;
                  </span>{" "}
                  \{"\n"}
                  {"  "}<span className="text-amber-300">-d</span>{" "}
                  <span className="text-orange-300">&apos;{"{"}</span>
                  {"\n"}
                  {"    "}<span className="text-sky-300">&quot;agent_id&quot;</span>:{" "}
                  <span className="text-orange-300">&quot;ag_xxx&quot;</span>,{"\n"}
                  {"    "}<span className="text-sky-300">&quot;message&quot;</span>:{" "}
                  <span className="text-orange-300">
                    &quot;Comment réinitialiser mon mot de passe ?&quot;
                  </span>,{"\n"}
                  {"    "}<span className="text-sky-300">&quot;stream&quot;</span>:{" "}
                  <span className="text-purple-400">true</span>
                  {"\n"}
                  {"  "}<span className="text-orange-300">{"}"}&apos;</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* ─── CTA ─── */}
      <CtaSection
        title="Prêt à connecter Claudia à vos outils ?"
        subtitle="Commencez gratuitement et déployez votre chatbot IA sur tous vos canaux en quelques minutes."
      />
    </>
  );
}
