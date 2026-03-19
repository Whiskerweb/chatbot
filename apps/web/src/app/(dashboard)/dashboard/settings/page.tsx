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
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const utils = trpc.useUtils();
  const org = trpc.settings.getOrg.useQuery();
  const members = trpc.settings.getMembers.useQuery();
  const updateOrg = trpc.settings.updateOrg.useMutation({
    onSuccess: () => utils.settings.getOrg.invalidate(),
  });

  const [orgName, setOrgName] = useState("");
  const [orgSlug, setOrgSlug] = useState("");

  useEffect(() => {
    if (org.data) {
      setOrgName(org.data.name);
      setOrgSlug(org.data.slug);
    }
  }, [org.data]);

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
