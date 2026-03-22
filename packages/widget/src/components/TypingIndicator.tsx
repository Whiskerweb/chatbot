import { h } from "preact";

interface TypingIndicatorProps {
  color: string;
}

export function TypingIndicator({ color }: TypingIndicatorProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "4px",
        padding: "12px 16px",
        alignItems: "center",
        color,
      }}
    >
      <span class="hc-typing-dot" style={{ animationDelay: "0ms" }} />
      <span class="hc-typing-dot" style={{ animationDelay: "150ms" }} />
      <span class="hc-typing-dot" style={{ animationDelay: "300ms" }} />
    </div>
  );
}
