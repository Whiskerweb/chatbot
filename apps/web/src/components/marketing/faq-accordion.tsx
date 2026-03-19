"use client";
import { ChevronDown } from "lucide-react";
import type { Faq } from "@/data/marketing/faqs";
import { ScrollReveal } from "./scroll-reveal";

interface FaqAccordionProps {
  faqs: Faq[];
  className?: string;
}

export function FaqAccordion({ faqs, className = "" }: FaqAccordionProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {faqs.map((faq, i) => (
        <ScrollReveal key={faq.q} delay={i * 80}>
          <details className="group rounded-2xl bg-card shadow-apple">
            <summary className="flex cursor-pointer items-center justify-between p-6 text-sm font-medium [&::-webkit-details-marker]:hidden list-none">
              {faq.q}
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180" strokeWidth={1.5} />
            </summary>
            <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">
              {faq.a}
            </div>
          </details>
        </ScrollReveal>
      ))}
    </div>
  );
}
