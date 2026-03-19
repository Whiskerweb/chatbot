"use client";
import { useInView } from "@/hooks/use-in-view";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({ title, subtitle, className = "" }: SectionHeaderProps) {
  const { ref, isInView } = useInView();

  return (
    <div ref={ref} className={`text-center mb-12 ${className}`}>
      <h2
        className={`text-3xl font-semibold tracking-tight transition-all duration-500 ease-apple ${
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-muted-foreground max-w-2xl mx-auto transition-all duration-500 ease-apple ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
