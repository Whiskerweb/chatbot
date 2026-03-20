export interface Faq {
  q: string;
  a: string;
}

export const globalFaqs: Faq[] = [
  {
    q: "Qu'est-ce qu'un crédit ?",
    a: "Un crédit correspond à une unité de consommation. Chaque message IA consomme 1 à 5 crédits selon l'usage. L'indexation de documents consomme également des crédits. Votre consommation est visible en temps réel dans le dashboard.",
  },
  {
    q: "Puis-je changer de plan à tout moment ?",
    a: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Le changement est effectif immédiatement et le montant est calculé au prorata.",
  },
  {
    q: "Quelles sources de données sont supportées ?",
    a: "Sites web (crawling automatique), fichiers PDF, DOCX, TXT, Markdown, CSV, pages Notion et Google Drive. D'autres connecteurs arrivent bientôt.",
  },
  {
    q: "Puis-je utiliser mes propres clés API ?",
    a: "Oui, à partir du plan Pro. Vous pouvez configurer vos clés OpenAI, Anthropic ou Google AI dans les paramètres. Vos messages ne consomment alors pas de crédits.",
  },
  {
    q: "Mes données sont-elles sécurisées ?",
    a: "Absolument. Chiffrement AES-256 au repos et TLS 1.3 en transit. Vos données ne sont jamais utilisées pour entraîner d'autres IA. Hébergement européen disponible.",
  },
  {
    q: "Le white-label est-il disponible ?",
    a: "Oui, à partir du plan Growth. Vous pouvez personnaliser entièrement le widget avec votre marque, couleurs et domaine personnalisé.",
  },
];
