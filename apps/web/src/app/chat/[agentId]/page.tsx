import { notFound } from "next/navigation";
import { prisma } from "@chatbot/db";
import { ChatClient } from "@/components/chat/chat-client";
import type { Metadata } from "next";

interface Props {
  params: { agentId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const agent = await prisma.agent.findFirst({
    where: {
      OR: [{ id: params.agentId }, { slug: params.agentId }],
      isActive: true,
    },
    select: { name: true, welcomeMessage: true },
  });

  if (!agent) return { title: "Chat" };

  return {
    title: `Chat with ${agent.name}`,
    description: agent.welcomeMessage,
    openGraph: {
      title: `Chat with ${agent.name}`,
      description: agent.welcomeMessage,
    },
    robots: "noindex",
  };
}

export default async function ChatPage({ params }: Props) {
  const agent = await prisma.agent.findFirst({
    where: {
      OR: [{ id: params.agentId }, { slug: params.agentId }],
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      primaryColor: true,
      avatarUrl: true,
      welcomeMessage: true,
      suggestedQuestions: true,
      leadCaptureEnabled: true,
      leadCaptureFields: true,
      widgetConfig: true,
      isActive: true,
      org: { select: { plan: true } },
    },
  });

  if (!agent) {
    notFound();
  }

  const config = {
    agentId: agent.id,
    name: agent.name,
    primaryColor: agent.primaryColor,
    avatarUrl: agent.avatarUrl,
    welcomeMessage: agent.welcomeMessage,
    suggestedQuestions: agent.suggestedQuestions,
    leadCaptureEnabled: agent.leadCaptureEnabled,
    leadCaptureFields: agent.leadCaptureFields as Record<string, boolean> | null,
    widgetConfig: agent.widgetConfig as Record<string, unknown> | null,
  };

  return <ChatClient config={config} />;
}
