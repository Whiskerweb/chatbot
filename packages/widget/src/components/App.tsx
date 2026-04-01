import { h } from "preact";
import { useState, useCallback } from "preact/hooks";
import type { AgentConfig, Message } from "../types";
import { sendMessage } from "../lib/api";
import {
  getVisitorId,
  getConversationId,
  setConversationId,
  clearConversation,
  isLeadSubmitted,
} from "../lib/storage";
import { Bubble } from "./Bubble";
import { ChatWindow } from "./ChatWindow";

interface AppProps {
  config: AgentConfig;
  apiBase: string;
  agentId: string;
}

let messageCounter = 0;
function nextId(): string {
  return `msg_${Date.now()}_${++messageCounter}`;
}

export function App({ config, apiBase, agentId }: AppProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const welcome: Message = {
      id: "welcome",
      role: "assistant",
      content: config.welcomeMessage || `Bonjour ! Je suis ${config.name}. Comment puis-je vous aider ?`,
    };
    return [welcome];
  });
  const [conversationId, setConvId] = useState<string | null>(() =>
    getConversationId(agentId)
  );
  const [visitorId] = useState(() => getVisitorId(agentId));
  const [isStreaming, setIsStreaming] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(() => {
    return config.leadCaptureEnabled && !isLeadSubmitted(agentId);
  });

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleReset = useCallback(() => {
    clearConversation(agentId);
    setConvId(null);
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: config.welcomeMessage || `Bonjour ! Je suis ${config.name}. Comment puis-je vous aider ?`,
      },
    ]);
    setIsStreaming(false);
  }, [agentId, config]);

  const handleSend = useCallback(
    (text: string) => {
      if (isStreaming) return;

      const userMsg: Message = { id: nextId(), role: "user", content: text };
      setMessages((prev) => [...prev, userMsg]);
      setIsStreaming(true);

      // Create placeholder for assistant response
      const assistantId = nextId();
      let assistantContent = "";

      sendMessage(apiBase, agentId, {
        message: text,
        conversationId: conversationId || undefined,
        visitorId,
        metadata: { pageUrl: window.location.href },
      })
        .onToken((token) => {
          assistantContent += token;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last && last.id === assistantId) {
              return [
                ...prev.slice(0, -1),
                { ...last, content: assistantContent },
              ];
            }
            return [
              ...prev,
              { id: assistantId, role: "assistant", content: assistantContent },
            ];
          });
        })
        .onSources((sources) => {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last && last.id === assistantId) {
              return [...prev.slice(0, -1), { ...last, sources }];
            }
            return prev;
          });
        })
        .onProducts((products) => {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last && last.id === assistantId) {
              return [...prev.slice(0, -1), { ...last, products }];
            }
            return prev;
          });
        })
        .onDone((data) => {
          setIsStreaming(false);
          if (data.conversationId) {
            setConvId(data.conversationId);
            setConversationId(agentId, data.conversationId);
          }
          // Update the assistant message with the real messageId for feedback
          if (data.messageId) {
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.id === assistantId) {
                return [...prev.slice(0, -1), { ...last, id: data.messageId }];
              }
              return prev;
            });
          }
        })
        .onError((err) => {
          setIsStreaming(false);
          setMessages((prev) => [
            ...prev,
            {
              id: nextId(),
              role: "assistant",
              content: "Désolé, une erreur est survenue. Veuillez réessayer.",
            },
          ]);
          console.error("[HelloClaudia Widget]", err);
        });
    },
    [apiBase, agentId, conversationId, visitorId, isStreaming]
  );

  const handleLeadSubmitted = useCallback(() => {
    setShowLeadForm(false);
  }, []);

  const handleToggleExpand = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const handleDismissLead = useCallback(() => {
    setShowLeadForm(false);
  }, []);

  return (
    <div>
      {isOpen && (
        <ChatWindow
          config={config}
          messages={messages}
          isStreaming={isStreaming}
          showLeadForm={showLeadForm}
          conversationId={conversationId}
          apiBase={apiBase}
          agentId={agentId}
          expanded={expanded}
          onSend={handleSend}
          onClose={handleClose}
          onReset={handleReset}
          onLeadSubmitted={handleLeadSubmitted}
          onToggleExpand={handleToggleExpand}
          onDismissLead={handleDismissLead}
        />
      )}
      <Bubble
        isOpen={isOpen}
        onClick={handleToggle}
        primaryColor={config.primaryColor}
        avatarUrl={config.avatarUrl}
        apiBase={apiBase}
        widgetConfig={config.widgetConfig}
      />
    </div>
  );
}
