import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@chatbot/db";
import { z } from "zod";

const feedbackSchema = z.object({
  messageId: z.string(),
  score: z.number().refine((v) => v === 1 || v === 5),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = feedbackSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await prisma.message.update({
      where: { id: parsed.data.messageId },
      data: { feedbackScore: parsed.data.score },
    });

    return NextResponse.json(
      { success: true },
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
