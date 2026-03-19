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
          "User-Agent": "ChatbotSaaS/1.0 (compatible; indexing bot)",
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) continue;
      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("text/html")) continue;

      const html = await response.text();
      const $ = cheerio.load(html);

      // Remove unwanted elements
      $("script, style, nav, footer, header, aside").remove();

      const title = $("title").text().trim() || $("h1").first().text().trim() || item.url;
      const mainContent = $("main, article, .content, #content").first();
      const text = (mainContent.length ? mainContent : $("body"))
        .text()
        .replace(/\s+/g, " ")
        .trim();

      if (text.length > 50) {
        results.push({ url: item.url, title, text });
      }

      // Find links to crawl
      if (item.depth < options.maxDepth) {
        $("a[href]").each((_, el) => {
          try {
            const href = $(el).attr("href");
            if (!href) return;
            const linkUrl = new URL(href, item.url);

            // Only crawl same domain
            if (linkUrl.hostname !== baseUrl.hostname) return;
            // Skip anchors, mailto, tel
            if (linkUrl.hash || linkUrl.protocol === "mailto:" || linkUrl.protocol === "tel:") return;
            // Skip common non-content paths
            if (/\.(png|jpg|jpeg|gif|svg|pdf|zip|css|js)$/i.test(linkUrl.pathname)) return;

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
