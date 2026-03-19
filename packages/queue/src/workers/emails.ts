import { Worker, Job } from "bullmq";
import { getRedisConnection } from "../connection";
import type { EmailJobData } from "../queues";

export function startEmailWorker() {
  const connection = getRedisConnection();
  if (!connection) return null;

  const worker = new Worker<EmailJobData>(
    "emails",
    async (job: Job<EmailJobData>) => {
      const { type, email, data } = job.data;

      switch (type) {
        case "credits-warning":
          await sendCreditsWarning(email, data);
          break;
        case "credits-exhausted":
          await sendCreditsExhausted(email, data);
          break;
        case "weekly-report":
          await sendWeeklyReport(email, data);
          break;
        case "escalation-notify":
          await sendEscalationNotify(email, data);
          break;
      }
    },
    { connection, concurrency: 5 }
  );

  worker.on("failed", (job, err) => {
    console.error(`Email job ${job?.id} failed:`, err);
  });

  return worker;
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[EMAIL MOCK] To: ${to}, Subject: ${subject}`);
    return;
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? "noreply@chatbot.com",
      to,
      subject,
      html,
    }),
  });
}

async function sendCreditsWarning(email: string, data: Record<string, unknown>) {
  await sendEmail(
    email,
    "Vous avez utilisé 80% de vos crédits",
    `<h1>Attention : crédits bientôt épuisés</h1>
     <p>Vous avez utilisé ${data.used} de vos ${data.total} crédits ce mois-ci.</p>
     <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing">Voir les plans disponibles</a></p>`
  );
}

async function sendCreditsExhausted(email: string, data: Record<string, unknown>) {
  await sendEmail(
    email,
    "Crédits épuisés — votre chatbot est en pause",
    `<h1>Crédits épuisés</h1>
     <p>Votre chatbot ne peut plus répondre aux visiteurs.</p>
     <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing">Upgrader votre plan</a></p>`
  );
}

async function sendWeeklyReport(email: string, data: Record<string, unknown>) {
  await sendEmail(
    email,
    "Rapport hebdomadaire de votre chatbot",
    `<h1>Votre semaine en chiffres</h1>
     <p>Conversations: ${data.conversations}</p>
     <p>Taux de déflection: ${data.deflection}%</p>`
  );
}

async function sendEscalationNotify(email: string, data: Record<string, unknown>) {
  await sendEmail(
    email,
    "Escalade : un visiteur demande un humain",
    `<h1>Conversation escaladée</h1>
     <p>Un visiteur demande à parler à un humain.</p>
     <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/inbox">Voir la conversation</a></p>`
  );
}
