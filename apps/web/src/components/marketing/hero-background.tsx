export function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Gradient orbs */}
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-accent-blue/10 blur-3xl motion-safe:animate-pulse-soft" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-foreground/5 blur-3xl motion-safe:animate-pulse-soft [animation-delay:1s]" />
    </div>
  );
}
