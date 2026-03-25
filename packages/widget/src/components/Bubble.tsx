import { h } from "preact";
import { BUBBLE_SIZE_MAP } from "../types";
import type { WidgetConfig } from "../types";

interface BubbleProps {
  isOpen: boolean;
  onClick: () => void;
  primaryColor: string;
  avatarUrl: string | null;
  apiBase: string;
  widgetConfig: WidgetConfig | null;
}

const ICONS: Record<string, h.JSX.Element> = {
  chat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  "message-circle": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  ),
  headset: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
      <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  ),
};

const CLOSE_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export function Bubble({ isOpen, onClick, primaryColor, avatarUrl, apiBase, widgetConfig }: BubbleProps) {
  const iconKey = widgetConfig?.bubbleIcon || "chat";
  const sizeKey = widgetConfig?.bubbleSize || "md";
  const color = widgetConfig?.bubbleColor || primaryColor;
  const size = BUBBLE_SIZE_MAP[sizeKey] || 56;

  // Priority: bubbleImageUrl > avatarUrl > default widget-icon.png
  const imageUrl = widgetConfig?.bubbleImageUrl || avatarUrl || `${apiBase}/widget-icon.png`;

  return (
    <div
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        backgroundColor: color,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        zIndex: "2147483647",
        animation: "hc-fade-in 0.3s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
      }}
    >
      {isOpen ? CLOSE_ICON : (
        <img
          src={imageUrl}
          alt="Chat"
          style={{
            width: `${Math.round(size * 0.55)}px`,
            height: `${Math.round(size * 0.55)}px`,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      )}
    </div>
  );
}
