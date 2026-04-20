"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { signUpHref } from "@/lib/urls";

export function PricingCards({ plans }: { plans: any[] }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan: any, i: number) => (
          <ScrollReveal key={plan.name} delay={i * 100}>
          <div
            className={`rounded-3xl bg-card p-8 transition-all duration-200 ${
              plan.popular
                ? "ring-2 ring-foreground shadow-apple-hover scale-[1.02]"
                : "shadow-apple hover:shadow-apple-hover hover:-translate-y-0.5"
            }`}
          >
            {plan.popular && (
              <span className="inline-flex items-center rounded-full bg-foreground text-background px-3 py-1 text-xs font-medium mb-4">
                Populaire
              </span>
            )}
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <div className="mt-3">
              <span className="text-4xl font-light tracking-tight">{plan.price}€</span>
              <span className="text-muted-foreground text-sm">/mois</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{plan.credits} crédits/mois</p>
            <Link
              href={signUpHref()}
              className={`mt-6 flex h-11 w-full items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98] ${
                plan.popular
                  ? "bg-foreground text-background hover:bg-foreground/90"
                  : "border border-border bg-card hover:bg-muted"
              }`}
            >
              {plan.price === 0 ? "Commencer" : "Sélectionner"}
            </Link>
            {plan.features && (
              <div className="mt-6 space-y-3">
                {plan.features.map((f: string) => (
                  <div key={f} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-sm text-muted-foreground">{f}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
