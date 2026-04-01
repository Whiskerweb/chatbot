import { h } from "preact";
import { useRef, useEffect } from "preact/hooks";
import type { AgentConfig, Message, WidgetConfig } from "../types";
import {
  BORDER_RADIUS_MAP,
  SHADOW_MAP,
  FONT_FAMILY_MAP,
} from "../types";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { LeadCaptureForm } from "./LeadCaptureForm";
import { InputBar } from "./InputBar";

interface ChatWindowProps {
  config: AgentConfig;
  messages: Message[];
  isStreaming: boolean;
  showLeadForm: boolean;
  conversationId: string | null;
  apiBase: string;
  agentId: string;
  expanded: boolean;
  onSend: (text: string) => void;
  onClose: () => void;
  onReset: () => void;
  onLeadSubmitted: () => void;
  onToggleExpand: () => void;
  onDismissLead: () => void;
}

export function ChatWindow({
  config,
  messages,
  isStreaming,
  showLeadForm,
  conversationId,
  apiBase,
  agentId,
  expanded,
  onSend,
  onClose,
  onReset,
  onLeadSubmitted,
  onToggleExpand,
  onDismissLead,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wc = config.widgetConfig;
  const isDark = wc?.theme === "dark" || (wc?.theme !== "light" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const primaryColor = config.primaryColor;
  const borderRadius = BORDER_RADIUS_MAP[wc?.widgetBorderRadius || "rounded"] || "16px";
  const shadow = wc?.widgetShadow === "glow"
    ? `0 0 30px ${primaryColor}33`
    : (SHADOW_MAP[wc?.widgetShadow || "lg"] || SHADOW_MAP.lg);
  const fontFamily = FONT_FAMILY_MAP[wc?.fontFamily || "system"] || FONT_FAMILY_MAP.system;
  const bgColor = wc?.backgroundColor || (isDark ? "#1a1a1a" : "#ffffff");

  // Background pattern
  let bgPattern = "";
  if (wc?.backgroundPattern === "dots") {
    bgPattern = isDark
      ? "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)"
      : "radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)";
  } else if (wc?.backgroundPattern === "grid") {
    const lineColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
    bgPattern = `linear-gradient(${lineColor} 1px, transparent 1px), linear-gradient(90deg, ${lineColor} 1px, transparent 1px)`;
  } else if (wc?.backgroundPattern === "diagonal") {
    const lineColor = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)";
    bgPattern = `repeating-linear-gradient(45deg, transparent, transparent 10px, ${lineColor} 10px, ${lineColor} 11px)`;
  }

  // Header style
  let headerBg = primaryColor;
  let headerText = wc?.headerTextColor || "#fff";
  const headerStyle = wc?.headerStyle || "solid";
  if (headerStyle === "gradient") {
    const from = wc?.headerGradientFrom || primaryColor;
    const to = wc?.headerGradientTo || primaryColor;
    headerBg = `linear-gradient(135deg, ${from}, ${to})`;
  } else if (headerStyle === "transparent") {
    headerBg = isDark ? "rgba(26,26,26,0.8)" : "rgba(255,255,255,0.8)";
    headerText = wc?.headerTextColor || (isDark ? "#fff" : "#1a1a1a");
  }

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const hasOnlyWelcome = messages.length <= 1;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "80px",
        right: "20px",
        width: expanded ? "500px" : "380px",
        height: expanded ? "700px" : "560px",
        maxWidth: "calc(100vw - 20px)",
        maxHeight: "calc(100vh - 100px)",
        transition: "width 0.25s ease, height 0.25s ease",
        borderRadius,
        boxShadow: shadow,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily,
        animation: "hc-slide-up 0.25s ease",
        zIndex: "2147483646",
        backgroundColor: bgColor,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px",
          background: headerBg,
          color: headerText,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexShrink: 0,
          ...(headerStyle === "transparent"
            ? { backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }
            : {}),
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
            backgroundColor: headerStyle === "transparent" ? primaryColor : "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: "700",
            color: "#fff",
          }}
        >
          {config.avatarUrl ? (
            <img
              src={config.avatarUrl}
              alt={config.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            config.name.charAt(0).toUpperCase()
          )}
        </div>

        {/* Name */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: "600", fontSize: "15px", lineHeight: "1.3" }}>
            {config.name}
          </div>
          <div style={{ fontSize: "12px", opacity: 0.8 }}>En ligne</div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "4px" }}>
          {/* Expand/Shrink */}
          <button
            onClick={onToggleExpand}
            title={expanded ? "Réduire" : "Agrandir"}
            style={{
              background: "none",
              border: "none",
              color: headerText,
              cursor: "pointer",
              padding: "4px",
              borderRadius: "6px",
              opacity: 0.7,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {expanded ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
                <polyline points="4 14 10 14 10 20" />
                <polyline points="20 10 14 10 14 4" />
                <line x1="14" y1="10" x2="21" y2="3" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            )}
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            title="Nouvelle conversation"
            style={{
              background: "none",
              border: "none",
              color: headerText,
              cursor: "pointer",
              padding: "4px",
              borderRadius: "6px",
              opacity: 0.7,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            title="Fermer"
            style={{
              background: "none",
              border: "none",
              color: headerText,
              cursor: "pointer",
              padding: "4px",
              borderRadius: "6px",
              opacity: 0.7,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          padding: "12px 0",
          ...(bgPattern
            ? {
                backgroundImage: bgPattern,
                backgroundSize:
                  wc?.backgroundPattern === "dots"
                    ? "16px 16px"
                    : wc?.backgroundPattern === "grid"
                    ? "20px 20px"
                    : undefined,
              }
            : {}),
        }}
      >
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            config={{
              primaryColor,
              avatarUrl: config.avatarUrl,
              name: config.name,
              widgetConfig: wc,
            }}
            apiBase={apiBase}
            isDark={isDark}
            onSendMessage={onSend}
          />
        ))}

        {isStreaming && messages[messages.length - 1]?.role === "user" && (
          <div style={{ paddingLeft: "44px" }}>
            <TypingIndicator color={isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)"} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions */}
      {hasOnlyWelcome && !isStreaming && config.suggestedQuestions?.length > 0 && (
        <SuggestedQuestions
          questions={config.suggestedQuestions}
          onSelect={onSend}
          primaryColor={primaryColor}
          isDark={isDark}
        />
      )}

      {/* Lead capture form */}
      {showLeadForm && (
        <LeadCaptureForm
          config={config}
          apiBase={apiBase}
          agentId={agentId}
          conversationId={conversationId}
          onSubmitted={onLeadSubmitted}
          onDismiss={onDismissLead}
          primaryColor={primaryColor}
          isDark={isDark}
        />
      )}

      {/* Input bar */}
      <InputBar
        onSend={onSend}
        isStreaming={isStreaming}
        primaryColor={primaryColor}
        isDark={isDark}
      />

      {/* Branding */}
      {(wc?.showBranding !== false) && (
        <div
          style={{
            textAlign: "center",
            padding: "6px",
            fontSize: "11px",
            color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
            borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
          }}
        >
          Propulsé par{" "}
          <a
            href="https://helloclaudia.fr"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            HelloClaudia
          </a>
        </div>
      )}
    </div>
  );
}
