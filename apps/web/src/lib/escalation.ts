interface EscalationParams {
  agent: {
    id: string;
    name: string;
    escalationEmail?: string | null;
    escalationSlackUrl?: string | null;
  };
  conversation: {
    id: string;
    visitorName?: string | null;
    visitorEmail?: string | null;
    messageCount: number;
  };
  lastMessage: string;
}

export async function triggerEscalation(params: EscalationParams): Promise<void> {
  const { agent, conversation, lastMessage } = params;
  const promises: Promise<void>[] = [];

  if (agent.escalationEmail) {
    promises.push(sendEscalationEmail(agent, conversation, lastMessage));
  }

  if (agent.escalationSlackUrl) {
    promises.push(sendSlackNotification(agent, conversation, lastMessage));
  }

  await Promise.allSettled(promises);
}

async function sendEscalationEmail(
  agent: EscalationParams["agent"],
  conversation: EscalationParams["conversation"],
  lastMessage: string
): Promise<void> {
  const subject = `🚨 Escalade - ${agent.name} - Conversation ${conversation.id.slice(0, 8)}`;
  const body = [
    `<h2>Escalade demandée</h2>`,
    `<p><strong>Agent :</strong> ${agent.name}</p>`,
    conversation.visitorName ? `<p><strong>Visiteur :</strong> ${conversation.visitorName}</p>` : "",
    conversation.visitorEmail ? `<p><strong>Email :</strong> ${conversation.visitorEmail}</p>` : "",
    `<p><strong>Messages échangés :</strong> ${conversation.messageCount}</p>`,
    `<p><strong>Dernier message :</strong></p>`,
    `<blockquote>${lastMessage.slice(0, 500)}</blockquote>`,
    `<p><a href="${process.env.NEXT_PUBLIC_APP_URL || "https://helloclaudia.fr"}/dashboard/inbox?conversationId=${conversation.id}">Voir la conversation</a></p>`,
  ].join("\n");

  if (process.env.RESEND_API_KEY) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Claudia <notifications@helloclaudia.fr>",
        to: [agent.escalationEmail],
        subject,
        html: body,
      }),
    });
    if (!res.ok) {
      console.error("[Escalation] Email send failed:", await res.text());
    }
  } else {
    console.log("[Escalation] Would send email to:", agent.escalationEmail, "Subject:", subject);
  }
}

async function sendSlackNotification(
  agent: EscalationParams["agent"],
  conversation: EscalationParams["conversation"],
  lastMessage: string
): Promise<void> {
  if (!agent.escalationSlackUrl) return;

  const conversationUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://helloclaudia.fr"}/dashboard/inbox?conversationId=${conversation.id}`;

  const payload = {
    text: `🚨 Escalade demandée - ${agent.name}`,
    blocks: [
      {
        type: "header",
        text: { type: "plain_text", text: `🚨 Escalade - ${agent.name}`, emoji: true },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Visiteur :*\n${conversation.visitorName || "Anonyme"}` },
          { type: "mrkdwn", text: `*Email :*\n${conversation.visitorEmail || "Non renseigné"}` },
          { type: "mrkdwn", text: `*Messages :*\n${conversation.messageCount}` },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Dernier message :*\n>${lastMessage.slice(0, 300).replace(/\n/g, "\n>")}`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "Voir la conversation", emoji: true },
            url: conversationUrl,
            style: "primary",
          },
        ],
      },
    ],
  };

  const res = await fetch(agent.escalationSlackUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error("[Escalation] Slack notification failed:", res.status);
  }
}
