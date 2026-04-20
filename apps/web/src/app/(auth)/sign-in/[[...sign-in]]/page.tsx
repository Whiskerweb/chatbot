"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { dashboardHref } from "@/lib/urls";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const { data: { user: signedInUser } } = await supabase.auth.getUser();
    if (signedInUser) {
      await fetch("/api/auth/ensure-org", { method: "POST" });
    }

    const target = dashboardHref();
    if (/^https?:\/\//.test(target)) {
      window.location.href = target;
    } else {
      router.push(target);
      router.refresh();
    }
  };

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-xl font-semibold tracking-tight">HelloClaudia</Link>
        </div>

        <div className="rounded-3xl bg-card shadow-apple p-8">
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold tracking-tight">Connexion</h1>
            <p className="mt-1 text-sm text-muted-foreground">Connectez-vous à votre compte</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground">ou</span>
            </div>
          </div>

          <Button variant="outline" className="w-full h-11" onClick={handleGoogleSignIn}>
            Continuer avec Google
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Pas encore de compte ?{" "}
          <Link href="/sign-up" className="text-foreground hover:underline font-medium">
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
