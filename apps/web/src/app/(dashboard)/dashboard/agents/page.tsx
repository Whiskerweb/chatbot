"use client";

import { Header } from "@/components/dashboard/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Plus, Globe, FileText, MessageSquare, Trash2, Lock } from "lucide-react";
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
  const [createError, setCreateError] = useState("");

  const utils = trpc.useUtils();
  const agents = trpc.agents.list.useQuery();
  const plan = trpc.billing.getCurrentPlan.useQuery();
  const createAgent = trpc.agents.create.useMutation({
    onSuccess: () => {
      utils.agents.list.invalidate();
      setShowCreate(false);
      setName("");
      setDescription("");
      setCreateError("");
    },
    onError: (err) => {
      setCreateError(err.message);
    },
  });
  const deleteAgent = trpc.agents.delete.useMutation({
    onSuccess: () => {
      utils.agents.list.invalidate();
    },
  });

  const agentCount = agents.data?.length ?? 0;
  const maxAgents = plan.data?.maxAgents ?? 1;
  const planName = plan.data?.name ?? "Free";
  const atLimit = agentCount >= maxAgents;

  const handleCreate = () => {
    if (!name.trim()) return;
    setCreateError("");
    createAgent.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
    });
  };

  const handleDelete = (e: React.MouseEvent, agentId: string, agentName: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Supprimer "${agentName}" et toutes ses données (sources, conversations) ?`)) {
      deleteAgent.mutate({ id: agentId });
    }
  };

  return (
    <div>
      <Header
        title="Agents"
        description="Gérez vos chatbots IA"
        action={{ label: "Nouvel agent", onClick: () => setShowCreate(true) }}
      />

      <div className="p-4 md:p-8">
        {/* Plan usage indicator */}
        <div className="mb-6 flex items-center justify-between rounded-xl bg-card p-4 shadow-apple">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{agentCount}</span> / {maxAgents} agent{maxAgents > 1 ? "s" : ""}
              <span className="ml-2 text-xs text-muted-foreground/70">Plan {planName}</span>
            </div>
            <div className="h-2 w-32 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${atLimit ? "bg-red-500" : "bg-emerald-500"}`}
                style={{ width: `${Math.min(100, (agentCount / maxAgents) * 100)}%` }}
              />
            </div>
          </div>
          {atLimit && (
            <Link href="/tarifs" className="text-xs font-medium text-foreground hover:underline">
              Passer au plan supérieur →
            </Link>
          )}
        </div>

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
                    <div className="flex items-center gap-2">
                      <Badge variant={agent.isActive ? "success" : "secondary"}>
                        {agent.isActive ? "Actif" : "Inactif"}
                      </Badge>
                      <button
                        onClick={(e) => handleDelete(e, agent.id, agent.name)}
                        className="rounded-lg p-1.5 text-muted-foreground/50 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Supprimer l'agent"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                    </div>
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
                      <p className="mt-1 text-sm font-medium">HelloClaudia</p>
                      <p className="text-xs text-muted-foreground">IA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {/* Create new agent card — locked if at plan limit */}
          {atLimit ? (
            <Link href="/tarifs">
              <Card className="flex items-center justify-center border-2 border-dashed border-muted/60 rounded-2xl hover:border-foreground/10 cursor-pointer transition-colors min-h-[200px] opacity-70 hover:opacity-90">
                <div className="text-center">
                  <Lock className="mx-auto h-7 w-7 text-muted-foreground/50" strokeWidth={1.5} />
                  <p className="mt-2 text-sm font-medium text-muted-foreground">Limite atteinte</p>
                  <p className="mt-1 text-xs text-muted-foreground/70">Passez au plan supérieur →</p>
                </div>
              </Card>
            </Link>
          ) : (
            <Card
              className="flex items-center justify-center border-2 border-dashed border-muted rounded-2xl hover:border-foreground/20 cursor-pointer transition-colors min-h-[200px]"
              onClick={() => setShowCreate(true)}
            >
              <div className="text-center">
                <Plus className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium text-muted-foreground">Créer un agent</p>
              </div>
            </Card>
          )}
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
          {createError && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {createError}
              {atLimit && (
                <Link href="/tarifs" className="ml-2 font-medium underline">
                  Voir les plans →
                </Link>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreate(false); setCreateError(""); }}>Annuler</Button>
            <Button onClick={handleCreate} disabled={!name.trim() || createAgent.isPending}>
              {createAgent.isPending ? "Création..." : "Créer l'agent"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
