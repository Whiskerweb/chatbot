import { NextRequest } from "next/server";
import { prisma } from "@chatbot/db";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  // Rate limit to prevent analytics spam
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = rateLimit(`product-click:${ip}`, 60, 60_000);
  if (!limit.success) {
    return Response.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const productId = req.nextUrl.searchParams.get("id");
  const targetUrl = req.nextUrl.searchParams.get("url");

  // Security: validate URL scheme (block javascript:, data:, etc.)
  if (!targetUrl || !/^https?:\/\//i.test(targetUrl)) {
    return Response.json({ error: "Invalid URL" }, { status: 400 });
  }

  // Security: verify product exists and URL matches stored URL (anti open-redirect)
  if (productId) {
    try {
      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (product && product.url === targetUrl) {
        // Log click event (fire-and-forget)
        prisma.productEvent.create({
          data: {
            productId,
            agentId: product.agentId,
            eventType: "click",
            visitorId: req.headers.get("x-visitor-id") ?? undefined,
          },
        }).catch(console.error);
      }
    } catch {
      // Don't block redirect on DB errors
    }
  }

  return Response.redirect(targetUrl, 302);
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
