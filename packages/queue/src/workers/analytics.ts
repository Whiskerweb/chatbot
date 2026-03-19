import { Worker, Job } from "bullmq";
import { getRedisConnection } from "../connection";
import type { AnalyticsJobData } from "../queues";
import { analyticsQueue } from "../queues";
import { prisma } from "@chatbot/db";
import { llmGateway } from "@chatbot/ai/llm/gateway";
import { isFeatureAvailable } from "@chatbot/shared";

const CATEGORY_COLORS = [
  "#0084ff", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#06b6d4", "#ec4899", "#84cc16", "#f97316", "#6366f1",
];

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
        case "categorize-questions":
          await categorizeQuestions(job.data.agentId!, job.data.orgId!);
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

  // Chain: trigger AI categorization for paid plans
  try {
    const agent = await prisma.agent.findUnique({ where: { id: agentId }, select: { orgId: true } });
    if (agent) {
      const org = await prisma.organization.findUnique({ where: { id: agent.orgId } });
      if (org && isFeatureAvailable(org.plan, 'aiAnalytics')) {
        await analyticsQueue?.add('categorize-questions', {
          type: 'categorize-questions',
          agentId,
          orgId: agent.orgId,
        });
      }
    }
  } catch (e) {
    console.error("Failed to chain categorize-questions:", e);
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

async function categorizeQuestions(agentId: string, orgId: string) {
  // 1. Check plan
  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  if (!org || !isFeatureAvailable(org.plan, 'aiAnalytics')) return;

  // 2. Get top questions (answered, count >= 2, limit 100)
  const questions = await prisma.topQuestion.findMany({
    where: { agentId, answered: true, count: { gte: 2 } },
    orderBy: { count: 'desc' },
    take: 100,
  });

  if (questions.length < 3) return; // Not enough data

  // 3. Call LLM
  const prompt = `Tu es un analyste de données. Voici une liste de questions fréquentes posées par les utilisateurs d'un chatbot. Regroupe-les en 5 à 10 catégories thématiques.

Questions :
${questions.map((q, i) => `${i + 1}. "${q.question}" (posée ${q.count} fois)`).join('\n')}

Réponds UNIQUEMENT avec un JSON valide au format :
[{"label": "Nom de la catégorie", "description": "Brève description", "questionIndices": [1, 3, 5]}]`;

  try {
    const response = await llmGateway.chat({
      model: "GPT4O_MINI" as any,
      messages: [
        { role: "system", content: "Tu es un analyste de données. Réponds uniquement en JSON valide." },
        { role: "user", content: prompt },
      ],
      maxTokens: 2048,
      temperature: 0.3,
    });

    // Parse JSON from response (handle markdown code blocks)
    let jsonStr = response.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const categories = JSON.parse(jsonStr) as Array<{
      label: string;
      description: string;
      questionIndices: number[];
    }>;

    // 4. Delete old categories for this agent
    await prisma.questionCategory.deleteMany({ where: { agentId } });

    // 5. Create new categories
    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      const matchedQuestions = cat.questionIndices
        .map((idx) => questions[idx - 1])
        .filter(Boolean);

      const totalCount = matchedQuestions.reduce((sum, q) => sum + q.count, 0);

      await prisma.questionCategory.create({
        data: {
          agentId,
          label: cat.label,
          description: cat.description || null,
          questionIds: matchedQuestions.map((q) => q.id),
          count: totalCount,
          color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
          computedAt: new Date(),
        },
      });
    }

    console.log(`Categorized ${questions.length} questions into ${categories.length} categories for agent ${agentId}`);
  } catch (error) {
    console.error("Failed to categorize questions:", error);
  }
}
