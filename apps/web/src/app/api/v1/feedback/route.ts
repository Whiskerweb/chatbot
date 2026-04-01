import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@chatbot/db";
import { z } from "zod";

const feedbackSchema = z.object({
  messageId: z.string(),
  score: z.number().refine((v) => v === -1 || v === 1 || v === 5),
  reason: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = feedbackSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { messageId, score, reason } = parsed.data;

    if (reason) {
      console.log(`[Feedback] messageId=${messageId} score=${score} reason="${reason}"`);
    }

    await prisma.message.update({
      where: { id: messageId },
      data: { feedbackScore: score },
    });

    return NextResponse.json(
      { success: true, reason: reason || null },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
