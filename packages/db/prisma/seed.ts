import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create demo organization
  const org = await prisma.organization.upsert({
    where: { slug: "demo-org" },
    update: {},
    create: {
      name: "Demo Organization",
      slug: "demo-org",
      plan: "FREE",
      creditsTotal: 100,
      creditsUsed: 0,
      creditsResetAt: new Date(),
    },
  });
  console.log("Created org:", org.id);

  // Create demo member
  const member = await prisma.member.upsert({
    where: { orgId_clerkUserId: { orgId: org.id, clerkUserId: "demo-user" } },
    update: {},
    create: {
      orgId: org.id,
      clerkUserId: "demo-user",
      email: "demo@chatbot.com",
      name: "Demo User",
      role: "OWNER",
    },
  });
  console.log("Created member:", member.id);

  // Create demo agent
  const agent = await prisma.agent.upsert({
    where: { orgId_slug: { orgId: org.id, slug: "support-client" } },
    update: {},
    create: {
      orgId: org.id,
      name: "Support Client",
      slug: "support-client",
      description: "Agent de support principal pour les clients",
      model: "GPT4O_MINI",
      temperature: 0.3,
      systemPrompt: "",
      strictMode: true,
      fallbackMessage: "Désolé, je n'ai pas trouvé de réponse dans la documentation.",
      welcomeMessage: "Bonjour ! Comment puis-je vous aider ?",
      suggestedQuestions: [
        "Comment réinitialiser mon mot de passe ?",
        "Quels sont vos tarifs ?",
        "Comment contacter le support ?",
      ],
      primaryColor: "#1A56DB",
    },
  });
  console.log("Created agent:", agent.id);

  // Create demo sources
  const source1 = await prisma.source.upsert({
    where: { id: "demo-source-1" },
    update: {},
    create: {
      id: "demo-source-1",
      agentId: agent.id,
      type: "TEXT_RAW",
      name: "FAQ Produit",
      status: "INDEXED",
      pagesCount: 1,
      chunksCount: 5,
      lastIndexedAt: new Date(),
    },
  });

  const source2 = await prisma.source.upsert({
    where: { id: "demo-source-2" },
    update: {},
    create: {
      id: "demo-source-2",
      agentId: agent.id,
      type: "WEBSITE",
      name: "docs.example.com",
      url: "https://docs.example.com",
      status: "INDEXED",
      pagesCount: 12,
      chunksCount: 48,
      lastIndexedAt: new Date(),
    },
  });
  console.log("Created sources");

  // Create demo chunks for the FAQ source
  const faqChunks = [
    {
      content: "Comment réinitialiser mon mot de passe ?\n\nPour réinitialiser votre mot de passe, suivez ces étapes :\n1. Cliquez sur 'Mot de passe oublié' sur la page de connexion\n2. Entrez votre adresse email\n3. Vérifiez votre boîte mail et cliquez sur le lien reçu\n4. Choisissez un nouveau mot de passe d'au moins 8 caractères\n\nSi vous ne recevez pas l'email, vérifiez votre dossier spam.",
      tokenCount: 80,
    },
    {
      content: "Quels sont vos tarifs ?\n\nNous proposons plusieurs plans :\n- Free : 0€/mois, 100 crédits, 1 agent\n- Starter : 29€/mois, 3000 crédits, 3 agents\n- Pro : 79€/mois, 15000 crédits, 10 agents, tous les modèles IA\n- Growth : 199€/mois, 50000 crédits, 25 agents, white-label inclus\n\nTous les plans incluent un essai gratuit.",
      tokenCount: 85,
    },
    {
      content: "Comment contacter le support ?\n\nVous pouvez nous contacter de plusieurs façons :\n- Email : support@example.com (réponse sous 24h)\n- Chat en direct : disponible du lundi au vendredi de 9h à 18h\n- Centre d'aide : docs.example.com/help\n- Téléphone : +33 1 23 45 67 89 (plan Pro et supérieur)",
      tokenCount: 70,
    },
    {
      content: "Comment fonctionne le système de crédits ?\n\nChaque action consomme des crédits :\n- Message IA : 1 à 5 crédits selon le modèle choisi\n- Indexation d'une page web : 2 crédits\n- Indexation d'un PDF : 1 crédit par page\n- Export CSV : 5 crédits\n\nLes crédits sont réinitialisés chaque mois. Vous pouvez suivre votre consommation dans le dashboard.",
      tokenCount: 75,
    },
    {
      content: "Comment intégrer le chatbot sur mon site ?\n\nL'intégration est simple et ne prend qu'une minute :\n1. Allez dans l'onglet Déploiement de votre agent\n2. Copiez le code JavaScript (une seule ligne)\n3. Collez-le juste avant la balise </body> de votre site\n\nLe widget apparaîtra automatiquement en bas à droite de votre page. Vous pouvez personnaliser sa couleur et sa position dans l'onglet Personnalisation.",
      tokenCount: 80,
    },
  ];

  for (let i = 0; i < faqChunks.length; i++) {
    await prisma.chunk.upsert({
      where: { pineconeId: `demo-chunk-${i}` },
      update: {},
      create: {
        sourceId: source1.id,
        content: faqChunks[i].content,
        tokenCount: faqChunks[i].tokenCount,
        pineconeId: `demo-chunk-${i}`,
        metadata: { position: i, headingPath: faqChunks[i].content.split("\n")[0] },
      },
    });
  }
  console.log("Created demo chunks");

  // Create demo conversations
  for (let i = 0; i < 5; i++) {
    const conv = await prisma.conversation.create({
      data: {
        agentId: agent.id,
        visitorId: `visitor-${i}`,
        visitorName: i === 0 ? "Jean Dupont" : i === 1 ? "Marie Martin" : undefined,
        visitorEmail: i === 0 ? "jean@example.com" : i === 1 ? "marie@startup.co" : undefined,
        status: i === 2 ? "ESCALATED" : i >= 3 ? "CLOSED" : "ACTIVE",
        channel: "WIDGET",
        messageCount: 4,
        resolved: i >= 3,
        escalated: i === 2,
        visitorMeta: { country: "FR", device: "Desktop", browser: "Chrome" },
      },
    });

    const questions = [
      "Comment réinitialiser mon mot de passe ?",
      "Quels sont vos tarifs ?",
      "Proposez-vous une API REST ?",
      "Comment contacter le support ?",
      "Comment intégrer le chatbot ?",
    ];

    const answers = [
      "Pour réinitialiser votre mot de passe, cliquez sur 'Mot de passe oublié' sur la page de connexion, entrez votre email et suivez le lien reçu. [Source: FAQ Produit]",
      "Nous proposons 4 plans : Free (0€), Starter (29€), Pro (79€) et Growth (199€). Le plan Pro est le plus populaire. [Source: FAQ Produit]",
      "Désolé, je n'ai pas trouvé de réponse dans la documentation.",
      "Vous pouvez nous contacter par email à support@example.com ou via le chat en direct du lundi au vendredi. [Source: FAQ Produit]",
      "L'intégration est très simple : copiez le code JavaScript depuis l'onglet Déploiement et collez-le dans votre site. [Source: FAQ Produit]",
    ];

    await prisma.message.create({
      data: { conversationId: conv.id, role: "USER", content: questions[i], createdAt: new Date(Date.now() - 3600000 * (5 - i)) },
    });
    await prisma.message.create({
      data: {
        conversationId: conv.id,
        role: "ASSISTANT",
        content: answers[i],
        model: "GPT4O_MINI",
        creditsUsed: 1,
        latencyMs: 800 + Math.random() * 500,
        createdAt: new Date(Date.now() - 3600000 * (5 - i) + 2000),
      },
    });
    await prisma.message.create({
      data: { conversationId: conv.id, role: "USER", content: "Merci !", createdAt: new Date(Date.now() - 3600000 * (5 - i) + 60000) },
    });
    await prisma.message.create({
      data: {
        conversationId: conv.id,
        role: "ASSISTANT",
        content: "Je vous en prie ! N'hésitez pas si vous avez d'autres questions.",
        model: "GPT4O_MINI",
        creditsUsed: 1,
        createdAt: new Date(Date.now() - 3600000 * (5 - i) + 62000),
      },
    });
  }
  console.log("Created demo conversations");

  // Create demo credit logs
  const actions = ["MESSAGE_AI", "INDEXING", "MESSAGE_AI", "MESSAGE_AI", "INDEXING"] as const;
  for (let i = 0; i < 20; i++) {
    await prisma.creditLog.create({
      data: {
        orgId: org.id,
        agentId: agent.id,
        action: actions[i % actions.length],
        credits: actions[i % actions.length] === "INDEXING" ? 2 : 1,
        createdAt: new Date(Date.now() - i * 3600000),
      },
    });
  }
  console.log("Created demo credit logs");

  // Update org credits used
  await prisma.organization.update({
    where: { id: org.id },
    data: { creditsUsed: 24 },
  });

  // Create demo top questions
  const topQuestions = [
    { question: "Comment réinitialiser mon mot de passe ?", count: 45, answered: true },
    { question: "Quels sont vos tarifs ?", count: 38, answered: true },
    { question: "Comment contacter le support ?", count: 29, answered: true },
    { question: "Proposez-vous une API ?", count: 22, answered: false },
    { question: "Comment annuler mon abonnement ?", count: 18, answered: true },
    { question: "Intégration avec Salesforce ?", count: 15, answered: false },
    { question: "RGPD et données personnelles ?", count: 12, answered: false },
  ];

  for (const q of topQuestions) {
    await prisma.topQuestion.create({
      data: {
        agentId: agent.id,
        question: q.question,
        count: q.count,
        answered: q.answered,
        lastAskedAt: new Date(),
      },
    });
  }
  console.log("Created demo top questions");

  // Create second agent
  await prisma.agent.upsert({
    where: { orgId_slug: { orgId: org.id, slug: "faq-produit" } },
    update: {},
    create: {
      orgId: org.id,
      name: "FAQ Produit",
      slug: "faq-produit",
      description: "Répond aux questions sur les produits et services",
      model: "CLAUDE_HAIKU",
      temperature: 0.2,
      systemPrompt: "",
      strictMode: true,
      fallbackMessage: "Je n'ai pas la réponse à cette question. Contactez notre équipe commerciale.",
      welcomeMessage: "Bonjour ! Posez-moi vos questions sur nos produits.",
      primaryColor: "#059669",
    },
  });
  console.log("Created second agent");

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
