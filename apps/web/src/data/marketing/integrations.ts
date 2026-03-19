export type IntegrationCategory =
  | "messagerie"
  | "cms"
  | "crm"
  | "productivite"
  | "ecommerce"
  | "automatisation";

export type IntegrationStatus = "disponible" | "bientot";

export interface Integration {
  name: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  description: string;
  featured?: boolean;
}

export const categoryLabels: Record<IntegrationCategory, string> = {
  messagerie: "Messagerie",
  cms: "CMS",
  crm: "CRM",
  productivite: "Productivité",
  ecommerce: "E-commerce",
  automatisation: "Automatisation",
};

export const integrations: Integration[] = [
  // Messagerie
  {
    name: "WhatsApp",
    category: "messagerie",
    status: "disponible",
    description: "Déployez votre chatbot sur WhatsApp Business. Répondez aux clients sur leur canal préféré, 24/7.",
    featured: true,
  },
  {
    name: "Slack",
    category: "messagerie",
    status: "disponible",
    description: "Intégrez Claudia dans vos canaux Slack pour un support interne instantané.",
    featured: true,
  },
  {
    name: "Discord",
    category: "messagerie",
    status: "disponible",
    description: "Bot Discord pour vos communautés. Réponses automatiques dans les canaux de support.",
  },
  {
    name: "Telegram",
    category: "messagerie",
    status: "disponible",
    description: "Bot Telegram avec réponses IA basées sur votre documentation.",
  },
  {
    name: "Messenger",
    category: "messagerie",
    status: "bientot",
    description: "Chatbot Facebook Messenger pour votre page entreprise.",
  },
  {
    name: "Instagram",
    category: "messagerie",
    status: "bientot",
    description: "Réponses automatiques aux DM Instagram de vos clients.",
  },

  // CMS
  {
    name: "WordPress",
    category: "cms",
    status: "disponible",
    description: "Plugin WordPress officiel. Installation en 1 clic depuis votre tableau de bord WP.",
    featured: true,
  },
  {
    name: "Webflow",
    category: "cms",
    status: "disponible",
    description: "Intégration native Webflow via embed code. Déploiement instantané sur votre site.",
  },
  {
    name: "Wix",
    category: "cms",
    status: "disponible",
    description: "App Wix pour ajouter le widget Claudia à votre site en quelques clics.",
  },
  {
    name: "Framer",
    category: "cms",
    status: "bientot",
    description: "Composant Framer pour intégrer Claudia dans vos sites Framer.",
  },

  // CRM
  {
    name: "Zendesk",
    category: "crm",
    status: "disponible",
    description: "Synchronisez les conversations et les leads avec votre instance Zendesk.",
  },
  {
    name: "HubSpot",
    category: "crm",
    status: "bientot",
    description: "Envoyez automatiquement les leads capturés vers votre CRM HubSpot.",
  },
  {
    name: "Salesforce",
    category: "crm",
    status: "bientot",
    description: "Intégration Salesforce pour la synchronisation des contacts et conversations.",
  },

  // Productivité
  {
    name: "Notion",
    category: "productivite",
    status: "disponible",
    description: "Indexez vos pages Notion comme source de données pour votre chatbot.",
    featured: true,
  },
  {
    name: "Google Drive",
    category: "productivite",
    status: "disponible",
    description: "Connectez votre Google Drive pour indexer automatiquement vos documents.",
  },
  {
    name: "Confluence",
    category: "productivite",
    status: "disponible",
    description: "Indexez votre base de connaissances Confluence pour des réponses internes précises.",
  },
  {
    name: "SharePoint",
    category: "productivite",
    status: "disponible",
    description: "Connectez SharePoint pour indexer les documents de votre organisation.",
  },

  // E-commerce
  {
    name: "Shopify",
    category: "ecommerce",
    status: "disponible",
    description: "App Shopify native. Chatbot IA pour le support client et la recommandation produit.",
    featured: true,
  },
  {
    name: "WooCommerce",
    category: "ecommerce",
    status: "disponible",
    description: "Extension WooCommerce pour intégrer Claudia à votre boutique en ligne.",
  },
  {
    name: "PrestaShop",
    category: "ecommerce",
    status: "bientot",
    description: "Module PrestaShop pour le support client automatisé de votre boutique.",
  },

  // Automatisation
  {
    name: "Zapier",
    category: "automatisation",
    status: "disponible",
    description: "Connectez Claudia à 5000+ apps via Zapier. Automatisez vos workflows sans code.",
    featured: true,
  },
  {
    name: "Make",
    category: "automatisation",
    status: "disponible",
    description: "Scénarios Make (ex-Integromat) pour des automatisations avancées avec Claudia.",
  },
  {
    name: "n8n",
    category: "automatisation",
    status: "bientot",
    description: "Workflows n8n self-hosted pour une automatisation complète avec Claudia.",
  },
];
