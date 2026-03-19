import { Worker, Job } from "bullmq";
import { getRedisConnection } from "../connection";
import type { AnalyticsJobData } from "../queues";
import { prisma } from "@chatbot/db";

export function startAnalyticsWorker() {
  const connection = getRedisConnection();
  if (!connection) return null;

  const worker = new Worker<AnalyticsJobData>(
    "analytics",
    async (job: Job<AnalyticsJobData>) => {
      switch (job.data.type) {
        case "compute-top-questions":
          await computeTopQuestions(job.data.agentId!);
          break;
        case "detect-gaps":
          await detectGaps(job.data.agentId!);
          break;
        case "reset-credits":
          await resetCredits();
          break;
      }
    },
    { connection, concurrency: 2 }
  );

  return worker;
}

async function computeTopQuestions(agentId: string) {
  // Get recent user messages
  const messages = await prisma.message.findMany({
    where: {
      role: "USER",
      conversation: { agentId },
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
    select: { content: true },
  });

  // Simple grouping by normalized content (in production, use embeddings)
  const questionCounts = new Map<string, number>();
  for (const msg of messages) {
    const normalized = msg.content.toLowerCase().trim();
    questionCounts.set(normalized, (questionCounts.get(normalized) ?? 0) + 1);
  }

  for (const [question, count] of questionCounts) {
    await prisma.topQuestion.upsert({
      where: { id: `${agentId}_${question.slice(0, 50)}` },
      create: {
        agentId,
        question,
        count,
        lastAskedAt: new Date(),
      },
      update: {
        count: { increment: count },
        lastAskedAt: new Date(),
      },
    });
  }
}

async function detectGaps(agentId: string) {
  // Find messages where the bot used fallback
  const fallbackMessages = await prisma.message.findMany({
    where: {
      role: "ASSISTANT",
      conversation: { agentId },
      content: { contains: "pas trouvé de réponse" },
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
    include: {
      conversation: {
        include: {
          messages: {
            where: { role: "USER" },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      },
    },
  });

  for (const msg of fallbackMessages) {
    const userQuestion = msg.conversation.messages[0]?.content;
    if (!userQuestion) continue;

    await prisma.topQuestion.upsert({
      where: { id: `${agentId}_gap_${userQuestion.slice(0, 50)}` },
      create: {
        agentId,
        question: userQuestion,
        count: 1,
        answered: false,
        lastAskedAt: new Date(),
      },
      update: {
        count: { increment: 1 },
        lastAskedAt: new Date(),
      },
    });
  }
}

async function resetCredits() {
  await prisma.organization.updateMany({
    data: { creditsUsed: 0, creditsResetAt: new Date() },
  });
  console.log("Credits reset for all organizations");
}
