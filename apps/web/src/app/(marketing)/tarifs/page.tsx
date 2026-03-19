import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Building2 } from "lucide-react";

import { plans, pricingFeatureMatrix, pricingFaqs } from "@/data/marketing/plans";
import { CtaSection } from "@/components/marketing/cta-section";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { PricingCards } from "./pricing-cards";

/* ─── Metadata ─── */
export const metadata: Metadata = {
  title: "Tarifs | Claudia",
  description:
    "Des tarifs simples et transparents pour votre chatbot IA. Commencez gratuitement avec 100 crédits, sans carte bancaire. Plans Starter, Pro et Growth pour accompagner votre croissance.",
  openGraph: {
    title: "Tarifs | Claudia",
    description:
      "Des tarifs simples et transparents pour votre chatbot IA. Commencez gratuitement, évoluez selon vos besoins.",
    type: "website",
    url: "/tarifs",
  },
};

/* ─── Feature comparison table ─── */
const planKeys = ["free", "starter", "pro", "growth"] as const;
const planLabels = { free: "Free", starter: "Starter", pro: "Pro", growth: "Growth" };

export default function TarifsPage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-8 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl leading-[1.1]">
          Tarifs simples et transparents
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Commencez gratuitement avec 100 crédits. Pas de carte bancaire requise.
          <br className="hidden sm:block" />
          Passez au plan supérieur quand vous êtes prêt.
        </p>
      </section>

      {/* ─── Pricing cards with toggle (client component) ─── */}
      <PricingCards plans={plans} />

      {/* ─── Feature comparison table ─── */}
      <ScrollReveal>
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold tracking-tight">
            Comparaison complète des plans
          </h2>
          <p className="mt-3 text-muted-foreground">
            Toutes les fonctionnalit&eacute;s, plan par plan.
          </p>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block rounded-3xl bg-card shadow-apple overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="sticky top-0 bg-card border-b border-border/50">
                  <th className="text-left p-5 font-medium text-muted-foreground w-1/3">
                    Fonctionnalit&eacute;
                  </th>
                  {planKeys.map((key) => (
                    <th
                      key={key}
                      className={`p-5 text-center font-semibold ${
                        key === "pro" ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      <span
                        className={
                          key === "pro"
                            ? "inline-flex items-center gap-2"
                            : ""
                        }
                      >
                        {planLabels[key]}
                        {key === "pro" && (
                          <span className="inline-flex items-center rounded-full bg-foreground text-background px-2 py-0.5 text-[10px] font-medium">
                            Populaire
                          </span>
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pricingFeatureMatrix.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={
                      i < pricingFeatureMatrix.length - 1
                        ? "border-b border-border/30"
                        : ""
                    }
                  >
                    <td className="p-5 font-medium text-foreground">
                      {row.feature}
                    </td>
                    {planKeys.map((key) => {
                      const value = row[key];
                      return (
                        <td key={key} className="p-5 text-center text-muted-foreground">
                          {value === "✓" ? (
                            <Check className="h-4 w-4 text-emerald-500 mx-auto" strokeWidth={2} />
                          ) : (
                            <span className={value === "—" ? "text-muted-foreground/40" : ""}>
                              {value}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-6">
          {planKeys.map((key) => (
            <div key={key} className="rounded-3xl bg-card shadow-apple p-6">
              <h3 className="text-lg font-semibold mb-4">{planLabels[key]}</h3>
              <div className="space-y-3">
                {pricingFeatureMatrix.map((row) => {
                  const value = row[key];
                  return (
                    <div
                      key={row.feature}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">{row.feature}</span>
                      <span className="font-medium text-foreground">
                        {value === "✓" ? (
                          <Check className="h-4 w-4 text-emerald-500" strokeWidth={2} />
                        ) : value === "—" ? (
                          <span className="text-muted-foreground/40">{value}</span>
                        ) : (
                          value
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
      </ScrollReveal>

      {/* ─── Enterprise CTA ─── */}
      <ScrollReveal>
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="rounded-3xl bg-card shadow-apple p-12 md:p-16">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background">
                  <Building2 className="h-5 w-5 motion-safe:animate-float" strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Plan Enterprise
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed max-w-lg">
                Pour les organisations qui ont besoin de performances, de s&eacute;curit&eacute; et
                d&apos;accompagnement sur mesure. Cr&eacute;dits illimit&eacute;s, SLA garanti,
                h&eacute;bergement d&eacute;di&eacute; et un interlocuteur d&eacute;di&eacute; pour votre &eacute;quipe.
              </p>
              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Cr\u00e9dits illimit\u00e9s",
                  "SLA 99,9% garanti",
                  "H\u00e9bergement d\u00e9di\u00e9",
                  "SSO / SAML",
                  "Interlocuteur d\u00e9di\u00e9",
                  "Onboarding personnalis\u00e9",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" strokeWidth={2} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="shrink-0">
              <Link
                href="/contact"
                className="inline-flex h-12 items-center rounded-2xl bg-foreground px-7 text-sm font-medium text-background hover:bg-foreground/90 transition-all duration-200 active:scale-[0.98] gap-2"
              >
                Contacter l&apos;&eacute;quipe commerciale <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* ─── FAQ ─── */}
      <section className="mx-auto max-w-3xl px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold tracking-tight">
            Questions fr&eacute;quentes
          </h2>
          <p className="mt-3 text-muted-foreground">
            Tout ce que vous devez savoir sur nos tarifs.
          </p>
        </div>
        <FaqAccordion faqs={pricingFaqs} />
      </section>

      {/* ─── CTA Final ─── */}
      <CtaSection
        title="Pr\u00eat \u00e0 lancer votre chatbot IA ?"
        subtitle="Commencez gratuitement avec 100 cr\u00e9dits. Aucune carte bancaire requise."
        cta={{ label: "Commencer gratuitement", href: "/sign-up" }}
      />
    </>
  );
}
