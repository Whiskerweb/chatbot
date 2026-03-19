# PRD TECHNIQUE — Plateforme SaaS de Chatbot IA

> **Version 2.0 | Mars 2026**
> Document de référence pour le développement. Chaque section est directement implémentable par Claude Code.

---

## 1. Vision et principes

Ce PRD est un document exécutable. Chaque section est écrite pour être directement copiée dans Claude Code. Il décrit l'architecture complète, le schéma de base de données, les routes API, le système de crédits, la structure de fichiers, et le comportement de chaque composant.

### 1.1 Pitch

Permettre à toute entreprise de déployer un chatbot IA entraîné sur sa documentation en moins de 10 minutes, avec un dashboard complet pour piloter la performance, un système de crédits transparent et une expérience d'onboarding inégalée.

### 1.2 Principes fondateurs

- **Free-first** : un plan gratuit fonctionnel (pas un trial déguisé). L'utilisateur doit pouvoir tester le produit réellement.
- **Crédits transparents** : chaque action IA consomme des crédits visibles en temps réel dans le dashboard. Pas de surprise.
- **Dashboard-centric** : les startups doivent voir tout — questions fréquentes, gaps documentaires, ROI, tendances.
- **Coûts absorbés** : les coûts API LLM sont internes. L'utilisateur ne voit que ses crédits, jamais les coûts OpenAI/Anthropic.
- **Claude Code-ready** : chaque spec est assez précise pour être codée sans ambiguïté. Schéma SQL, routes, types, tout est là.

---

## 2. Business model et système de crédits

### 2.1 Philosophie économique

Les coûts API (OpenAI, Anthropic, etc.) sont gérés en interne et absorbés dans le prix de l'abonnement. L'utilisateur voit uniquement ses crédits. Le prix est calculé pour couvrir les coûts API moyens avec une marge de 60-70%. Le système de crédits crée un upgrade path naturel : plus le chatbot est utilisé, plus il consomme, et l'utilisateur monte en plan organiquement.

### 2.2 Grille de consommation de crédits

#### Messages IA (par message envoyé par le chatbot)

| Modèle LLM | Crédits/msg | Coût API réel est. | Marge |
|---|---|---|---|
| GPT-4o mini / Haiku / Gemini Flash | 1 | ~0.001$ | ~90% |
| GPT-4o / Sonnet / Gemini Pro | 3 | ~0.008$ | ~70% |
| Claude Opus / GPT-4 Turbo | 5 | ~0.02$ | ~60% |

#### Indexation de sources

| Action | Crédits |
|---|---|
| Indexation d'une page web crawlée | 2 |
| Indexation d'un fichier PDF (par page) | 1 / page |
| Indexation fichier DOCX/TXT/MD | 1 / 1000 mots |
| Re-indexation (auto-sync) | 0.5 / page (50% réduc) |
| Connecteur Notion/Drive (par page sync) | 1 / page |

#### Autres actions

| Action | Crédits |
|---|---|
| Export CSV des leads/conversations | 5 |
| Appel API externe (webhook action) | 2 |
| Traduction auto dans l'inbox | 1 |
| Suggestion d'amélioration IA | 3 |

### 2.3 Plans tarifaires

Chaque plan inclut un volume de crédits mensuel. Les crédits non utilisés ne sont PAS reportés. Un dashboard en temps réel montre la consommation.

| | Free | Starter 29$ | Pro 79$ | Growth 199$ | Business 399$ |
|---|---|---|---|---|---|
| **Crédits/mois** | 100 | 3 000 | 15 000 | 50 000 | 200 000 |
| **Agents** | 1 | 3 | 10 | 25 | Illimité |
| **Sources max** | 30 | 500 | 5 000 | 15 000 | 50 000 |
| **Modèles IA** | Mini/Haiku | + Sonnet | Tous+BYOK | Tous+BYOK | Tous+BYOK |
| **Live chat** | - | Oui | Oui | Oui | Oui |
| **White-label** | - | - | +49$/m | Inclus | Inclus |
| **Auto-sync** | - | Hebdo | Quotidien | 4x/jour | Temps réel |
| **API/MCP** | - | API | API+MCP | API+MCP | Tout+SDK |
| **Membres équipe** | 1 | 2 | 5 | 15 | Illimité |
| **Rétention logs** | 7 jours | 30 jours | 90 jours | 1 an | Illimité |
| **Support** | Community | Email 48h | Chat 24h | Prioritaire | Dédié+SLA |

### 2.4 Logique d'upgrade / mécanisme d'upsell

Le système de crédits est le moteur principal d'upsell :

1. Quand l'utilisateur atteint **80%** de ses crédits → bannière dans le dashboard : "Vous avez utilisé 80% de vos crédits ce mois-ci"
2. À **100%** → le chatbot continue de fonctionner mais affiche un message générique au visiteur ("Revenez bientôt") et le dashboard montre un CTA d'upgrade
3. Un **email automatique** est envoyé à 80% et 100% avec comparaison des plans
4. Dans les analytics, les **features bloquées** sont visibles mais grisées avec un badge "Pro" ou "Growth"
5. Le dashboard montre des **projections** : "À ce rythme, vous aurez besoin de X crédits. Le plan Pro vous conviendrait."

---

## 3. Stack technique

### 3.1 Stack principale

| Composant | Technologie | Justification |
|---|---|---|
| Frontend | Next.js 14 (App Router) | SSR, RSC, routing filesystem, standard marché |
| UI Kit | shadcn/ui + TailwindCSS | Composants accessibles, customisables, pas de lock-in |
| Backend API | Next.js API Routes + tRPC | Full-stack dans un mono-repo, typesafe end-to-end |
| Base de données | PostgreSQL (Supabase) | Mature, gratuit pour commencer, RLS, realtime |
| ORM | Prisma | Schéma déclaratif, migrations auto, typesafe |
| Vector DB | Pinecone (Starter gratuit) | Managed, performant, serverless, 0 ops |
| Cache / Queue | Redis (Upstash) + BullMQ | Serverless Redis, queues pour jobs async |
| Storage fichiers | Cloudflare R2 (S3-compat) | Pas de frais d'egress, compatible S3 |
| Auth | Clerk | SSO/SAML ready, webhooks, orgs/teams built-in |
| LLM Gateway | LiteLLM (self-hosted) ou Portkey | Routing multi-modèles, fallback, cost tracking |
| Paiement | Stripe (Subscriptions + Usage) | Standard, webhooks, portail client |
| Email | Resend | DX excellent, React Email templates |
| Monitoring | Sentry + PostHog | Errors + product analytics, plans gratuits généreux |
| Deploy | Vercel (front+API) + Fly.io (workers) | Vercel pour Next.js natif, Fly pour long-running jobs |

### 3.2 Structure du mono-repo

```
/
├── apps/
│   ├── web/                        # Next.js app (dashboard + landing)
│   │   └── src/
│   │       ├── app/                # App Router pages
│   │       │   ├── (auth)/         # Routes auth (login, register)
│   │       │   ├── (dashboard)/    # Routes dashboard protégées
│   │       │   │   ├── agents/             # CRUD agents
│   │       │   │   ├── agents/[id]/        # Détail agent (sources, config, test)
│   │       │   │   │   ├── sources/        # Tab sources
│   │       │   │   │   ├── config/         # Tab configuration IA
│   │       │   │   │   ├── customize/      # Tab personnalisation widget
│   │       │   │   │   ├── test/           # Tab sandbox test
│   │       │   │   │   └── deploy/         # Tab déploiement
│   │       │   │   ├── analytics/          # Dashboard analytique
│   │       │   │   ├── inbox/              # Live chat / conversations
│   │       │   │   ├── settings/           # Compte, équipe
│   │       │   │   └── billing/            # Plans, crédits, factures
│   │       │   └── (marketing)/    # Landing page, pricing, docs
│   │       ├── components/
│   │       │   ├── ui/             # shadcn/ui components
│   │       │   ├── dashboard/      # Composants dashboard spécifiques
│   │       │   ├── chat/           # Widget chat components
│   │       │   └── agents/         # Composants gestion agents
│   │       ├── lib/                # Utils, configs, constants
│   │       │   ├── credits.ts      # Logique de calcul de crédits
│   │       │   ├── plans.ts        # Définition des plans et limites
│   │       │   └── constants.ts    # Constantes globales
│   │       └── server/
│   │           ├── trpc/           # tRPC config + routers
│   │           │   ├── routers/
│   │           │   │   ├── agents.ts
│   │           │   │   ├── sources.ts
│   │           │   │   ├── conversations.ts
│   │           │   │   ├── analytics.ts
│   │           │   │   ├── billing.ts
│   │           │   │   └── settings.ts
│   │           │   └── index.ts    # App router
│   │           └── actions/        # Server actions Next.js
│   └── widget/                     # Widget JS embedable (build séparé)
│       └── src/
│           ├── ChatWidget.tsx      # Composant React du widget
│           ├── embed.ts            # Script d'injection (1 ligne)
│           └── styles.css          # Styles isolés
├── packages/
│   ├── db/                         # Prisma schema + migrations + seed
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── src/
│   │       └── client.ts           # Prisma client singleton
│   ├── ai/                         # Pipeline RAG, LLM gateway, embeddings
│   │   └── src/
│   │       ├── rag/
│   │       │   ├── chunker.ts      # Découpage en chunks
│   │       │   ├── embedder.ts     # Génération d'embeddings
│   │       │   ├── retriever.ts    # Recherche vectorielle
│   │       │   ├── reranker.ts     # Reranking des résultats
│   │       │   └── generator.ts    # Génération de réponse LLM
│   │       ├── parsers/
│   │       │   ├── pdf.ts
│   │       │   ├── docx.ts
│   │       │   ├── html.ts
│   │       │   └── markdown.ts
│   │       ├── crawlers/
│   │       │   ├── website.ts      # Crawl avec Puppeteer
│   │       │   └── sitemap.ts      # Parse sitemap XML
│   │       └── llm/
│   │           ├── gateway.ts      # Routing multi-modèles (LiteLLM)
│   │           ├── models.ts       # Définition des modèles disponibles
│   │           └── prompts.ts      # System prompts templates
│   ├── queue/                      # BullMQ jobs
│   │   └── src/
│   │       ├── queues.ts           # Définition des queues
│   │       ├── workers/
│   │       │   ├── indexing.ts     # Worker d'indexation
│   │       │   ├── sync.ts         # Worker de sync
│   │       │   ├── analytics.ts    # Worker analytics
│   │       │   └── emails.ts       # Worker emails
│   │       └── jobs/
│   │           ├── crawl-website.ts
│   │           ├── parse-file.ts
│   │           ├── chunk-and-embed.ts
│   │           ├── sync-website.ts
│   │           ├── sync-notion.ts
│   │           ├── compute-top-questions.ts
│   │           ├── detect-gaps.ts
│   │           └── credits-warning.ts
│   └── shared/                     # Types partagés, constantes, utils
│       └── src/
│           ├── types.ts
│           ├── credits.ts          # Constantes crédits partagées
│           └── validators.ts       # Schémas Zod partagés
└── infrastructure/
    ├── docker-compose.yml          # Dev local (Postgres, Redis)
    └── scripts/
        ├── seed.ts
        └── migrate.ts
```

---

## 4. Schéma de base de données (Prisma)

Schéma complet. Copier directement dans `packages/db/prisma/schema.prisma`.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================
// ENUMS
// ============================================================

enum Plan {
  FREE
  STARTER
  PRO
  GROWTH
  BUSINESS
  ENTERPRISE
}

enum MemberRole {
  OWNER
  ADMIN
  MEMBER
  VIEWER
}

enum LLMModel {
  GPT4O_MINI
  GPT4O
  CLAUDE_HAIKU
  CLAUDE_SONNET
  CLAUDE_OPUS
  GEMINI_FLASH
  GEMINI_PRO
  GROK
}

enum WidgetPosition {
  BOTTOM_RIGHT
  BOTTOM_LEFT
  FULL_PAGE
}

enum SourceType {
  WEBSITE
  SITEMAP
  FILE_PDF
  FILE_DOCX
  FILE_TXT
  FILE_HTML
  FILE_CSV
  FILE_MD
  NOTION
  GOOGLE_DRIVE
  SHAREPOINT
  CONFLUENCE
  ZENDESK
  TEXT_RAW
}

enum SourceStatus {
  PENDING
  INDEXING
  INDEXED
  FAILED
  SYNCING
}

enum ConversationStatus {
  ACTIVE
  CLOSED
  ESCALATED
}

enum Channel {
  WIDGET
  API
  SLACK
  WHATSAPP
  TELEGRAM
  DISCORD
}

enum MessageRole {
  USER
  ASSISTANT
  HUMAN
  SYSTEM
}

enum CreditAction {
  MESSAGE_AI
  INDEXING
  REINDEX
  SYNC
  EXPORT
  WEBHOOK
  TRANSLATION
  AI_SUGGESTION
}

// ============================================================
// MODELS
// ============================================================

model Organization {
  id                String   @id @default(cuid())
  name              String
  slug              String   @unique
  clerkOrgId        String?  @unique
  plan              Plan     @default(FREE)

  // Stripe
  stripeCustomerId  String?  @unique
  stripeSubId       String?  @unique

  // Crédits
  creditsTotal      Int      @default(100)   // crédits du plan
  creditsUsed       Int      @default(0)     // crédits consommés ce mois
  creditsResetAt    DateTime                  // date de reset mensuel

  // BYOK keys (chiffrées AES-256 avant stockage)
  openaiKey         String?
  anthropicKey      String?
  googleKey         String?

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  members           Member[]
  agents            Agent[]
  creditLogs        CreditLog[]
  invoices          Invoice[]
}

model Member {
  id            String     @id @default(cuid())
  orgId         String
  org           Organization @relation(fields: [orgId], references: [id], onDelete: Cascade)
  clerkUserId   String
  email         String
  name          String
  role          MemberRole @default(MEMBER)
  createdAt     DateTime   @default(now())

  @@unique([orgId, clerkUserId])
  @@index([orgId])
}

model Agent {
  id                  String   @id @default(cuid())
  orgId               String
  org                 Organization @relation(fields: [orgId], references: [id], onDelete: Cascade)
  name                String
  slug                String
  description         String?

  // Configuration IA
  model               LLMModel @default(GPT4O_MINI)
  temperature         Float    @default(0.3)
  systemPrompt        String   @default("")
  strictMode          Boolean  @default(true)  // anti-hallucination
  fallbackMessage     String   @default("Désolé, je n'ai pas trouvé de réponse dans la documentation.")
  maxTokensResponse   Int      @default(1024)

  // Personnalisation widget
  primaryColor        String   @default("#1A56DB")
  avatarUrl           String?
  welcomeMessage      String   @default("Bonjour ! Comment puis-je vous aider ?")
  suggestedQuestions  String[] @default([])
  position            WidgetPosition @default(BOTTOM_RIGHT)

  // Lead capture
  leadCaptureEnabled  Boolean  @default(false)
  leadCaptureFields   Json?    // [{field:"email",required:true}, {field:"name",required:false}]

  // Escalade
  escalationEnabled   Boolean  @default(false)
  escalationAfter     Int      @default(3)    // après X messages sans réponse
  escalationEmail     String?
  escalationSlackUrl  String?

  // Status
  isActive            Boolean  @default(true)
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  sources             Source[]
  conversations       Conversation[]
  leads               Lead[]

  @@unique([orgId, slug])
  @@index([orgId])
}

model Source {
  id              String       @id @default(cuid())
  agentId         String
  agent           Agent        @relation(fields: [agentId], references: [id], onDelete: Cascade)
  type            SourceType
  name            String
  url             String?
  filePath        String?      // chemin Cloudflare R2
  fileName        String?
  fileSize        Int?

  // Connecteur
  connectorId     String?
  connectorMeta   Json?

  // Indexation
  status          SourceStatus @default(PENDING)
  pagesCount      Int          @default(0)
  chunksCount     Int          @default(0)
  lastIndexedAt   DateTime?
  lastSyncAt      DateTime?
  nextSyncAt      DateTime?
  indexError       String?
  creditsConsumed Int          @default(0)

  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  chunks          Chunk[]

  @@index([agentId])
  @@index([status])
}

model Chunk {
  id          String   @id @default(cuid())
  sourceId    String
  source      Source   @relation(fields: [sourceId], references: [id], onDelete: Cascade)
  content     String
  tokenCount  Int
  metadata    Json?    // {pageUrl, pageTitle, section, headingPath}
  pineconeId  String   @unique
  createdAt   DateTime @default(now())

  @@index([sourceId])
}

model Conversation {
  id              String             @id @default(cuid())
  agentId         String
  agent           Agent              @relation(fields: [agentId], references: [id], onDelete: Cascade)

  // Visiteur
  visitorId       String             // fingerprint anonyme
  visitorName     String?
  visitorEmail    String?
  visitorMeta     Json?              // {country, device, browser, referrer, pageUrl}

  // Status
  status          ConversationStatus @default(ACTIVE)
  channel         Channel            @default(WIDGET)
  rating          Int?               // 1-5 note du visiteur
  resolved        Boolean            @default(false)
  escalated       Boolean            @default(false)
  assignedTo      String?            // member id si escalade

  // Stats
  messageCount    Int                @default(0)
  creditsUsed     Int                @default(0)

  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  messages        Message[]

  @@index([agentId])
  @@index([agentId, createdAt])
  @@index([visitorId])
  @@index([status])
}

model Message {
  id              String       @id @default(cuid())
  conversationId  String
  conversation    Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  role            MessageRole
  content         String

  // Pour les messages ASSISTANT
  model           LLMModel?
  creditsUsed     Int          @default(0)
  sources         Json?        // [{chunkId, sourceId, title, url, relevanceScore}]
  tokensInput     Int?
  tokensOutput    Int?
  latencyMs       Int?
  feedbackScore   Int?         // 1 (pouce bas) ou 5 (pouce haut)

  // Pour les messages HUMAN (escalade)
  memberName      String?

  createdAt       DateTime     @default(now())

  @@index([conversationId])
  @@index([conversationId, createdAt])
}

model CreditLog {
  id          String       @id @default(cuid())
  orgId       String
  org         Organization @relation(fields: [orgId], references: [id], onDelete: Cascade)
  agentId     String?
  action      CreditAction
  credits     Int
  metadata    Json?        // {model, sourceId, messageId, ...}
  createdAt   DateTime     @default(now())

  @@index([orgId])
  @@index([orgId, createdAt])
  @@index([orgId, action])
}

model Lead {
  id              String   @id @default(cuid())
  agentId         String
  agent           Agent    @relation(fields: [agentId], references: [id], onDelete: Cascade)
  conversationId  String?
  email           String
  name            String?
  phone           String?
  customFields    Json?
  createdAt       DateTime @default(now())

  @@index([agentId])
  @@index([agentId, createdAt])
}

model Invoice {
  id              String       @id @default(cuid())
  orgId           String
  org             Organization @relation(fields: [orgId], references: [id], onDelete: Cascade)
  stripeInvoiceId String       @unique
  amount          Int          // en centimes
  status          String       // paid, failed, pending
  pdfUrl          String?
  createdAt       DateTime     @default(now())

  @@index([orgId])
}

// Table dénormalisée pour les analytics
model TopQuestion {
  id          String   @id @default(cuid())
  agentId     String
  question    String   // question normalisée/groupée
  count       Int      @default(1)
  answered    Boolean  @default(true) // false = gap documentaire
  lastAskedAt DateTime
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([agentId])
  @@index([agentId, count(sort: Desc)])
  @@index([agentId, answered])
}
```

---

## 5. Routes API et tRPC Routers

L'API est construite avec tRPC pour le dashboard (typesafe) et des API Routes Next.js classiques pour les endpoints publics (widget, webhooks).

### 5.1 tRPC Routers (dashboard, auth required)

#### `agents` router

```typescript
agents.list          // GET  → liste les agents de l'org
agents.getById       // GET  → détail d'un agent + stats rapides
agents.create        // POST → input: {name, description?, model?, temperature?}
agents.update        // PATCH → mise à jour config (partiel)
agents.delete        // DELETE → suppression + cleanup sources + chunks Pinecone
agents.duplicate     // POST → copie un agent avec toutes ses sources
agents.testChat      // POST → input: {agentId, message} → réponse IA test
agents.getStats      // GET  → stats d'un agent (conversations, crédits, deflection)
```

#### `sources` router

```typescript
sources.list              // GET  → sources d'un agent avec status
sources.addWebsite        // POST → {agentId, url, maxDepth?, maxPages?}
sources.addSitemap        // POST → {agentId, sitemapUrl}
sources.uploadFile        // POST → retourne presigned URL R2 + crée Source PENDING
sources.confirmUpload     // POST → {sourceId} → déclenche le job d'indexation
sources.addNotion         // POST → {agentId, notionPageId, accessToken}
sources.addGoogleDrive    // POST → {agentId, folderId, accessToken}
sources.addRawText        // POST → {agentId, title, content}
sources.delete            // DELETE → supprime source + chunks BDD + vecteurs Pinecone
sources.reindex           // POST → re-indexe une source (job async)
sources.getStatus         // GET  → status d'indexation temps réel (polling ou SSE)
sources.getPages          // GET  → liste des pages crawlées pour une source website
sources.excludePaths      // PATCH → {sourceId, excludePatterns: string[]}
```

#### `conversations` router

```typescript
conversations.list        // GET  → liste paginée + filtres (status, agent, channel, date)
conversations.getById     // GET  → conversation + tous les messages
conversations.close       // PATCH → fermer une conversation
conversations.assign      // PATCH → assigner à un membre de l'équipe
conversations.reply       // POST → réponse humaine (escalade) {conversationId, content}
conversations.search      // GET  → recherche full-text dans les messages
conversations.export      // POST → export CSV (coûte 5 crédits)
```

#### `analytics` router

```typescript
analytics.overview        // GET  → {period} → stats globales
  // Retourne: {
  //   conversations: {total, vs_previous, trend[]},
  //   messages: {total, vs_previous},
  //   deflectionRate: {value, vs_previous},
  //   leadsCapture: {total, vs_previous},
  //   creditsUsed: {total, remaining, projectedEnd}
  // }

analytics.credits         // GET  → {period, groupBy: "day"|"week"} → conso crédits par type
  // Retourne: [{date, messageAI, indexing, sync, other}]

analytics.topQuestions     // GET  → {agentId?, limit?, period?}
  // Retourne: [{question, count, answerRate, trend}]

analytics.unanswered       // GET  → {agentId?, limit?}
  // Retourne: [{question, count, lastAskedAt, suggestedAction}]
  // suggestedAction = "Ajouter une FAQ sur ce sujet" | "Mettre à jour [source]"

analytics.sourceUsage      // GET  → sources les plus citées dans les réponses
  // Retourne: [{sourceId, name, citationCount, lastCited}]

analytics.trends           // GET  → {period, granularity} → conversations par jour
analytics.deflection       // GET  → taux de déflection par période
analytics.satisfaction     // GET  → distribution des notes + moyenne
analytics.aiSuggestions    // POST → génère des suggestions IA (coûte 3 crédits)
  // Retourne: [{type: "missing_doc"|"outdated_source"|"frequent_topic", description, priority}]
```

#### `billing` router

```typescript
billing.getUsage           // GET  → crédits utilisés/restants + historique
billing.getPlans           // GET  → liste des plans avec features
billing.getCurrentPlan     // GET  → plan actuel + date renouvellement + limites
billing.createCheckout     // POST → {planId} → URL Stripe Checkout
billing.createPortal       // POST → URL portail Stripe (factures, annulation)
billing.getInvoices        // GET  → historique factures
billing.getCreditLogs      // GET  → {period?, action?, agentId?} → logs détaillés
billing.getProjection      // GET  → projection de consommation fin de mois
```

#### `settings` router

```typescript
settings.getOrg            // GET  → infos organisation
settings.updateOrg         // PATCH → {name?, slug?}
settings.getMembers        // GET  → membres de l'équipe + rôles
settings.inviteMember      // POST → {email, role} → envoie invitation Clerk
settings.updateMember      // PATCH → {memberId, role}
settings.removeMember      // DELETE → {memberId}
settings.updateKeys        // PATCH → BYOK {openaiKey?, anthropicKey?, googleKey?}
  // Les clés sont chiffrées AES-256 avant stockage
settings.deleteAccount     // DELETE → supprime org + toutes les données (GDPR)
```

### 5.2 API Routes publiques (pas d'auth dashboard)

#### Widget / Chat public

```
POST /api/v1/chat
  Headers: { x-agent-id: string }
  Body: {
    message: string,
    conversationId?: string,   // null = nouvelle conversation
    visitorId: string,          // fingerprint généré côté client
    metadata?: {
      pageUrl?: string,
      referrer?: string,
      country?: string,
      device?: string
    }
  }
  Response: SSE stream
    event: token    → data: {token: "Bonjour"}
    event: sources  → data: {sources: [{title, url, score}]}
    event: done     → data: {conversationId, messageId, creditsUsed}
    event: error    → data: {code, message}

GET /api/v1/agent/:slug/config
  Response: {
    name: string,
    primaryColor: string,
    avatarUrl?: string,
    welcomeMessage: string,
    suggestedQuestions: string[],
    position: "BOTTOM_RIGHT" | "BOTTOM_LEFT" | "FULL_PAGE",
    leadCaptureEnabled: boolean,
    leadCaptureFields?: [{field, required}],
    escalationEnabled: boolean
  }
  // Endpoint public, pas de data sensible

POST /api/v1/lead
  Body: {agentId, conversationId?, email, name?, phone?, customFields?}
  Response: {success: true, leadId: string}

POST /api/v1/feedback
  Body: {messageId, score: 1 | 5}
  Response: {success: true}
```

#### Webhooks

```
POST /api/webhooks/stripe
  Events gérés:
    - checkout.session.completed     → active le plan, set creditsTotal
    - customer.subscription.updated  → update plan + crédits
    - customer.subscription.deleted  → downgrade vers FREE
    - invoice.paid                   → log dans Invoice
    - invoice.payment_failed         → email d'alerte

POST /api/webhooks/clerk
  Events gérés:
    - organization.created           → crée Organization en BDD
    - organization.updated           → sync name/slug
    - organizationMembership.created → crée Member
    - organizationMembership.deleted → supprime Member

POST /api/webhooks/notion
  → Notification de changement, déclenche job sync-notion
```

### 5.3 Serveur MCP (plans Pro+)

```
POST /api/mcp/tools
  → Liste les outils disponibles: query_agent, list_sources, get_analytics

POST /api/mcp/execute
  Body: {tool: string, params: object}
  → Exécute un outil et retourne le résultat
```

---

## 6. Dashboard — Écrans et composants

Chaque écran est décrit avec ses composants, ses données et son comportement.

### 6.1 Vue d'ensemble (`/dashboard`)

L'écran principal après connexion. Répond à : "Comment se porte mon chatbot ?"

**Composants :**

- **Barre de crédits** (en haut) : barre de progression horizontale. Affiche "X / Y crédits utilisés ce mois". Couleurs : vert (<60%), orange (60-80%), rouge (>80%). Lien "Upgrader" si >80%. Affiche aussi la projection : "À ce rythme, il vous reste ~12 jours de crédits."

- **4 cartes KPI** :
  1. Conversations ce mois (+ évolution vs mois précédent %)
  2. Messages traités (+ évolution)
  3. Taux de déflection en % (+ évolution)
  4. Leads capturés (+ évolution)
  - Chaque carte = valeur + flèche verte↑ ou rouge↓ + pourcentage

- **Graphe d'activité** : courbe des conversations par jour sur les 30 derniers jours. Toggle 7j/30j/90j. Librairie : Recharts `<AreaChart>`. Overlay optionnel des messages/jour.

- **Top 5 questions fréquentes** : liste avec nombre d'occurrences. Badge "Sans réponse" si le bot n'a pas pu répondre. Clic → ouvre la conversation.

- **Questions sans réponse (gaps)** : encart alerte orange. Liste les dernières questions sans réponse avec nombre de fois posée. CTA "Compléter la documentation" → tab Sources de l'agent concerné. C'EST LE FEATURE KILLER : montre au client ce qui manque dans sa doc.

- **Agents actifs** : cards pour chaque agent. Affiche : nom, status (badge vert/gris), conversations aujourd'hui, crédits consommés aujourd'hui. Clic → détail agent.

### 6.2 Détail d'un agent (`/dashboard/agents/[id]`)

Layout en **5 tabs** :

#### Tab Sources
- Liste de toutes les sources connectées. Pour chaque source : icône type, nom, badge status (INDEXED vert / PENDING jaune / FAILED rouge), nombre de pages, date dernière indexation, bouton ↻ re-index
- 3 boutons "+" en haut : Website | Fichier | Connecteur
- **Ajout website** : modal avec champ URL, toggle "Inclure sous-pages", champs exclusion de chemins, bouton "Scanner"
- **Ajout fichier** : zone drag&drop, accepte PDF/DOCX/TXT/HTML/CSV/MD, barre de progression d'upload, puis indexation auto
- **Ajout connecteur** : cards Notion / Google Drive / (futurs). Clic → OAuth flow → sélection pages/dossiers
- Jauge : "X pages indexées / Y sources connectées | Z crédits consommés pour l'indexation"

#### Tab Configuration
- **Modèle IA** : dropdown avec les modèles disponibles selon le plan. Badge "X crédits/msg" à côté de chaque option
- **Température** : slider 0.0-1.0 avec labels ("Précis" à 0, "Créatif" à 1). Défaut 0.3
- **System prompt** : textarea avec placeholder. Bouton "Restaurer le défaut"
- **Mode strict** : toggle ON/OFF. Description : "Le bot répond uniquement à partir de la documentation indexée"
- **Message fallback** : champ texte pour le message quand le bot ne sait pas
- **Escalade** : toggle + champ "Après X messages sans réponse" + email de notification
- Bouton "Sauvegarder" en bas (sticky)

#### Tab Personnalisation
- **Color picker** pour couleur principale (hex + presets)
- **Upload avatar/logo** (drag&drop, crop, preview)
- **Message d'accueil** : champ texte
- **Questions suggérées** : liste éditable avec drag&drop pour réordonner. Bouton "+ Ajouter"
- **Lead capture** : toggle global + toggles par champ (email requis, nom optionnel, téléphone optionnel, champ custom)
- **Preview live** du widget à droite qui se met à jour en temps réel

#### Tab Test (Sandbox)
- Chat identique au widget final mais dans le dashboard
- Sous chaque réponse IA : sources utilisées (collapsible), nombre de crédits consommés, modèle utilisé, latence
- Bouton "Améliorer" sur chaque réponse → ouvre un panel pour ajouter du contexte manquant ou corriger
- Bouton "Réinitialiser la conversation"
- N'affecte pas les stats/analytics (marqué comme test)

#### Tab Déploiement
- **Widget JS** : bloc de code copiable (1 ligne) avec bouton copier
  ```html
  <script src="https://cdn.notreapp.com/widget.js" data-agent-id="xxx" async></script>
  ```
- **Iframe** : code embed copiable
- **Lien direct** : URL partageable du chatbot en pleine page
- **Intégrations** : cards pour chaque canal (Slack, WhatsApp, Telegram, Discord) avec status connecté/non et bouton Connect (OAuth)
- **Domaine personnalisé** (plans Growth+) : champ pour saisir le domaine + instructions DNS

### 6.3 Analytics (`/dashboard/analytics`)

**Filtres globaux** (en haut) : sélecteur de période (7j, 30j, 90j, custom), sélecteur d'agent (tous ou spécifique).

**Section métriques :**
- **Graphe conversations** : Recharts `<AreaChart>` conversations/jour avec overlay messages/jour
- **Graphe crédits** : Recharts `<BarChart>` stacked montrant crédits par type (messages, indexation, sync, autres) par jour
- **Taux de déflection** : gauge circulaire 0-100%. Tooltip : "Conversations résolues sans intervention humaine"
- **Temps de réponse moyen** : affichage en ms. Trend vs période précédente
- **Satisfaction** : note moyenne /5 + distribution en bar chart horizontal

**Section intelligence :**
- **Top 20 questions fréquentes** : tableau paginable. Colonnes : question, occurrences, taux de réponse (%), trend ↑↓. Clic → conversations associées
- **Questions sans réponse (gaps documentaires)** : tableau. Colonnes : question, nb de fois posée, agent, CTA "Ajouter à la doc". L'IA groupe les questions similaires par embedding proximity
- **Sources les plus citées** : classement par nombre de citations. Permet de voir quelles docs sont utiles
- **Suggestions IA** : bouton "Générer des suggestions" (3 crédits). Retourne : "Ajoutez une FAQ sur [sujet]", "La page [URL] semble obsolète", etc.

### 6.4 Inbox / Live chat (`/dashboard/inbox`)

**Layout 3 colonnes :**

- **Colonne gauche** (280px) : liste conversations triées par récence. Filtres : status (actif/escalade/fermé), agent, canal. Badge rouge pour escalades. Avatar + nom ou "Visiteur #xxx". Preview du dernier message. Recherche par contenu.

- **Colonne centre** (flex) : fil de messages. Messages visiteur à gauche (gris), messages IA à droite (bleu/couleur agent), messages humains à droite (vert). Timestamps. Sources IA collapsibles. Zone de saisie en bas pour réponse humaine + bouton "Fermer". Indicateur de frappe en temps réel.

- **Colonne droite** (320px) : infos visiteur (email, nom, localisation, appareil, page d'origine, referrer, durée session). Tags personnalisables. Historique des conversations précédentes du même visiteur. Notes internes (privées, pas visibles par le visiteur).

### 6.5 Billing (`/dashboard/billing`)

- **Jauge de crédits** : grande jauge visuelle circulaire. Crédits utilisés / total. Projection de fin de mois basée sur la conso actuelle. "À ce rythme, vous atteindrez la limite le XX/XX."
- **Graphe de consommation** : courbe cumulative des crédits consommés sur le mois en cours vs le mois précédent
- **Historique détaillé** : tableau paginé. Colonnes : date, heure, action (badge coloré), agent, crédits, modèle. Filtres : période, type d'action, agent.
- **Plan actuel** : card avec nom du plan, prix, date de renouvellement, boutons "Changer" + "Gérer facturation" (portail Stripe)
- **Comparaison des plans** : tableau avec le plan actuel surligné. Features du plan supérieur en évidence avec badge "Disponible sur Pro"

---

## 7. Pipeline RAG — Implémentation détaillée

Le RAG est le cœur du produit.

### 7.1 Ingestion

1. L'utilisateur ajoute une source (URL, fichier, connecteur)
2. Un job BullMQ est créé dans la queue `indexing` avec priorité
3. Le worker récupère le job et télécharge/crawl le contenu
4. **Sites web** : Puppeteer headless avec rotation de user-agent, respect du `robots.txt`, profondeur configurable (défaut: 3), max pages configurable (défaut: 100)
5. **Fichiers** : parseur spécialisé (`pdf-parse` pour PDF, `mammoth` pour DOCX, `cheerio` pour HTML, lecture directe pour TXT/MD/CSV)
6. Le texte brut est extrait et stocké temporairement

### 7.2 Chunking

1. Découpage en chunks de **512 tokens** avec un **overlap de 64 tokens**
2. Stratégie de découpage (par priorité) :
   - D'abord par headings (h1, h2, h3)
   - Puis par paragraphes
   - Puis par phrases si nécessaire
3. Chaque chunk conserve ses metadata : `{sourceId, pageUrl, pageTitle, headingPath, position}`
4. Chunks trop courts (<50 tokens) → fusionnés avec le précédent
5. Chunks trop longs (>800 tokens) → re-découpés

### 7.3 Embedding et indexation

1. Chaque chunk → vecteur via **OpenAI text-embedding-3-small** (1536 dims, ~$0.02/1M tokens)
2. Upload en batch dans **Pinecone** (namespace = `agent_{agentId}`)
3. Metadata stockées dans Pinecone : `{sourceId, chunkId, pageUrl, title}`
4. En parallèle : chunk sauvegardé dans PostgreSQL (table `Chunk`) pour affichage du texte source
5. Calcul et déduction des crédits d'indexation

### 7.4 Requête et génération

Flow quand un visiteur pose une question :

1. La question est convertie en embedding via le même modèle
2. Recherche vectorielle dans Pinecone (`namespace = agent_{agentId}`, `top_k = 10`)
3. **Reranking** : les 10 résultats sont re-classés par pertinence (Cohere rerank API ou score cosine + heuristiques)
4. Les **5 meilleurs chunks** sont sélectionnés comme contexte
5. Construction du prompt :
   ```
   [System prompt agent] +
   [Chunks contexte avec metadata] +
   [5 derniers messages de la conversation] +
   [Question du visiteur]
   ```
6. Envoi au LLM sélectionné via LiteLLM avec **streaming SSE**
7. Parsing de la réponse pour extraire les citations (références aux sources)
8. Calcul des crédits : `tokens_input + tokens_output → crédits selon le modèle`
9. Sauvegarde du message en BDD avec metadata complètes
10. Si `strictMode = true` ET score max des chunks < 0.3 → répondre avec `fallbackMessage` au lieu de générer

### 7.5 System prompt anti-hallucination

```
Tu es un assistant IA pour {AGENT_NAME}. Tu réponds UNIQUEMENT en te
basant sur les documents fournis ci-dessous. Si la réponse ne se trouve
pas dans les documents, dis exactement : "{FALLBACK_MESSAGE}".

Règles strictes :
- Ne JAMAIS inventer d'information
- Ne JAMAIS répondre sur des sujets non couverts par les documents
- Toujours citer tes sources avec [Source: titre]
- Répondre dans la langue de la question

DOCUMENTS DE RÉFÉRENCE :
---
{CHUNKS avec titre de source et URL}
---

HISTORIQUE :
{5 derniers messages}
```

---

## 8. Widget chat embedable

### 8.1 Intégration (1 ligne)

```html
<script src="https://cdn.notreapp.com/widget.js" data-agent-id="AGENT_ID" async></script>
```

Le script `widget.js` fait ~30KB gzippé. Il crée un iframe sandboxé pour éviter les conflits CSS/JS.

### 8.2 Comportement

1. Au chargement : fetch config agent (`GET /api/v1/agent/:slug/config`)
2. Affichage du bouton flottant (position selon config) avec badge notification
3. Au clic : ouverture panneau de chat avec animation slide-up
4. Message d'accueil + questions suggérées (chips cliquables)
5. Si lead capture actif : formulaire modal avant le premier message
6. Chaque message visiteur → `POST /api/v1/chat` avec streaming SSE
7. Réponses s'affichent progressivement (token par token, effet de frappe)
8. Sous chaque réponse IA : icônes de sources cliquables
9. Boutons feedback : 👍/👎 sur chaque réponse
10. Bouton "Parler à un humain" si escalade activée

### 8.3 Specs techniques

- **Framework** : Preact (3KB) pour la légèreté
- **Communication** : postMessage entre iframe et site hôte
- **Persistance** : conversation ID en `sessionStorage` du site hôte
- **Responsive** : plein écran sur mobile (<768px)
- **A11y** : navigation clavier, aria-labels, screen reader compatible
- **Theming** : CSS custom properties injectées depuis la config agent
- **CSP compatible** : fonctionne avec les Content Security Policies strictes

---

## 9. Jobs asynchrones (BullMQ)

Les jobs longs tournent sur des workers Fly.io séparés du serveur web.

### 9.1 Queue `indexing`

| Job | Params | Timeout | Retry | Description |
|---|---|---|---|---|
| `crawl-website` | `{sourceId, url, maxDepth, maxPages}` | 5min | 3x | Crawl un site web |
| `parse-file` | `{sourceId, r2Key, fileType}` | 2min | 3x | Parse un fichier uploadé |
| `chunk-and-embed` | `{sourceId, rawText, metadata}` | 3min | 2x | Chunks + embeddings + Pinecone upsert |
| `delete-source` | `{sourceId, pineconeNamespace}` | 1min | 2x | Supprime chunks Pinecone + BDD |

### 9.2 Queue `sync`

| Job | Schedule | Description |
|---|---|---|
| `sync-website` | Selon plan | Re-crawl + diff + update chunks modifiés |
| `sync-notion` | Selon plan | Fetch pages modifiées via API Notion |
| `sync-gdrive` | Selon plan | Fetch fichiers modifiés via Changes API |

### 9.3 Queue `emails`

| Job | Trigger | Description |
|---|---|---|
| `credits-warning` | 80% crédits | Email avec conso + comparaison plans |
| `credits-exhausted` | 100% crédits | Email urgent + CTA upgrade |
| `weekly-report` | Chaque lundi | Résumé : conversations, déflection, top questions |
| `escalation-notify` | Escalade | Notification email + Slack |

### 9.4 Queue `analytics`

| Job | Schedule | Description |
|---|---|---|
| `compute-top-questions` | Toutes les heures | Agrège questions par embedding similarity |
| `detect-gaps` | Quotidien | Analyse conversations fallback → suggestions |
| `compute-deflection` | Quotidien | Calcul taux déflection par agent |
| `reset-credits` | 1er du mois 00:00 | Reset `creditsUsed` à 0 pour toutes les orgs |

---

## 10. Sécurité et conformité

### 10.1 Auth et autorisation

- **Clerk** pour l'auth : SSO Google/GitHub, magic link, MFA
- **RBAC** : Owner > Admin > Member > Viewer (via Clerk Organizations)
- **Middleware Next.js** : vérification token Clerk + appartenance org sur chaque route `/dashboard`
- **Rate limiting** : 100 req/min API dashboard, 30 req/min widget chat par IP, 10 req/min auth par IP

### 10.2 Protection des données

- Clés BYOK chiffrées **AES-256** côté serveur avant stockage en BDD
- Pas de stockage de conversations chez les fournisseurs LLM (opt-out data training)
- **TLS 1.3** en transit, **AES-256** au repos (Supabase encryption at rest)
- PII redaction optionnel : emails/téléphones automatiquement masqués dans les logs
- Rétention des logs configurable par plan (7j à illimité)

### 10.3 GDPR

- Consentement : bannière cookie sur le widget si localisation EU
- Droit à l'effacement : `DELETE /api/v1/visitor/:id` supprime toutes les conversations et leads
- DPA disponible pour les plans Growth+
- Data residency EU possible via Supabase EU region

---

## 11. Roadmap de développement

### Phase 1 — MVP (Semaines 1-8)

> Objectif : core loop fonctionnel. Upload doc → chatbot → widget déployé.

**Semaines 1-2 : Fondations**
- Setup mono-repo Next.js 14 + Prisma + Supabase + Clerk
- Schéma BDD initial (toutes les tables de la section 4)
- Auth : inscription, login, création d'org
- Layout dashboard (sidebar, header, routing protégé)
- Docker compose pour dev local (Postgres + Redis)

**Semaines 3-4 : Core RAG**
- Pipeline indexation : upload fichier → parse → chunk → embed → Pinecone
- Crawl website basique (URL simple, pas encore sitemap)
- Endpoint `/api/v1/chat` avec RAG + streaming SSE
- Sandbox de test dans le dashboard (tab Test)

**Semaines 5-6 : Widget + Crédits**
- Widget chat embedable (Preact, iframe, 1 ligne)
- Système de crédits (grille complète, décompte en temps réel, CreditLog)
- Dashboard overview (4 KPI cards, graphe activité, barre crédits)
- Page billing basique (plan actuel, crédits restants)

**Semaines 7-8 : Polish + Launch**
- Intégration Stripe (plans Free + Starter + Pro, webhooks)
- Personnalisation widget (couleurs, avatar, messages)
- Analytics basiques : top questions + questions sans réponse (gaps)
- Landing page + pricing page
- Beta privée 20-50 early adopters

### Phase 2 — Growth features (Semaines 9-16)

- Connecteurs Notion + Google Drive avec auto-sync
- Multi-modèles (Anthropic Claude, Google Gemini) + BYOK
- Live chat / inbox avec escalade humaine (layout 3 colonnes)
- Capture de leads avec formulaire configurable
- Analytics avancés (suggestions IA, sources les plus citées, satisfaction)
- Sitemap crawling + exclusion de chemins
- API REST v1 publique documentée
- Plans Growth et Business
- Emails transactionnels (crédits warning, weekly report, escalade)
- Projections de consommation dans le dashboard

### Phase 3 — Scale (Semaines 17-24)

- Connecteurs SharePoint, Confluence, Zendesk
- Intégrations Slack, WhatsApp, Telegram, Discord
- White-label complet (custom domain, branding)
- Programme agences (multi-workspace)
- Serveur MCP
- RBAC avancé + SSO SAML/OIDC
- Actions IA (prise de RDV Calendly, workflows Zapier)
- Marketplace de templates d'agents par verticale

### Phase 4 — Moat (Semaines 25-36)

- Agents multi-étapes avec logique conditionnelle
- SDK pour développeurs (npm package)
- Self-hosting option (Docker)
- Certification SOC-2 Type 2
- Data residency EU
- IA prédictive : anticipation des questions basée sur le trafic

---

## 12. Métriques de succès

| KPI | MVP (S8) | PMF (S16) | Scale (S24) |
|---|---|---|---|
| Inscrits | 200 | 2 000 | 10 000 |
| Agents déployés | 100 | 1 000 | 8 000 |
| MRR | 2k$ | 20k$ | 120k$ |
| Conversion Free→Paid | 5% | 10% | 14% |
| Churn mensuel | <12% | <8% | <5% |
| Déflection moyenne | 50% | 65% | 75% |

---

## 13. Instructions pour Claude Code

### 13.1 Ordre d'implémentation

1. Créer le mono-repo Next.js 14 avec App Router, TailwindCSS, shadcn/ui
2. Configurer Prisma avec le schéma complet de la section 4
3. Configurer Clerk pour l'auth (email + Google SSO)
4. Setup Supabase PostgreSQL + Upstash Redis
5. Créer le layout dashboard avec sidebar navigation
6. Implémenter le CRUD agents (création, liste, détail)
7. Implémenter l'upload de fichiers vers R2 + parsing
8. Implémenter le crawling de site web (basique, URL simple)
9. Implémenter le pipeline RAG (chunking → embedding → Pinecone)
10. Implémenter l'endpoint `/api/v1/chat` avec streaming SSE
11. Créer le sandbox de test dans le dashboard
12. Créer le widget embedable (Preact, iframe)
13. Implémenter le système de crédits (grille, décompte, logs)
14. Créer le dashboard overview avec les 4 KPIs + graphe
15. Implémenter les analytics (top questions, gaps)
16. Configurer Stripe (plans, checkout, webhooks)
17. Créer la landing page + pricing

### 13.2 Conventions de code

- **TypeScript strict** mode partout
- **Nommage** : camelCase variables/fonctions, PascalCase composants/types
- **React** : function components avec hooks uniquement
- **Server Components** par défaut, `"use client"` uniquement si nécessaire
- **tRPC** pour toutes les routes authentifiées du dashboard
- **API Routes** classiques pour les endpoints publics (widget, webhooks)
- **Zod** pour la validation de tous les inputs
- **Error handling** : try/catch avec codes d'erreur standardisés (`CREDITS_EXHAUSTED`, `PLAN_LIMIT_REACHED`, `SOURCE_NOT_FOUND`, etc.)
- **Logging** : pino avec contexte `{orgId, agentId, userId}`
- **Tests** : Vitest pour unit tests, Playwright pour E2E (priorité sur les flows critiques : onboarding, chat, billing)

### 13.3 Variables d'environnement

```env
# Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Database
DATABASE_URL=postgresql://...

# Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Vector DB
PINECONE_API_KEY=
PINECONE_INDEX=

# Storage
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=

# LLM (clés internes de la plateforme)
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_AI_API_KEY=

# Reranking
COHERE_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_STARTER=
STRIPE_PRICE_PRO=
STRIPE_PRICE_GROWTH=
STRIPE_PRICE_BUSINESS=

# Email
RESEND_API_KEY=
EMAIL_FROM=noreply@notreapp.com

# Monitoring
SENTRY_DSN=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# App
NEXT_PUBLIC_APP_URL=https://app.notreapp.com
NEXT_PUBLIC_WIDGET_URL=https://cdn.notreapp.com
ENCRYPTION_KEY=  # Pour chiffrer les clés BYOK (AES-256)
```

---

> **Ce document est la référence unique pour le développement.** Toute décision non couverte ici doit être soumise pour validation avant implémentation. Le document sera mis à jour en continu au fil des sprints.