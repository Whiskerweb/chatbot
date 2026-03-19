import * as cheerio from "cheerio";

interface SitemapUrl {
  url: string;
  lastmod?: string;
  priority?: number;
}

export async function parseSitemap(sitemapUrl: string): Promise<SitemapUrl[]> {
  const response = await fetch(sitemapUrl, {
    headers: { "User-Agent": "ChatbotSaaS/1.0 (compatible; indexing bot)" },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) throw new Error(`Failed to fetch sitemap: ${response.status}`);

  const xml = await response.text();
  const $ = cheerio.load(xml, { xmlMode: true });
  const urls: SitemapUrl[] = [];

  // Handle sitemap index (sitemapindex > sitemap > loc)
  const sitemapLocs = $("sitemapindex sitemap loc");
  if (sitemapLocs.length > 0) {
    for (let i = 0; i < sitemapLocs.length; i++) {
      const subSitemapUrl = $(sitemapLocs[i]).text().trim();
      try {
        const subUrls = await parseSitemap(subSitemapUrl);
        urls.push(...subUrls);
      } catch {
        // Skip failed sub-sitemaps
      }
    }
    return urls;
  }

  // Handle regular sitemap (urlset > url > loc)
  $("urlset url").each((_, el) => {
    const loc = $(el).find("loc").text().trim();
    const lastmod = $(el).find("lastmod").text().trim() || undefined;
    const priority = parseFloat($(el).find("priority").text()) || undefined;
    if (loc) {
      urls.push({ url: loc, lastmod, priority });
    }
  });

  return urls;
}
