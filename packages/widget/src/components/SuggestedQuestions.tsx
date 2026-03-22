import { h } from "preact";

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (q: string) => void;
  primaryColor: string;
  isDark: boolean;
}

export function SuggestedQuestions({
  questions,
  onSelect,
  primaryColor,
  isDark,
}: SuggestedQuestionsProps) {
  if (!questions.length) return null;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        padding: "8px 16px 12px",
      }}
    >
      {questions.map((q, i) => (
        <button
          key={i}
          onClick={() => onSelect(q)}
          style={{
            padding: "6px 14px",
            borderRadius: "16px",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"}`,
            background: "transparent",
            color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)",
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.15s ease",
            lineHeight: "1.4",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.backgroundColor = primaryColor;
            el.style.color = "#fff";
            el.style.borderColor = primaryColor;
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.backgroundColor = "transparent";
            el.style.color = isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)";
            el.style.borderColor = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)";
          }}
        >
          {q}
        </button>
      ))}
    </div>
  );
}
