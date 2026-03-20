import { cn } from "@/lib/utils";

const SIZES = {
  sm: { container: "w-8 h-8", text: "text-[11px]" },
  md: { container: "w-12 h-12", text: "text-base" },
  lg: { container: "w-16 h-16", text: "text-xl" },
} as const;

interface ClaudiaAvatarProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ClaudiaAvatar({ size = "md", className }: ClaudiaAvatarProps) {
  const s = SIZES[size];

  return (
    <div
      className={cn(
        s.container,
        "rounded-full shrink-0 flex items-center justify-center relative overflow-hidden",
        className
      )}
      style={{
        background: "linear-gradient(135deg, #0084ff 0%, #8b5cf6 50%, #ec4899 100%)",
      }}
    >
      {/* Subtle inner glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25) 0%, transparent 60%)",
        }}
      />
      {/* Abstract face - minimalist geometric design */}
      <svg
        viewBox="0 0 40 40"
        fill="none"
        className={cn("relative z-10", size === "sm" ? "w-5 h-5" : size === "md" ? "w-7 h-7" : "w-10 h-10")}
      >
        {/* Face outline - soft organic shape */}
        <ellipse cx="20" cy="21" rx="10" ry="11.5" fill="rgba(255,255,255,0.9)" />
        {/* Left eye */}
        <ellipse cx="16.5" cy="19" rx="1.8" ry="2" fill="#1a1a2e" />
        <circle cx="16" cy="18.3" r="0.6" fill="white" />
        {/* Right eye */}
        <ellipse cx="23.5" cy="19" rx="1.8" ry="2" fill="#1a1a2e" />
        <circle cx="23" cy="18.3" r="0.6" fill="white" />
        {/* Smile */}
        <path
          d="M16.5 24.5 Q20 27 23.5 24.5"
          stroke="#1a1a2e"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Hair - flowing abstract strands */}
        <path
          d="M10 17 Q10 8 20 7 Q30 8 30 17"
          fill="rgba(255,255,255,0.9)"
        />
        <path
          d="M9 18 Q8 7 20 5.5 Q32 7 31 18"
          fill="#1a1a2e"
        />
        {/* Hair detail - side strands */}
        <path
          d="M9 18 Q7 22 9 26"
          stroke="#1a1a2e"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M31 18 Q33 22 31 26"
          stroke="#1a1a2e"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Small AI sparkle */}
        <circle cx="30" cy="10" r="1.5" fill="rgba(255,255,255,0.8)" />
        <circle cx="31.5" cy="8" r="0.8" fill="rgba(255,255,255,0.5)" />
      </svg>
    </div>
  );
}
