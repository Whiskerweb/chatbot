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
    ? `Assistant IA de ${options.agentName}. Réponds en te basant sur les DOCS ci-dessous. Si les docs contiennent l'info, utilise-les et cite [Source: titre]. Si les docs ne couvrent pas la question, aide quand même l'utilisateur du mieux possible en restant honnête sur ce que tu sais et ne sais pas. N'invente jamais de fausses informations. Langue = langue de la question.`
    : `Assistant IA de ${options.agentName}. Base tes réponses sur les DOCS ci-dessous en priorité. Reformule et synthétise naturellement. Cite [Source: titre]. Si info absente des docs, aide quand même l'utilisateur. Langue = langue de la question. Sois conversationnel.`;

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
