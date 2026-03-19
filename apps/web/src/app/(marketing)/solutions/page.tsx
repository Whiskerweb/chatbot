import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Zap, Shield, Globe } from "lucide-react";
import { solutions } from "@/data/marketing/solutions";
import { CtaSection } from "@/components/marketing/cta-section";

export function generateMetadata(): Metadata {
  return {
    title: "Solutions | Claudia",
    description:
      "Découvrez comment Claudia s'adapte à votre secteur : e-commerce, SaaS, santé, immobilier, éducation, finance. Un chatbot IA sur mesure pour chaque industrie.",
  };
}

const valueProps = [
  {
    icon: Zap,
    title: "Déploiement en 10 minutes",
    description:
      "Même processus de configuration, quel que soit votre secteur. Importez vos données, personnalisez et déployez.",
  },
  {
    icon: Shield,
    title: "Données sécurisées",
    description:
      "Conformité RGPD, chiffrement AES-256 au repos et TLS 1.3 en transit. Hébergement européen disponible.",
  },
  {
    icon: Globe,
    title: "Support multilingue",
    description:
      "Plus de 50 langues détectées et supportées automatiquement. Vos clients sont compris, partout dans le monde.",
  },
];

export default function SolutionsPage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-8 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
          Claudia s&apos;adapte
          <br />
          <span className="text-muted-foreground">à votre secteur</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Une solution IA sur mesure pour chaque industrie
        </p>
      </section>

      {/* ─── Solutions Grid ─── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution) => (
            <Link
              key={solution.slug}
              href={`/solutions/${solution.slug}`}
              className="group rounded-3xl bg-card shadow-apple p-8 transition-all duration-200 hover:shadow-apple-hover hover:-translate-y-0.5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60">
                <solution.icon
                  className="h-5 w-5 text-foreground"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="mt-5 text-base font-semibold">
                {solution.shortTitle}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {solution.description}
              </p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground group-hover:gap-2.5 transition-all duration-200">
                En savoir plus
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Cross-cutting Value Props ─── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight">
            Quel que soit votre secteur
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Des avantages transversaux qui accompagnent chaque solution.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {valueProps.map((prop) => (
            <div
              key={prop.title}
              className="rounded-3xl bg-card shadow-apple p-8 text-center transition-all duration-200 hover:shadow-apple-hover hover:-translate-y-0.5"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60">
                <prop.icon
                  className="h-5 w-5 text-foreground"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="mt-4 text-base font-semibold">{prop.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <CtaSection
        title="Trouvez la solution adaptée à votre secteur"
        subtitle="Créez votre chatbot IA personnalisé en quelques minutes. 100 crédits offerts, sans carte bancaire."
      />
    </>
  );
}
