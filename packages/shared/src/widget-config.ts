import { z } from "zod";

// --- Zod Schema ---

export const widgetConfigSchema = z.object({
  theme: z.enum(["light", "dark", "custom"]),
  presetId: z.string().optional(),

  // Header
  headerStyle: z.enum(["solid", "gradient", "transparent"]),
  headerGradientFrom: z.string().optional(),
  headerGradientTo: z.string().optional(),
  headerTextColor: z.string().optional(),

  // Chat area
  backgroundColor: z.string().optional(),
  backgroundPattern: z.enum(["none", "dots", "grid", "diagonal"]).optional(),

  // Message bubbles
  userMessageBgColor: z.string().optional(),
  userMessageTextColor: z.string().optional(),
  botMessageBgColor: z.string().optional(),
  botMessageTextColor: z.string().optional(),
  messageBorderRadius: z.enum(["sharp", "rounded", "pill"]).optional(),

  // Typography
  fontFamily: z.enum(["inter", "system", "poppins", "dm-sans", "geist"]).optional(),

  // Launcher bubble
  bubbleIcon: z.enum(["chat", "message-circle", "headset", "sparkle", "custom"]).optional(),
  bubbleSize: z.enum(["sm", "md", "lg"]).optional(),
  bubbleColor: z.string().optional(),

  // Shape & effects
  widgetBorderRadius: z.enum(["sharp", "rounded", "pill"]).optional(),
  widgetShadow: z.enum(["none", "sm", "md", "lg", "glow"]).optional(),
  glassEffect: z.boolean().optional(),

  // Branding
  showBranding: z.boolean().optional(),
});

// --- TypeScript type ---

export type WidgetConfig = z.infer<typeof widgetConfigSchema>;

// --- Default config ---

export const DEFAULT_WIDGET_CONFIG: WidgetConfig = {
  theme: "light",
  presetId: "classic-light",

  headerStyle: "solid",
  headerTextColor: "#FFFFFF",

  backgroundColor: "#F9FAFB",
  backgroundPattern: "none",

  userMessageBgColor: "#1A56DB",
  userMessageTextColor: "#FFFFFF",
  botMessageBgColor: "#FFFFFF",
  botMessageTextColor: "#111827",
  messageBorderRadius: "rounded",

  fontFamily: "inter",

  bubbleIcon: "chat",
  bubbleSize: "md",

  widgetBorderRadius: "rounded",
  widgetShadow: "lg",
  glassEffect: false,

  showBranding: true,
};

// --- Helpers ---

export const BORDER_RADIUS_MAP = {
  sharp: "8px",
  rounded: "16px",
  pill: "24px",
} as const;

export const MESSAGE_RADIUS_MAP = {
  sharp: "4px",
  rounded: "16px",
  pill: "24px",
} as const;

export const SHADOW_MAP = {
  none: "none",
  sm: "0 1px 3px rgba(0,0,0,0.1)",
  md: "0 4px 12px rgba(0,0,0,0.1)",
  lg: "0 8px 30px rgba(0,0,0,0.12)",
  glow: "", // computed dynamically with primaryColor
} as const;

export const BUBBLE_SIZE_MAP = {
  sm: 48,
  md: 56,
  lg: 64,
} as const;

export const FONT_FAMILY_MAP = {
  inter: "'Inter', sans-serif",
  system: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  poppins: "'Poppins', sans-serif",
  "dm-sans": "'DM Sans', sans-serif",
  geist: "'Geist', sans-serif",
} as const;
