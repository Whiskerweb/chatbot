import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div>
      <Header title="Settings" description="Paramètres de votre organisation" />
      <div className="p-6 space-y-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Organisation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input defaultValue="Mon Entreprise" />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input defaultValue="mon-entreprise" />
            </div>
            <Button>Sauvegarder</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Membres de l&apos;équipe</CardTitle>
            <CardDescription>Gérez les accès de votre équipe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>LR</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Lucas Roncey</p>
                    <p className="text-xs text-muted-foreground">lucas@example.com</p>
                  </div>
                </div>
                <Badge>Owner</Badge>
              </div>
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

        <Card className="border-destructive">
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
