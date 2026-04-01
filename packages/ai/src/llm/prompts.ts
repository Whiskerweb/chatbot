interface PromptProduct {
  name: string;
  description: string;
  url: string;
  price?: string;
}

interface PromptOptions {
  agentName: string;
  fallbackMessage: string;
  customPrompt?: string;
  contextDocs: string;
  strictMode?: boolean;
  promotedProducts?: PromptProduct[];
}

export function buildSystemPrompt(options: PromptOptions): string {
  const strict = options.strictMode !== false; // default true

  const basePrompt = strict
    ? `Assistant IA de ${options.agentName}. Réponds UNIQUEMENT depuis les DOCS ci-dessous. Hors docs : "${options.fallbackMessage}". Cite [Source: titre]. Langue = langue de la question. Aucune invention.`
    : `Assistant IA de ${options.agentName}. Base tes réponses sur les DOCS ci-dessous en priorité. Reformule et synthétise naturellement. Cite [Source: titre]. Si info absente des docs, dis-le. Langue = langue de la question. Sois conversationnel.`;

  const customSection = options.customPrompt
    ? `\n\nInstructions additionnelles :\n${options.customPrompt}`
    : "";

  const productSection = options.promotedProducts?.length
    ? `\n\nPRODUITS (mentionne naturellement si pertinent, avec le lien) :\n${options.promotedProducts
        .map((p) => `- [${p.name}](${p.url}) : ${p.description}${p.price ? `. Prix: ${p.price}` : ""}`)
        .join("\n")}`
    : "";

  return `${basePrompt}${customSection}${productSection}

DOCS:
${options.contextDocs}`;
}
