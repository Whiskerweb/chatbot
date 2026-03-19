import Link from "next/link";
import {
  Bot,
  MessageSquare,
  Zap,
  Shield,
  BarChart3,
  Globe,
  Upload,
  Settings,
  Rocket,
  Check,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Code,
  Headphones,
  Palette,
  Key,
  Users,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">
      {/* ───────────── HEADER / NAV ───────────── */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1A56DB]">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Chat<span className="text-[#1A56DB]">Bot</span> AI
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm font-medium text-gray-600 transition hover:text-[#1A56DB]">
              Fonctionnalités
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-gray-600 transition hover:text-[#1A56DB]">
              Comment ça marche
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-gray-600 transition hover:text-[#1A56DB]">
              Tarifs
            </Link>
            <Link href="#faq" className="text-sm font-medium text-gray-600 transition hover:text-[#1A56DB]">
              FAQ
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="hidden rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 sm:inline-flex"
            >
              Connexion
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1A56DB] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-[#1648c0]"
            >
              Commencer gratuitement
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ───────────── HERO ───────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[#1A56DB]/5 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 top-20 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-20 text-center sm:pt-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-[#1A56DB]">
            <Sparkles className="h-4 w-4" />
            Propulsé par les derniers modèles d&apos;IA
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Créez votre chatbot IA
            <br />
            <span className="bg-gradient-to-r from-[#1A56DB] to-indigo-500 bg-clip-text text-transparent">
              en quelques minutes
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl">
            Entraînez un assistant intelligent sur vos données, déployez-le sur votre site et
            offrez à vos visiteurs une expérience conversationnelle exceptionnelle. Sans code, sans
            complexité.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-xl bg-[#1A56DB] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-[#1648c0] hover:shadow-xl hover:shadow-blue-500/30"
            >
              <Rocket className="h-5 w-5" />
              Démarrer gratuitement
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
            >
              Voir comment ça marche
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            Gratuit pour commencer &middot; Aucune carte bancaire requise
          </p>
        </div>
      </section>

      {/* ───────────── FEATURES ───────────── */}
      <section id="features" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#1A56DB]">
              Fonctionnalités
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Tout ce dont vous avez besoin pour un chatbot performant
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Une plateforme complète pour créer, entraîner et déployer des agents
              conversationnels alimentés par l&apos;IA.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 transition hover:border-[#1A56DB]/30 hover:shadow-lg hover:shadow-blue-500/5">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#1A56DB] transition group-hover:bg-[#1A56DB] group-hover:text-white">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">Conversations naturelles</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Des réponses contextuelles et précises grâce aux modèles de langage les plus
                avancés du marché. Vos utilisateurs bénéficient d&apos;une expérience fluide et
                humaine.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 transition hover:border-[#1A56DB]/30 hover:shadow-lg hover:shadow-blue-500/5">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#1A56DB] transition group-hover:bg-[#1A56DB] group-hover:text-white">
                <Upload className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">Sources multiples</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Importez vos données depuis des sites web, fichiers PDF, documents Word, bases de
                connaissances et bien plus. Votre chatbot apprend de tout votre contenu.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 transition hover:border-[#1A56DB]/30 hover:shadow-lg hover:shadow-blue-500/5">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#1A56DB] transition group-hover:bg-[#1A56DB] group-hover:text-white">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">Analytics avancées</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Dashboard complet avec statistiques en temps réel : conversations, satisfaction,
                questions fréquentes et tendances d&apos;usage pour optimiser votre chatbot.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 transition hover:border-[#1A56DB]/30 hover:shadow-lg hover:shadow-blue-500/5">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#1A56DB] transition group-hover:bg-[#1A56DB] group-hover:text-white">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">Déploiement en un clic</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Intégrez votre chatbot sur n&apos;importe quel site web avec un simple snippet de
                code. Compatible avec tous les CMS et frameworks modernes.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 transition hover:border-[#1A56DB]/30 hover:shadow-lg hover:shadow-blue-500/5">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#1A56DB] transition group-hover:bg-[#1A56DB] group-hover:text-white">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">Sécurité & confidentialité</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Vos données sont chiffrées et protégées. Conformité RGPD, hébergement européen
                disponible, et contrôle total sur vos informations sensibles.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 transition hover:border-[#1A56DB]/30 hover:shadow-lg hover:shadow-blue-500/5">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#1A56DB] transition group-hover:bg-[#1A56DB] group-hover:text-white">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">Réponses instantanées</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Temps de réponse ultra-rapide grâce à notre infrastructure optimisée. Votre chatbot
                est disponible 24h/24 et gère des milliers de conversations simultanées.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── HOW IT WORKS ───────────── */}
      <section id="how-it-works" className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#1A56DB]">
              Simple &amp; rapide
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Trois étapes pour lancer votre chatbot
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Pas besoin de coder. Configurez et déployez votre agent en quelques minutes.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="relative rounded-2xl bg-white p-8 shadow-sm">
              <div className="absolute -top-5 left-8 flex h-10 w-10 items-center justify-center rounded-full bg-[#1A56DB] text-lg font-bold text-white shadow-lg shadow-blue-500/30">
                1
              </div>
              <div className="mt-4">
                <Upload className="mb-4 h-8 w-8 text-[#1A56DB]" />
                <h3 className="text-xl font-semibold">Importez vos données</h3>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  Ajoutez vos sources : pages web, fichiers PDF, documents, FAQ... Notre système
                  indexe et structure automatiquement votre contenu.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-2xl bg-white p-8 shadow-sm">
              <div className="absolute -top-5 left-8 flex h-10 w-10 items-center justify-center rounded-full bg-[#1A56DB] text-lg font-bold text-white shadow-lg shadow-blue-500/30">
                2
              </div>
              <div className="mt-4">
                <Settings className="mb-4 h-8 w-8 text-[#1A56DB]" />
                <h3 className="text-xl font-semibold">Personnalisez votre agent</h3>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  Configurez le ton, l&apos;apparence et le comportement de votre chatbot.
                  Choisissez le modèle IA qui correspond le mieux à vos besoins.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-2xl bg-white p-8 shadow-sm">
              <div className="absolute -top-5 left-8 flex h-10 w-10 items-center justify-center rounded-full bg-[#1A56DB] text-lg font-bold text-white shadow-lg shadow-blue-500/30">
                3
              </div>
              <div className="mt-4">
                <Rocket className="mb-4 h-8 w-8 text-[#1A56DB]" />
                <h3 className="text-xl font-semibold">Déployez en un clic</h3>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  Copiez un simple snippet de code sur votre site et votre chatbot est en ligne.
                  Suivez ses performances depuis votre dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── PRICING ───────────── */}
      <section id="pricing" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#1A56DB]">
              Tarifs
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Un plan pour chaque ambition
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Commencez gratuitement et évoluez à votre rythme. Tous les plans incluent les mises à
              jour et le support.
            </p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-4">
            {/* ── Free ── */}
            <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Free</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">0&euro;</span>
                  <span className="text-sm text-gray-500">/mois</span>
                </div>
                <p className="mt-3 text-sm text-gray-600">
                  Idéal pour découvrir la plateforme et tester votre premier chatbot.
                </p>
              </div>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1A56DB]" />
                  100 crédits / mois
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1A56DB]" />
                  1 agent
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1A56DB]" />
                  30 sources
                </li>
              </ul>
              <Link
                href="/sign-up"
                className="mt-8 block rounded-lg border border-gray-300 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Commencer gratuitement
              </Link>
            </div>

            {/* ── Starter ── */}
            <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Starter</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">29&euro;</span>
                  <span className="text-sm text-gray-500">/mois</span>
                </div>
                <p className="mt-3 text-sm text-gray-600">
                  Pour les indépendants et petits projets qui veulent aller plus loin.
                </p>
              </div>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1A56DB]" />
                  3 000 crédits / mois
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1A56DB]" />
                  3 agents
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1A56DB]" />
                  500 sources
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1A56DB]" />
                  Live chat
                </li>
              </ul>
              <Link
                href="/sign-up"
                className="mt-8 block rounded-lg border border-gray-300 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Choisir Starter
              </Link>
            </div>

            {/* ── Pro (Populaire) ── */}
            <div className="relative flex flex-col rounded-2xl border-2 border-[#1A56DB] bg-blue-50/40 p-6 shadow-lg shadow-blue-500/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#1A56DB] px-4 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Populaire
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Pro</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[#1A56DB]">79&euro;</span>
                  <span className="text-sm text-gray-500">/mois</span>
                </div>
                <p className="mt-3 text-sm text-gray-600">
                  Le choix idéal pour les entreprises en croissance qui veulent le meilleur de
                  l&apos;IA.
                </p>
              </div>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1A56DB]" />
                  15 000 crédits / mois
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1A56DB]" />
                  10 agents
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1A56DB]" />
                  5 000 sources
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1A56DB]" />
                  Tous les modèles IA
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1A56DB]" />
                  Bring Your Own Key (BYOK)
                </li>
              </ul>
              <Link
                href="/sign-up"
                className="mt-8 block rounded-lg bg-[#1A56DB] py-3 text-center text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-[#1648c0]"
              >
                Choisir Pro
              </Link>
            </div>

            {/* ── Growth ── */}
            <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Growth</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">199&euro;</span>
                  <span className="text-sm text-gray-500">/mois</span>
                </div>
                <p className="mt-3 text-sm text-gray-600">
                  Pour les équipes qui veulent scaler avec du white-label et plus de puissance.
                </p>
              </div>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1A56DB]" />
                  50 000 crédits / mois
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1A56DB]" />
                  25 agents
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1A56DB]" />
                  15 000 sources
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1A56DB]" />
                  White-label inclus
                </li>
              </ul>
              <Link
                href="/sign-up"
                className="mt-8 block rounded-lg border border-gray-300 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Choisir Growth
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ───────────── FAQ ───────────── */}
      <section id="faq" className="bg-gray-50 py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#1A56DB]">FAQ</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Questions fréquentes
            </h2>
          </div>

          <div className="mt-12 divide-y divide-gray-200">
            {/* Q1 */}
            <details className="group py-6">
              <summary className="flex cursor-pointer items-center justify-between text-lg font-medium text-gray-900">
                Qu&apos;est-ce qu&apos;un crédit ?
                <ChevronDown className="h-5 w-5 text-gray-500 transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Un crédit correspond à un message envoyé par un utilisateur à votre chatbot. Chaque
                réponse générée par l&apos;IA consomme un ou plusieurs crédits selon le modèle
                utilisé et la longueur de la réponse.
              </p>
            </details>

            {/* Q2 */}
            <details className="group py-6">
              <summary className="flex cursor-pointer items-center justify-between text-lg font-medium text-gray-900">
                Puis-je changer de plan à tout moment ?
                <ChevronDown className="h-5 w-5 text-gray-500 transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Oui, vous pouvez passer à un plan supérieur ou inférieur à tout moment. Le
                changement prend effet immédiatement et la facturation est ajustée au prorata.
              </p>
            </details>

            {/* Q3 */}
            <details className="group py-6">
              <summary className="flex cursor-pointer items-center justify-between text-lg font-medium text-gray-900">
                Quels types de sources puis-je utiliser ?
                <ChevronDown className="h-5 w-5 text-gray-500 transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Vous pouvez importer des pages web (crawling automatique), des fichiers PDF, des
                documents Word, des fichiers texte, et même du contenu brut. D&apos;autres
                intégrations comme Notion et Google Drive sont en cours de développement.
              </p>
            </details>

            {/* Q4 */}
            <details className="group py-6">
              <summary className="flex cursor-pointer items-center justify-between text-lg font-medium text-gray-900">
                Qu&apos;est-ce que le BYOK (Bring Your Own Key) ?
                <ChevronDown className="h-5 w-5 text-gray-500 transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Le BYOK vous permet d&apos;utiliser votre propre clé API OpenAI, Anthropic ou autre
                fournisseur. Cela vous donne un contrôle total sur vos coûts d&apos;IA et ne
                consomme pas vos crédits de la plateforme.
              </p>
            </details>

            {/* Q5 */}
            <details className="group py-6">
              <summary className="flex cursor-pointer items-center justify-between text-lg font-medium text-gray-900">
                Mes données sont-elles sécurisées ?
                <ChevronDown className="h-5 w-5 text-gray-500 transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Absolument. Toutes les données sont chiffrées en transit et au repos. Nous sommes
                conformes au RGPD et ne partageons jamais vos données avec des tiers. Vous pouvez
                supprimer toutes vos données à tout moment.
              </p>
            </details>

            {/* Q6 */}
            <details className="group py-6">
              <summary className="flex cursor-pointer items-center justify-between text-lg font-medium text-gray-900">
                Le white-label, c&apos;est quoi exactement ?
                <ChevronDown className="h-5 w-5 text-gray-500 transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Le white-label vous permet de personnaliser entièrement l&apos;apparence du chatbot
                avec votre propre branding : logo, couleurs, domaine personnalisé. Aucune mention de
                notre marque n&apos;apparaît auprès de vos utilisateurs.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* ───────────── CTA FINAL ───────────── */}
      <section className="relative overflow-hidden bg-[#1A56DB] py-24">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#1A56DB] via-blue-600 to-indigo-700" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Prêt à transformer votre support client ?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-blue-100">
            Rejoignez des centaines d&apos;entreprises qui utilisent ChatBot AI pour offrir une
            expérience client exceptionnelle, 24h/24.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-[#1A56DB] shadow-lg transition hover:bg-blue-50"
            >
              <Rocket className="h-5 w-5" />
              Démarrer gratuitement
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Voir les tarifs
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <p className="mt-6 text-sm text-blue-200">
            Aucune carte bancaire requise &middot; Configuration en 5 minutes
          </p>
        </div>
      </section>

      {/* ───────────── FOOTER ───────────── */}
      <footer className="border-t border-gray-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A56DB]">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold">
                  Chat<span className="text-[#1A56DB]">Bot</span> AI
                </span>
              </Link>
              <p className="mt-4 text-sm text-gray-500 leading-relaxed">
                La plateforme tout-en-un pour créer des chatbots IA intelligents et les déployer sur
                votre site web.
              </p>
            </div>

            {/* Produit */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
                Produit
              </h4>
              <ul className="mt-4 space-y-3 text-sm text-gray-600">
                <li>
                  <Link href="#features" className="transition hover:text-[#1A56DB]">
                    Fonctionnalités
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="transition hover:text-[#1A56DB]">
                    Tarifs
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="transition hover:text-[#1A56DB]">
                    Comment ça marche
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="transition hover:text-[#1A56DB]">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Ressources */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
                Ressources
              </h4>
              <ul className="mt-4 space-y-3 text-sm text-gray-600">
                <li>
                  <Link href="/docs" className="transition hover:text-[#1A56DB]">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="transition hover:text-[#1A56DB]">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/changelog" className="transition hover:text-[#1A56DB]">
                    Changelog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="transition hover:text-[#1A56DB]">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Légal */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
                Légal
              </h4>
              <ul className="mt-4 space-y-3 text-sm text-gray-600">
                <li>
                  <Link href="/privacy" className="transition hover:text-[#1A56DB]">
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="transition hover:text-[#1A56DB]">
                    Conditions d&apos;utilisation
                  </Link>
                </li>
                <li>
                  <Link href="/legal" className="transition hover:text-[#1A56DB]">
                    Mentions légales
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ChatBot AI. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
