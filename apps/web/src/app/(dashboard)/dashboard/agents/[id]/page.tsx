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
import {
  Globe, FileText, Upload, RefreshCw, Trash2, Code, Copy, Send,
  ExternalLink, MessageSquare, Palette, Settings2, TestTube, Rocket,
} from "lucide-react";
import { useState } from "react";

export default function AgentDetailPage({ params }: { params: { id: string } }) {
  const [testMessages, setTestMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "Bonjour ! Comment puis-je vous aider ?" },
  ]);
  const [testInput, setTestInput] = useState("");

  return (
    <div>
      <Header title="Support Client" description="Agent de support principal" />

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
              <Button><Globe className="mr-2 h-4 w-4" /> Website</Button>
              <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Fichier</Button>
              <Button variant="outline"><ExternalLink className="mr-2 h-4 w-4" /> Connecteur</Button>
            </div>

            <div className="space-y-2">
              {[
                { name: "docs.example.com", type: "WEBSITE", status: "INDEXED", pages: 45, date: "Il y a 2h" },
                { name: "guide-utilisateur.pdf", type: "FILE_PDF", status: "INDEXED", pages: 12, date: "Il y a 1j" },
                { name: "FAQ interne", type: "TEXT_RAW", status: "PENDING", pages: 1, date: "À l'instant" },
              ].map((source, i) => (
                <Card key={i}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      {source.type === "WEBSITE" ? <Globe className="h-5 w-5 text-blue-500" /> : <FileText className="h-5 w-5 text-orange-500" />}
                      <div>
                        <p className="font-medium text-sm">{source.name}</p>
                        <p className="text-xs text-muted-foreground">{source.pages} pages &bull; {source.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={source.status === "INDEXED" ? "success" : "warning"}>
                        {source.status === "INDEXED" ? "Indexé" : "En attente"}
                      </Badge>
                      <Button variant="ghost" size="icon"><RefreshCw className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="config" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Modèle IA</CardTitle>
                <CardDescription>Choisissez le modèle de langage pour cet agent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select defaultValue="GPT4O_MINI">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GPT4O_MINI">GPT-4o Mini — 1 crédit/msg</SelectItem>
                    <SelectItem value="CLAUDE_HAIKU">Claude Haiku — 1 crédit/msg</SelectItem>
                    <SelectItem value="GPT4O">GPT-4o — 3 crédits/msg</SelectItem>
                    <SelectItem value="CLAUDE_SONNET">Claude Sonnet — 3 crédits/msg</SelectItem>
                    <SelectItem value="CLAUDE_OPUS">Claude Opus — 5 crédits/msg</SelectItem>
                  </SelectContent>
                </Select>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Température</Label>
                    <span className="text-sm text-muted-foreground">0.3</span>
                  </div>
                  <Slider defaultValue={[0.3]} min={0} max={1} step={0.1} />
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
                <Textarea rows={6} placeholder="Instructions additionnelles pour l'agent..." className="font-mono text-sm" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comportement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mode strict</Label>
                    <p className="text-xs text-muted-foreground">Répond uniquement à partir de la documentation</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Message fallback</Label>
                  <Input defaultValue="Désolé, je n'ai pas trouvé de réponse dans la documentation." />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Escalade</Label>
                    <p className="text-xs text-muted-foreground">Transfert à un humain après X messages sans réponse</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Button className="w-full">Sauvegarder</Button>
          </TabsContent>

          {/* Customize Tab */}
          <TabsContent value="customize">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Apparence</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Couleur principale</Label>
                      <div className="flex gap-2">
                        <Input type="color" defaultValue="#1A56DB" className="w-12 h-10 p-1" />
                        <Input defaultValue="#1A56DB" className="font-mono" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Message d&apos;accueil</Label>
                      <Input defaultValue="Bonjour ! Comment puis-je vous aider ?" />
                    </div>
                    <div className="space-y-2">
                      <Label>Questions suggérées</Label>
                      <div className="space-y-2">
                        <Input placeholder="Question 1..." />
                        <Input placeholder="Question 2..." />
                        <Input placeholder="Question 3..." />
                        <Button variant="outline" size="sm">+ Ajouter</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Capture de leads</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Activer la capture de leads</Label>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Preview */}
              <div className="sticky top-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Aperçu du widget</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border bg-white shadow-lg overflow-hidden max-w-sm mx-auto">
                      <div className="bg-primary p-4 text-primary-foreground">
                        <p className="font-semibold">Support Client</p>
                      </div>
                      <div className="p-4 space-y-3 min-h-[300px] bg-gray-50">
                        <div className="bg-white rounded-lg p-3 shadow-sm max-w-[80%]">
                          <p className="text-sm">Bonjour ! Comment puis-je vous aider ?</p>
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
                <CardDescription>Testez votre agent avant de le déployer. Les messages ici ne sont pas comptabilisés.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-muted/30 min-h-[400px] flex flex-col">
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {testMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}>
                        <div className={`rounded-lg px-4 py-2 max-w-[70%] ${msg.role === "assistant" ? "bg-white shadow-sm" : "bg-primary text-primary-foreground"}`}>
                          <p className="text-sm">{msg.content}</p>
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
                        if (e.key === "Enter" && testInput.trim()) {
                          setTestMessages([...testMessages, { role: "user", content: testInput }]);
                          setTestInput("");
                          // Mock response
                          setTimeout(() => {
                            setTestMessages((prev) => [...prev, { role: "assistant", content: "Je cherche dans la documentation..." }]);
                          }, 500);
                        }
                      }}
                    />
                    <Button size="icon"><Send className="h-4 w-4" /></Button>
                  </div>
                </div>
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
                    {`<script src="https://cdn.chatbot.com/widget.js" data-agent-id="${params.id}" async></script>`}
                  </pre>
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Iframe</CardTitle>
                <CardDescription>Intégrez le chatbot dans un iframe</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="rounded-lg bg-muted p-4 text-sm font-mono overflow-x-auto">
                  {`<iframe src="https://app.chatbot.com/chat/${params.id}" width="400" height="600" frameborder="0"></iframe>`}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lien direct</CardTitle>
                <CardDescription>Partagez ce lien pour accéder au chatbot en pleine page</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input readOnly value={`https://app.chatbot.com/chat/${params.id}`} className="font-mono text-sm" />
                  <Button variant="outline"><Copy className="h-4 w-4" /></Button>
                  <Button variant="outline"><ExternalLink className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
