import type { AgentConfig } from "../types";

export async function fetchConfig(
  apiBase: string,
  agentId: string
): Promise<AgentConfig> {
  const res = await fetch(`${apiBase}/api/v1/agent/${agentId}/config`);
  if (!res.ok) throw new Error(`Failed to fetch config: ${res.status}`);
  return res.json();
}

interface SendMessageParams {
  message: string;
  conversationId?: string;
  visitorId: string;
  metadata?: Record<string, unknown>;
}

interface StreamCallbacks {
  onToken: (cb: (token: string) => void) => StreamCallbacks;
  onSearching: (cb: (sources: Array<{ title: string; url?: string }>) => void) => StreamCallbacks;
  onSources: (cb: (sources: Array<{ title: string; url?: string }>) => void) => StreamCallbacks;
  onDone: (cb: (data: { conversationId: string; messageId: string }) => void) => StreamCallbacks;
  onError: (cb: (err: Error) => void) => StreamCallbacks;
}

export function sendMessage(
  apiBase: string,
  agentId: string,
  params: SendMessageParams
): StreamCallbacks {
  let tokenCb: ((token: string) => void) | null = null;
  let searchingCb: ((sources: Array<{ title: string; url?: string }>) => void) | null = null;
  let sourcesCb: ((sources: Array<{ title: string; url?: string }>) => void) | null = null;
  let doneCb: ((data: { conversationId: string; messageId: string }) => void) | null = null;
  let errorCb: ((err: Error) => void) | null = null;

  // Start streaming in next microtask so callbacks can be attached
  Promise.resolve().then(async () => {
    try {
      const res = await fetch(`${apiBase}/api/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-agent-id": agentId,
        },
        body: JSON.stringify({
          message: params.message,
          conversationId: params.conversationId,
          visitorId: params.visitorId,
          metadata: params.metadata,
        }),
      });

      if (!res.ok) {
        throw new Error(`Chat request failed: ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        // Keep the last potentially incomplete line
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;
          const jsonStr = trimmed.slice(6);
          if (!jsonStr || jsonStr === "[DONE]") continue;

          try {
            const data = JSON.parse(jsonStr);
            if (data.searching && searchingCb) {
              searchingCb(data.searching);
            }
            if (data.token !== undefined && tokenCb) {
              tokenCb(data.token);
            }
            if (data.sources && sourcesCb) {
              sourcesCb(data.sources);
            }
            if (data.done && doneCb) {
              doneCb({
                conversationId: data.conversationId,
                messageId: data.messageId,
              });
            }
            if (data.error && errorCb) {
              errorCb(new Error(data.error));
            }
          } catch {
            // Skip malformed JSON lines
          }
        }
      }
    } catch (err) {
      if (errorCb) errorCb(err instanceof Error ? err : new Error(String(err)));
    }
  });

  const callbacks: StreamCallbacks = {
    onToken(cb) {
      tokenCb = cb;
      return callbacks;
    },
    onSearching(cb) {
      searchingCb = cb;
      return callbacks;
    },
    onSources(cb) {
      sourcesCb = cb;
      return callbacks;
    },
    onDone(cb) {
      doneCb = cb;
      return callbacks;
    },
    onError(cb) {
      errorCb = cb;
      return callbacks;
    },
  };

  return callbacks;
}

export async function submitLead(
  apiBase: string,
  params: { agentId: string; conversationId?: string; email: string; name?: string }
): Promise<void> {
  const res = await fetch(`${apiBase}/api/v1/lead`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`Failed to submit lead: ${res.status}`);
}

export async function submitFeedback(
  apiBase: string,
  params: { messageId: string; score: number }
): Promise<void> {
  const res = await fetch(`${apiBase}/api/v1/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`Failed to submit feedback: ${res.status}`);
}
