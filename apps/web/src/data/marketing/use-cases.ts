import {
  Headphones, Target, Compass, BookOpen, ShoppingBag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface UseCaseStep {
  title: string;
  description: string;
}

export interface UseCaseMetric {
  label: string;
  before: string;
  after: string;
}

export interface UseCase {
  slug: string;
  icon: LucideIcon;
  title: string;
  shortTitle: string;
  headline: string;
  description: string;
  problem: string;
  solution: string;
  metrics: UseCaseMetric[];
  steps: UseCaseStep[];
  metaDescription: string;
}

export const useCases: UseCase[] = [
  {
    slug: "support-client",
    icon: Headphones,
    title: "Automatiser le support client",
    shortTitle: "Support client",
    headline: "Résolvez 70% des demandes automatiquement",
    description:
      "HelloClaudia prend en charge les questions récurrentes et ne sollicite votre équipe que pour les cas complexes.",
    problem:
      "Votre équipe support passe 70% de son temps à répondre aux mêmes questions. Les clients attendent des heures pour des réponses simples. Les pics d'activité créent des backlogs impossibles à gérer.",
    solution:
      "HelloClaudia répond instantanément aux questions fréquentes en s'appuyant sur votre documentation. Elle cite ses sources, propose des articles pertinents et escalade intelligemment vers un humain quand nécessaire. Résultat : votre équipe se concentre sur les cas à haute valeur ajoutée.",
    metrics: [
      { label: "Temps de première réponse", before: "4 heures", after: "< 5 secondes" },
      { label: "Taux de déflection", before: "15%", after: "72%" },
      { label: "Satisfaction client (CSAT)", before: "3.2/5", after: "4.6/5" },
      { label: "Coût par interaction", before: "8,50 €", after: "0,12 €" },
    ],
    steps: [
      {
        title: "Importez votre documentation",
        description: "Connectez votre site d'aide, uploadez vos FAQ, ou synchronisez Notion / Google Drive. HelloClaudia indexe tout en quelques minutes.",
      },
      {
        title: "Configurez les règles d'escalade",
        description: "Définissez quand HelloClaudia doit transférer à un humain : sujets sensibles, demandes de remboursement, ou quand elle n'a pas la réponse.",
      },
      {
        title: "Déployez et itérez",
        description: "Intégrez le widget en une ligne de code. Utilisez les analytics pour identifier les gaps et améliorer continuellement les réponses.",
      },
    ],
    metaDescription:
      "Automatisez 70% de votre support client avec un chatbot IA. Réponse en <5s, citations des sources, escalade intelligente. Déployé en 10 minutes.",
  },
  {
    slug: "generation-leads",
    icon: Target,
    title: "Qualifier et capturer des leads",
    shortTitle: "Génération de leads",
    headline: "Transformez vos visiteurs en leads qualifiés",
    description:
      "HelloClaudia engage vos visiteurs, répond à leurs questions et capture leurs informations au bon moment.",
    problem:
      "90% de vos visiteurs quittent votre site sans laisser de coordonnées. Les formulaires de contact ont un taux de conversion de 2%. Votre équipe commerciale perd du temps avec des leads non qualifiés.",
    solution:
      "HelloClaudia engage naturellement la conversation, répond aux questions produit avec précision, et propose le formulaire de capture au moment optimal — quand le visiteur est convaincu. Les leads arrivent pré-qualifiés avec tout le contexte de la conversation.",
    metrics: [
      { label: "Taux de conversion visiteur→lead", before: "2%", after: "8%" },
      { label: "Leads qualifiés / mois", before: "45", after: "180" },
      { label: "Coût d'acquisition lead", before: "85 €", after: "22 €" },
      { label: "Temps de qualification", before: "30 min", after: "Instantané" },
    ],
    steps: [
      {
        title: "Importez votre documentation produit",
        description: "HelloClaudia doit connaître votre offre pour convaincre. Importez vos pages produit, tarifs, cas clients et FAQ commerciale.",
      },
      {
        title: "Configurez le formulaire de capture",
        description: "Choisissez les champs (email, nom, entreprise, budget) et le moment où le formulaire apparaît : après N messages, sur intention d'achat, etc.",
      },
      {
        title: "Connectez votre CRM",
        description: "Via Zapier ou l'API, envoyez automatiquement les leads qualifiés vers HubSpot, Salesforce ou votre outil de vente avec le contexte complet.",
      },
    ],
    metaDescription:
      "Générez 4x plus de leads qualifiés avec un chatbot IA. Engagement conversationnel, capture au bon moment, synchronisation CRM automatique.",
  },
  {
    slug: "onboarding",
    icon: Compass,
    title: "Guider l'onboarding utilisateur",
    shortTitle: "Onboarding",
    headline: "Réduisez le time-to-value de vos utilisateurs",
    description:
      "HelloClaudia accompagne chaque nouvel utilisateur pas à pas, répond à ses questions et le guide vers les fonctionnalités clés.",
    problem:
      "40% des utilisateurs SaaS abandonnent pendant la première semaine. Les tutoriels vidéo ne répondent pas aux questions spécifiques. L'onboarding humain ne scale pas au-delà de quelques dizaines de clients.",
    solution:
      "HelloClaudia connaît votre produit dans les moindres détails. Elle guide chaque utilisateur de manière personnalisée : répond aux questions en contexte, suggère les prochaines étapes et s'assure que les fonctionnalités clés sont activées.",
    metrics: [
      { label: "Taux d'activation (jour 7)", before: "35%", after: "62%" },
      { label: "Time-to-value", before: "12 jours", after: "4 jours" },
      { label: "Tickets onboarding", before: "8 / utilisateur", after: "2 / utilisateur" },
      { label: "Rétention (mois 1)", before: "60%", after: "82%" },
    ],
    steps: [
      {
        title: "Indexez votre documentation produit",
        description: "Guides de démarrage, tutoriels, FAQ, changelog — tout ce dont un nouvel utilisateur a besoin pour réussir.",
      },
      {
        title: "Configurez les messages proactifs",
        description: "Définissez des messages d'accueil et des questions suggérées adaptés au parcours de l'utilisateur (nouveau, en essai, payant).",
      },
      {
        title: "Analysez et optimisez",
        description: "Le dashboard Analytics révèle les blocages : questions fréquentes, étapes où les utilisateurs se perdent, fonctionnalités sous-utilisées.",
      },
    ],
    metaDescription:
      "Améliorez l'onboarding avec un chatbot IA. Réduisez le time-to-value de 65%, augmentez l'activation et la rétention. Guide personnalisé 24/7.",
  },
  {
    slug: "base-connaissances",
    icon: BookOpen,
    title: "Base de connaissances interne",
    shortTitle: "Base de connaissances",
    headline: "Rendez votre savoir d'entreprise accessible en une question",
    description:
      "HelloClaudia transforme votre documentation interne en assistant conversationnel pour toute l'équipe.",
    problem:
      "L'information est dispersée entre Notion, Google Drive, Confluence et des PDF. Les employés passent 20% de leur temps à chercher des informations. Les nouveaux arrivants mettent des semaines à être autonomes.",
    solution:
      "HelloClaudia indexe toutes vos sources internes et devient le point d'entrée unique pour accéder au savoir de l'entreprise. Chaque réponse cite sa source exacte. Les employés trouvent l'information en secondes, pas en heures.",
    metrics: [
      { label: "Temps de recherche", before: "25 min/requête", after: "< 10 secondes" },
      { label: "Onboarding employé", before: "6 semaines", after: "2 semaines" },
      { label: "Questions internes au support", before: "120/semaine", after: "35/semaine" },
      { label: "Satisfaction employé", before: "3.1/5", after: "4.5/5" },
    ],
    steps: [
      {
        title: "Connectez vos sources internes",
        description: "Notion, Google Drive, Confluence, SharePoint, PDF internes — HelloClaudia indexe tout et maintient la sync automatique.",
      },
      {
        title: "Déployez sur Slack ou en interne",
        description: "Intégrez HelloClaudia dans Slack pour un accès direct, ou déployez le widget sur votre intranet.",
      },
      {
        title: "Identifiez les gaps",
        description: "Le dashboard montre les questions sans réponse : autant de sujets à documenter pour améliorer le savoir collectif.",
      },
    ],
    metaDescription:
      "Transformez votre documentation interne en assistant IA. Accès instantané au savoir d'entreprise, citations des sources, détection des gaps.",
  },
  {
    slug: "ventes",
    icon: ShoppingBag,
    title: "Assistant de vente IA",
    shortTitle: "Ventes",
    headline: "Un commercial IA disponible 24/7",
    description:
      "HelloClaudia répond aux questions pré-achat, compare vos offres et guide les prospects vers la conversion.",
    problem:
      "Les prospects posent des questions en dehors des heures de bureau. L'équipe commerciale passe du temps à répondre aux mêmes questions produit. Les comparaisons avec les concurrents sont chronophages.",
    solution:
      "HelloClaudia maîtrise votre offre commerciale et répond aux questions pré-achat avec précision : tarifs, fonctionnalités, comparaisons, cas clients. Elle identifie les signaux d'achat et alerte votre équipe au bon moment.",
    metrics: [
      { label: "Réponses hors heures", before: "0%", after: "100%" },
      { label: "Pipeline généré", before: "Base", after: "+45%" },
      { label: "Cycle de vente", before: "28 jours", after: "18 jours" },
      { label: "Temps commercial libéré", before: "Base", after: "+12h/semaine" },
    ],
    steps: [
      {
        title: "Importez votre matériel commercial",
        description: "Fiches produit, grilles tarifaires, études de cas, FAQ commerciale — HelloClaudia devient experte de votre offre.",
      },
      {
        title: "Configurez les alertes commerciales",
        description: "Définissez les signaux d'achat (demande de devis, comparaison, question tarif) qui déclenchent une notification à votre équipe.",
      },
      {
        title: "Analysez les conversations",
        description: "Identifiez les objections fréquentes, les concurrents mentionnés et les fonctionnalités les plus demandées pour affiner votre pitch.",
      },
    ],
    metaDescription:
      "Assistant de vente IA : répondez aux questions pré-achat 24/7, qualifiez les prospects et réduisez le cycle de vente de 35%.",
  },
];
