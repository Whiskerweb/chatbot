import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon: Icon, title, description, className = "" }: FeatureCardProps) {
  return (
    <div className={`rounded-3xl bg-card shadow-apple p-8 transition-all duration-200 hover:shadow-apple-hover hover:-translate-y-0.5 ${className}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60">
        <Icon className="h-5 w-5 text-foreground" strokeWidth={1.5} />
      </div>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
