import { h } from "preact";
import { useState } from "preact/hooks";
import { submitLead } from "../lib/api";
import { setLeadSubmitted } from "../lib/storage";
import type { AgentConfig } from "../types";

interface LeadCaptureFormProps {
  config: AgentConfig;
  apiBase: string;
  agentId: string;
  conversationId: string | null;
  onSubmitted: () => void;
  primaryColor: string;
  isDark: boolean;
}

export function LeadCaptureForm({
  config,
  apiBase,
  agentId,
  conversationId,
  onSubmitted,
  primaryColor,
  isDark,
}: LeadCaptureFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const showName = config.leadCaptureFields?.some((f) => f.field === "name");
  const nameRequired = config.leadCaptureFields?.some(
    (f) => f.field === "name" && f.required
  );

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!email.trim()) return;
    if (showName && nameRequired && !name.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      await submitLead(apiBase, {
        agentId,
        conversationId: conversationId || undefined,
        email: email.trim(),
        name: name.trim() || undefined,
      });
      setLeadSubmitted(agentId);
      onSubmitted();
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"}`,
    background: isDark ? "#2a2a2a" : "#fff",
    color: isDark ? "#fff" : "#1a1a1a",
    fontSize: "14px",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  return (
    <div
      style={{
        padding: "12px 16px",
        borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
      }}
    >
      <div
        style={{
          backgroundColor: isDark ? "#252525" : "#f8f9fa",
          borderRadius: "12px",
          padding: "16px",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            fontWeight: "600",
            color: isDark ? "#fff" : "#1a1a1a",
            marginBottom: "4px",
          }}
        >
          Laissez-nous vos coordonnées
        </div>
        <div
          style={{
            fontSize: "12px",
            color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
            marginBottom: "12px",
          }}
        >
          Pour que nous puissions vous recontacter.
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {showName && (
            <input
              type="text"
              placeholder={nameRequired ? "Nom *" : "Nom"}
              value={name}
              onInput={(e) => setName((e.target as HTMLInputElement).value)}
              style={inputStyle}
              required={!!nameRequired}
            />
          )}
          <input
            type="email"
            placeholder="Email *"
            value={email}
            onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
            style={inputStyle}
            required
          />
          {error && (
            <div style={{ fontSize: "12px", color: "#ef4444" }}>{error}</div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: primaryColor,
              color: "#fff",
              fontSize: "14px",
              fontWeight: "600",
              cursor: isSubmitting ? "wait" : "pointer",
              opacity: isSubmitting ? 0.7 : 1,
              fontFamily: "inherit",
              transition: "opacity 0.15s ease",
            }}
          >
            {isSubmitting ? "Envoi..." : "Envoyer"}
          </button>
        </form>
      </div>
    </div>
  );
}
