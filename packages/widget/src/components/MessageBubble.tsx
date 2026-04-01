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
  onSendMessage?: (text: string) => void;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderMarkdown(text: string): string {
  // Extract code blocks BEFORE escaping HTML (they contain raw code)
  const codeBlocks: string[] = [];
  let processed = text.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const idx = codeBlocks.length;
    const langLabel = lang ? `<span style="position:absolute;top:6px;left:10px;font-size:10px;opacity:0.5;text-transform:uppercase">${escapeHtml(lang)}</span>` : "";
    codeBlocks.push(
      `<div style="position:relative;margin:8px 0;border-radius:8px;background:#1e1e1e;color:#d4d4d4;font-size:12px;overflow:hidden">` +
      langLabel +
      `<button onclick="navigator.clipboard.writeText(this.parentElement.querySelector('code').textContent).then(()=>{this.textContent='Copié !';setTimeout(()=>this.textContent='Copier',1500)})" style="position:absolute;top:6px;right:8px;font-size:10px;padding:2px 8px;border-radius:4px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.08);color:#ccc;cursor:pointer">Copier</button>` +
      `<pre style="margin:0;padding:${lang ? "28px" : "12px"} 12px 12px;overflow-x:auto;white-space:pre"><code>${escapeHtml(code.trim())}</code></pre>` +
      `</div>`
    );
    return `__CODEBLOCK_${idx}__`;
  });

  let html = escapeHtml(processed);

  // Headers: ## Title
  html = html.replace(/^### (.+)$/gm, '<div style="font-weight:700;font-size:13px;margin:8px 0 4px">$1</div>');
  html = html.replace(/^## (.+)$/gm, '<div style="font-weight:700;font-size:14px;margin:10px 0 4px">$1</div>');

  // Bold: **text**
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Italic: *text*
  html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>");

  // Inline code: `code`
  html = html.replace(/`([^`]+)`/g, '<code style="background:rgba(0,0,0,0.06);padding:1px 5px;border-radius:4px;font-size:12px;font-family:monospace">$1</code>');

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

  // Restore code blocks
  for (let i = 0; i < codeBlocks.length; i++) {
    html = html.replace(`__CODEBLOCK_${i}__`, codeBlocks[i]);
  }

  return `<p style="margin:0">${html}</p>`;
}

export function MessageBubble({ message, config, apiBase, isDark, onSendMessage }: MessageBubbleProps) {
  const [feedbackScore, setFeedbackScore] = useState<number | undefined>(
    message.feedbackScore
  );
  const [showReasons, setShowReasons] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const wc = config.widgetConfig;
  const isUser = message.role === "user";
  const msgRadius = MESSAGE_RADIUS_MAP[wc?.messageBorderRadius || "rounded"] || "16px";

  const userBg = wc?.userMessageBgColor || config.primaryColor;
  const userText = wc?.userMessageTextColor || "#fff";
  const botBg = wc?.botMessageBgColor || (isDark ? "#2a2a2a" : "#f0f0f0");
  const botText = wc?.botMessageTextColor || (isDark ? "#fff" : "#1a1a1a");

  const handleFeedback = async (score: number, reason?: string) => {
    if (feedbackScore === score && !reason) return;
    setFeedbackScore(score);
    setShowReasons(false);
    try {
      await submitFeedback(apiBase, { messageId: message.id, score, reason });
    } catch {
      // ignore
    }
  };

  const handleThumbsDown = () => {
    if (feedbackScore === -1) return;
    setShowReasons(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
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
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "4px",
            paddingLeft: "2px",
            ...(message.searching ? { animation: "hc-pulse 1.5s ease-in-out infinite" } : {}),
          }}>
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

        {/* Feedback + Copy — only on real messages, not welcome */}
        {!isUser && message.id !== "welcome" && message.content && (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", paddingLeft: "2px" }}>
            <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
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
                onClick={handleThumbsDown}
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
              {/* Copy button */}
              <button
                onClick={handleCopy}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px 4px",
                  borderRadius: "4px",
                  opacity: copied ? 1 : hovered ? 0.7 : 0.3,
                  transition: "opacity 0.15s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title={copied ? "Copie !" : "Copier la reponse"}
              >
                {copied ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke={isDark ? "#fff" : "#1a1a1a"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke={isDark ? "#fff" : "#1a1a1a"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                )}
              </button>
            </div>
            {/* Negative feedback reasons */}
            {showReasons && (
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", animation: "hc-fade-in 0.2s ease" }}>
                {([
                  { label: "Incorrecte", value: "incorrecte" },
                  { label: "Incomplete", value: "incomplete" },
                  { label: "Hors sujet", value: "hors_sujet" },
                ] as const).map((r) => (
                  <button
                    key={r.value}
                    onClick={() => handleFeedback(-1, r.value)}
                    style={{
                      background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`,
                      color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
                      cursor: "pointer",
                      fontSize: "11px",
                      padding: "3px 8px",
                      borderRadius: "8px",
                      transition: "background-color 0.15s ease",
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Follow-up questions */}
        {!isUser && message.followUp && message.followUp.length > 0 && onSendMessage && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", paddingLeft: "2px", marginTop: "4px" }}>
            {message.followUp.map((q, i) => (
              <button
                key={i}
                onClick={() => onSendMessage(q)}
                style={{
                  background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`,
                  color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)",
                  cursor: "pointer",
                  fontSize: "12px",
                  padding: "6px 12px",
                  borderRadius: "12px",
                  transition: "background-color 0.15s ease",
                  textAlign: "left",
                  lineHeight: "1.4",
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
