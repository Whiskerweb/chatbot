export function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Gradient orbs — subtle color accents over the grid */}
      <div
        className="absolute -top-20 right-1/4 h-[500px] w-[500px] rounded-full blur-[120px] opacity-[0.07] motion-safe:animate-orb-float-1"
        style={{ background: "radial-gradient(circle, hsl(224 76% 48%), transparent 70%)" }}
      />
      <div
        className="absolute top-1/3 -left-20 h-[400px] w-[400px] rounded-full blur-[120px] opacity-[0.05] motion-safe:animate-orb-float-2"
        style={{ background: "radial-gradient(circle, hsl(262 83% 58%), transparent 70%)" }}
      />
      <div
        className="absolute -bottom-20 right-1/3 h-[350px] w-[350px] rounded-full blur-[100px] opacity-[0.04] motion-safe:animate-orb-float-3"
        style={{ background: "radial-gradient(circle, hsl(190 95% 39%), transparent 70%)" }}
      />
    </div>
  );
}
