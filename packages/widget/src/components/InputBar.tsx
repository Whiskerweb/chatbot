import { h } from "preact";
import { useState, useRef } from "preact/hooks";

interface InputBarProps {
  onSend: (text: string) => void;
  isStreaming: boolean;
  primaryColor: string;
  isDark: boolean;
}

export function InputBar({ onSend, isStreaming, primaryColor, isDark }: InputBarProps) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setText("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    setText(target.value);
    target.style.height = "auto";
    target.style.height = Math.min(target.scrollHeight, 100) + "px";
  };

  const bgColor = isDark ? "#2a2a2a" : "#f5f5f5";
  const textColor = isDark ? "#fff" : "#1a1a1a";
  const placeholderStyle = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "8px",
        padding: "12px 16px",
        borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
        backgroundColor: isDark ? "#1a1a1a" : "#fff",
      }}
    >
      <textarea
        ref={inputRef}
        value={text}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        placeholder="Votre message..."
        disabled={isStreaming}
        rows={1}
        style={{
          flex: 1,
          resize: "none",
          border: "none",
          outline: "none",
          padding: "10px 14px",
          borderRadius: "12px",
          backgroundColor: bgColor,
          color: textColor,
          fontSize: "14px",
          lineHeight: "1.4",
          fontFamily: "inherit",
          maxHeight: "100px",
          overflow: "auto",
          opacity: isStreaming ? 0.6 : 1,
          // Placeholder color via CSS-in-JS is not possible, use a workaround
        }}
      />
      <button
        onClick={handleSend}
        disabled={isStreaming || !text.trim()}
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          border: "none",
          backgroundColor: text.trim() && !isStreaming ? primaryColor : isDark ? "#333" : "#ddd",
          color: text.trim() && !isStreaming ? "#fff" : isDark ? "#666" : "#999",
          cursor: text.trim() && !isStreaming ? "pointer" : "default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "background-color 0.15s ease",
          padding: 0,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          width="18"
          height="18"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
  );
}
