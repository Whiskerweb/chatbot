interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Compresses conversation history to reduce input tokens.
 * - Last `maxRecentRaw` messages are kept verbatim (most relevant context).
 * - Older assistant messages are truncated to `maxOlderChars` characters.
 * - Older user messages are kept intact (they're usually short).
 */
export function compressHistory(
  messages: ChatMessage[],
  maxRecentRaw = 2,
  maxOlderChars = 350
): ChatMessage[] {
  if (messages.length <= maxRecentRaw) return messages;

  const recent = messages.slice(-maxRecentRaw);
  const older = messages.slice(0, -maxRecentRaw).map((m) => ({
    role: m.role,
    content:
      m.role === "assistant" && m.content.length > maxOlderChars
        ? m.content.slice(0, maxOlderChars) + "..."
        : m.content,
  }));

  return [...older, ...recent];
}
