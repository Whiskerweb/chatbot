"use client";

import { Header } from "@/components/dashboard/header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Send, User, Loader2, MessageSquare } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function InboxPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const conversations = trpc.conversations.list.useQuery({ limit: 50 });
  const selectedConversation = trpc.conversations.getById.useQuery(
    { id: selectedId! },
    { enabled: !!selectedId }
  );

  const utils = trpc.useUtils();
  const reply = trpc.conversations.reply.useMutation({
    onSuccess: () => {
      utils.conversations.getById.invalidate({ id: selectedId! });
      utils.conversations.list.invalidate();
      setReplyText("");
    },
  });
  const closeConv = trpc.conversations.close.useMutation({
    onSuccess: () => {
      utils.conversations.list.invalidate();
      utils.conversations.getById.invalidate({ id: selectedId! });
    },
  });

  const handleReply = () => {
    if (!replyText.trim() || !selectedId) return;
    reply.mutate({ conversationId: selectedId, content: replyText.trim() });
  };

  return (
    <div>
      <Header title="Inbox" description="Conversations en direct" />
      <div className="flex h-[calc(100vh-130px)]">
        {/* Left column - Conversation list */}
        <div className="w-80 flex flex-col">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground" strokeWidth={1.5} />
              <Input placeholder="Rechercher..." className="pl-9" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.isLoading && (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" strokeWidth={1.5} />
              </div>
            )}
            {conversations.data?.items.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={`flex items-start gap-3 p-3 mx-2 mb-0.5 cursor-pointer rounded-xl hover:bg-muted/60 transition-all duration-200 ${selectedId === conv.id ? "bg-muted/80 rounded-xl" : ""}`}
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback><User className="h-[18px] w-[18px]" strokeWidth={1.5} /></AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium truncate">
                      {conv.visitorEmail || conv.visitorName || `Visiteur`}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(conv.updatedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {conv.messages[0]?.content ?? "..."}
                  </p>
                  <div className="flex gap-1 mt-1">
                    <Badge variant="secondary" className="text-[10px] px-1 py-0">{conv.agent.name}</Badge>
                    {conv.status === "ESCALATED" && <Badge variant="destructive" className="text-[10px] px-1 py-0">Escalade</Badge>}
                  </div>
                </div>
              </div>
            ))}
            {conversations.data?.items.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground/30" strokeWidth={1.5} />
                <p className="mt-3 text-sm text-muted-foreground">Aucune conversation</p>
              </div>
            )}
          </div>
        </div>

        {/* Center column - Messages */}
        <div className="flex-1 flex flex-col">
          {selectedId && selectedConversation.data ? (
            <>
              <div className="p-4 border-b flex items-center justify-between">
                <div>
                  <p className="font-semibold">
                    {selectedConversation.data.visitorEmail || selectedConversation.data.visitorName || "Visiteur"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedConversation.data.agent.name} &bull; {selectedConversation.data.channel} &bull; {selectedConversation.data.status}
                  </p>
                </div>
                <div className="flex gap-2">
                  {selectedConversation.data.status !== "CLOSED" && (
                    <Button variant="outline" size="sm" onClick={() => closeConv.mutate({ id: selectedId })}>
                      Fermer
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.data.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === "USER" ? "justify-start" : "justify-end"}`}>
                    <div className={`rounded-2xl px-4 py-2 max-w-[70%] ${
                      msg.role === "USER" ? "bg-muted" :
                      msg.role === "HUMAN" ? "bg-green-100" :
                      "bg-primary/10"
                    }`}>
                      {msg.role === "HUMAN" && <p className="text-xs font-medium text-green-700 mb-1">{msg.memberName}</p>}
                      <p className="text-sm whitespace-pre-line">{msg.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t p-3 flex gap-2">
                <Input
                  placeholder="Répondre en tant qu'humain..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleReply(); }}
                />
                <Button onClick={handleReply} disabled={reply.isPending}>
                  <Send className="h-[18px] w-[18px]" strokeWidth={1.5} />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/30" strokeWidth={1.5} />
                <p className="mt-3">Sélectionnez une conversation</p>
              </div>
            </div>
          )}
        </div>

        {/* Right column - Visitor info */}
        {selectedId && selectedConversation.data && (
          <div className="w-72 border-l border-border/50 p-4 space-y-4 overflow-y-auto">
            <div>
              <h3 className="font-semibold mb-2">Informations visiteur</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span>{selectedConversation.data.visitorEmail ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nom</span>
                  <span>{selectedConversation.data.visitorName ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Canal</span>
                  <span>{selectedConversation.data.channel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Messages</span>
                  <span>{selectedConversation.data.messageCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Crédits</span>
                  <span>{selectedConversation.data.creditsUsed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Créé</span>
                  <span>{new Date(selectedConversation.data.createdAt).toLocaleDateString("fr-FR")}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
