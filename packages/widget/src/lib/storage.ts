const PREFIX = "hc";

export function getVisitorId(agentId: string): string {
  const key = `${PREFIX}_visitor_${agentId}`;
  try {
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const id = crypto.randomUUID();
    localStorage.setItem(key, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export function getConversationId(agentId: string): string | null {
  try {
    return localStorage.getItem(`${PREFIX}_conv_${agentId}`);
  } catch {
    return null;
  }
}

export function setConversationId(agentId: string, id: string): void {
  try {
    localStorage.setItem(`${PREFIX}_conv_${agentId}`, id);
  } catch {
    // ignore
  }
}

export function clearConversation(agentId: string): void {
  try {
    localStorage.removeItem(`${PREFIX}_conv_${agentId}`);
  } catch {
    // ignore
  }
}

export function isLeadSubmitted(agentId: string): boolean {
  try {
    return localStorage.getItem(`${PREFIX}_lead_${agentId}`) === "1";
  } catch {
    return false;
  }
}

export function setLeadSubmitted(agentId: string): void {
  try {
    localStorage.setItem(`${PREFIX}_lead_${agentId}`, "1");
  } catch {
    // ignore
  }
}
