import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CtaSectionProps {
  title?: string;
  subtitle?: string;
  cta?: { label: string; href: string };
}

export function CtaSection({
  title = "Prêt à transformer votre support client ?",
  subtitle = "Rejoignez les entreprises qui automatisent leur support avec un chatbot IA personnalisé.",
  cta = { label: "Commencer gratuitement", href: "/sign-up" },
}: CtaSectionProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="rounded-3xl bg-foreground p-16 text-center text-background">
        <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-4 text-background/60 max-w-xl mx-auto">{subtitle}</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href={cta.href}
            className="inline-flex h-12 items-center rounded-2xl bg-background text-foreground px-7 text-sm font-medium hover:bg-background/90 transition-all duration-200 active:scale-[0.98] gap-2"
          >
            {cta.label} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
