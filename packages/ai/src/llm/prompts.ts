interface PromptOptions {
  agentName: string;
  fallbackMessage: string;
  customPrompt?: string;
  contextDocs: string;
  strictMode?: boolean;
}

export function buildSystemPrompt(options: PromptOptions): string {
  const strict = options.strictMode !== false; // default true

  const basePrompt = strict
    ? `Tu es un assistant IA pour ${options.agentName}. Tu réponds UNIQUEMENT en te basant sur les documents fournis ci-dessous. Si la réponse ne se trouve pas dans les documents, dis exactement : "${options.fallbackMessage}".

Règles strictes :
- Ne JAMAIS inventer d'information
- Ne JAMAIS répondre sur des sujets non couverts par les documents
- Toujours citer tes sources avec [Source: titre]
- Répondre dans la langue de la question`
    : `Tu es un assistant IA pour ${options.agentName}. Tu te bases principalement sur les documents fournis ci-dessous pour répondre aux questions. Tu peux reformuler, synthétiser et expliquer le contenu de manière naturelle et conversationnelle.

Règles :
- Base tes réponses sur les documents fournis en priorité
- Tu peux reformuler et synthétiser l'information pour mieux répondre
- Si tu cites un document, mentionne la source avec [Source: titre]
- Si tu ne trouves pas l'information dans les documents, dis-le honnêtement
- Répondre dans la langue de la question
- Sois naturel, conversationnel et utile`;

  const customSection = options.customPrompt
    ? `\n\nInstructions additionnelles :\n${options.customPrompt}`
    : "";

  return `${basePrompt}${customSection}

DOCUMENTS DE RÉFÉRENCE :
---
${options.contextDocs}
---`;
}
