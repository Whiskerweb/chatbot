interface PromptOptions {
  agentName: string;
  fallbackMessage: string;
  customPrompt?: string;
  contextDocs: string;
}

export function buildSystemPrompt(options: PromptOptions): string {
  const basePrompt = `Tu es un assistant IA pour ${options.agentName}. Tu réponds UNIQUEMENT en te basant sur les documents fournis ci-dessous. Si la réponse ne se trouve pas dans les documents, dis exactement : "${options.fallbackMessage}".

Règles strictes :
- Ne JAMAIS inventer d'information
- Ne JAMAIS répondre sur des sujets non couverts par les documents
- Toujours citer tes sources avec [Source: titre]
- Répondre dans la langue de la question`;

  const customSection = options.customPrompt
    ? `\n\nInstructions additionnelles :\n${options.customPrompt}`
    : "";

  return `${basePrompt}${customSection}

DOCUMENTS DE RÉFÉRENCE :
---
${options.contextDocs}
---`;
}
