export interface Plan {
  name: string;
  price: number;
  credits: string;
  agents: string;
  sources: string;
  popular?: boolean;
  features: string[];
}

export const plans: Plan[] = [
  {
    name: "Free",
    price: 0,
    credits: "100",
    agents: "1",
    sources: "30",
    features: [
      "IA HelloClaudia",
      "Dashboard basique",
      "Support communauté",
      "Rétention 7 jours",
    ],
  },
  {
    name: "Starter",
    price: 29,
    credits: "3 000",
    agents: "3",
    sources: "500",
    features: [
      "IA HelloClaudia avancée",
      "Live chat",
      "Sync hebdomadaire",
      "API REST",
      "Support email 48h",
    ],
  },
  {
    name: "Pro",
    price: 79,
    credits: "15 000",
    agents: "10",
    sources: "5 000",
    popular: true,
    features: [
      "IA HelloClaudia Pro + BYOK",
      "Sync quotidien",
      "API + MCP",
      "5 membres",
      "Support chat 24h",
    ],
  },
  {
    name: "Growth",
    price: 199,
    credits: "50 000",
    agents: "25",
    sources: "15 000",
    features: [
      "White-label inclus",
      "Sync 4x/jour",
      "15 membres",
      "Rétention 1 an",
      "Support prioritaire",
    ],
  },
];

export const pricingFeatureMatrix = [
  { feature: "Crédits / mois", free: "100", starter: "3 000", pro: "15 000", growth: "50 000" },
  { feature: "Agents", free: "1", starter: "3", pro: "10", growth: "25" },
  { feature: "Sources indexées", free: "30", starter: "500", pro: "5 000", growth: "15 000" },
  { feature: "Membres", free: "1", starter: "2", pro: "5", growth: "15" },
  { feature: "Intelligence IA", free: "Standard", starter: "Avancée", pro: "Pro + BYOK", growth: "Pro + BYOK" },
  { feature: "Live chat", free: "—", starter: "✓", pro: "✓", growth: "✓" },
  { feature: "API REST", free: "—", starter: "✓", pro: "✓", growth: "✓" },
  { feature: "Serveur MCP", free: "—", starter: "—", pro: "✓", growth: "✓" },
  { feature: "Sync automatique", free: "—", starter: "Hebdo", pro: "Quotidien", growth: "4x/jour" },
  { feature: "White-label", free: "—", starter: "—", pro: "—", growth: "✓" },
  { feature: "Rétention données", free: "7 jours", starter: "30 jours", pro: "90 jours", growth: "1 an" },
  { feature: "Support", free: "Communauté", starter: "Email 48h", pro: "Chat 24h", growth: "Prioritaire" },
];

export const pricingFaqs = [
  { q: "Qu'est-ce qu'un crédit ?", a: "Un crédit correspond à une unité de consommation. Chaque message IA consomme 1 à 5 crédits selon l'usage. L'indexation de documents consomme également des crédits. Votre consommation est visible en temps réel dans le dashboard." },
  { q: "Puis-je changer de plan à tout moment ?", a: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Le changement est effectif immédiatement et le montant est calculé au prorata." },
  { q: "Qu'arrive-t-il si je dépasse mes crédits ?", a: "Votre chatbot continue de fonctionner mais les réponses sont ralenties. Vous recevez une notification pour upgrader ou acheter des crédits supplémentaires." },
  { q: "Y a-t-il un engagement ?", a: "Non, tous les plans sont sans engagement. Vous pouvez annuler à tout moment. Le plan annuel offre une réduction de 20% et peut être annulé avec remboursement au prorata." },
  { q: "Puis-je utiliser mes propres clés API ?", a: "Oui, à partir du plan Pro (BYOK). Vos messages ne consomment alors pas de crédits HelloClaudia. Vous payez directement auprès du fournisseur IA." },
  { q: "Proposez-vous un plan Enterprise ?", a: "Oui, contactez-nous pour un plan sur mesure avec crédits illimités, SLA garanti, hébergement dédié et accompagnement personnalisé." },
];
