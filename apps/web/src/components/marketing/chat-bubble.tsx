"use client";

import { useState } from "react";
import { MessageSquare, X } from "lucide-react";

interface ChatBubbleProps {
  agentId: string;
}

export function ChatBubble({ agentId }: ChatBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat iframe */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] h-[560px] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white animate-in slide-in-from-bottom-4 fade-in duration-300">
          <iframe
            src={`/chat/${agentId}`}
            className="w-full h-full border-0"
            title="Chat"
          />
        </div>
      )}

      {/* Floating bubble button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-black text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </button>
    </>
  );
}
