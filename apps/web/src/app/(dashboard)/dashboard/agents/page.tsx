"use client";

import { Header } from "@/components/dashboard/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, MoreVertical, Plus, Globe, FileText, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const mockAgents = [
  { id: "1", name: "Support Client", slug: "support-client", model: "GPT4O_MINI", isActive: true, sources: 12, conversations: 156, description: "Agent de support principal" },
  { id: "2", name: "FAQ Produit", slug: "faq-produit", model: "CLAUDE_HAIKU", isActive: true, sources: 8, conversations: 89, description: "Répond aux questions produit" },
];

export default function AgentsPage() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div>
      <Header
        title="Agents"
        description="Gérez vos chatbots IA"
        action={{ label: "Nouvel agent", onClick: () => setShowCreate(true) }}
      />

      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockAgents.map((agent) => (
            <Link key={agent.id} href={`/dashboard/agents/${agent.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <Bot className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{agent.name}</h3>
                        <p className="text-xs text-muted-foreground">{agent.description}</p>
                      </div>
                    </div>
                    <Badge variant={agent.isActive ? "success" : "secondary"}>
                      {agent.isActive ? "Actif" : "Inactif"}
                    </Badge>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1 text-muted-foreground">
                        <FileText className="h-3.5 w-3.5" />
                      </div>
                      <p className="mt-1 text-lg font-semibold">{agent.sources}</p>
                      <p className="text-xs text-muted-foreground">Sources</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-muted-foreground">
                        <MessageSquare className="h-3.5 w-3.5" />
                      </div>
                      <p className="mt-1 text-lg font-semibold">{agent.conversations}</p>
                      <p className="text-xs text-muted-foreground">Conversations</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-muted-foreground">
                        <Globe className="h-3.5 w-3.5" />
                      </div>
                      <p className="mt-1 text-lg font-semibold">{agent.model.split("_")[0]}</p>
                      <p className="text-xs text-muted-foreground">Modèle</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {/* Create new agent card */}
          <Card
            className="flex items-center justify-center border-dashed cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors min-h-[200px]"
            onClick={() => setShowCreate(true)}
          >
            <div className="text-center">
              <Plus className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium text-muted-foreground">Créer un agent</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Create Agent Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un nouvel agent</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l&apos;agent</Label>
              <Input id="name" placeholder="Ex: Support Client" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnel)</Label>
              <Textarea id="description" placeholder="Décrivez le rôle de cet agent..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Annuler</Button>
            <Button onClick={() => setShowCreate(false)}>Créer l&apos;agent</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
