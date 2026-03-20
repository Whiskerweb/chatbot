import {
  ShoppingCart, Laptop, Heart, Building2, GraduationCap, Landmark,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SolutionUseCase {
  title: string;
  scenario: string;
}

export interface SolutionFaq {
  q: string;
  a: string;
}

export interface Solution {
  slug: string;
  icon: LucideIcon;
  title: string;
  shortTitle: string;
  headline: string;
  description: string;
  painPoints: string[];
  useCases: SolutionUseCase[];
  kpis: { label: string; value: string; description: string }[];
  integrations: string[];
  faqs: SolutionFaq[];
  metaDescription: string;
}

export const solutions: Solution[] = [
  {
    slug: "e-commerce",
    icon: ShoppingCart,
    title: "Chatbot IA pour le E-commerce",
    shortTitle: "E-commerce",
    headline: "Automatisez le support e-commerce et boostez vos ventes",
    description:
      "Répondez instantanément aux questions sur les commandes, les retours et les produits. HelloClaudia guide vos clients vers l'achat, 24/7.",
    painPoints: [
      "80% des questions portent sur le suivi de commande et les retours",
      "Les clients abandonnent après 2 minutes d'attente",
      "Le support est submergé pendant les pics (Black Friday, soldes)",
    ],
    useCases: [
      {
        title: "Suivi de commande automatisé",
        scenario: "Un client demande 'Où est ma commande ?' — HelloClaudia récupère le statut en temps réel via votre API et répond instantanément avec le numéro de suivi.",
      },
      {
        title: "Assistant produit",
        scenario: "Un visiteur hésite entre deux produits — HelloClaudia compare les caractéristiques à partir de vos fiches produit et recommande le plus adapté.",
      },
      {
        title: "Gestion des retours",
        scenario: "Un client veut retourner un article — HelloClaudia vérifie l'éligibilité, génère l'étiquette retour et guide le client étape par étape.",
      },
    ],
    kpis: [
      { label: "Taux de déflection", value: "72%", description: "des demandes traitées sans intervention humaine" },
      { label: "Temps de réponse", value: "<5s", description: "contre 4h en moyenne par email" },
      { label: "Satisfaction client", value: "4.6/5", description: "score CSAT moyen avec HelloClaudia" },
    ],
    integrations: ["Shopify", "WooCommerce", "WordPress", "Webflow"],
    faqs: [
      { q: "HelloClaudia peut-elle se connecter à mon système de commandes ?", a: "Oui, via notre API REST ou les webhooks. HelloClaudia peut interroger votre système de gestion de commandes en temps réel pour fournir des statuts précis." },
      { q: "Le chatbot gère-t-il plusieurs langues ?", a: "Oui, HelloClaudia détecte automatiquement la langue du client et répond dans la même langue. Plus de 50 langues supportées." },
      { q: "Combien de temps pour être opérationnel ?", a: "Moins d'une heure. Importez votre catalogue produit et vos FAQ, personnalisez le widget, et c'est parti." },
    ],
    metaDescription:
      "Chatbot IA pour e-commerce : support automatisé pour commandes, retours et recommandations produit. Widget compatible Shopify, WooCommerce. Déployé en 1 heure.",
  },
  {
    slug: "saas",
    icon: Laptop,
    title: "Chatbot IA pour les SaaS",
    shortTitle: "SaaS",
    headline: "Support produit intelligent pour les entreprises SaaS",
    description:
      "Déflectez les tickets de support niveau 1, accélérez l'onboarding et identifiez les lacunes de votre documentation.",
    painPoints: [
      "Les tickets répétitifs monopolisent votre équipe support",
      "Les utilisateurs abandonnent pendant l'onboarding",
      "La documentation est toujours en retard sur le produit",
    ],
    useCases: [
      {
        title: "Support niveau 1 automatisé",
        scenario: "Un utilisateur demande comment réinitialiser son mot de passe — HelloClaudia fournit la procédure exacte avec captures d'écran, depuis votre documentation.",
      },
      {
        title: "Onboarding guidé",
        scenario: "Un nouvel utilisateur explore votre produit — HelloClaudia le guide pas à pas, répond à ses questions et l'oriente vers les fonctionnalités clés.",
      },
      {
        title: "Détection des gaps documentaires",
        scenario: "HelloClaudia identifie que 30% des questions portent sur une feature non documentée — vous recevez une alerte avec les questions exactes.",
      },
    ],
    kpis: [
      { label: "Tickets déflectés", value: "65%", description: "des demandes niveau 1 résolues automatiquement" },
      { label: "Temps d'onboarding", value: "-40%", description: "réduction du temps d'activation des nouveaux utilisateurs" },
      { label: "Documentation", value: "100%", description: "des gaps identifiés et remontés automatiquement" },
    ],
    integrations: ["WordPress", "Webflow", "Wix", "Framer"],
    faqs: [
      { q: "HelloClaudia fonctionne-t-elle avec notre base de connaissances existante ?", a: "Oui, importez vos documents (PDF, DOCX, TXT, Markdown, CSV) ou indexez votre site de documentation via le crawling automatique. Des connecteurs Notion, Confluence et Google Drive arrivent bientôt." },
      { q: "Peut-on voir les questions sans réponse ?", a: "Absolument. Le dashboard Analytics affiche en temps réel les questions auxquelles HelloClaudia ne peut pas répondre, classées par fréquence." },
      { q: "L'escalade vers le support humain est-elle possible ?", a: "Oui, HelloClaudia peut transférer la conversation à votre équipe via le live chat intégré, en transmettant tout le contexte." },
    ],
    metaDescription:
      "Chatbot IA pour SaaS : déflectez 65% des tickets, accélérez l'onboarding et détectez les lacunes de votre documentation. Widget intégrable en 1 minute.",
  },
  {
    slug: "sante",
    icon: Heart,
    title: "Chatbot IA pour la Santé",
    shortTitle: "Santé",
    headline: "Un assistant IA fiable et conforme pour le secteur santé",
    description:
      "Répondez aux questions des patients avec précision grâce au mode strict. Conformité RGPD et confidentialité des données garanties.",
    painPoints: [
      "Les patients appellent pour des questions simples (horaires, préparation RDV)",
      "L'information médicale doit être exacte — zéro tolérance aux hallucinations",
      "La conformité RGPD est non-négociable",
    ],
    useCases: [
      {
        title: "FAQ patients automatisée",
        scenario: "Un patient demande les horaires d'ouverture ou la préparation pour un examen — HelloClaudia répond instantanément à partir de vos informations validées.",
      },
      {
        title: "Prise de rendez-vous guidée",
        scenario: "HelloClaudia guide le patient vers le bon service et le bon praticien en fonction de ses symptômes, puis redirige vers votre outil de prise de RDV.",
      },
      {
        title: "Information post-consultation",
        scenario: "Après une consultation, le patient retrouve les consignes de suivi via le chatbot, réduisant les appels au secrétariat.",
      },
    ],
    kpis: [
      { label: "Appels réduits", value: "55%", description: "des appels téléphoniques déflectés vers le chatbot" },
      { label: "Précision", value: "99.2%", description: "de réponses conformes grâce au mode strict" },
      { label: "Satisfaction", value: "4.7/5", description: "score de satisfaction patient" },
    ],
    integrations: ["WordPress", "Webflow", "Wix"],
    faqs: [
      { q: "Le chatbot respecte-t-il le secret médical ?", a: "HelloClaudia ne stocke aucune donnée de santé personnelle. Les conversations sont chiffrées et purgées selon vos règles de rétention. DPA disponible." },
      { q: "Le mode strict est-il fiable ?", a: "Le mode strict empêche HelloClaudia de générer des informations non présentes dans vos sources. Taux de conformité >99% vérifié sur nos benchmarks." },
      { q: "Hébergement en Europe ?", a: "Oui, l'option d'hébergement européen est disponible pour garantir la conformité RGPD et la souveraineté des données." },
    ],
    metaDescription:
      "Chatbot IA pour la santé : réponses fiables avec mode strict, conformité RGPD, chiffrement des données. Réduisez 55% des appels patients.",
  },
  {
    slug: "immobilier",
    icon: Building2,
    title: "Chatbot IA pour l'Immobilier",
    shortTitle: "Immobilier",
    headline: "Qualifiez vos prospects et répondez 24/7",
    description:
      "HelloClaudia répond aux questions sur vos biens, qualifie les prospects et planifie les visites — même en dehors des heures de bureau.",
    painPoints: [
      "Les prospects contactent en soirée et le week-end",
      "60% des demandes sont des questions répétitives sur les biens",
      "La qualification manuelle des leads est chronophage",
    ],
    useCases: [
      {
        title: "Qualification de prospects",
        scenario: "Un visiteur consulte une annonce — HelloClaudia pose les bonnes questions (budget, surface, localisation) et transmet un lead qualifié à l'agent immobilier.",
      },
      {
        title: "FAQ sur les biens",
        scenario: "Un prospect demande les charges, le DPE ou la surface — HelloClaudia répond instantanément à partir de vos fiches descriptives importées.",
      },
      {
        title: "Prise de rendez-vous",
        scenario: "HelloClaudia propose des créneaux de visite disponibles et confirme le rendez-vous. L'agent reçoit une notification avec le profil du prospect.",
      },
    ],
    kpis: [
      { label: "Leads qualifiés", value: "+60%", description: "d'augmentation des leads qualifiés automatiquement" },
      { label: "Disponibilité", value: "24/7", description: "réponse instantanée même le week-end et en soirée" },
      { label: "Temps gagné", value: "15h/sem", description: "par agent immobilier en moyenne" },
    ],
    integrations: ["WordPress", "Webflow", "Wix"],
    faqs: [
      { q: "HelloClaudia peut-elle gérer plusieurs agences ?", a: "Oui, chaque agence peut avoir son propre agent avec ses biens et son branding. Gestion centralisée ou autonome au choix." },
      { q: "Comment importer les fiches de biens ?", a: "Uploadez vos fiches en PDF/DOCX ou connectez votre site web. HelloClaudia indexe automatiquement toutes les informations des biens." },
      { q: "L'intégration calendrier est-elle disponible ?", a: "Via notre API REST, vous pouvez connecter Google Calendar, Calendly ou tout autre outil de planification pour la prise de rendez-vous automatisée." },
    ],
    metaDescription:
      "Chatbot IA pour l'immobilier : qualifiez vos prospects 24/7, répondez aux questions sur vos biens et planifiez les visites automatiquement.",
  },
  {
    slug: "education",
    icon: GraduationCap,
    title: "Chatbot IA pour l'Éducation",
    shortTitle: "Éducation",
    headline: "Un assistant IA disponible 24/7 pour étudiants et enseignants",
    description:
      "Répondez aux questions administratives, guidez les étudiants et réduisez la charge de travail de votre équipe pédagogique.",
    painPoints: [
      "Les étudiants posent les mêmes questions chaque rentrée",
      "Le secrétariat est débordé par les demandes administratives",
      "Les enseignants passent du temps à répondre aux mêmes emails",
    ],
    useCases: [
      {
        title: "FAQ administrative",
        scenario: "Un étudiant demande les dates d'inscription, les documents requis ou les procédures de bourse — HelloClaudia répond instantanément à partir du règlement intérieur.",
      },
      {
        title: "Assistant de cours",
        scenario: "Indexez les supports de cours et HelloClaudia aide les étudiants à retrouver les informations clés, réviser les concepts et préparer les examens.",
      },
      {
        title: "Orientation & parcours",
        scenario: "Un futur étudiant explore les formations — HelloClaudia l'oriente vers le parcours adapté en fonction de ses intérêts et prérequis.",
      },
    ],
    kpis: [
      { label: "Emails réduits", value: "70%", description: "de réduction des emails au secrétariat" },
      { label: "Disponibilité", value: "24/7", description: "y compris pendant les vacances et les week-ends" },
      { label: "Adoption", value: "85%", description: "des étudiants utilisent le chatbot après 1 mois" },
    ],
    integrations: ["WordPress", "Webflow", "Wix", "Framer"],
    faqs: [
      { q: "Les données des étudiants sont-elles protégées ?", a: "Oui, HelloClaudia est conforme RGPD. Les conversations sont chiffrées et les données personnelles ne sont jamais partagées ni utilisées pour l'entraînement IA." },
      { q: "Peut-on créer un chatbot par département ?", a: "Oui, chaque département ou formation peut avoir son propre agent avec ses documents spécifiques. Gestion centralisée depuis un seul dashboard." },
      { q: "L'intégration avec notre LMS est-elle possible ?", a: "Via notre API REST, vous pouvez connecter HelloClaudia à Moodle, Canvas ou tout autre LMS pour synchroniser les contenus." },
    ],
    metaDescription:
      "Chatbot IA pour l'éducation : FAQ administrative 24/7, assistant de cours, orientation étudiante. Réduisez 70% des emails au secrétariat.",
  },
  {
    slug: "services-financiers",
    icon: Landmark,
    title: "Chatbot IA pour les Services Financiers",
    shortTitle: "Finance",
    headline: "IA de confiance pour le secteur financier",
    description:
      "Répondez aux questions clients avec précision, conformité réglementaire et traçabilité complète. Mode strict obligatoire.",
    painPoints: [
      "La réglementation exige des réponses traçables et exactes",
      "Les clients attendent des réponses rapides sur leurs comptes et produits",
      "Le coût par interaction du support humain est élevé",
    ],
    useCases: [
      {
        title: "FAQ produits financiers",
        scenario: "Un client demande les conditions d'un prêt ou les frais d'un compte — HelloClaudia répond à partir de vos fiches produit validées par la conformité.",
      },
      {
        title: "Assistance réglementaire interne",
        scenario: "Un conseiller cherche une procédure KYC ou une règle de conformité — HelloClaudia retrouve l'information exacte dans votre base documentaire interne.",
      },
      {
        title: "Onboarding client",
        scenario: "Un nouveau client ouvre un compte — HelloClaudia l'accompagne dans les étapes, les documents requis et les délais, réduisant les abandons.",
      },
    ],
    kpis: [
      { label: "Conformité", value: "100%", description: "des réponses traçables et vérifiables grâce au mode strict" },
      { label: "Coût/interaction", value: "-80%", description: "de réduction vs. support téléphonique" },
      { label: "Temps de réponse", value: "<3s", description: "réponse instantanée contre 24-48h par email" },
    ],
    integrations: ["WordPress", "Webflow", "Wix"],
    faqs: [
      { q: "HelloClaudia est-elle conforme aux réglementations financières ?", a: "Le mode strict garantit que HelloClaudia ne fournit que des informations provenant de vos sources validées. Chaque réponse est traçable avec sa source exacte." },
      { q: "L'audit des conversations est-il possible ?", a: "Oui, toutes les conversations sont archivées et exportables. Vous pouvez retracer chaque réponse et sa source documentaire." },
      { q: "Hébergement souverain disponible ?", a: "Oui, nous proposons un hébergement européen dédié pour les institutions financières nécessitant la souveraineté des données." },
    ],
    metaDescription:
      "Chatbot IA pour les services financiers : conformité réglementaire, réponses traçables, mode strict. Réduisez 80% du coût par interaction.",
  },
];
