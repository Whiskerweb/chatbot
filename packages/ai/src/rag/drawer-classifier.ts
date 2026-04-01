/**
 * Drawer-based query classifier.
 * Maps user questions to topic categories using keyword matching.
 * Used to filter Pinecone searches to relevant "drawers" only.
 */

const DRAWER_KEYWORDS: Record<string, string[]> = {
  pricing: [
    "prix", "tarif", "abonnement", "coût", "cout", "plan", "facturation",
    "payer", "paiement", "gratuit", "essai", "price", "cost", "billing",
    "subscription", "free", "trial", "offre", "formule", "réduction",
    "promotion", "remise",
  ],
  support: [
    "aide", "problème", "probleme", "erreur", "bug", "contact",
    "help", "issue", "marche pas", "fonctionne pas", "panne",
    "assistance", "support", "résoudre", "solution", "dépannage",
  ],
  features: [
    "fonctionnalité", "fonctionnalite", "comment", "utiliser",
    "configurer", "feature", "faire", "intégration", "integration",
    "personnaliser", "paramètre", "parametre", "option", "outil",
  ],
  legal: [
    "cgv", "rgpd", "gdpr", "politique", "confidentialité",
    "confidentialite", "conditions", "mentions", "légal", "legal",
    "données", "donnees", "privacy", "terms", "droit",
  ],
  onboarding: [
    "commencer", "démarrer", "demarrer", "installer", "installation",
    "premier", "début", "debut", "setup", "getting started", "tutoriel",
    "guide", "inscription",
  ],
};

export interface DrawerResult {
  drawers: string[];
  confidence: "high" | "low" | "none";
}

/**
 * Classifies a user query into topic drawers.
 * Returns matched drawer names and confidence level.
 * Empty drawers = no filter (search everything).
 */
export function classifyQuery(query: string): DrawerResult {
  const lower = query.toLowerCase();
  const words = lower.split(/\s+/);

  const matches: { drawer: string; matchCount: number }[] = [];

  for (const [drawer, keywords] of Object.entries(DRAWER_KEYWORDS)) {
    const matchCount = keywords.filter((kw) =>
      kw.includes(" ") ? lower.includes(kw) : words.some((w) => w.includes(kw))
    ).length;

    if (matchCount > 0) {
      matches.push({ drawer, matchCount });
    }
  }

  if (matches.length === 0) {
    return { drawers: [], confidence: "none" };
  }

  // Sort by match count, take top drawers
  matches.sort((a, b) => b.matchCount - a.matchCount);

  const topMatch = matches[0].matchCount;
  const confidence = topMatch >= 2 ? "high" : "low";

  // Take drawers with at least 1 keyword match
  const drawers = matches.map((m) => m.drawer);

  return { drawers, confidence };
}

/**
 * Builds a Pinecone metadata filter from drawer classification.
 * Returns undefined if no drawers matched (= search everything).
 */
export function buildDrawerFilter(
  result: DrawerResult
): Record<string, any> | undefined {
  // Only filter when confidence is high (2+ keyword matches)
  // Low confidence = could be ambiguous, search everything
  if (result.confidence !== "high" || result.drawers.length === 0) {
    return undefined;
  }

  return { category: { $in: result.drawers } };
}
