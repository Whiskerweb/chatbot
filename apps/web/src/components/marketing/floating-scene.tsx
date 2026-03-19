import type { LucideIcon } from "lucide-react";

interface FloatingSceneProps {
  icon: LucideIcon;
  className?: string;
}

export function FloatingScene({ icon: Icon, className = "" }: FloatingSceneProps) {
  return (
    <div className={`relative min-h-[360px] rounded-2xl bg-card shadow-apple overflow-hidden ${className}`}>
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent-blue/5 to-transparent motion-safe:animate-gradient-shift bg-[length:200%_200%]" />

      {/* Floating shapes */}
      <div className="absolute top-8 left-1/4 h-16 w-16 rounded-2xl bg-primary/5 motion-safe:animate-float" />
      <div className="absolute top-16 right-1/4 h-12 w-12 rounded-full bg-accent-blue/10 motion-safe:animate-float [animation-delay:1s]" />
      <div className="absolute bottom-12 left-1/3 h-10 w-10 rounded-xl bg-primary/5 motion-safe:animate-float [animation-delay:0.5s]" />
      <div className="absolute bottom-20 right-1/3 h-8 w-8 rounded-lg bg-accent-blue/5 motion-safe:animate-float [animation-delay:1.5s]" />

      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-3xl bg-card shadow-apple p-6 motion-safe:animate-scale-in">
          <Icon className="h-10 w-10 text-foreground" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
