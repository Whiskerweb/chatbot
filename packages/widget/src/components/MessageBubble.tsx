import { h } from "preact";
import { useState } from "preact/hooks";
import { submitFeedback } from "../lib/api";
import type { Message, WidgetConfig } from "../types";
import { MESSAGE_RADIUS_MAP } from "../types";
import { ProductCard } from "./ProductCard";

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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderMarkdown(text: string): string {
  let html = escapeHtml(text);

  // Headers: ## Title
  html = html.replace(/^### (.+)$/gm, '<div style="font-weight:700;font-size:13px;margin:8px 0 4px">$1</div>');
  html = html.replace(/^## (.+)$/gm, '<div style="font-weight:700;font-size:14px;margin:10px 0 4px">$1</div>');

  // Bold: **text**
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Italic: *text*
  html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>");

  // Links: [text](url) — only allow https
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:underline">$1</a>');

  // Unordered lists: - item or * item
  html = html.replace(/^[\-\*] (.+)$/gm, '<li style="margin-left:16px;list-style:disc">$1</li>');
  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li[^>]*>.*?<\/li>\n?)+)/g, '<ul style="margin:4px 0;padding:0">$1</ul>');

  // Line breaks (but not double for paragraphs)
  html = html.replace(/\n\n/g, '</p><p style="margin:8px 0">');
  html = html.replace(/\n/g, "<br/>");

  return `<p style="margin:0">${html}</p>`;
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

  // Deduplicate sources by URL
  const uniqueSources = message.sources
    ? message.sources.filter((s, i, arr) =>
        arr.findIndex((x) => (x.url || x.title) === (s.url || s.title)) === i
      )
    : [];

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
            lineHeight: "1.6",
            wordBreak: "break-word",
          }}
        >
          {isUser ? (
            message.content
          ) : (
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }} />
          )}
        </div>

        {/* Sources — deduplicated, with favicons */}
        {!isUser && uniqueSources.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", paddingLeft: "2px" }}>
            {uniqueSources.map((s, i) => {
              const domain = s.url ? new URL(s.url).hostname.replace("www.", "") : "";
              return (
                <a
                  key={i}
                  href={s.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "11px",
                    color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
                    textDecoration: "none",
                    padding: "3px 8px",
                    borderRadius: "8px",
                    backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    transition: "background-color 0.15s ease",
                  }}
                >
                  {s.url && (
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=16`}
                      alt=""
                      style={{ width: "12px", height: "12px", borderRadius: "2px" }}
                    />
                  )}
                  {domain || s.title}
                </a>
              );
            })}
          </div>
        )}

        {/* Product cards */}
        {!isUser && message.products && message.products.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
            {message.products
              .filter((p) => p.displayMode !== "INLINE_LINK")
              .map((product, i) => (
                <ProductCard
                  key={i}
                  product={product}
                  primaryColor={config.primaryColor}
                  isDark={isDark}
                  apiBase={apiBase}
                />
              ))}
          </div>
        )}

        {/* Feedback — only on real messages, not welcome */}
        {!isUser && message.id !== "welcome" && message.content && (
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
                opacity: feedbackScore === 1 ? 1 : 0.3,
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
                opacity: feedbackScore === -1 ? 1 : 0.3,
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
