"use client";

import Link from "next/link";
import { useState } from "react";
import {
  MessageSquare, FileText, BarChart3, Shield, Zap,
  ArrowRight, Check, ChevronDown, Bot, Globe, Plug,
  Lock, Eye, Palette, Send, Users,
  Sparkles, Clock, TrendingUp,
} from "lucide-react";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { HeroBackground } from "@/components/marketing/hero-background";
import { BrandLogo } from "@/components/marketing/brand-logos";

/* ─── Feature tabs data ─── */
const featureTabs = [
  {
    id: "agent",
    label: "Agent IA",
    icon: Bot,
    title: "Un agent IA entraîné sur vos données",
    description: "Votre chatbot comprend le contexte, répond avec précision et cite ses sources. Mode strict anti-hallucination inclus.",
    features: [
      "Réponses basées uniquement sur votre documentation",
      "Citations automatiques des sources",
      "IA avancée propulsée par HelloClaudia",
      "Personnalisation du ton et du comportement",
      "Escalade vers un humain si nécessaire",
    ],
  },
  {
    id: "sources",
    label: "Sources & RAG",
    icon: FileText,
    title: "Importez n'importe quelle source de données",
    description: "Sites web, PDF, Notion, Google Drive — tout est indexé automatiquement avec notre pipeline RAG optimisé.",
    features: [
      "Crawling automatique de sites web",
      "Upload PDF, DOCX, TXT, Markdown, CSV",
      "Connecteurs Notion & Google Drive",
      "Re-indexation et sync automatique",
      "Chunking intelligent avec overlap",
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    title: "Dashboard complet pour piloter la performance",
    description: "Visualisez les questions fréquentes, identifiez les gaps documentaires et mesurez le ROI de votre chatbot.",
    features: [
      "Top questions et tendances",
      "Détection des gaps documentaires",
      "Taux de déflection en temps réel",
      "Consommation de crédits détaillée",
      "Suggestions IA d'amélioration",
    ],
  },
  {
    id: "widget",
    label: "Widget",
    icon: Palette,
    title: "Un widget élégant, intégré en 1 minute",
    description: "Personnalisez les couleurs, le message d'accueil et les questions suggérées. Déployez avec une seule ligne de code.",
    features: [
      "Intégration en 1 ligne de JavaScript",
      "Personnalisation complète (couleurs, logo, messages)",
      "Responsive et accessible",
      "Capture de leads intégrée",
      "Compatible CSP et iframe",
    ],
  },
  {
    id: "api",
    label: "API & Intégrations",
    icon: Plug,
    title: "API REST complète et widget intégrable",
    description: "Intégrez le chatbot dans vos outils existants via notre API REST ou nos connecteurs natifs.",
    features: [
      "API REST documentée",
      "Webhooks pour les événements",
      "Streaming SSE en temps réel",
      "BYOK (vos propres clés API)",
      "Serveur MCP (plans Pro+)",
    ],
  },
];

/* ─── Integrations (widget JS compatible) ─── */
const integrations = [
  "WordPress", "Shopify", "Webflow", "Wix", "WooCommerce", "Framer",
];

/* ─── Testimonials ─── */
const testimonials = [
  {
    quote: "Notre taux de déflection est passé de 30% à 75% en 3 semaines. Le chatbot répond mieux que notre ancienne FAQ.",
    name: "Marie Laurent",
    title: "Head of Support",
    company: "TechFlow",
  },
  {
    quote: "L'intégration a pris 10 minutes. Le dashboard analytics nous montre exactement ce qui manque dans notre documentation.",
    name: "Thomas Berger",
    title: "CTO",
    company: "DataPulse",
  },
  {
    quote: "Le système de crédits est transparent et prévisible. On sait exactement ce qu'on consomme et pourquoi.",
    name: "Sophie Martin",
    title: "Product Manager",
    company: "CloudBase",
  },
];

/* ─── Plans ─── */
const plans = [
  { name: "Free", price: 0, credits: "100", agents: "1", sources: "30", features: ["IA HelloClaudia", "Dashboard basique", "Support communauté", "Rétention 7 jours"] },
  { name: "Starter", price: 29, credits: "3 000", agents: "3", sources: "500", features: ["IA HelloClaudia avancée", "Live chat", "Sync hebdomadaire", "API REST", "Support email 48h"] },
  { name: "Pro", price: 79, credits: "15 000", agents: "10", sources: "5 000", popular: true, features: ["IA HelloClaudia Pro + BYOK", "Sync quotidien", "API + MCP", "5 membres", "Support chat 24h"] },
  { name: "Growth", price: 199, credits: "50 000", agents: "25", sources: "15 000", features: ["White-label inclus", "Sync 4x/jour", "15 membres", "Rétention 1 an", "Support prioritaire"] },
];

/* ─── FAQs ─── */
const faqs = [
  { q: "Qu'est-ce qu'un crédit ?", a: "Un crédit correspond à une unité de consommation. Chaque message IA consomme 1 à 5 crédits selon l'usage. L'indexation de documents consomme également des crédits. Votre consommation est visible en temps réel dans le dashboard." },
  { q: "Puis-je changer de plan à tout moment ?", a: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Le changement est effectif immédiatement et le montant est calculé au prorata." },
  { q: "Quelles sources de données sont supportées ?", a: "Sites web (crawling automatique), fichiers PDF, DOCX, TXT, Markdown et CSV. D'autres connecteurs (Notion, Google Drive, etc.) arrivent bientôt." },
  { q: "Puis-je utiliser mes propres clés API ?", a: "Oui, à partir du plan Pro. Vous pouvez configurer vos clés OpenAI, Anthropic ou Google AI dans les paramètres. Vos messages ne consomment alors pas de crédits." },
  { q: "Mes données sont-elles sécurisées ?", a: "Absolument. Chiffrement AES-256 au repos et TLS 1.3 en transit. Vos données ne sont jamais utilisées pour entraîner d'autres IA. Hébergement européen disponible." },
  { q: "Le white-label est-il disponible ?", a: "Oui, à partir du plan Growth. Vous pouvez personnaliser entièrement le widget avec votre marque, couleurs et domaine personnalisé." },
];

/* ─── Stats ─── */
const stats = [
  { value: "10M+", label: "Messages traités", icon: MessageSquare },
  { value: "2,500+", label: "Entreprises actives", icon: Users },
  { value: "99.9%", label: "Uptime garanti", icon: TrendingUp },
  { value: "<2s", label: "Temps de réponse", icon: Clock },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("agent");
  const activeFeature = featureTabs.find((t) => t.id === activeTab)!;

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative mx-auto max-w-6xl px-6 pt-24 pb-16 text-center">
        <HeroBackground />

        <div className="motion-safe:animate-fade-in-up inline-flex items-center rounded-full border border-border/60 bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-xs mb-8" style={{ animationDelay: "0ms", animationFillMode: "both" }}>
          <Zap className="h-3.5 w-3.5 mr-2 text-amber-500" strokeWidth={2} />
          Propulsé par HelloClaudia — IA de nouvelle génération
        </div>

        <h1 className="motion-safe:animate-fade-in-up text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
          Construisez, Automatisez
          <br />
          & Déployez votre
          <br />
          <span className="text-muted-foreground">Chatbot IA</span>
        </h1>

        <p className="motion-safe:animate-fade-in-up mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
          Entraînez un agent IA sur votre documentation et automatisez votre support client,
          vos ventes et vos opérations. Déployé en 10 minutes.
        </p>

        <div className="motion-safe:animate-fade-in-up mt-8 flex items-center justify-center gap-4" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
          <Link href="/sign-up" className="inline-flex h-12 items-center rounded-2xl bg-foreground px-7 text-sm font-medium text-background hover:bg-foreground/90 transition-all duration-200 active:scale-[0.98] gap-2">
            Commencer gratuitement <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="#how" className="inline-flex h-12 items-center rounded-2xl border border-border bg-card px-7 text-sm font-medium hover:bg-muted transition-all duration-200">
            Réserver une démo
          </Link>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">100 crédits gratuits &bull; Aucune carte bancaire requise</p>

        {/* Dashboard mockup */}
        <ScrollReveal>
        <div className="mt-16 mx-auto max-w-4xl">
          <div className="rounded-2xl shadow-apple-hover border border-border/50 bg-card overflow-hidden motion-safe:animate-fade-in-scale" style={{ animationDelay: "400ms" }}>
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/40">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400/80 motion-safe:animate-dot-pulse" style={{ animationDelay: "0ms" }} />
                <div className="h-3 w-3 rounded-full bg-amber-400/80 motion-safe:animate-dot-pulse" style={{ animationDelay: "150ms" }} />
                <div className="h-3 w-3 rounded-full bg-emerald-400/80 motion-safe:animate-dot-pulse" style={{ animationDelay: "300ms" }} />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="rounded-lg bg-background/80 px-4 py-1 text-xs text-muted-foreground relative overflow-hidden">
                  app.helloclaudia.fr/dashboard
                  <div className="absolute inset-0 motion-safe:animate-shimmer bg-gradient-to-r from-transparent via-foreground/5 to-transparent" />
                </div>
              </div>
            </div>
            {/* Dashboard content */}
            <div className="p-6 bg-background/50">
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Conversations", value: "1,248", change: "+12%" },
                  { label: "Messages", value: "8,432", change: "+18%" },
                  { label: "Déflection", value: "76%", change: "+5%" },
                  { label: "Leads", value: "89", change: "+23%" },
                ].map((kpi, i) => (
                  <ScrollReveal key={kpi.label} delay={500 + i * 100}>
                  <div className="rounded-xl bg-card shadow-apple p-4 transition-all duration-300 hover:shadow-apple-hover hover:-translate-y-0.5">
                    <p className="text-xs text-muted-foreground">{kpi.label}</p>
                    <p className="text-xl font-light mt-1">{kpi.value}</p>
                    <span className="text-xs text-emerald-600">{kpi.change}</span>
                  </div>
                  </ScrollReveal>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <ScrollReveal delay={900} className="col-span-2">
                <div className="rounded-xl bg-card shadow-apple p-4 h-32 transition-all duration-300 hover:shadow-apple-hover">
                  <p className="text-xs text-muted-foreground mb-3">Activité</p>
                  <div className="flex items-end gap-1 h-16">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                      <div key={i} className="flex-1 origin-bottom rounded-sm bg-foreground/10 motion-safe:animate-grow-up" style={{ height: `${h}%`, animationDelay: `${1000 + i * 60}ms` }} />
                    ))}
                  </div>
                </div>
                </ScrollReveal>
                <ScrollReveal delay={1000}>
                <div className="rounded-xl bg-card shadow-apple p-4 h-32 transition-all duration-300 hover:shadow-apple-hover">
                  <p className="text-xs text-muted-foreground mb-3">Top questions</p>
                  <div className="space-y-2">
                    {["Mot de passe ?", "Tarifs ?", "API REST ?"].map((q, i) => (
                      <div key={q} className="flex items-center gap-2 opacity-0 motion-safe:animate-fade-in-up" style={{ animationDelay: `${1100 + i * 120}ms`, animationFillMode: "both" }}>
                        <div className="h-1.5 w-1.5 rounded-full bg-foreground/30 motion-safe:animate-pulse-soft" style={{ animationDelay: `${i * 400}ms` }} />
                        <span className="text-xs text-muted-foreground truncate">{q}</span>
                      </div>
                    ))}
                  </div>
                </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </section>

      {/* ─── Stats ─── */}
      <section className="relative py-16 border-y border-border/50 overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(220 14% 97%) 0%, hsl(224 76% 48% / 0.02) 50%, hsl(220 14% 97%) 100%)" }}>
        {/* Color accent — soft teal, left */}
        <div className="absolute -left-32 top-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full blur-[100px] opacity-[0.07] pointer-events-none" style={{ background: "#06b6d4" }} />
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 80}>
              <div className="text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-muted mb-3">
                  <stat.icon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Tabs ─── */}
      <section id="features" className="relative mx-auto max-w-6xl px-6 py-24">
        {/* Subtle background accent */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full blur-[120px] opacity-[0.04]"
            style={{ background: "radial-gradient(circle, hsl(262 83% 58%), transparent 70%)" }}
          />
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight">Une plateforme complète</h2>
          <p className="mt-3 text-muted-foreground">Tout ce dont vous avez besoin pour déployer et gérer vos chatbots IA.</p>
        </div>

        <ScrollReveal>
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {featureTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-foreground text-background shadow-sm"
                  : "bg-card shadow-apple text-muted-foreground hover:text-foreground hover:shadow-apple-hover"
              }`}
            >
              <tab.icon className="h-4 w-4" strokeWidth={1.5} />
              {tab.label}
            </button>
          ))}
        </div>
        </ScrollReveal>

        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="animate-fade-in-up" key={activeTab}>
            <h3 className="text-2xl font-semibold tracking-tight">{activeFeature.title}</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">{activeFeature.description}</p>
            <ul className="mt-6 space-y-3">
              {activeFeature.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 mt-0.5">
                    <Check className="h-3 w-3 text-emerald-600" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link href="/fonctionnalites" className="inline-flex h-11 items-center rounded-xl bg-foreground px-6 text-sm font-medium text-background hover:bg-foreground/90 transition-all duration-200 active:scale-[0.98] gap-2">
                Découvrir toutes les fonctionnalités <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Feature illustration */}
          <div className="relative min-h-[360px] rounded-2xl bg-card shadow-apple overflow-hidden">
            <div
              className="absolute inset-0 motion-safe:animate-gradient-shift bg-[length:200%_200%]"
              style={{ background: "linear-gradient(135deg, hsl(224 76% 48% / 0.04), hsl(262 83% 58% / 0.04), hsl(190 95% 39% / 0.03), transparent)", backgroundSize: "200% 200%" }}
            />
            <div className="absolute top-8 left-1/4 h-16 w-16 rounded-2xl bg-foreground/[0.03] motion-safe:animate-float" />
            <div className="absolute top-16 right-1/4 h-12 w-12 rounded-full bg-foreground/[0.03] motion-safe:animate-float [animation-delay:1s]" />
            <div className="absolute bottom-12 left-1/3 h-10 w-10 rounded-xl bg-foreground/[0.03] motion-safe:animate-float [animation-delay:0.5s]" />
            <div className="absolute bottom-20 right-1/3 h-8 w-8 rounded-lg bg-foreground/[0.03] motion-safe:animate-float [animation-delay:1.5s]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-3xl bg-card shadow-apple-hover p-6 motion-safe:animate-scale-in">
                <activeFeature.icon className="h-10 w-10 text-foreground" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Integrations ─── */}
      <section id="integrations" className="relative py-24 overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(220 14% 97%) 0%, hsl(190 95% 39% / 0.03) 50%, hsl(220 14% 97%) 100%)" }}>
        {/* Color accent — soft blue, center-right */}
        <div className="absolute right-1/4 -bottom-16 h-[320px] w-[320px] rounded-full blur-[110px] opacity-[0.05] pointer-events-none" style={{ background: "#3b82f6" }} />
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight">Compatible avec votre site</h2>
            <p className="mt-3 text-muted-foreground">Un simple snippet JavaScript à copier-coller. Fonctionne sur tous les CMS et sites web.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {integrations.map((name, i) => (
              <ScrollReveal key={name} delay={i * 50}>
              <div className="inline-flex items-center gap-2 rounded-2xl bg-card shadow-apple px-5 py-3 text-sm font-medium text-muted-foreground transition-all duration-200 hover:shadow-apple-hover hover:-translate-y-0.5 hover:text-foreground">
                <BrandLogo name={name} className="h-4 w-4" showColor />
                {name}
              </div>
              </ScrollReveal>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/integrations" className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">
              Voir toutes les intégrations et les prochaines à venir →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section id="how" className="relative mx-auto max-w-6xl px-6 py-24 overflow-hidden">
        {/* Color accent — warm peach, right side */}
        <div className="absolute -right-20 top-20 h-[350px] w-[350px] rounded-full blur-[120px] opacity-[0.06] pointer-events-none" style={{ background: "#f97316" }} />
        {/* Color accent — soft lavender, bottom left */}
        <div className="absolute -left-32 bottom-0 h-[250px] w-[250px] rounded-full blur-[100px] opacity-[0.05] pointer-events-none" style={{ background: "#a78bfa" }} />

        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold tracking-tight">Comment ça marche</h2>
          <p className="mt-3 text-muted-foreground">Trois étapes pour un chatbot opérationnel.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { step: "1", title: "Importez vos données", desc: "Connectez votre site web, uploadez vos PDF ou synchronisez Notion. L'indexation est automatique.", icon: FileText },
            { step: "2", title: "Personnalisez votre agent", desc: "Choisissez le modèle IA, ajustez le ton, configurez les couleurs et le message d'accueil.", icon: Palette },
            { step: "3", title: "Déployez en un clic", desc: "Copiez une ligne de code sur votre site. Le widget est immédiatement actif.", icon: Send },
          ].map((s, i) => (
            <ScrollReveal key={s.step} delay={i * 120}>
            <div className="rounded-3xl bg-card shadow-apple p-8 text-center transition-all duration-200 hover:shadow-apple-hover hover:-translate-y-1 group">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background transition-transform duration-300 group-hover:scale-110">
                <s.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div className="mx-auto mt-3 flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                {s.step}
              </div>
              <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="relative py-24 overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(220 14% 97%) 0%, hsl(262 83% 58% / 0.02) 50%, hsl(220 14% 97%) 100%)" }}>
        {/* Color accent — soft rose, right */}
        <div className="absolute -right-24 top-1/3 h-[300px] w-[300px] rounded-full blur-[110px] opacity-[0.06] pointer-events-none" style={{ background: "#f43f5e" }} />
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight">Ce que disent nos clients</h2>
            <p className="mt-3 text-muted-foreground">Des entreprises qui ont transformé leur support client.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 100}>
              <div className="rounded-3xl bg-card shadow-apple p-8 transition-all duration-200 hover:shadow-apple-hover hover:-translate-y-0.5">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s: number) => (
                    <svg key={s} className="h-4 w-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.title}, {t.company}</p>
                  </div>
                </div>
              </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Security ─── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <ScrollReveal>
        <div className="rounded-3xl bg-card shadow-apple p-12 md:p-16 relative overflow-hidden">
          {/* Dot pattern background */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="relative">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold tracking-tight">Sécurité & Conformité</h2>
              <p className="mt-3 text-muted-foreground">Vos données sont protégées par les standards les plus exigeants.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { icon: Shield, title: "Chiffrement AES-256", desc: "Données chiffrées au repos et en transit (TLS 1.3). Isolation complète entre les organisations." },
                { icon: Lock, title: "RGPD Compliant", desc: "Hébergement européen disponible. Droit à l'effacement, DPA, et consentement cookie intégrés." },
                { icon: Eye, title: "Privacy-first", desc: "Vos données ne sont jamais utilisées pour entraîner d'autres IA. Opt-out data training par défaut." },
              ].map((s) => (
                <div key={s.title} className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60">
                    <s.icon className="h-6 w-6 text-foreground" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        </ScrollReveal>
      </section>

      {/* ─── Pricing ─── */}
      <section id="pricing" className="relative py-24 overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(220 14% 97%) 0%, hsl(224 76% 48% / 0.02) 50%, hsl(220 14% 97%) 100%)" }}>
        {/* Color accent — mint, left */}
        <div className="absolute -left-20 top-1/4 h-[280px] w-[280px] rounded-full blur-[100px] opacity-[0.06] pointer-events-none" style={{ background: "#34d399" }} />
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold tracking-tight">Tarifs simples et transparents</h2>
            <p className="mt-3 text-muted-foreground">Commencez gratuitement, évoluez selon vos besoins.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan, i) => (
              <ScrollReveal key={plan.name} delay={i * 100}>
              <div
                className={`rounded-3xl bg-card p-8 transition-all duration-200 ${
                  plan.popular
                    ? "ring-2 ring-foreground shadow-apple-hover scale-[1.02]"
                    : "shadow-apple hover:shadow-apple-hover hover:-translate-y-0.5"
                }`}
              >
                {plan.popular && (
                  <span className="inline-flex items-center rounded-full bg-foreground text-background px-3 py-1 text-xs font-medium mb-4">
                    Populaire
                  </span>
                )}
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="mt-3">
                  <span className="text-4xl font-light tracking-tight">{plan.price}€</span>
                  <span className="text-muted-foreground text-sm">/mois</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.credits} crédits/mois</p>
                <Link
                  href="/sign-up"
                  className={`mt-6 flex h-11 w-full items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98] ${
                    plan.popular
                      ? "bg-foreground text-background hover:bg-foreground/90"
                      : "border border-border bg-card hover:bg-muted"
                  }`}
                >
                  {plan.price === 0 ? "Commencer" : "Sélectionner"}
                </Link>
                <div className="mt-6 space-y-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Inclus :</p>
                  <p className="text-sm text-muted-foreground">{plan.agents} agent{Number(plan.agents) > 1 ? "s" : ""} &bull; {plan.sources} sources</p>
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" strokeWidth={2} />
                      <span className="text-sm text-muted-foreground">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              </ScrollReveal>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/tarifs" className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">
              Comparer tous les plans en détail →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold tracking-tight">Questions fréquentes</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <ScrollReveal key={faq.q} delay={i * 80}>
            <details className="group rounded-2xl bg-card shadow-apple">
              <summary className="flex cursor-pointer items-center justify-between p-6 text-sm font-medium [&::-webkit-details-marker]:hidden list-none">
                {faq.q}
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180" strokeWidth={1.5} />
              </summary>
              <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">
                {faq.a}
              </div>
            </details>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ─── CTA Final ─── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <ScrollReveal>
        <div
          className="rounded-3xl p-16 text-center text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #111 0%, #1a1a2e 50%, #16213e 100%)" }}
        >
          {/* Subtle dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          {/* Subtle gradient orbs */}
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full blur-[80px] opacity-20" style={{ background: "hsl(224 76% 48%)" }} />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full blur-[80px] opacity-15" style={{ background: "hsl(262 83% 58%)" }} />
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-tight">Prêt à transformer votre support client ?</h2>
            <p className="mt-4 text-white/60 max-w-xl mx-auto">
              Rejoignez les entreprises qui automatisent leur support avec HelloClaudia.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link href="/sign-up" className="inline-flex h-12 items-center rounded-2xl bg-white text-foreground px-7 text-sm font-medium hover:bg-white/90 transition-all duration-200 active:scale-[0.98] gap-2 shadow-lg">
                Commencer gratuitement <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </section>
    </>
  );
}
