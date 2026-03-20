import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md";
  showText?: boolean;
  className?: string;
}

export function LogoIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="HelloClaudia"
      width={size}
      height={size}
      className={`shrink-0 dark:invert ${className}`}
    />
  );
}

export function Logo({ size = "sm", showText = true, className = "" }: LogoProps) {
  const s = size === "sm" ? 28 : 34;

  return (
    <span className={`group inline-flex items-center gap-2 ${className}`}>
      <LogoIcon
        size={s}
        className="transition-transform duration-300 ease-apple group-hover:scale-110"
      />

      {showText && (
        <span className="inline-flex items-baseline gap-[3px]">
          <span className="text-[8px] font-medium uppercase tracking-[0.12em] text-muted-foreground/70">
            hello
          </span>
          <span className="text-[17px] font-semibold tracking-tight text-foreground leading-none">
            claudia
          </span>
        </span>
      )}
    </span>
  );
}
