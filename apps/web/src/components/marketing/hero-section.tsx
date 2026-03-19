import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface HeroSectionProps {
  badge?: string;
  badgeIcon?: LucideIcon;
  title: string;
  titleAccent?: string;
  subtitle: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  note?: string;
}

export function HeroSection({
  badge,
  badgeIcon: BadgeIcon,
  title,
  titleAccent,
  subtitle,
  primaryCta = { label: "Commencer gratuitement", href: "/sign-up" },
  secondaryCta,
  note,
}: HeroSectionProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-20 pb-8 text-center">
      {badge && (
        <div className="inline-flex items-center rounded-full border border-border/60 bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-xs mb-8">
          {BadgeIcon && <BadgeIcon className="h-3.5 w-3.5 mr-2 text-amber-500" strokeWidth={2} />}
          {badge}
        </div>
      )}
      <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
        {title}
        {titleAccent && (
          <>
            <br />
            <span className="text-muted-foreground">{titleAccent}</span>
          </>
        )}
      </h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        {subtitle}
      </p>
      <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
        <Link
          href={primaryCta.href}
          className="inline-flex h-12 items-center rounded-2xl bg-foreground px-7 text-sm font-medium text-background hover:bg-foreground/90 transition-all duration-200 active:scale-[0.98] gap-2"
        >
          {primaryCta.label} <ArrowRight className="h-4 w-4" />
        </Link>
        {secondaryCta && (
          <Link
            href={secondaryCta.href}
            className="inline-flex h-12 items-center rounded-2xl border border-border bg-card px-7 text-sm font-medium hover:bg-muted transition-all duration-200"
          >
            {secondaryCta.label}
          </Link>
        )}
      </div>
      {note && (
        <p className="mt-4 text-xs text-muted-foreground">{note}</p>
      )}
    </section>
  );
}
