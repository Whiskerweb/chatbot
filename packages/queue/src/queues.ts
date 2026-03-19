import { Queue } from "bullmq";
import { getRedisConnection } from "./connection";

// Job data types
export interface IndexingJobData {
  type: "crawl-website" | "parse-file" | "chunk-and-embed" | "delete-source";
  sourceId: string;
  orgId: string;
  agentId: string;
  // crawl-website specific
  url?: string;
  maxDepth?: number;
  maxPages?: number;
  // parse-file specific
  r2Key?: string;
  fileType?: string;
  // chunk-and-embed specific
  rawText?: string;
  metadata?: Record<string, string>;
  // delete-source specific
  pineconeNamespace?: string;
}

export interface SyncJobData {
  type: "sync-website" | "sync-notion" | "sync-gdrive";
  sourceId: string;
  orgId: string;
  agentId: string;
}

export interface EmailJobData {
  type: "credits-warning" | "credits-exhausted" | "weekly-report" | "escalation-notify";
  orgId: string;
  email: string;
  data: Record<string, unknown>;
}

export interface AnalyticsJobData {
  type: "compute-top-questions" | "detect-gaps" | "compute-deflection" | "reset-credits" | "categorize-questions";
  agentId?: string;
  orgId?: string;
}

const connection = getRedisConnection();

function createQueue<T>(name: string): Queue<T> | null {
  if (!connection) return null;
  return new Queue<T>(name, { connection });
}

export const indexingQueue = createQueue<IndexingJobData>("indexing");
export const syncQueue = createQueue<SyncJobData>("sync");
export const emailQueue = createQueue<EmailJobData>("emails");
export const analyticsQueue = createQueue<AnalyticsJobData>("analytics");
