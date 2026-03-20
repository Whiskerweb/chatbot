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
    status: "bientot",
    description: "Déployez votre chatbot sur WhatsApp Business. Répondez aux clients sur leur canal préféré, 24/7.",
  },
  {
    name: "Slack",
    category: "messagerie",
    status: "bientot",
    description: "Intégrez HelloClaudia dans vos canaux Slack pour un support interne instantané.",
  },
  {
    name: "Discord",
    category: "messagerie",
    status: "bientot",
    description: "Bot Discord pour vos communautés. Réponses automatiques dans les canaux de support.",
  },
  {
    name: "Telegram",
    category: "messagerie",
    status: "bientot",
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

  // CMS — widget JS compatible, pas de plugin/app natif
  {
    name: "WordPress",
    category: "cms",
    status: "disponible",
    description: "Ajoutez le widget HelloClaudia à votre site WordPress en copiant-collant une ligne de JavaScript.",
    featured: true,
  },
  {
    name: "Webflow",
    category: "cms",
    status: "disponible",
    description: "Intégrez le widget HelloClaudia à votre site Webflow via un embed code. Déploiement en quelques clics.",
  },
  {
    name: "Wix",
    category: "cms",
    status: "disponible",
    description: "Ajoutez le widget HelloClaudia à votre site Wix en intégrant le snippet JavaScript.",
  },
  {
    name: "Framer",
    category: "cms",
    status: "disponible",
    description: "Intégrez le widget HelloClaudia à votre site Framer via un embed code.",
  },

  // CRM
  {
    name: "Zendesk",
    category: "crm",
    status: "bientot",
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
    status: "bientot",
    description: "Indexez vos pages Notion comme source de données pour votre chatbot.",
  },
  {
    name: "Google Drive",
    category: "productivite",
    status: "bientot",
    description: "Connectez votre Google Drive pour indexer automatiquement vos documents.",
  },
  {
    name: "Confluence",
    category: "productivite",
    status: "bientot",
    description: "Indexez votre base de connaissances Confluence pour des réponses internes précises.",
  },
  {
    name: "SharePoint",
    category: "productivite",
    status: "bientot",
    description: "Connectez SharePoint pour indexer les documents de votre organisation.",
  },

  // E-commerce — widget JS compatible, pas d'app native
  {
    name: "Shopify",
    category: "ecommerce",
    status: "disponible",
    description: "Ajoutez le widget HelloClaudia à votre boutique Shopify en copiant-collant le snippet JavaScript.",
    featured: true,
  },
  {
    name: "WooCommerce",
    category: "ecommerce",
    status: "disponible",
    description: "Intégrez le widget HelloClaudia à votre boutique WooCommerce via le snippet JavaScript.",
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
    status: "bientot",
    description: "Connectez HelloClaudia à 5000+ apps via Zapier. Automatisez vos workflows sans code.",
  },
  {
    name: "Make",
    category: "automatisation",
    status: "bientot",
    description: "Scénarios Make (ex-Integromat) pour des automatisations avancées avec HelloClaudia.",
  },
  {
    name: "n8n",
    category: "automatisation",
    status: "bientot",
    description: "Workflows n8n self-hosted pour une automatisation complète avec HelloClaudia.",
  },
];
