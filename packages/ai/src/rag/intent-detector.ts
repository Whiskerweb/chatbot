/**
 * Keyword-based intent classifier.
 * Detects user intent from message text without any LLM call.
 * Used to skip RAG pipeline for simple greetings/farewells.
 */

export type Intent = "greeting" | "farewell" | "pricing" | "support" | "technical" | "general";

const INTENT_KEYWORDS: Record<Exclude<Intent, "general">, string[]> = {
  greeting: [
    "bonjour", "salut", "hello", "hey", "hi", "coucou", "bonsoir",
    "bonne journée", "bonne journee", "yo", "wesh", "hola",
  ],
  farewell: [
    "merci", "au revoir", "bye", "à bientôt", "a bientot", "thanks",
    "thank you", "goodbye", "bonne soirée", "bonne soiree", "à plus",
    "a plus", "ciao", "adieu",
  ],
  pricing: [
    "prix", "tarif", "coût", "cout", "abonnement", "plan", "payer",
    "gratuit", "price", "cost", "billing", "facturation", "paiement",
    "subscription", "offre", "formule",
  ],
  support: [
    "aide", "problème", "probleme", "erreur", "bug", "marche pas",
    "help", "issue", "fonctionne pas", "panne", "assistance",
    "support", "résoudre", "dépannage",
  ],
  technical: [
    "comment", "configurer", "installer", "intégrer", "integrer",
    "api", "code", "script", "setup", "implémenter", "implementer",
    "sdk", "webhook", "endpoint", "documentation",
  ],
};

export function detectIntent(message: string): Intent {
  const lower = message.toLowerCase().trim();

  // For very short messages (1-3 words), prioritize greeting/farewell detection
  const wordCount = lower.split(/\s+/).length;

  let bestIntent: Intent = "general";
  let bestScore = 0;

  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent as Intent;
    }
  }

  // For greeting/farewell, only skip RAG if the message is short (conversational)
  // "Bonjour, comment configurer mon widget ?" should NOT be treated as a simple greeting
  if ((bestIntent === "greeting" || bestIntent === "farewell") && wordCount > 4) {
    // Re-evaluate without greeting/farewell
    let secondBest: Intent = "general";
    let secondScore = 0;
    for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
      if (intent === "greeting" || intent === "farewell") continue;
      let score = 0;
      for (const keyword of keywords) {
        if (lower.includes(keyword)) {
          score++;
        }
      }
      if (score > secondScore) {
        secondScore = score;
        secondBest = intent as Intent;
      }
    }
    if (secondScore > 0) {
      return secondBest;
    }
    // If no other intent matches but message is long, treat as general (needs RAG)
    return "general";
  }

  return bestIntent;
}
