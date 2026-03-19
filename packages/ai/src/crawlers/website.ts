import * as cheerio from "cheerio";

interface CrawlOptions {
  url: string;
  maxDepth: number;
  maxPages: number;
}

interface CrawlResult {
  url: string;
  title: string;
  text: string;
}

/**
 * Extract clean, readable text from HTML by removing noise elements
 * and focusing on meaningful content.
 */
function extractCleanText($: cheerio.CheerioAPI): string {
  // Remove all non-content elements
  $(
    [
      "script", "style", "noscript", "iframe", "object", "embed", "applet",
      "nav", "footer", "header", "aside",
      ".nav", ".navbar", ".navigation", ".menu", ".sidebar", ".footer", ".header",
      ".cookie-banner", ".cookie-consent", ".popup", ".modal", ".overlay",
      ".social-share", ".share-buttons", ".social-links",
      ".ad", ".ads", ".advertisement", ".banner",
      ".breadcrumb", ".breadcrumbs", ".pagination",
      "[role='navigation']", "[role='banner']", "[role='contentinfo']",
      "[aria-hidden='true']",
      "svg", "canvas", "video", "audio",
      "form", "input", "select", "textarea", "button",
      "img", "figure", "picture",
    ].join(", ")
  ).remove();

  // Try to find main content area
  const contentSelectors = [
    "main", "article", "[role='main']",
    ".content", ".main-content", ".page-content", ".post-content",
    ".article-content", ".entry-content", ".prose",
    "#content", "#main", "#main-content",
  ];

  let contentEl: cheerio.Cheerio<cheerio.Element> | null = null;
  for (const selector of contentSelectors) {
    const el = $(selector).first();
    if (el.length && el.text().trim().length > 100) {
      contentEl = el;
      break;
    }
  }

  const source = contentEl ?? $("body");

  // Extract text with structure preserved
  const blocks: string[] = [];

  source.find("h1, h2, h3, h4, h5, h6, p, li, td, th, blockquote, pre, dd, dt").each((_, el) => {
    const tag = (el as cheerio.Element).tagName?.toLowerCase();
    let text = $(el).text().replace(/\s+/g, " ").trim();

    if (!text || text.length < 3) return;

    // Add markdown-style headings
    if (tag?.startsWith("h")) {
      const level = parseInt(tag[1]);
      text = "#".repeat(level) + " " + text;
    }

    // Skip if it looks like UI noise (very short + no real words)
    if (text.length < 10 && !/[a-zA-ZÀ-ÿ]{3,}/.test(text)) return;

    blocks.push(text);
  });

  // If structured extraction gave too little, fall back to full text
  if (blocks.join("\n").length < 100) {
    return source
      .text()
      .replace(/\s+/g, " ")
      .replace(/(.)\1{4,}/g, "$1") // Remove repeated chars (e.g. "====")
      .trim();
  }

  // Deduplicate consecutive identical lines
  const deduped: string[] = [];
  for (const block of blocks) {
    if (deduped[deduped.length - 1] !== block) {
      deduped.push(block);
    }
  }

  return deduped.join("\n\n");
}

export async function crawlWebsite(options: CrawlOptions): Promise<CrawlResult[]> {
  const visited = new Set<string>();
  const results: CrawlResult[] = [];
  const queue: { url: string; depth: number }[] = [{ url: options.url, depth: 0 }];

  const baseUrl = new URL(options.url);

  while (queue.length > 0 && results.length < options.maxPages) {
    const item = queue.shift()!;

    if (visited.has(item.url) || item.depth > options.maxDepth) continue;
    visited.add(item.url);

    try {
      const response = await fetch(item.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; ChatbotSaaS/1.0; +https://chatbot-ai.com/bot)",
          "Accept": "text/html,application/xhtml+xml",
          "Accept-Language": "fr,en;q=0.9",
        },
        signal: AbortSignal.timeout(15000),
        redirect: "follow",
      });

      if (!response.ok) continue;
      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("text/html")) continue;

      const html = await response.text();
      const $ = cheerio.load(html);

      const title = $("title").text().trim()
        || $("h1").first().text().trim()
        || $('meta[property="og:title"]').attr("content")?.trim()
        || item.url;

      const text = extractCleanText($);

      // Only keep pages with meaningful content (at least 50 chars of real text)
      if (text.length > 50) {
        results.push({ url: item.url, title, text });
      }

      // Find links to crawl
      if (item.depth < options.maxDepth) {
        // Re-load to get links (we removed elements from the DOM above)
        const $links = cheerio.load(html);
        $links("a[href]").each((_, el) => {
          try {
            const href = $links(el).attr("href");
            if (!href) return;
            const linkUrl = new URL(href, item.url);

            // Only crawl same domain
            if (linkUrl.hostname !== baseUrl.hostname) return;
            // Skip anchors, mailto, tel
            if (linkUrl.hash || linkUrl.protocol === "mailto:" || linkUrl.protocol === "tel:") return;
            // Skip common non-content paths
            if (/\.(png|jpg|jpeg|gif|svg|pdf|zip|css|js|woff2?|ttf|eot|ico|mp4|mp3|webm)$/i.test(linkUrl.pathname)) return;
            // Skip common non-content URL patterns
            if (/\/(login|signin|signup|register|cart|checkout|admin|wp-admin|api)\b/i.test(linkUrl.pathname)) return;

            const cleanUrl = linkUrl.origin + linkUrl.pathname;
            if (!visited.has(cleanUrl)) {
              queue.push({ url: cleanUrl, depth: item.depth + 1 });
            }
          } catch {
            // Skip invalid URLs
          }
        });
      }
    } catch {
      // Skip failed fetches
    }
  }

  return results;
}
