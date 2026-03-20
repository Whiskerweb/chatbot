import { cn } from "@/lib/utils";
import Image from "next/image";

const SIZES = {
  sm: { container: "w-8 h-8", icon: 20 },
  md: { container: "w-12 h-12", icon: 28 },
  lg: { container: "w-16 h-16", icon: 40 },
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
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25) 0%, transparent 60%)",
        }}
      />
      <Image
        src="/logo.png"
        alt="HelloClaudia"
        width={s.icon}
        height={s.icon}
        className="relative z-10 invert"
      />
    </div>
  );
}
