export function parseMarkdown(content: string): { text: string; title: string } {
  // Extract title from first heading
  const titleMatch = content.match(/^#\s+(.+)/m);
  const title = titleMatch ? titleMatch[1].trim() : "Untitled";

  // Markdown is already text-friendly, just clean up
  const text = content
    .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1") // Convert links to text
    .trim();

  return { text, title };
}
