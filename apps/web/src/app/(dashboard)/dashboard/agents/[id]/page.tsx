"use client";

import { Header } from "@/components/dashboard/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Globe, FileText, Upload, RefreshCw, Trash2, Copy, Send,
  ExternalLink, Settings2, TestTube, Rocket, Palette, Loader2, Plus,
} from "lucide-react";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useParams, useRouter } from "next/navigation";

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.id as string;

  const utils = trpc.useUtils();
  const agent = trpc.agents.getById.useQuery({ id: agentId });
  const sources = trpc.sources.list.useQuery({ agentId });

  const updateAgent = trpc.agents.update.useMutation({
    onSuccess: () => utils.agents.getById.invalidate({ id: agentId }),
  });
  const deleteAgent = trpc.agents.delete.useMutation({
    onSuccess: () => router.push("/dashboard/agents"),
  });
  const addWebsite = trpc.sources.addWebsite.useMutation({
    onSuccess: () => {
      utils.sources.list.invalidate({ agentId });
      setShowAddWebsite(false);
      setWebsiteUrl("");
    },
  });
  const addText = trpc.sources.addRawText.useMutation({
    onSuccess: () => {
      utils.sources.list.invalidate({ agentId });
      setShowAddText(false);
      setTextTitle("");
      setTextContent("");
    },
  });
  const deleteSource = trpc.sources.delete.useMutation({
    onSuccess: () => utils.sources.list.invalidate({ agentId }),
  });
  const reindexSource = trpc.sources.reindex.useMutation({
    onSuccess: () => utils.sources.list.invalidate({ agentId }),
  });

  // Local state for forms
  const [showAddWebsite, setShowAddWebsite] = useState(false);
  const [showAddText, setShowAddText] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [textTitle, setTextTitle] = useState("");
  const [textContent, setTextContent] = useState("");

  // Config form state
  const [model, setModel] = useState("");
  const [temperature, setTemperature] = useState(0.3);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [strictMode, setStrictMode] = useState(true);
  const [fallbackMessage, setFallbackMessage] = useState("");
  const [escalationEnabled, setEscalationEnabled] = useState(false);

  // Customize form state
  const [primaryColor, setPrimaryColor] = useState("#1A56DB");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [leadCaptureEnabled, setLeadCaptureEnabled] = useState(false);

  // Test chat state
  const [testMessages, setTestMessages] = useState<{ role: string; content: string }[]>([]);
  const [testInput, setTestInput] = useState("");

  // Populate form when agent loads
  useEffect(() => {
    if (agent.data) {
      setModel(agent.data.model);
      setTemperature(agent.data.temperature);
      setSystemPrompt(agent.data.systemPrompt);
      setStrictMode(agent.data.strictMode);
      setFallbackMessage(agent.data.fallbackMessage);
      setEscalationEnabled(agent.data.escalationEnabled);
      setPrimaryColor(agent.data.primaryColor);
      setWelcomeMessage(agent.data.welcomeMessage);
      setLeadCaptureEnabled(agent.data.leadCaptureEnabled);
      setTestMessages([{ role: "assistant", content: agent.data.welcomeMessage }]);
    }
  }, [agent.data]);

  const handleSaveConfig = () => {
    updateAgent.mutate({
      id: agentId,
      model: model as any,
      temperature,
      systemPrompt,
      strictMode,
      fallbackMessage,
      escalationEnabled,
    });
  };

  const handleSaveCustomize = () => {
    updateAgent.mutate({
      id: agentId,
      primaryColor,
      welcomeMessage,
      leadCaptureEnabled,
    });
  };

  const handleSendTest = async () => {
    if (!testInput.trim()) return;
    const userMsg = testInput.trim();
    setTestInput("");
    setTestMessages((prev) => [...prev, { role: "user", content: userMsg }]);

    try {
      const response = await fetch("/api/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-agent-id": agentId,
        },
        body: JSON.stringify({
          message: userMsg,
          visitorId: "test-sandbox",
          metadata: { pageUrl: "sandbox" },
        }),
      });

      const reader = response.body?.getReader();
      if (!reader) return;

      let fullResponse = "";
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.token) {
                fullResponse += data.token;
                setTestMessages((prev) => {
                  const msgs = [...prev];
                  const lastMsg = msgs[msgs.length - 1];
                  if (lastMsg?.role === "assistant" && !lastMsg.content.startsWith(agent.data?.welcomeMessage ?? "---")) {
                    lastMsg.content = fullResponse;
                  } else {
                    msgs.push({ role: "assistant", content: fullResponse });
                  }
                  return msgs;
                });
              }
            } catch {}
          }
        }
      }
    } catch {
      setTestMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Erreur lors de la communication avec l'agent." },
      ]);
    }
  };

  if (agent.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!agent.data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Agent introuvable</p>
      </div>
    );
  }

  const statusMap: Record<string, { label: string; variant: "success" | "warning" | "destructive" }> = {
    INDEXED: { label: "Indexé", variant: "success" },
    PENDING: { label: "En attente", variant: "warning" },
    INDEXING: { label: "Indexation...", variant: "warning" },
    FAILED: { label: "Erreur", variant: "destructive" },
    SYNCING: { label: "Sync...", variant: "warning" },
  };

  return (
    <div>
      <Header title={agent.data.name} description={agent.data.description ?? undefined} />

      <div className="p-6">
        <Tabs defaultValue="sources" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="sources" className="gap-2"><FileText className="h-4 w-4" /> Sources</TabsTrigger>
            <TabsTrigger value="config" className="gap-2"><Settings2 className="h-4 w-4" /> Configuration</TabsTrigger>
            <TabsTrigger value="customize" className="gap-2"><Palette className="h-4 w-4" /> Personnalisation</TabsTrigger>
            <TabsTrigger value="test" className="gap-2"><TestTube className="h-4 w-4" /> Test</TabsTrigger>
            <TabsTrigger value="deploy" className="gap-2"><Rocket className="h-4 w-4" /> Déploiement</TabsTrigger>
          </TabsList>

          {/* Sources Tab */}
          <TabsContent value="sources" className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={() => setShowAddWebsite(true)}><Globe className="mr-2 h-4 w-4" /> Website</Button>
              <Button variant="outline" onClick={() => setShowAddText(true)}><FileText className="mr-2 h-4 w-4" /> Texte</Button>
              <Button variant="outline" disabled><Upload className="mr-2 h-4 w-4" /> Fichier (bientôt)</Button>
            </div>

            {sources.data && sources.data.length > 0 ? (
              <div className="space-y-2">
                {sources.data.map((source) => {
                  const status = statusMap[source.status] ?? { label: source.status, variant: "secondary" as const };
                  return (
                    <Card key={source.id}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          {source.type === "WEBSITE" || source.type === "SITEMAP" ? (
                            <Globe className="h-5 w-5 text-blue-500" />
                          ) : (
                            <FileText className="h-5 w-5 text-orange-500" />
                          )}
                          <div>
                            <p className="font-medium text-sm">{source.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {source.pagesCount} pages &bull; {source.chunksCount} chunks
                              {source.lastIndexedAt && ` • Indexé ${new Date(source.lastIndexedAt).toLocaleDateString("fr-FR")}`}
                            </p>
                            {source.indexError && (
                              <p className="text-xs text-destructive mt-1">{source.indexError}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={status.variant}>{status.label}</Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => reindexSource.mutate({ id: source.id })}
                            disabled={reindexSource.isPending}
                          >
                            <RefreshCw className={`h-4 w-4 ${reindexSource.isPending ? "animate-spin" : ""}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm("Supprimer cette source ?")) {
                                deleteSource.mutate({ id: source.id });
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 border rounded-lg bg-muted/30">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <h3 className="mt-4 text-lg font-semibold">Aucune source</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                  Ajoutez des sources de documentation pour entraîner votre agent.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="config" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Modèle IA</CardTitle>
                <CardDescription>Choisissez le modèle de langage pour cet agent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GPT4O_MINI">GPT-4o Mini — 1 crédit/msg</SelectItem>
                    <SelectItem value="CLAUDE_HAIKU">Claude Haiku — 1 crédit/msg</SelectItem>
                    <SelectItem value="GEMINI_FLASH">Gemini Flash — 1 crédit/msg</SelectItem>
                    <SelectItem value="GPT4O">GPT-4o — 3 crédits/msg</SelectItem>
                    <SelectItem value="CLAUDE_SONNET">Claude Sonnet — 3 crédits/msg</SelectItem>
                    <SelectItem value="GEMINI_PRO">Gemini Pro — 3 crédits/msg</SelectItem>
                    <SelectItem value="CLAUDE_OPUS">Claude Opus — 5 crédits/msg</SelectItem>
                  </SelectContent>
                </Select>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Température</Label>
                    <span className="text-sm text-muted-foreground">{temperature}</span>
                  </div>
                  <Slider value={[temperature]} onValueChange={([v]) => setTemperature(v)} min={0} max={1} step={0.1} />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Précis</span>
                    <span>Créatif</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Prompt</CardTitle>
                <CardDescription>Instructions personnalisées pour l&apos;IA</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={6}
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="Instructions additionnelles pour l'agent..."
                  className="font-mono text-sm"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Comportement</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mode strict</Label>
                    <p className="text-xs text-muted-foreground">Répond uniquement à partir de la documentation</p>
                  </div>
                  <Switch checked={strictMode} onCheckedChange={setStrictMode} />
                </div>
                <div className="space-y-2">
                  <Label>Message fallback</Label>
                  <Input value={fallbackMessage} onChange={(e) => setFallbackMessage(e.target.value)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Escalade</Label>
                    <p className="text-xs text-muted-foreground">Transfert à un humain après messages sans réponse</p>
                  </div>
                  <Switch checked={escalationEnabled} onCheckedChange={setEscalationEnabled} />
                </div>
              </CardContent>
            </Card>

            <Button className="w-full" onClick={handleSaveConfig} disabled={updateAgent.isPending}>
              {updateAgent.isPending ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </TabsContent>

          {/* Customize Tab */}
          <TabsContent value="customize">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                <Card>
                  <CardHeader><CardTitle>Apparence</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Couleur principale</Label>
                      <div className="flex gap-2">
                        <Input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-12 h-10 p-1" />
                        <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="font-mono" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Message d&apos;accueil</Label>
                      <Input value={welcomeMessage} onChange={(e) => setWelcomeMessage(e.target.value)} />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Capture de leads</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Label>Activer la capture de leads</Label>
                      <Switch checked={leadCaptureEnabled} onCheckedChange={setLeadCaptureEnabled} />
                    </div>
                  </CardContent>
                </Card>
                <Button className="w-full" onClick={handleSaveCustomize} disabled={updateAgent.isPending}>
                  {updateAgent.isPending ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
              </div>
              {/* Preview */}
              <div className="sticky top-6">
                <Card>
                  <CardHeader><CardTitle>Aperçu du widget</CardTitle></CardHeader>
                  <CardContent>
                    <div className="rounded-lg border bg-white shadow-lg overflow-hidden max-w-sm mx-auto">
                      <div className="p-4 text-white" style={{ backgroundColor: primaryColor }}>
                        <p className="font-semibold">{agent.data.name}</p>
                      </div>
                      <div className="p-4 space-y-3 min-h-[300px] bg-gray-50">
                        <div className="bg-white rounded-lg p-3 shadow-sm max-w-[80%]">
                          <p className="text-sm">{welcomeMessage || "Bonjour !"}</p>
                        </div>
                      </div>
                      <div className="p-3 border-t">
                        <Input placeholder="Votre message..." disabled className="text-sm" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Test Tab */}
          <TabsContent value="test">
            <Card>
              <CardHeader>
                <CardTitle>Sandbox de test</CardTitle>
                <CardDescription>Testez votre agent. Les réponses utilisent l&apos;API réelle.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-muted/30 min-h-[400px] flex flex-col">
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[400px]">
                    {testMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`rounded-lg px-4 py-2 max-w-[70%] ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-white shadow-sm"}`}>
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t p-3 flex gap-2">
                    <Input
                      placeholder="Testez une question..."
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSendTest();
                      }}
                    />
                    <Button size="icon" onClick={handleSendTest}><Send className="h-4 w-4" /></Button>
                  </div>
                </div>
                <Button variant="outline" className="mt-3" onClick={() => setTestMessages([{ role: "assistant", content: agent.data?.welcomeMessage ?? "" }])}>
                  Réinitialiser la conversation
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Deploy Tab */}
          <TabsContent value="deploy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Widget JavaScript</CardTitle>
                <CardDescription>Copiez ce code et collez-le dans votre site</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="rounded-lg bg-muted p-4 text-sm font-mono overflow-x-auto">
                    {`<script src="${process.env.NEXT_PUBLIC_WIDGET_URL ?? "https://cdn.chatbot.com"}/widget.js" data-agent-id="${agentId}" async></script>`}
                  </pre>
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => navigator.clipboard.writeText(`<script src="${process.env.NEXT_PUBLIC_WIDGET_URL ?? "https://cdn.chatbot.com"}/widget.js" data-agent-id="${agentId}" async></script>`)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Lien direct</CardTitle>
                <CardDescription>Partagez ce lien pour accéder au chatbot en pleine page</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input readOnly value={`${process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin}/chat/${agentId}`} className="font-mono text-sm" />
                  <Button variant="outline" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/chat/${agentId}`)}><Copy className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Website Dialog */}
      <Dialog open={showAddWebsite} onOpenChange={setShowAddWebsite}>
        <DialogContent>
          <DialogHeader><DialogTitle>Ajouter un site web</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>URL du site</Label>
              <Input placeholder="https://docs.example.com" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddWebsite(false)}>Annuler</Button>
            <Button onClick={() => addWebsite.mutate({ agentId, url: websiteUrl })} disabled={!websiteUrl.trim() || addWebsite.isPending}>
              {addWebsite.isPending ? "Ajout..." : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Text Dialog */}
      <Dialog open={showAddText} onOpenChange={setShowAddText}>
        <DialogContent>
          <DialogHeader><DialogTitle>Ajouter du texte</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Titre</Label>
              <Input placeholder="Ex: FAQ produit" value={textTitle} onChange={(e) => setTextTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Contenu</Label>
              <Textarea rows={8} placeholder="Collez votre texte ici..." value={textContent} onChange={(e) => setTextContent(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddText(false)}>Annuler</Button>
            <Button onClick={() => addText.mutate({ agentId, title: textTitle, content: textContent })} disabled={!textTitle.trim() || !textContent.trim() || addText.isPending}>
              {addText.isPending ? "Ajout..." : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
