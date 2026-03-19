interface ChunkOptions {
  maxTokens?: number;
  overlap?: number;
  minTokens?: number;
}

interface ChunkResult {
  content: string;
  tokenCount: number;
  metadata: {
    position: number;
    headingPath?: string;
    pageUrl?: string;
    pageTitle?: string;
  };
}

const DEFAULT_OPTIONS: Required<ChunkOptions> = {
  maxTokens: 512,
  overlap: 64,
  minTokens: 50,
};

// Rough token estimation: ~4 chars per token for English, ~3 for French
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 3.5);
}

function splitByHeadings(text: string): string[] {
  // Split by markdown headings (# ## ### etc.)
  const sections = text.split(/(?=^#{1,3}\s)/m);
  return sections.filter((s) => s.trim().length > 0);
}

function splitByParagraphs(text: string): string[] {
  return text.split(/\n\s*\n/).filter((s) => s.trim().length > 0);
}

function splitBySentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0);
}

export const chunker = {
  chunk(text: string, options?: ChunkOptions): ChunkResult[] {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const chunks: ChunkResult[] = [];

    // Step 1: Split by headings first
    const sections = splitByHeadings(text);

    let position = 0;
    for (const section of sections) {
      const sectionTokens = estimateTokens(section);

      // Extract heading for metadata
      const headingMatch = section.match(/^(#{1,3})\s+(.+)/m);
      const headingPath = headingMatch ? headingMatch[2].trim() : undefined;

      if (sectionTokens <= opts.maxTokens) {
        if (sectionTokens >= opts.minTokens) {
          chunks.push({
            content: section.trim(),
            tokenCount: sectionTokens,
            metadata: { position: position++, headingPath },
          });
        } else if (chunks.length > 0) {
          // Merge with previous chunk if too short
          const prev = chunks[chunks.length - 1];
          prev.content += "\n\n" + section.trim();
          prev.tokenCount = estimateTokens(prev.content);
        }
        continue;
      }

      // Step 2: Section too long, split by paragraphs
      const paragraphs = splitByParagraphs(section);
      let currentChunk = "";

      for (const para of paragraphs) {
        const paraTokens = estimateTokens(para);

        if (paraTokens > opts.maxTokens) {
          // Step 3: Paragraph too long, split by sentences
          if (currentChunk) {
            chunks.push({
              content: currentChunk.trim(),
              tokenCount: estimateTokens(currentChunk),
              metadata: { position: position++, headingPath },
            });
            currentChunk = "";
          }

          const sentences = splitBySentences(para);
          let sentenceChunk = "";

          for (const sentence of sentences) {
            if (estimateTokens(sentenceChunk + " " + sentence) > opts.maxTokens) {
              if (sentenceChunk) {
                chunks.push({
                  content: sentenceChunk.trim(),
                  tokenCount: estimateTokens(sentenceChunk),
                  metadata: { position: position++, headingPath },
                });
              }
              sentenceChunk = sentence;
            } else {
              sentenceChunk += (sentenceChunk ? " " : "") + sentence;
            }
          }

          if (sentenceChunk) {
            currentChunk = sentenceChunk;
          }
          continue;
        }

        if (estimateTokens(currentChunk + "\n\n" + para) > opts.maxTokens) {
          if (currentChunk) {
            chunks.push({
              content: currentChunk.trim(),
              tokenCount: estimateTokens(currentChunk),
              metadata: { position: position++, headingPath },
            });

            // Add overlap from end of previous chunk
            const overlapText = currentChunk.slice(-opts.overlap * 4);
            currentChunk = overlapText + "\n\n" + para;
          } else {
            currentChunk = para;
          }
        } else {
          currentChunk += (currentChunk ? "\n\n" : "") + para;
        }
      }

      if (currentChunk && estimateTokens(currentChunk) >= opts.minTokens) {
        chunks.push({
          content: currentChunk.trim(),
          tokenCount: estimateTokens(currentChunk),
          metadata: { position: position++, headingPath },
        });
      } else if (currentChunk && chunks.length > 0) {
        const prev = chunks[chunks.length - 1];
        prev.content += "\n\n" + currentChunk.trim();
        prev.tokenCount = estimateTokens(prev.content);
      }
    }

    return chunks;
  },
};
