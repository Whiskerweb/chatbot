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
  ChevronDown, Check, X, AlertCircle, Eye,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useParams, useRouter } from "next/navigation";
import type { WidgetConfig } from "@chatbot/shared";
import { DEFAULT_WIDGET_CONFIG } from "@chatbot/shared";
import { WidgetPreview } from "@/components/dashboard/widget-preview";
import { WidgetCustomizer } from "@/components/dashboard/widget-customizer";
import { ClaudiaAvatar } from "@/components/dashboard/claudia-avatar";

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.id as string;

  const utils = trpc.useUtils();
  const agent = trpc.agents.getById.useQuery({ id: agentId });
  const [expandedSource, setExpandedSource] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Poll sources every 3s when any source is indexing
  const sources = trpc.sources.list.useQuery({ agentId });
  const hasIndexing = useMemo(
    () => sources.data?.some((s) => s.status === "PENDING" || s.status === "INDEXING") ?? false,
    [sources.data]
  );

  // Auto-refetch when indexing
  useEffect(() => {
    if (!hasIndexing) return;
    const interval = setInterval(() => sources.refetch(), 3000);
    return () => clearInterval(interval);
  }, [hasIndexing, sources]);

  // Pages for expanded source
  const sourcePages = trpc.sources.getPages.useQuery(
    { sourceId: expandedSource! },
    { enabled: !!expandedSource }
  );
  const deletePageMutation = trpc.sources.deletePage.useMutation({
    onSuccess: () => {
      if (expandedSource) {
        utils.sources.getPages.invalidate({ sourceId: expandedSource });
        utils.sources.list.invalidate({ agentId });
      }
    },
  });

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
  const [showUploadFile, setShowUploadFile] = useState(false);
  const [uploading, setUploading] = useState(false);
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
  const [widgetConfig, setWidgetConfig] = useState<WidgetConfig>(DEFAULT_WIDGET_CONFIG);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Current plan
  const currentPlan = trpc.billing.getCurrentPlan.useQuery();

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
      setWidgetConfig((agent.data as any).widgetConfig ?? DEFAULT_WIDGET_CONFIG);
      setAvatarUrl(agent.data.avatarUrl);
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
      widgetConfig,
      avatarUrl: avatarUrl ?? undefined,
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

      <div className="p-4 md:p-8">
        <Tabs defaultValue="sources" className="space-y-8">
          <TabsList className="flex w-full overflow-x-auto">
            <TabsTrigger value="sources" className="gap-2 flex-shrink-0"><FileText className="h-[18px] w-[18px]" strokeWidth={1.5} /> <span className="hidden sm:inline">Sources</span></TabsTrigger>
            <TabsTrigger value="config" className="gap-2 flex-shrink-0"><Settings2 className="h-[18px] w-[18px]" strokeWidth={1.5} /> <span className="hidden sm:inline">Configuration</span></TabsTrigger>
            <TabsTrigger value="customize" className="gap-2 flex-shrink-0"><Palette className="h-[18px] w-[18px]" strokeWidth={1.5} /> <span className="hidden sm:inline">Personnalisation</span></TabsTrigger>
            <TabsTrigger value="test" className="gap-2 flex-shrink-0"><TestTube className="h-[18px] w-[18px]" strokeWidth={1.5} /> <span className="hidden sm:inline">Test</span></TabsTrigger>
            <TabsTrigger value="deploy" className="gap-2 flex-shrink-0"><Rocket className="h-[18px] w-[18px]" strokeWidth={1.5} /> <span className="hidden sm:inline">Déploiement</span></TabsTrigger>
          </TabsList>

          {/* Sources Tab */}
          <TabsContent value="sources" className="space-y-6">
            {/* Add buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddWebsite(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-foreground/90 active:scale-[0.98]"
              >
                <Globe className="h-4 w-4" strokeWidth={1.5} />
                Website
              </button>
              <button
                onClick={() => setShowAddText(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-card shadow-apple px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:shadow-apple-hover hover:text-foreground active:scale-[0.98]"
              >
                <FileText className="h-4 w-4" strokeWidth={1.5} />
                Texte
              </button>
              <button
                onClick={() => setShowUploadFile(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-card shadow-apple px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:shadow-apple-hover hover:text-foreground active:scale-[0.98]"
              >
                <Upload className="h-4 w-4" strokeWidth={1.5} />
                Fichier
              </button>
            </div>

            {/* Sources list */}
            {sources.data && sources.data.length > 0 ? (
              <div className="space-y-3">
                {sources.data.map((source) => {
                  const isExpanded = expandedSource === source.id;
                  const isIndexing = source.status === "INDEXING" || source.status === "PENDING";
                  const isFailed = source.status === "FAILED";
                  const isIndexed = source.status === "INDEXED";

                  return (
                    <div key={source.id} className="rounded-2xl bg-card shadow-apple overflow-hidden transition-all duration-200">
                      {/* Source header — clickable to expand */}
                      <div
                        className="flex items-center justify-between p-5 cursor-pointer hover:bg-muted/20 transition-colors duration-150"
                        onClick={() => isIndexed && source.pagesCount > 0 && setExpandedSource(isExpanded ? null : source.id)}
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          {/* Type icon */}
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            isIndexing ? "bg-amber-50" : isFailed ? "bg-red-50" : "bg-muted/60"
                          }`}>
                            {source.type === "WEBSITE" || source.type === "SITEMAP" ? (
                              <Globe className={`h-[18px] w-[18px] ${isIndexing ? "text-amber-600" : isFailed ? "text-red-500" : "text-foreground"}`} strokeWidth={1.5} />
                            ) : (
                              <FileText className={`h-[18px] w-[18px] ${isIndexing ? "text-amber-600" : isFailed ? "text-red-500" : "text-foreground"}`} strokeWidth={1.5} />
                            )}
                          </div>

                          {/* Info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm truncate">{source.name}</p>
                              {/* Status indicator */}
                              {isIndexing && (
                                <span className="inline-flex items-center gap-1.5 text-xs text-amber-600">
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  Indexation...
                                </span>
                              )}
                              {isIndexed && (
                                <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                                  <Check className="h-3 w-3" strokeWidth={2.5} />
                                  Indexé
                                </span>
                              )}
                              {isFailed && (
                                <span className="inline-flex items-center gap-1 text-xs text-red-500">
                                  <AlertCircle className="h-3 w-3" strokeWidth={2} />
                                  Erreur
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {source.pagesCount} page{source.pagesCount !== 1 ? "s" : ""} &middot; {source.chunksCount} chunk{source.chunksCount !== 1 ? "s" : ""}
                              {source.lastIndexedAt && ` &middot; ${new Date(source.lastIndexedAt).toLocaleDateString("fr-FR")}`}
                            </p>
                            {source.indexError && (
                              <p className="text-xs text-red-500 mt-1 truncate">{source.indexError}</p>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          {isIndexed && source.pagesCount > 0 && (
                            <button
                              onClick={() => setExpandedSource(isExpanded ? null : source.id)}
                              className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all duration-200"
                            >
                              <ChevronDown className={`h-[18px] w-[18px] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} strokeWidth={1.5} />
                            </button>
                          )}
                          <button
                            onClick={() => reindexSource.mutate({ id: source.id })}
                            disabled={reindexSource.isPending || isIndexing}
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all duration-200 disabled:opacity-40"
                          >
                            <RefreshCw className={`h-[18px] w-[18px] ${isIndexing ? "animate-spin" : ""}`} strokeWidth={1.5} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Supprimer cette source et toutes ses données ?")) {
                                deleteSource.mutate({ id: source.id });
                                if (expandedSource === source.id) setExpandedSource(null);
                              }
                            }}
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-all duration-200"
                          >
                            <Trash2 className="h-[18px] w-[18px]" strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>

                      {/* Indexing progress bar */}
                      {isIndexing && (
                        <div className="px-5 pb-4">
                          <div className="h-1 w-full rounded-full bg-muted/60 overflow-hidden">
                            <div className="h-full w-1/3 rounded-full bg-amber-400 animate-pulse" style={{ animation: "pulse 1.5s ease-in-out infinite, slideRight 2s ease-in-out infinite" }} />
                          </div>
                        </div>
                      )}

                      {/* Expanded pages list */}
                      {isExpanded && (
                        <div className="border-t border-border/50">
                          {sourcePages.isLoading ? (
                            <div className="flex items-center justify-center py-8">
                              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            </div>
                          ) : sourcePages.data && sourcePages.data.length > 0 ? (
                            <div>
                              {sourcePages.data.map((page) => (
                                <div key={page.pageUrl} className="flex items-center gap-1.5 px-5 py-1.5 hover:bg-muted/20 transition-colors duration-100 group">
                                  <button
                                    onClick={() => deletePageMutation.mutate({ sourceId: source.id, pageUrl: page.pageUrl })}
                                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded text-muted-foreground/0 group-hover:text-muted-foreground/40 hover:!text-red-500 transition-all duration-150 ml-14"
                                  >
                                    <X className="h-2.5 w-2.5" strokeWidth={2.5} />
                                  </button>
                                  <span className="text-xs text-muted-foreground truncate">{page.pageTitle}</span>
                                  <span className="text-[10px] text-muted-foreground/50 shrink-0">{page.chunksCount}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground text-center py-6">Aucune page trouvée</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 rounded-2xl shadow-apple bg-card">
                <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-muted/60">
                  <FileText className="h-6 w-6 text-muted-foreground/40" strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 text-base font-semibold">Aucune source</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                  Ajoutez un site web, du texte ou un fichier pour entraîner votre agent IA.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="config" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Intelligence Artificielle</CardTitle>
                <CardDescription>Propulsé par HelloClaudia</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl bg-muted/60 px-4 py-3 text-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ClaudiaAvatar size="sm" />
                    <span className="font-medium">HelloClaudia IA</span>
                  </div>
                  <Badge variant="secondary">IA avancée</Badge>
                </div>

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
            <div className="grid gap-6 lg:grid-cols-[1fr,auto]">
              <div className="space-y-4">
                <WidgetCustomizer
                  config={widgetConfig}
                  onChange={setWidgetConfig}
                  primaryColor={primaryColor}
                  onPrimaryColorChange={setPrimaryColor}
                  welcomeMessage={welcomeMessage}
                  onWelcomeMessageChange={setWelcomeMessage}
                  leadCaptureEnabled={leadCaptureEnabled}
                  onLeadCaptureChange={setLeadCaptureEnabled}
                  plan={currentPlan.data?.slug ?? "FREE"}
                  avatarUrl={avatarUrl}
                  onAvatarUrlChange={setAvatarUrl}
                />
                <Button className="w-full" onClick={handleSaveCustomize} disabled={updateAgent.isPending}>
                  {updateAgent.isPending ? "Sauvegarde..." : "Sauvegarder la personnalisation"}
                </Button>
              </div>
              {/* Preview - desktop: inline, mobile: button + dialog */}
              <div className="sticky top-6 hidden lg:block">
                <div className="flex flex-col items-center gap-3">
                  <p className="text-sm font-medium text-muted-foreground">Aperçu en temps réel</p>
                  <WidgetPreview
                    config={widgetConfig}
                    primaryColor={primaryColor}
                    agentName={agent.data.name}
                    welcomeMessage={welcomeMessage}
                    avatarUrl={avatarUrl}
                  />
                </div>
              </div>

              {/* Mobile preview button */}
              <div className="lg:hidden fixed bottom-20 right-4 z-40">
                <Button
                  onClick={() => setShowPreview(true)}
                  className="rounded-full shadow-lg gap-2 h-12 px-5"
                >
                  <Eye className="h-4 w-4" strokeWidth={1.5} />
                  Prévisualiser
                </Button>
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
                <div className="rounded-2xl shadow-apple bg-card min-h-[400px] flex flex-col">
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[400px]">
                    {testMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`rounded-2xl px-4 py-2 max-w-[70%] ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-white shadow-sm"}`}>
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
                    <Button size="icon" onClick={handleSendTest}><Send className="h-[18px] w-[18px]" strokeWidth={1.5} /></Button>
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
                  <pre className="rounded-xl bg-muted/60 p-4 text-sm font-mono overflow-x-auto">
                    {`<script src="${process.env.NEXT_PUBLIC_APP_URL ?? (typeof window !== "undefined" ? window.location.origin : "")}/widget.js" data-agent-id="${agentId}" async></script>`}
                  </pre>
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => navigator.clipboard.writeText(`<script src="${process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin}/widget.js" data-agent-id="${agentId}" async></script>`)}>
                    <Copy className="h-[18px] w-[18px]" strokeWidth={1.5} />
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
                  <Input readOnly value={`${process.env.NEXT_PUBLIC_APP_URL ?? (typeof window !== "undefined" ? window.location.origin : "")}/chat/${agentId}`} className="font-mono text-sm" />
                  <Button variant="outline" onClick={() => navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin}/chat/${agentId}`)}><Copy className="h-[18px] w-[18px]" strokeWidth={1.5} /></Button>
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

      {/* Upload File Dialog */}
      <Dialog open={showUploadFile} onOpenChange={setShowUploadFile}>
        <DialogContent>
          <DialogHeader><DialogTitle>Uploader un fichier</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Fichier (PDF, DOCX, TXT, MD, CSV, HTML)</Label>
              <Input
                type="file"
                accept=".pdf,.docx,.txt,.md,.csv,.html"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploading(true);
                  try {
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("agentId", agentId);
                    const res = await fetch("/api/v1/upload", { method: "POST", body: formData });
                    if (res.ok) {
                      utils.sources.list.invalidate({ agentId });
                      setShowUploadFile(false);
                    } else {
                      const data = await res.json();
                      alert(data.error || "Erreur lors de l'upload");
                    }
                  } catch {
                    alert("Erreur lors de l'upload");
                  } finally {
                    setUploading(false);
                  }
                }}
                disabled={uploading}
              />
              {uploading && <p className="text-sm text-muted-foreground">Upload et indexation en cours...</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadFile(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Widget Preview Dialog (mobile) */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-[420px] p-4">
          <DialogHeader>
            <DialogTitle>Aperçu du widget</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-2 overflow-auto max-h-[70vh]">
            <WidgetPreview
              config={widgetConfig}
              primaryColor={primaryColor}
              agentName={agent.data?.name ?? "Agent"}
              welcomeMessage={welcomeMessage}
              avatarUrl={avatarUrl}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
