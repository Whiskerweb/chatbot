"use client";

import { useState, useRef, useEffect, useCallback, FormEvent } from "react";

// ── Types ──

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: { title: string; url?: string }[];
  searching?: boolean;
  feedbackScore?: number | null;
}

interface AgentConfig {
  agentId: string;
  name: string;
  primaryColor: string;
  avatarUrl: string | null;
  welcomeMessage: string;
  suggestedQuestions: string[];
  leadCaptureEnabled: boolean;
  leadCaptureFields: Record<string, boolean> | null;
  widgetConfig: Record<string, unknown> | null;
}

interface Props {
  config: AgentConfig;
}

// ── Helpers ──

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getVisitorId(agentId: string): string {
  if (typeof window === "undefined") return "ssr";
  const key = `hc_visitor_${agentId}`;
  let id = localStorage.getItem(key);
  if (!id) {
    id = "v_" + generateId();
    localStorage.setItem(key, id);
  }
  return id;
}

function getStoredConversationId(agentId: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(`hc_conv_${agentId}`);
}

function storeConversationId(agentId: string, id: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(`hc_conv_${agentId}`, id);
  }
}

// ── Markdown-lite renderer ──

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderMarkdown(text: string) {
  return escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline">$1</a>')
    .replace(/\n/g, "<br />");
}

// ── Component ──

export function ChatClient({ config }: Props) {
  const {
    agentId,
    name,
    primaryColor,
    avatarUrl,
    welcomeMessage,
    suggestedQuestions,
    leadCaptureEnabled,
    leadCaptureFields,
    widgetConfig,
  } = config;

  const theme = (widgetConfig?.theme as string) ?? "light";
  const isDark = theme === "dark";

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: welcomeMessage,
    },
  ]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [visitorId] = useState(() => getVisitorId(agentId));
  const [isStreaming, setIsStreaming] = useState(false);
  const [input, setInput] = useState("");
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // Lead form fields
  const [leadEmail, setLeadEmail] = useState("");
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Restore conversation id
  useEffect(() => {
    const stored = getStoredConversationId(agentId);
    if (stored) setConversationId(stored);
  }, [agentId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Show lead form after 2 user messages
  useEffect(() => {
    if (!leadCaptureEnabled || leadSubmitted) return;
    const userMsgCount = messages.filter((m) => m.role === "user").length;
    if (userMsgCount >= 2 && !showLeadForm) {
      setShowLeadForm(true);
    }
  }, [messages, leadCaptureEnabled, leadSubmitted, showLeadForm]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const userMsg: ChatMessage = {
        id: generateId(),
        role: "user",
        content: text.trim(),
      };

      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setInput("");
      setIsStreaming(true);

      try {
        const res = await fetch("/api/v1/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-agent-id": agentId,
          },
          body: JSON.stringify({
            message: text.trim(),
            conversationId,
            visitorId,
            metadata: { pageUrl: window.location.href },
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last.role === "assistant") {
              last.content =
                err.error === "CREDITS_EXHAUSTED"
                  ? "Le chatbot est temporairement indisponible. Veuillez r\u00e9essayer plus tard."
                  : "D\u00e9sol\u00e9, une erreur est survenue. Veuillez r\u00e9essayer.";
            }
            return updated;
          });
          setIsStreaming(false);
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) {
          setIsStreaming(false);
          return;
        }

        const decoder = new TextDecoder();
        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const data = JSON.parse(line.slice(6));

              if (data.searching) {
                setMessages((prev) => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  if (last.role === "assistant") {
                    last.sources = data.searching;
                    last.searching = true;
                  }
                  return [...updated];
                });
              }

              if (data.token) {
                fullContent += data.token;
                setMessages((prev) => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  if (last.role === "assistant") {
                    last.content = fullContent;
                    last.searching = false;
                  }
                  return [...updated];
                });
              }

              if (data.sources) {
                setMessages((prev) => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  if (last.role === "assistant") {
                    last.sources = data.sources;
                    last.searching = false;
                  }
                  return [...updated];
                });
              }

              if (data.done) {
                if (data.conversationId) {
                  setConversationId(data.conversationId);
                  storeConversationId(agentId, data.conversationId);
                }
                if (data.messageId) {
                  setMessages((prev) => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    if (last.role === "assistant") {
                      last.id = data.messageId;
                    }
                    return [...updated];
                  });
                }
              }
            } catch {
              // skip malformed lines
            }
          }
        }
      } catch {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === "assistant") {
            last.content = "D\u00e9sol\u00e9, une erreur de connexion est survenue.";
          }
          return updated;
        });
      } finally {
        setIsStreaming(false);
      }
    },
    [agentId, conversationId, visitorId, isStreaming]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleFeedback = async (messageId: string, score: number) => {
    try {
      await fetch("/api/v1/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, score }),
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, feedbackScore: score } : m))
      );
    } catch {
      // silent fail
    }
  };

  const handleLeadSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!leadEmail.trim()) return;
    try {
      await fetch("/api/v1/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId,
          conversationId,
          email: leadEmail.trim(),
          name: leadName.trim() || undefined,
          phone: leadPhone.trim() || undefined,
        }),
      });
      setShowLeadForm(false);
      setLeadSubmitted(true);
    } catch {
      // silent fail
    }
  };

  const showNameField = leadCaptureFields?.name !== false;
  const showPhoneField = leadCaptureFields?.phone === true;

  return (
    <div
      className={`flex flex-col h-screen ${isDark ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"}`}
    >
      {/* Header */}
      <header
        className="flex items-center gap-3 px-4 py-3 shadow-sm shrink-0"
        style={{ backgroundColor: primaryColor }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="h-9 w-9 rounded-full object-cover bg-white/20"
          />
        ) : (
          <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-sm">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-sm font-semibold text-white">{name}</h1>
          <p className="text-xs text-white/70">En ligne</p>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[85%] space-y-1">
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "text-white"
                      : isDark
                        ? "bg-gray-800 text-gray-100"
                        : "bg-white text-gray-900 shadow-sm"
                  }`}
                  style={msg.role === "user" ? { backgroundColor: primaryColor } : undefined}
                >
                  {msg.content ? (
                    <div
                      className="prose prose-sm max-w-none [&_a]:underline"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                    />
                  ) : (
                    <div className="flex items-center gap-1.5 py-1">
                      <span
                        className="h-2 w-2 rounded-full animate-bounce"
                        style={{ backgroundColor: primaryColor, animationDelay: "0ms" }}
                      />
                      <span
                        className="h-2 w-2 rounded-full animate-bounce"
                        style={{ backgroundColor: primaryColor, animationDelay: "150ms" }}
                      />
                      <span
                        className="h-2 w-2 rounded-full animate-bounce"
                        style={{ backgroundColor: primaryColor, animationDelay: "300ms" }}
                      />
                    </div>
                  )}
                </div>

                {/* Sources — Perplexity-style cards */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 px-1 -mx-1">
                    {msg.sources.map((source, i) => {
                      const domain = source.url ? new URL(source.url).hostname.replace("www.", "") : "";
                      return (
                        <a
                          key={i}
                          href={source.url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex-shrink-0 flex items-center gap-2.5 rounded-xl border px-3 py-2 text-xs transition-all hover:shadow-sm ${
                            msg.searching
                              ? "animate-pulse"
                              : ""
                          } ${
                            isDark
                              ? "bg-gray-800/60 border-gray-700/50 text-gray-300 hover:bg-gray-800 hover:border-gray-600"
                              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                          }`}
                          style={{ maxWidth: "200px" }}
                        >
                          {source.url && (
                            <img
                              src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
                              alt=""
                              className="h-4 w-4 rounded-sm flex-shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <div className="font-medium truncate">{source.title}</div>
                            {domain && (
                              <div className={`truncate ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                                {domain}
                              </div>
                            )}
                          </div>
                          <span className={`flex-shrink-0 text-[10px] font-medium rounded-full px-1.5 py-0.5 ${
                            isDark ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"
                          }`}>
                            {i + 1}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                )}

                {/* Feedback */}
                {msg.role === "assistant" && msg.id !== "welcome" && msg.content && (
                  <div className="flex items-center gap-1 px-1">
                    <button
                      onClick={() => handleFeedback(msg.id, 5)}
                      className={`p-1 rounded transition-colors ${
                        msg.feedbackScore === 5
                          ? "text-green-500"
                          : isDark
                            ? "text-gray-600 hover:text-gray-400"
                            : "text-gray-300 hover:text-gray-500"
                      }`}
                      title="Bonne r\u00e9ponse"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleFeedback(msg.id, 1)}
                      className={`p-1 rounded transition-colors ${
                        msg.feedbackScore === 1
                          ? "text-red-500"
                          : isDark
                            ? "text-gray-600 hover:text-gray-400"
                            : "text-gray-300 hover:text-gray-500"
                      }`}
                      title="Mauvaise r\u00e9ponse"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Suggested questions */}
          {messages.length === 1 && suggestedQuestions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  disabled={isStreaming}
                  className={`rounded-full px-3.5 py-1.5 text-sm border transition-colors disabled:opacity-50 ${
                    isDark
                      ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                      : "border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Lead capture form */}
          {showLeadForm && !leadSubmitted && (
            <div
              className={`rounded-2xl p-4 space-y-3 ${
                isDark ? "bg-gray-800" : "bg-white shadow-sm"
              }`}
            >
              <p className="text-sm font-medium">
                Pour mieux vous aider, laissez-nous vos coordonn\u00e9es :
              </p>
              <form onSubmit={handleLeadSubmit} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="Email *"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 ${
                    isDark
                      ? "bg-gray-900 border-gray-700 focus:ring-gray-600"
                      : "bg-white border-gray-200 focus:ring-gray-300"
                  }`}
                />
                {showNameField && (
                  <input
                    type="text"
                    placeholder="Nom"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 ${
                      isDark
                        ? "bg-gray-900 border-gray-700 focus:ring-gray-600"
                        : "bg-white border-gray-200 focus:ring-gray-300"
                    }`}
                  />
                )}
                {showPhoneField && (
                  <input
                    type="tel"
                    placeholder="T\u00e9l\u00e9phone"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 ${
                      isDark
                        ? "bg-gray-900 border-gray-700 focus:ring-gray-600"
                        : "bg-white border-gray-200 focus:ring-gray-300"
                    }`}
                  />
                )}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Envoyer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLeadForm(false);
                      setLeadSubmitted(true);
                    }}
                    className={`rounded-lg px-4 py-2 text-sm ${
                      isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Plus tard
                  </button>
                </div>
              </form>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className={`border-t px-4 py-3 shrink-0 ${isDark ? "border-gray-800 bg-gray-950" : "border-gray-200 bg-white"}`}>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question..."
            disabled={isStreaming}
            className={`flex-1 rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 transition-colors disabled:opacity-60 ${
              isDark
                ? "bg-gray-900 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:ring-gray-600"
                : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-gray-300"
            }`}
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: primaryColor }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
            </svg>
          </button>
        </form>

        {/* Powered by */}
        <div className="max-w-2xl mx-auto mt-2 text-center">
          <a
            href="https://helloclaudia.fr"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs transition-colors ${
              isDark ? "text-gray-600 hover:text-gray-400" : "text-gray-400 hover:text-gray-500"
            }`}
          >
            Powered by HelloClaudia
          </a>
        </div>
      </div>
    </div>
  );
}
