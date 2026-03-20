interface LogoProps {
  size?: "sm" | "md";
  showText?: boolean;
}

export function Logo({ size = "sm", showText = true }: LogoProps) {
  const s = size === "sm" ? 24 : 28;

  return (
    <span className="group inline-flex items-center gap-2.5">
      {/* Neural "C" symbol */}
      <svg
        width={s}
        height={s}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 ease-apple group-hover:rotate-[15deg] group-hover:scale-110"
      >
        {/* Outer ring — broken circle forming a "C" */}
        <path
          d="M26 8.5A13 13 0 1 0 26 23.5"
          stroke="hsl(var(--accent-blue))"
          strokeWidth="2"
          strokeLinecap="round"
          className="motion-safe:animate-stroke-draw"
          style={{ strokeDasharray: 52, strokeDashoffset: 0 }}
        />

        {/* Inner neural nodes */}
        <circle cx="10" cy="12" r="2" fill="hsl(var(--accent-blue))" className="opacity-80" />
        <circle cx="16" cy="9" r="1.5" fill="hsl(var(--accent-blue))" className="opacity-60" />
        <circle cx="10" cy="20" r="2" fill="hsl(var(--accent-blue))" className="opacity-80" />
        <circle cx="16" cy="23" r="1.5" fill="hsl(var(--accent-blue))" className="opacity-60" />
        <circle cx="16" cy="16" r="2.5" fill="hsl(var(--foreground))" />

        {/* Neural connections */}
        <line x1="10" y1="12" x2="16" y2="16" stroke="hsl(var(--accent-blue))" strokeWidth="1" className="opacity-30" />
        <line x1="16" y1="9" x2="16" y2="16" stroke="hsl(var(--accent-blue))" strokeWidth="1" className="opacity-30" />
        <line x1="10" y1="20" x2="16" y2="16" stroke="hsl(var(--accent-blue))" strokeWidth="1" className="opacity-30" />
        <line x1="16" y1="23" x2="16" y2="16" stroke="hsl(var(--accent-blue))" strokeWidth="1" className="opacity-30" />

        {/* Data flow dots on connections */}
        <circle cx="13" cy="14" r="0.8" fill="hsl(var(--accent-blue))" className="motion-safe:animate-pulse-soft opacity-50" />
        <circle cx="16" cy="12.5" r="0.8" fill="hsl(var(--accent-blue))" className="motion-safe:animate-pulse-soft opacity-50 [animation-delay:0.5s]" />
        <circle cx="13" cy="18" r="0.8" fill="hsl(var(--accent-blue))" className="motion-safe:animate-pulse-soft opacity-50 [animation-delay:1s]" />

        {/* Signal arc on the open side — tech feel */}
        <path
          d="M23 12.5a6 6 0 0 1 0 7"
          stroke="hsl(var(--accent-blue))"
          strokeWidth="1"
          strokeLinecap="round"
          className="opacity-20"
        />
        <path
          d="M25.5 11a8.5 8.5 0 0 1 0 10"
          stroke="hsl(var(--accent-blue))"
          strokeWidth="0.8"
          strokeLinecap="round"
          className="opacity-10"
        />
      </svg>

      {showText && (
        <span className="text-lg font-semibold tracking-tight">
          Claudia
          <span className="text-[hsl(var(--accent-blue))] ml-0.5 text-xs font-mono font-normal opacity-60">.ai</span>
        </span>
      )}
    </span>
  );
}
