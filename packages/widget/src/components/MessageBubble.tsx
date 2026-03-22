import { h } from "preact";
import { useState } from "preact/hooks";
import { submitFeedback } from "../lib/api";
import type { Message, WidgetConfig } from "../types";
import { MESSAGE_RADIUS_MAP } from "../types";

interface MessageBubbleProps {
  message: Message;
  config: {
    primaryColor: string;
    avatarUrl: string | null;
    name: string;
    widgetConfig: WidgetConfig | null;
  };
  apiBase: string;
  isDark: boolean;
}

export function MessageBubble({ message, config, apiBase, isDark }: MessageBubbleProps) {
  const [feedbackScore, setFeedbackScore] = useState<number | undefined>(
    message.feedbackScore
  );

  const wc = config.widgetConfig;
  const isUser = message.role === "user";
  const msgRadius = MESSAGE_RADIUS_MAP[wc?.messageBorderRadius || "rounded"] || "16px";

  const userBg = wc?.userMessageBgColor || config.primaryColor;
  const userText = wc?.userMessageTextColor || "#fff";
  const botBg = wc?.botMessageBgColor || (isDark ? "#2a2a2a" : "#f0f0f0");
  const botText = wc?.botMessageTextColor || (isDark ? "#fff" : "#1a1a1a");

  const handleFeedback = async (score: number) => {
    if (feedbackScore === score) return;
    setFeedbackScore(score);
    try {
      await submitFeedback(apiBase, { messageId: message.id, score });
    } catch {
      // ignore
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-end",
        gap: "8px",
        padding: "2px 16px",
        animation: "hc-fade-in 0.2s ease",
      }}
    >
      {/* Avatar for bot */}
      {!isUser && (
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            flexShrink: 0,
            overflow: "hidden",
            backgroundColor: config.primaryColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            color: "#fff",
            fontWeight: "600",
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
      )}

      <div style={{ maxWidth: "80%", display: "flex", flexDirection: "column", gap: "4px" }}>
        {/* Message bubble */}
        <div
          style={{
            padding: "10px 14px",
            borderRadius: isUser
              ? `${msgRadius} ${msgRadius} 4px ${msgRadius}`
              : `${msgRadius} ${msgRadius} ${msgRadius} 4px`,
            backgroundColor: isUser ? userBg : botBg,
            color: isUser ? userText : botText,
            fontSize: "14px",
            lineHeight: "1.5",
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
          }}
        >
          {message.content}
        </div>

        {/* Sources */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", paddingLeft: "2px" }}>
            {message.sources.map((s, i) => (
              <a
                key={i}
                href={s.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "11px",
                  color: config.primaryColor,
                  textDecoration: "none",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                  transition: "background-color 0.15s ease",
                }}
              >
                {s.title}
              </a>
            ))}
          </div>
        )}

        {/* Feedback */}
        {!isUser && message.id && (
          <div style={{ display: "flex", gap: "4px", paddingLeft: "2px" }}>
            <button
              onClick={() => handleFeedback(1)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                padding: "2px 4px",
                borderRadius: "4px",
                opacity: feedbackScore === 1 ? 1 : 0.4,
                transition: "opacity 0.15s ease",
              }}
              title="Utile"
            >
              👍
            </button>
            <button
              onClick={() => handleFeedback(-1)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                padding: "2px 4px",
                borderRadius: "4px",
                opacity: feedbackScore === -1 ? 1 : 0.4,
                transition: "opacity 0.15s ease",
              }}
              title="Pas utile"
            >
              👎
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
