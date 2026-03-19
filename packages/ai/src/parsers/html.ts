import * as cheerio from "cheerio";

export function parseHTML(html: string): { text: string; title: string } {
  const $ = cheerio.load(html);

  // Remove script, style, nav, footer, header elements
  $("script, style, nav, footer, header, aside, .nav, .footer, .header, .sidebar").remove();

  const title = $("title").text().trim() || $("h1").first().text().trim() || "Untitled";

  // Get main content, fallback to body
  const mainContent = $("main, article, .content, .main, #content, #main").first();
  const text = (mainContent.length ? mainContent : $("body")).text()
    .replace(/\s+/g, " ")
    .trim();

  return { text, title };
}
