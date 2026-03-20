"use client";

import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { Loader2, Globe, Lock, Crown, Check, AlertCircle, X } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const utils = trpc.useUtils();
  const org = trpc.settings.getOrg.useQuery();
  const members = trpc.settings.getMembers.useQuery();
  const updateOrg = trpc.settings.updateOrg.useMutation({
    onSuccess: () => utils.settings.getOrg.invalidate(),
  });

  const customDomain = trpc.settings.getCustomDomain.useQuery();
  const updateDomain = trpc.settings.updateCustomDomain.useMutation({
    onSuccess: () => utils.settings.getCustomDomain.invalidate(),
  });
  const removeDomain = trpc.settings.removeCustomDomain.useMutation({
    onSuccess: () => {
      setDomainInput("");
      utils.settings.getCustomDomain.invalidate();
    },
  });

  const [orgName, setOrgName] = useState("");
  const [orgSlug, setOrgSlug] = useState("");
  const [domainInput, setDomainInput] = useState("");

  useEffect(() => {
    if (org.data) {
      setOrgName(org.data.name);
      setOrgSlug(org.data.slug);
    }
  }, [org.data]);

  useEffect(() => {
    if (customDomain.data?.customDomain) {
      setDomainInput(customDomain.data.customDomain);
    }
  }, [customDomain.data]);

  if (org.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <Header title="Settings" description="Paramètres de votre organisation" />
      <div className="p-8 space-y-8 max-w-3xl">
        <Card>
          <CardHeader><CardTitle>Organisation</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={orgSlug} onChange={(e) => setOrgSlug(e.target.value)} />
            </div>
            <Button
              onClick={() => updateOrg.mutate({ name: orgName, slug: orgSlug })}
              disabled={updateOrg.isPending}
            >
              {updateOrg.isPending ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Membres de l&apos;équipe</CardTitle>
            <CardDescription>Gérez les accès de votre équipe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {members.data?.map((member) => (
                <div key={member.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>
                        {member.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <Badge>{member.role}</Badge>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <Button variant="outline">Inviter un membre</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clés API (BYOK)</CardTitle>
            <CardDescription>Utilisez vos propres clés API pour les modèles IA</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>OpenAI API Key</Label>
              <Input type="password" placeholder="sk-..." />
            </div>
            <div className="space-y-2">
              <Label>Anthropic API Key</Label>
              <Input type="password" placeholder="sk-ant-..." />
            </div>
            <div className="space-y-2">
              <Label>Google AI API Key</Label>
              <Input type="password" placeholder="AIza..." />
            </div>
            <Button>Sauvegarder les clés</Button>
          </CardContent>
        </Card>

        {/* Custom Domain */}
        <Card className="relative overflow-hidden">
          {!customDomain.data?.canUse && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-amber-500" />
                <span className="font-semibold text-sm">Plan Growth requis</span>
              </div>
              <p className="text-xs text-muted-foreground text-center max-w-xs mb-3">
                Connectez votre propre domaine pour un accès personnalisé (claudia.votredomaine.com)
              </p>
              <Link href="/dashboard/billing">
                <Button size="sm" className="gap-1.5">
                  <Lock className="h-3.5 w-3.5" />
                  Passer au Growth
                </Button>
              </Link>
            </div>
          )}
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Domaine personnalisé
            </CardTitle>
            <CardDescription>
              Connectez votre propre sous-domaine pour accéder au chatbot (ex: claudia.votredomaine.com)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {customDomain.data?.customDomain ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-border p-4">
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{customDomain.data.customDomain}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {customDomain.data.customDomainVerified ? (
                      <Badge variant="success" className="gap-1">
                        <Check className="h-3 w-3" /> Vérifié
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="gap-1">
                        <AlertCircle className="h-3 w-3" /> En attente
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDomain.mutate()}
                      disabled={removeDomain.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {!customDomain.data.customDomainVerified && (
                  <div className="rounded-xl bg-muted/50 p-4 space-y-2">
                    <p className="text-xs font-medium">Configuration DNS requise</p>
                    <p className="text-xs text-muted-foreground">
                      Ajoutez un enregistrement CNAME pointant vers :
                    </p>
                    <div className="rounded-lg bg-background border border-border p-3 font-mono text-xs select-all">
                      cname.vercel-dns.com
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      La vérification peut prendre jusqu&apos;à 24h après la configuration DNS.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="claudia.votredomaine.com"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                />
                <Button
                  onClick={() => domainInput && updateDomain.mutate({ domain: domainInput })}
                  disabled={!domainInput || updateDomain.isPending}
                >
                  {updateDomain.isPending ? "..." : "Connecter"}
                </Button>
              </div>
            )}
            {updateDomain.error && (
              <p className="text-xs text-red-500">{updateDomain.error.message}</p>
            )}
          </CardContent>
        </Card>

        <Card className="border border-red-200/60 bg-red-50/30">
          <CardHeader>
            <CardTitle className="text-destructive">Zone de danger</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Supprimer votre organisation et toutes les données associées. Cette action est irréversible.
            </p>
            <Button variant="destructive">Supprimer l&apos;organisation</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
