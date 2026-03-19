import Link from "next/link";
import {
  MessageSquare, FileText, BarChart3, Code, Shield, Zap,
  ArrowRight, Check, ChevronDown,
} from "lucide-react";

const features = [
  { icon: MessageSquare, title: "Conversations naturelles", desc: "IA conversationnelle qui comprend le contexte et répond avec précision à partir de vos documents." },
  { icon: FileText, title: "Sources multiples", desc: "Importez sites web, PDF, documents Word, Notion et plus. Indexation automatique." },
  { icon: BarChart3, title: "Analytics avancés", desc: "Dashboard complet : questions fréquentes, gaps documentaires, taux de déflection." },
  { icon: Code, title: "Déploiement en un clic", desc: "Une ligne de code pour intégrer le widget sur votre site. API REST disponible." },
  { icon: Shield, title: "Sécurité & confidentialité", desc: "Chiffrement AES-256, données hébergées en Europe, conformité RGPD." },
  { icon: Zap, title: "Réponses instantanées", desc: "Temps de réponse moyen inférieur à 2 secondes grâce à notre pipeline RAG optimisé." },
];

const plans = [
  { name: "Free", price: 0, credits: "100", agents: "1", sources: "30", features: ["Modèles rapides (GPT-4o Mini, Haiku)", "Dashboard basique", "Support communauté", "Rétention 7 jours"] },
  { name: "Starter", price: 29, credits: "3 000", agents: "3", sources: "500", features: ["Tous modèles standards", "Live chat", "Sync hebdomadaire", "API REST", "Support email 48h"] },
  { name: "Pro", price: 79, credits: "15 000", agents: "10", sources: "5 000", popular: true, features: ["Tous modèles IA + BYOK", "Sync quotidien", "API + MCP", "5 membres", "Support chat 24h"] },
  { name: "Growth", price: 199, credits: "50 000", agents: "25", sources: "15 000", features: ["White-label inclus", "Sync 4x/jour", "15 membres", "Rétention 1 an", "Support prioritaire"] },
];

const faqs = [
  { q: "Qu'est-ce qu'un crédit ?", a: "Un crédit correspond à une unité de consommation. Chaque message IA consomme 1 à 5 crédits selon le modèle choisi. L'indexation de documents consomme également des crédits. Votre consommation est visible en temps réel dans le dashboard." },
  { q: "Puis-je changer de plan à tout moment ?", a: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Le changement est effectif immédiatement et le montant est calculé au prorata." },
  { q: "Quelles sources de données sont supportées ?", a: "Sites web (crawling automatique), fichiers PDF, DOCX, TXT, Markdown, CSV, pages Notion et Google Drive. D'autres connecteurs arrivent bientôt." },
  { q: "Puis-je utiliser mes propres clés API ?", a: "Oui, à partir du plan Pro. Vous pouvez configurer vos clés OpenAI, Anthropic ou Google AI dans les paramètres. Vos messages ne consomment alors pas de crédits." },
  { q: "Mes données sont-elles sécurisées ?", a: "Absolument. Chiffrement AES-256 au repos et TLS 1.3 en transit. Vos données ne sont jamais utilisées pour entraîner des modèles IA. Hébergement européen disponible." },
  { q: "Le white-label est-il disponible ?", a: "Oui, à partir du plan Growth. Vous pouvez personnaliser entièrement le widget avec votre marque, couleurs et domaine personnalisé." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">ChatBot AI</Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Fonctionnalités</Link>
            <Link href="#how" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Comment ça marche</Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Tarifs</Link>
            <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Connexion</Link>
            <Link href="/sign-up" className="inline-flex h-9 items-center rounded-xl bg-foreground px-4 text-sm font-medium text-background hover:bg-foreground/90 transition-all duration-200 active:scale-[0.98]">
              Commencer
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center rounded-full border border-border/60 bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-xs mb-8">
          Propulsé par les derniers modèles d&apos;IA
        </div>
        <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Votre chatbot IA,
          <br />
          <span className="text-muted-foreground">prêt en 10 minutes</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Entraînez un chatbot sur votre documentation et déployez-le sur votre site.
          Dashboard complet, analytics en temps réel, et un système de crédits transparent.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/sign-up" className="inline-flex h-12 items-center rounded-2xl bg-foreground px-7 text-sm font-medium text-background hover:bg-foreground/90 transition-all duration-200 active:scale-[0.98] gap-2">
            Démarrer gratuitement <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="#how" className="inline-flex h-12 items-center rounded-2xl border border-border bg-card px-7 text-sm font-medium hover:bg-muted transition-all duration-200">
            Voir la démo
          </Link>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">100 crédits gratuits &bull; Aucune carte bancaire requise</p>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold tracking-tight">Tout ce dont vous avez besoin</h2>
          <p className="mt-3 text-muted-foreground">Une plateforme complète pour déployer et gérer vos chatbots IA.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-3xl bg-card shadow-apple p-8 transition-all duration-200 hover:shadow-apple-hover hover:-translate-y-0.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60">
                <f.icon className="h-6 w-6 text-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="mt-5 text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold tracking-tight">Comment ça marche</h2>
          <p className="mt-3 text-muted-foreground">Trois étapes pour un chatbot opérationnel.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { step: "1", title: "Importez vos données", desc: "Connectez votre site web, uploadez vos PDF ou synchronisez Notion. L'indexation est automatique." },
            { step: "2", title: "Personnalisez votre agent", desc: "Choisissez le modèle IA, ajustez le ton, configurez les couleurs et le message d'accueil." },
            { step: "3", title: "Déployez en un clic", desc: "Copiez une ligne de code sur votre site. Le widget est immédiatement actif et prêt à répondre." },
          ].map((s) => (
            <div key={s.step} className="rounded-3xl bg-card shadow-apple p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background text-lg font-semibold">
                {s.step}
              </div>
              <h3 className="mt-5 text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold tracking-tight">Tarifs simples et transparents</h2>
          <p className="mt-3 text-muted-foreground">Commencez gratuitement, évoluez selon vos besoins.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
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
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold tracking-tight">Questions fréquentes</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <details key={faq.q} className="group rounded-2xl bg-card shadow-apple">
              <summary className="flex cursor-pointer items-center justify-between p-6 text-sm font-medium [&::-webkit-details-marker]:hidden list-none">
                {faq.q}
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180" strokeWidth={1.5} />
              </summary>
              <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="rounded-3xl bg-foreground p-16 text-center text-background">
          <h2 className="text-3xl font-semibold tracking-tight">Prêt à transformer votre support client ?</h2>
          <p className="mt-4 text-background/60 max-w-xl mx-auto">
            Rejoignez les entreprises qui automatisent leur support avec un chatbot IA personnalisé.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/sign-up" className="inline-flex h-12 items-center rounded-2xl bg-background text-foreground px-7 text-sm font-medium hover:bg-background/90 transition-all duration-200 active:scale-[0.98] gap-2">
              Commencer gratuitement <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <p className="text-lg font-semibold tracking-tight">ChatBot AI</p>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                La plateforme de chatbot IA la plus simple pour les entreprises.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-4">Produit</p>
              <div className="space-y-3">
                <Link href="#features" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Fonctionnalités</Link>
                <Link href="#pricing" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Tarifs</Link>
                <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Documentation</Link>
                <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">API</Link>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-4">Ressources</p>
              <div className="space-y-3">
                <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
                <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Guides</Link>
                <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Changelog</Link>
                <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Status</Link>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-4">Légal</p>
              <div className="space-y-3">
                <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Confidentialité</Link>
                <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">CGU</Link>
                <Link href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">RGPD</Link>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ChatBot AI. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
