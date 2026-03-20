"use client";

import { Header } from "@/components/dashboard/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Plus, Globe, FileText, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { ClaudiaAvatar } from "@/components/dashboard/claudia-avatar";

export default function AgentsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const utils = trpc.useUtils();
  const agents = trpc.agents.list.useQuery();
  const createAgent = trpc.agents.create.useMutation({
    onSuccess: () => {
      utils.agents.list.invalidate();
      setShowCreate(false);
      setName("");
      setDescription("");
    },
  });

  const handleCreate = () => {
    if (!name.trim()) return;
    createAgent.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
    });
  };

  return (
    <div>
      <Header
        title="Agents"
        description="Gérez vos chatbots IA"
        action={{ label: "Nouvel agent", onClick: () => setShowCreate(true) }}
      />

      <div className="p-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {agents.data?.map((agent) => (
            <Link key={agent.id} href={`/dashboard/agents/${agent.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-7">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60">
                        <Bot className="h-[18px] w-[18px] text-foreground" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{agent.name}</h3>
                        <p className="text-xs text-muted-foreground">{agent.description || "Aucune description"}</p>
                      </div>
                    </div>
                    <Badge variant={agent.isActive ? "success" : "secondary"}>
                      {agent.isActive ? "Actif" : "Inactif"}
                    </Badge>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1 text-muted-foreground">
                        <FileText className="h-[18px] w-[18px]" strokeWidth={1.5} />
                      </div>
                      <p className="mt-1 text-lg font-light">{agent._count.sources}</p>
                      <p className="text-xs text-muted-foreground">Sources</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-muted-foreground">
                        <MessageSquare className="h-[18px] w-[18px]" strokeWidth={1.5} />
                      </div>
                      <p className="mt-1 text-lg font-light">{agent._count.conversations}</p>
                      <p className="text-xs text-muted-foreground">Conversations</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1">
                        <ClaudiaAvatar size="sm" />
                      </div>
                      <p className="mt-1 text-sm font-medium">Claudia</p>
                      <p className="text-xs text-muted-foreground">IA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {/* Create new agent card */}
          <Card
            className="flex items-center justify-center border-2 border-dashed border-muted rounded-2xl hover:border-foreground/20 cursor-pointer transition-colors min-h-[200px]"
            onClick={() => setShowCreate(true)}
          >
            <div className="text-center">
              <Plus className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium text-muted-foreground">Créer un agent</p>
            </div>
          </Card>
        </div>

        {agents.data?.length === 0 && (
          <div className="text-center py-16">
            <Bot className="mx-auto h-16 w-16 text-muted-foreground/20" strokeWidth={1.5} />
            <h3 className="mt-4 text-lg font-light">Aucun agent</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
              Créez votre premier agent pour commencer. Un agent est un chatbot IA entraîné sur vos documents.
            </p>
            <Button className="mt-4" onClick={() => setShowCreate(true)}>
              <Plus className="mr-2 h-[18px] w-[18px]" strokeWidth={1.5} /> Créer mon premier agent
            </Button>
          </div>
        )}
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
              <Input
                id="name"
                placeholder="Ex: Support Client"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnel)</Label>
              <Textarea
                id="description"
                placeholder="Décrivez le rôle de cet agent..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Annuler</Button>
            <Button onClick={handleCreate} disabled={!name.trim() || createAgent.isPending}>
              {createAgent.isPending ? "Création..." : "Créer l'agent"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
