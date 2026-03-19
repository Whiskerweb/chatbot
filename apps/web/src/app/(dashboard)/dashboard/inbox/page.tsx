"use client";

import { Header } from "@/components/dashboard/header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Send, X, User } from "lucide-react";
import { useState } from "react";

const mockConversations = [
  { id: "1", visitor: "Visiteur #1042", lastMessage: "Comment réinitialiser mon mot de passe ?", time: "Il y a 2min", status: "ACTIVE", unread: true },
  { id: "2", visitor: "jean@example.com", lastMessage: "Merci pour votre aide !", time: "Il y a 15min", status: "ACTIVE", unread: false },
  { id: "3", visitor: "Visiteur #1039", lastMessage: "Je ne trouve pas la documentation API", time: "Il y a 1h", status: "ESCALATED", unread: true },
  { id: "4", visitor: "marie@startup.co", lastMessage: "Super, ça fonctionne maintenant", time: "Il y a 3h", status: "CLOSED", unread: false },
];

const mockMessages = [
  { role: "user", content: "Bonjour, comment réinitialiser mon mot de passe ?", time: "14:30" },
  { role: "assistant", content: "Bonjour ! Pour réinitialiser votre mot de passe, suivez ces étapes :\n\n1. Cliquez sur \"Mot de passe oublié\" sur la page de connexion\n2. Entrez votre adresse email\n3. Vérifiez votre boîte mail et cliquez sur le lien reçu\n\n[Source: Guide utilisateur - Authentification]", time: "14:30" },
  { role: "user", content: "Je n'ai pas reçu l'email", time: "14:32" },
  { role: "assistant", content: "Vérifiez votre dossier spam. Si vous ne trouvez toujours pas l'email, contactez le support à support@example.com.\n\n[Source: FAQ - Problèmes de connexion]", time: "14:32" },
];

export default function InboxPage() {
  const [selectedId, setSelectedId] = useState("1");
  const [replyText, setReplyText] = useState("");

  return (
    <div>
      <Header title="Inbox" description="Conversations en direct" />
      <div className="flex h-[calc(100vh-130px)]">
        {/* Left column - Conversation list */}
        <div className="w-80 border-r flex flex-col">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher..." className="pl-9" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {mockConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={`flex items-start gap-3 p-3 cursor-pointer border-b hover:bg-muted/50 transition-colors ${selectedId === conv.id ? "bg-muted" : ""}`}
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className={`text-sm ${conv.unread ? "font-semibold" : "font-medium"}`}>{conv.visitor}</p>
                    <span className="text-xs text-muted-foreground">{conv.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                </div>
                {conv.status === "ESCALATED" && <Badge variant="destructive" className="text-xs">Escalade</Badge>}
                {conv.unread && <div className="h-2 w-2 rounded-full bg-primary mt-2" />}
              </div>
            ))}
          </div>
        </div>

        {/* Center column - Messages */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <div>
              <p className="font-semibold">Visiteur #1042</p>
              <p className="text-xs text-muted-foreground">support-client &bull; Widget &bull; Actif</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Fermer</Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mockMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}>
                <div className={`rounded-lg px-4 py-2 max-w-[70%] ${
                  msg.role === "user" ? "bg-muted" :
                  msg.role === "assistant" ? "bg-primary/10 text-foreground" :
                  "bg-green-100"
                }`}>
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t p-3 flex gap-2">
            <Input
              placeholder="Répondre en tant qu'humain..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <Button><Send className="h-4 w-4" /></Button>
          </div>
        </div>

        {/* Right column - Visitor info */}
        <div className="w-80 border-l p-4 space-y-4 overflow-y-auto">
          <div>
            <h3 className="font-semibold mb-2">Informations visiteur</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>—</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Pays</span><span>France</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Appareil</span><span>Desktop / Chrome</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Page</span><span className="truncate max-w-[140px]">/pricing</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Durée</span><span>5 min</span></div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Historique</h3>
            <p className="text-sm text-muted-foreground">Première visite</p>
          </div>
        </div>
      </div>
    </div>
  );
}
