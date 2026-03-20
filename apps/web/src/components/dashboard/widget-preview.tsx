"use client";

import {
  MessageCircle, MessageSquare, Headset, Sparkles, Send,
  ChevronLeft, Languages, RefreshCw, X, Paperclip,
} from "lucide-react";
import type { WidgetConfig } from "@chatbot/shared";
import { ClaudiaAvatar } from "@/components/dashboard/claudia-avatar";
import {
  BORDER_RADIUS_MAP,
  MESSAGE_RADIUS_MAP,
  SHADOW_MAP,
  BUBBLE_SIZE_MAP,
  FONT_FAMILY_MAP,
} from "@chatbot/shared";

interface WidgetPreviewProps {
  config: WidgetConfig;
  primaryColor: string;
  agentName: string;
  welcomeMessage: string;
  avatarUrl?: string | null;
}

function BubbleIcon({ icon, size }: { icon: string; size: number }) {
  const iconSize = size * 0.45;
  switch (icon) {
    case "message-circle":
      return <MessageCircle size={iconSize} />;
    case "headset":
      return <Headset size={iconSize} />;
    case "sparkle":
      return <Sparkles size={iconSize} />;
    case "chat":
    default:
      return <MessageSquare size={iconSize} />;
  }
}

function getBackgroundPattern(pattern: string | undefined, isDark: boolean) {
  const color = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  switch (pattern) {
    case "dots":
      return `radial-gradient(circle, ${color} 1px, transparent 1px)`;
    case "grid":
      return `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`;
    case "diagonal":
      return `repeating-linear-gradient(45deg, transparent, transparent 10px, ${color} 10px, ${color} 11px)`;
    default:
      return undefined;
  }
}

function getBackgroundSize(pattern: string | undefined) {
  switch (pattern) {
    case "dots":
      return "16px 16px";
    case "grid":
      return "20px 20px";
    default:
      return undefined;
  }
}

export function WidgetPreview({
  config,
  primaryColor,
  agentName,
  welcomeMessage,
  avatarUrl,
}: WidgetPreviewProps) {
  const isDark = config.theme === "dark";
  const borderRadius = BORDER_RADIUS_MAP[config.widgetBorderRadius ?? "rounded"];
  const msgRadius = MESSAGE_RADIUS_MAP[config.messageBorderRadius ?? "rounded"];
  const bubbleSize = BUBBLE_SIZE_MAP[config.bubbleSize ?? "md"];
  const font = FONT_FAMILY_MAP[config.fontFamily ?? "inter"];

  const shadow =
    config.widgetShadow === "glow"
      ? `0 0 40px ${primaryColor}40, 0 8px 30px rgba(0,0,0,0.12)`
      : SHADOW_MAP[config.widgetShadow ?? "lg"];

  // Header style
  let headerBg: string;
  if (config.headerStyle === "gradient" && config.headerGradientFrom && config.headerGradientTo) {
    headerBg = `linear-gradient(135deg, ${config.headerGradientFrom}, ${config.headerGradientTo})`;
  } else if (config.headerStyle === "transparent") {
    headerBg = "transparent";
  } else {
    headerBg = primaryColor;
  }

  const headerTextColor = config.headerTextColor ?? "#FFFFFF";
  const backgroundColor = config.backgroundColor ?? (isDark ? "#1A1A2E" : "#F9FAFB");
  const userMsgBg = config.userMessageBgColor ?? primaryColor;
  const userMsgText = config.userMessageTextColor ?? "#FFFFFF";
  const botMsgBg = config.botMessageBgColor ?? (isDark ? "#2D2D44" : "#FFFFFF");
  const botMsgText = config.botMessageTextColor ?? (isDark ? "#E5E7EB" : "#111827");
  const bubbleColor = config.bubbleColor ?? primaryColor;

  const glassStyles = config.glassEffect
    ? { backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" } as React.CSSProperties
    : {};

  const bgPattern = getBackgroundPattern(config.backgroundPattern, isDark);
  const bgSize = getBackgroundSize(config.backgroundPattern);

  return (
    <div className="relative" style={{ fontFamily: font }}>
      {/* Chat Window */}
      <div
        className="w-[370px] overflow-hidden flex flex-col"
        style={{
          borderRadius,
          boxShadow: shadow,
          height: 520,
          border: config.headerStyle === "transparent" ? `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}` : undefined,
          ...glassStyles,
        }}
      >
        {/* Header */}
        <div
          className="px-4 py-3 flex items-center gap-3 shrink-0"
          style={{
            background: headerBg,
            color: headerTextColor,
            borderBottom: config.headerStyle === "transparent" ? `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}` : undefined,
            ...(config.headerStyle === "transparent" ? { backgroundColor: isDark ? "rgba(26,26,46,0.8)" : "rgba(255,255,255,0.8)", ...glassStyles } : {}),
          }}
        >
          <button className="opacity-60 hover:opacity-100 transition-opacity" style={{ color: headerTextColor }}>
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <ClaudiaAvatar size="sm" />
            )}
            <span className="font-semibold text-sm truncate">{agentName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="opacity-50 hover:opacity-100 transition-opacity p-1" style={{ color: headerTextColor }}>
              <Languages size={16} />
            </button>
            <button className="opacity-50 hover:opacity-100 transition-opacity p-1" style={{ color: headerTextColor }}>
              <RefreshCw size={16} />
            </button>
            <button className="opacity-50 hover:opacity-100 transition-opacity p-1" style={{ color: headerTextColor }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div
          className="flex-1 p-4 space-y-3 overflow-y-auto"
          style={{
            backgroundColor,
            backgroundImage: bgPattern,
            backgroundSize: bgSize,
            ...glassStyles,
          }}
        >
          {/* Bot welcome */}
          <div className="flex items-start gap-2">
            <div className="mt-0.5">
              <ClaudiaAvatar size="sm" className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium" style={{ color: botMsgText, opacity: 0.7 }}>{agentName}</span>
                <span className="text-[10px]" style={{ color: botMsgText, opacity: 0.4 }}>À l&apos;instant</span>
              </div>
              <div
                className="px-3.5 py-2.5 text-sm leading-relaxed"
                style={{
                  backgroundColor: botMsgBg,
                  color: botMsgText,
                  borderRadius: `${msgRadius} ${msgRadius} ${msgRadius} 4px`,
                  boxShadow: isDark ? "none" : "0 1px 2px rgba(0,0,0,0.05)",
                  ...(config.glassEffect ? { backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" } as React.CSSProperties : {}),
                }}
              >
                {welcomeMessage || "Bonjour ! Comment puis-je vous aider ?"}
              </div>
            </div>
          </div>

          {/* User message */}
          <div className="flex justify-end">
            <div className="flex flex-col items-end">
              <span className="text-[10px] mb-1 mr-1" style={{ color: botMsgText, opacity: 0.4 }}>À l&apos;instant</span>
              <div
                className="px-3.5 py-2.5 text-sm leading-relaxed"
                style={{
                  backgroundColor: userMsgBg,
                  color: userMsgText,
                  borderRadius: `${msgRadius} ${msgRadius} 4px ${msgRadius}`,
                }}
              >
                Bonjour, comment ça marche ?
              </div>
            </div>
          </div>

          {/* Bot reply */}
          <div className="flex items-start gap-2">
            <div className="mt-0.5">
              <ClaudiaAvatar size="sm" className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium" style={{ color: botMsgText, opacity: 0.7 }}>{agentName}</span>
                <span className="text-[10px]" style={{ color: botMsgText, opacity: 0.4 }}>À l&apos;instant</span>
              </div>
              <div
                className="px-3.5 py-2.5 text-sm leading-relaxed"
                style={{
                  backgroundColor: botMsgBg,
                  color: botMsgText,
                  borderRadius: `${msgRadius} ${msgRadius} ${msgRadius} 4px`,
                  boxShadow: isDark ? "none" : "0 1px 2px rgba(0,0,0,0.05)",
                  ...(config.glassEffect ? { backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" } as React.CSSProperties : {}),
                }}
              >
                Je suis là pour répondre à vos questions à partir de la documentation.
              </div>

              {/* Feedback buttons */}
              <div className="flex gap-2 mt-2">
                <button
                  className="text-xs px-3 py-1.5 rounded-full border transition-colors"
                  style={{
                    borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
                    color: botMsgText,
                    opacity: 0.7,
                    backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
                  }}
                >
                  👍 Satisfait
                </button>
                <button
                  className="text-xs px-3 py-1.5 rounded-full border transition-colors"
                  style={{
                    borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
                    color: botMsgText,
                    opacity: 0.7,
                    backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
                  }}
                >
                  👎 Insatisfait
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div
          className="px-3 py-2.5 flex items-center gap-2 shrink-0"
          style={{
            backgroundColor: isDark ? "#16162a" : "#FFFFFF",
            borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            ...(config.glassEffect ? { backgroundColor: isDark ? "rgba(22,22,42,0.8)" : "rgba(255,255,255,0.9)", ...glassStyles } : {}),
          }}
        >
          <div
            className="flex-1 px-3 py-2 text-sm rounded-xl"
            style={{
              backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#F3F4F6",
              color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)",
            }}
          >
            Votre message...
          </div>
          <button className="p-1.5 opacity-40" style={{ color: isDark ? "#E5E7EB" : "#6B7280" }}>
            <Paperclip size={18} />
          </button>
          <button
            className="p-2 rounded-xl text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <Send size={16} />
          </button>
        </div>

        {/* Branding */}
        {config.showBranding !== false && (
          <div
            className="text-center py-1.5 text-[10px]"
            style={{
              backgroundColor: isDark ? "#12122a" : "#F9FAFB",
              color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
              borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
            }}
          >
            Powered By <strong>HelloClaudia</strong>
          </div>
        )}
      </div>

      {/* Launcher Bubble */}
      <div
        className="absolute -bottom-4 -right-4 rounded-full flex items-center justify-center text-white cursor-pointer transition-transform hover:scale-105"
        style={{
          width: bubbleSize,
          height: bubbleSize,
          backgroundColor: bubbleColor,
          boxShadow: `0 4px 14px ${bubbleColor}40`,
        }}
      >
        <BubbleIcon icon={config.bubbleIcon ?? "chat"} size={bubbleSize} />
      </div>
    </div>
  );
}
