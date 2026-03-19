export interface Testimonial {
  quote: string;
  name: string;
  title: string;
  company: string;
  industry?: string;
}

export const testimonials: Testimonial[] = [
  {
    quote: "Notre taux de déflection est passé de 30% à 75% en 3 semaines. Le chatbot répond mieux que notre ancienne FAQ.",
    name: "Marie Laurent",
    title: "Head of Support",
    company: "TechFlow",
    industry: "saas",
  },
  {
    quote: "L'intégration a pris 10 minutes. Le dashboard analytics nous montre exactement ce qui manque dans notre documentation.",
    name: "Thomas Berger",
    title: "CTO",
    company: "DataPulse",
    industry: "saas",
  },
  {
    quote: "Le système de crédits est transparent et prévisible. On sait exactement ce qu'on consomme et pourquoi.",
    name: "Sophie Martin",
    title: "Product Manager",
    company: "CloudBase",
    industry: "saas",
  },
  {
    quote: "Nos clients trouvent leurs réponses 24/7. Le taux de satisfaction a bondi de 40 points en un mois.",
    name: "Julien Moreau",
    title: "Directeur E-commerce",
    company: "ShopNow",
    industry: "e-commerce",
  },
  {
    quote: "Claudia a remplacé notre FAQ statique. Les patients obtiennent des réponses fiables et sourcées instantanément.",
    name: "Dr. Claire Duval",
    title: "Directrice Médicale",
    company: "MedConnect",
    industry: "sante",
  },
  {
    quote: "Le mode strict empêche toute hallucination. Essentiel pour notre secteur réglementé.",
    name: "François Petit",
    title: "Responsable Conformité",
    company: "FinSecure",
    industry: "services-financiers",
  },
  {
    quote: "L'intégration WhatsApp a transformé notre relation client. Les demandes de visite ont augmenté de 60%.",
    name: "Laure Girard",
    title: "Responsable Commercial",
    company: "ImmoVista",
    industry: "immobilier",
  },
  {
    quote: "Les étudiants adorent avoir un assistant disponible même à 2h du matin avant les examens.",
    name: "Prof. Marc Dubois",
    title: "Doyen Numérique",
    company: "UniTech",
    industry: "education",
  },
];
