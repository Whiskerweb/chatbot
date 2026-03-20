import {
  Bot, FileText, BarChart3, Palette, Plug, Shield,
  BrainCircuit, Globe, Zap, Lock, Eye, Code,
  MessageSquare, Search, RefreshCw, Database,
  Layers, Settings, PieChart, TrendingUp,
  Paintbrush, Smartphone, Users, Key,
  Webhook, Radio, Server, FileCode,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SubFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface Feature {
  slug: string;
  label: string;
  icon: LucideIcon;
  title: string;
  headline: string;
  description: string;
  features: string[];
  subFeatures: SubFeature[];
  useCases: string[];
  metaDescription: string;
}

export const features: Feature[] = [
  {
    slug: "agent-ia",
    label: "Agent IA",
    icon: Bot,
    title: "Agent IA",
    headline: "Un agent IA entraîné sur vos données",
    description:
      "Votre chatbot comprend le contexte, répond avec précision et cite ses sources. Mode strict anti-hallucination inclus.",
    features: [
      "Réponses basées uniquement sur votre documentation",
      "Citations automatiques des sources",
      "IA avancée propulsée par Claudia",
      "Personnalisation du ton et du comportement",
      "Escalade vers un humain si nécessaire",
    ],
    subFeatures: [
      {
        icon: BrainCircuit,
        title: "Mode strict anti-hallucination",
        description:
          "L'agent ne répond qu'à partir de vos données indexées. S'il ne trouve pas la réponse, il le dit clairement et propose une escalade vers votre équipe.",
      },
      {
        icon: MessageSquare,
        title: "Intelligence artificielle",
        description:
          "Une IA de pointe qui s'adapte à vos besoins : rapide, précise et contextuelle. Changez la créativité à tout moment.",
      },
      {
        icon: Settings,
        title: "Personnalité configurable",
        description:
          "Ajustez le ton (formel, décontracté, technique), la langue de réponse, le niveau de détail et les instructions spécifiques via le prompt système.",
      },
      {
        icon: Users,
        title: "Escalade intelligente",
        description:
          "Quand l'agent atteint ses limites, il transfère la conversation à votre équipe avec tout le contexte. Configurable par règles ou manuellement.",
      },
    ],
    useCases: ["support-client", "onboarding", "ventes"],
    metaDescription:
      "Déployez un agent IA entraîné sur votre documentation. Réponses précises, citations des sources, mode anti-hallucination. Propulsé par Claudia.",
  },
  {
    slug: "sources-rag",
    label: "Sources & RAG",
    icon: FileText,
    title: "Sources & RAG",
    headline: "Importez n'importe quelle source de données",
    description:
      "Sites web, PDF, Notion, Google Drive — tout est indexé automatiquement avec notre pipeline RAG optimisé.",
    features: [
      "Crawling automatique de sites web",
      "Upload PDF, DOCX, TXT, Markdown, CSV",
      "Connecteurs Notion & Google Drive",
      "Re-indexation et sync automatique",
      "Chunking intelligent avec overlap",
    ],
    subFeatures: [
      {
        icon: Globe,
        title: "Crawling automatique",
        description:
          "Entrez l'URL de votre site et Claudia crawle toutes les pages automatiquement. Le contenu est extrait, nettoyé et indexé en quelques minutes.",
      },
      {
        icon: Database,
        title: "Pipeline RAG optimisé",
        description:
          "Chunking intelligent avec overlap, embeddings vectoriels, et reranking pour des réponses précises. Chaque réponse cite ses sources exactes.",
      },
      {
        icon: RefreshCw,
        title: "Sync automatique",
        description:
          "Vos sources sont re-indexées automatiquement selon votre plan : hebdomadaire (Starter), quotidien (Pro) ou 4x/jour (Growth). Toujours à jour.",
      },
      {
        icon: Layers,
        title: "Multi-formats",
        description:
          "PDF, DOCX, TXT, Markdown, CSV, pages Notion, Google Drive, SharePoint, Confluence. Importez tout votre savoir d'entreprise en quelques clics.",
      },
    ],
    useCases: ["base-connaissances", "support-client", "onboarding"],
    metaDescription:
      "Indexez automatiquement vos sites web, PDF, Notion et Google Drive. Pipeline RAG optimisé avec chunking intelligent et sync automatique.",
  },
  {
    slug: "analytics",
    label: "Analytics",
    icon: BarChart3,
    title: "Analytics",
    headline: "Dashboard complet pour piloter la performance",
    description:
      "Visualisez les questions fréquentes, identifiez les gaps documentaires et mesurez le ROI de votre chatbot.",
    features: [
      "Top questions et tendances",
      "Détection des gaps documentaires",
      "Taux de déflection en temps réel",
      "Consommation de crédits détaillée",
      "Suggestions IA d'amélioration",
    ],
    subFeatures: [
      {
        icon: TrendingUp,
        title: "Métriques en temps réel",
        description:
          "Conversations, messages, taux de déflection, leads capturés — suivez vos KPIs clés en temps réel avec des graphiques interactifs.",
      },
      {
        icon: Search,
        title: "Détection des gaps",
        description:
          "Claudia identifie automatiquement les questions auxquelles elle ne peut pas répondre. Vous savez exactement quoi ajouter à votre documentation.",
      },
      {
        icon: PieChart,
        title: "Consommation transparente",
        description:
          "Visualisez votre consommation de crédits par agent et par jour. Pas de surprises, pas de coûts cachés.",
      },
      {
        icon: Zap,
        title: "Suggestions IA",
        description:
          "Des recommandations automatiques pour améliorer les performances : contenus manquants, questions fréquentes sans réponse, optimisations possibles.",
      },
    ],
    useCases: ["support-client", "generation-leads", "base-connaissances"],
    metaDescription:
      "Pilotez la performance de votre chatbot IA. Dashboard analytics, détection des gaps documentaires, taux de déflection et suggestions d'amélioration.",
  },
  {
    slug: "widget",
    label: "Widget",
    icon: Palette,
    title: "Widget personnalisable",
    headline: "Un widget élégant, intégré en 1 minute",
    description:
      "Personnalisez les couleurs, le message d'accueil et les questions suggérées. Déployez avec une seule ligne de code.",
    features: [
      "Intégration en 1 ligne de JavaScript",
      "Personnalisation complète (couleurs, logo, messages)",
      "Responsive et accessible",
      "Capture de leads intégrée",
      "Domaine personnalisé (Growth)",
      "Compatible CSP et iframe",
    ],
    subFeatures: [
      {
        icon: Paintbrush,
        title: "Personnalisation visuelle",
        description:
          "Couleurs, logo, avatar, position, message d'accueil, questions suggérées — faites du widget une extension naturelle de votre marque.",
      },
      {
        icon: Smartphone,
        title: "Responsive & accessible",
        description:
          "Le widget s'adapte à tous les écrans, du desktop au mobile. Conforme WCAG 2.1 pour une accessibilité optimale.",
      },
      {
        icon: Users,
        title: "Capture de leads",
        description:
          "Formulaire de capture intégré avec champs personnalisables (email, nom, téléphone). Les leads sont stockés et exportables.",
      },
      {
        icon: Code,
        title: "Intégration simple",
        description:
          "Une seule ligne de JavaScript à copier-coller. Compatible avec tous les CMS : WordPress, Shopify, Webflow, Wix et plus encore.",
      },
      {
        icon: Globe,
        title: "Domaine personnalisé",
        description:
          "Connectez votre propre sous-domaine (claudia.votresite.com) pour un accès direct et professionnel. Disponible sur le plan Growth.",
      },
    ],
    useCases: ["support-client", "generation-leads", "ventes"],
    metaDescription:
      "Widget chatbot personnalisable intégré en 1 minute. Couleurs, logo, messages, capture de leads. Compatible WordPress, Shopify, Webflow.",
  },
  {
    slug: "api-integrations",
    label: "API & Intégrations",
    icon: Plug,
    title: "API & Intégrations",
    headline: "API REST complète et intégrations natives",
    description:
      "Intégrez Claudia dans vos outils existants via notre API REST ou nos connecteurs natifs.",
    features: [
      "API REST documentée",
      "Webhooks pour les événements",
      "Streaming SSE en temps réel",
      "BYOK (vos propres clés API)",
      "Serveur MCP (plans Pro+)",
    ],
    subFeatures: [
      {
        icon: FileCode,
        title: "API REST complète",
        description:
          "Endpoints pour le chat, la gestion d'agents, l'upload de sources et la récupération d'analytics. Documentation OpenAPI incluse.",
      },
      {
        icon: Webhook,
        title: "Webhooks & événements",
        description:
          "Recevez des notifications en temps réel pour chaque conversation, message, lead capturé ou escalade. Intégrez avec vos workflows existants.",
      },
      {
        icon: Radio,
        title: "Streaming SSE",
        description:
          "Réponses en streaming via Server-Sent Events pour une expérience de chat fluide. Idéal pour les intégrations front-end custom.",
      },
      {
        icon: Key,
        title: "BYOK — Bring Your Own Keys",
        description:
          "Utilisez vos propres clés API OpenAI, Anthropic ou Google. Vos messages ne consomment plus de crédits Claudia. Disponible dès le plan Pro.",
      },
    ],
    useCases: ["base-connaissances", "support-client", "ventes"],
    metaDescription:
      "API REST complète, webhooks, streaming SSE et BYOK. Intégrez Claudia dans vos outils avec notre API documentée et nos connecteurs natifs.",
  },
  {
    slug: "securite",
    label: "Sécurité",
    icon: Shield,
    title: "Sécurité & Conformité",
    headline: "Vos données sont en sécurité",
    description:
      "Chiffrement AES-256, conformité RGPD et privacy-first. Vos données ne sont jamais utilisées pour entraîner d'autres IA.",
    features: [
      "Chiffrement AES-256 au repos",
      "TLS 1.3 en transit",
      "Conformité RGPD native",
      "Isolation multi-tenant",
      "Opt-out data training par défaut",
    ],
    subFeatures: [
      {
        icon: Lock,
        title: "Chiffrement de bout en bout",
        description:
          "Données chiffrées AES-256 au repos et TLS 1.3 en transit. Chaque organisation est isolée avec des clés distinctes.",
      },
      {
        icon: Shield,
        title: "RGPD natif",
        description:
          "Droit à l'effacement, DPA disponible, consentement cookie intégré, hébergement européen disponible. Conforme dès le premier jour.",
      },
      {
        icon: Eye,
        title: "Privacy-first",
        description:
          "Vos données ne sont jamais utilisées pour entraîner d'autres IA. Opt-out data training activé par défaut. Transparence totale.",
      },
      {
        icon: Server,
        title: "Infrastructure sécurisée",
        description:
          "Hébergement sur infrastructure cloud de niveau entreprise. Sauvegardes automatiques, monitoring 24/7, et plan de reprise d'activité.",
      },
    ],
    useCases: ["support-client", "base-connaissances"],
    metaDescription:
      "Sécurité entreprise pour votre chatbot IA. Chiffrement AES-256, conformité RGPD, privacy-first. Vos données ne servent jamais à entraîner d'autres IA.",
  },
];
