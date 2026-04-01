export interface AgentConfig {
  name: string;
  primaryColor: string;
  avatarUrl: string | null;
  welcomeMessage: string;
  suggestedQuestions: string[];
  position: string;
  leadCaptureEnabled: boolean;
  leadCaptureFields: Array<{ field: string; required: boolean }> | null;
  widgetConfig: WidgetConfig | null;
}

export interface WidgetConfig {
  theme: "light" | "dark" | "custom";
  headerStyle: "solid" | "gradient" | "transparent";
  headerGradientFrom?: string;
  headerGradientTo?: string;
  headerTextColor?: string;
  backgroundColor?: string;
  backgroundPattern?: "none" | "dots" | "grid" | "diagonal";
  userMessageBgColor?: string;
  userMessageTextColor?: string;
  botMessageBgColor?: string;
  botMessageTextColor?: string;
  messageBorderRadius?: "sharp" | "rounded" | "pill";
  fontFamily?: "inter" | "system" | "poppins" | "dm-sans" | "geist";
  bubbleIcon?: "chat" | "message-circle" | "headset" | "sparkle";
  bubbleImageUrl?: string;
  bubbleSize?: "sm" | "md" | "lg";
  bubbleColor?: string;
  widgetBorderRadius?: "sharp" | "rounded" | "pill";
  widgetShadow?: "none" | "sm" | "md" | "lg" | "glow";
  glassEffect?: boolean;
  showBranding?: boolean;
}

export interface ProductData {
  id: string;
  name: string;
  description: string;
  url: string;
  imageUrl?: string;
  price?: string;
  ctaText: string;
  displayMode: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Array<{ title: string; url?: string }>;
  products?: ProductData[];
  feedbackScore?: number;
}

export const BORDER_RADIUS_MAP: Record<string, string> = {
  sharp: "8px",
  rounded: "16px",
  pill: "24px",
};

export const MESSAGE_RADIUS_MAP: Record<string, string> = {
  sharp: "4px",
  rounded: "16px",
  pill: "24px",
};

export const SHADOW_MAP: Record<string, string> = {
  none: "none",
  sm: "0 1px 3px rgba(0,0,0,0.1)",
  md: "0 4px 12px rgba(0,0,0,0.1)",
  lg: "0 8px 30px rgba(0,0,0,0.12)",
  glow: "",
};

export const BUBBLE_SIZE_MAP: Record<string, number> = {
  sm: 48,
  md: 56,
  lg: 64,
};

export const FONT_FAMILY_MAP: Record<string, string> = {
  inter: "'Inter', sans-serif",
  system:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  poppins: "'Poppins', sans-serif",
  "dm-sans": "'DM Sans', sans-serif",
  geist: "'Geist', sans-serif",
};
