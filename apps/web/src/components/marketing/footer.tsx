import Link from "next/link";
import { Logo } from "./logo";

const footerLinks: Record<string, Array<{ label: string; href: string }>> = {
  Produit: [
    { label: "Fonctionnalités", href: "/fonctionnalites" },
    { label: "Tarifs", href: "/tarifs" },
    { label: "Intégrations", href: "/integrations" },
    { label: "API", href: "/fonctionnalites/api-integrations" },
    { label: "Sécurité", href: "/fonctionnalites/securite" },
  ],
  Solutions: [
    { label: "E-commerce", href: "/solutions/e-commerce" },
    { label: "SaaS", href: "/solutions/saas" },
    { label: "Santé", href: "/solutions/sante" },
    { label: "Immobilier", href: "/solutions/immobilier" },
    { label: "Éducation", href: "/solutions/education" },
    { label: "Finance", href: "/solutions/services-financiers" },
  ],
  "Cas d'usage": [
    { label: "Support client", href: "/cas-utilisation/support-client" },
    { label: "Génération de leads", href: "/cas-utilisation/generation-leads" },
    { label: "Onboarding", href: "/cas-utilisation/onboarding" },
    { label: "Base de connaissances", href: "/cas-utilisation/base-connaissances" },
    { label: "Ventes", href: "/cas-utilisation/ventes" },
  ],
  Légal: [
    { label: "Mentions légales", href: "/legal/mentions-legales" },
    { label: "CGU", href: "/legal/cgu" },
    { label: "Confidentialité", href: "/legal/confidentialite" },
    { label: "RGPD", href: "/legal/rgpd" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Logo size="md" />
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              La plateforme de chatbot IA la plus simple pour les entreprises.
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p className="text-sm font-medium mb-4">{category}</p>
              <div className="space-y-3">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} HelloClaudia. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
