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
        "rounded-full shrink-0 flex items-center justify-center bg-white border border-border/40",
        className
      )}
    >
      <Image
        src="/logo.png"
        alt="HelloClaudia"
        width={s.icon}
        height={s.icon}
      />
    </div>
  );
}
