import { NextRequest } from "next/server";
import { prisma } from "@chatbot/db";
import { createClient } from "@/lib/supabase/server";
import { indexFile } from "@/lib/indexing";

const FILE_TYPE_MAP: Record<string, { sourceType: string; parseType: string }> = {
  "application/pdf": { sourceType: "FILE_PDF", parseType: "pdf" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { sourceType: "FILE_DOCX", parseType: "docx" },
  "text/plain": { sourceType: "FILE_TXT", parseType: "txt" },
  "text/html": { sourceType: "FILE_HTML", parseType: "html" },
  "text/markdown": { sourceType: "FILE_MD", parseType: "md" },
  "text/csv": { sourceType: "FILE_CSV", parseType: "csv" },
};

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const member = await prisma.member.findFirst({
      where: { clerkUserId: user.id },
      include: { org: true },
    });
    if (!member) {
      return Response.json({ error: "No organization found" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const agentId = formData.get("agentId") as string | null;

    if (!file || !agentId) {
      return Response.json({ error: "Missing file or agentId" }, { status: 400 });
    }

    // Validate agent belongs to org
    const agent = await prisma.agent.findFirst({
      where: { id: agentId, orgId: member.orgId },
    });
    if (!agent) {
      return Response.json({ error: "Agent not found" }, { status: 404 });
    }

    // Validate file type
    const fileTypeInfo = FILE_TYPE_MAP[file.type];
    if (!fileTypeInfo) {
      // Try by extension
      const ext = file.name.split(".").pop()?.toLowerCase();
      const extMap: Record<string, string> = {
        pdf: "application/pdf",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        txt: "text/plain",
        html: "text/html",
        md: "text/markdown",
        csv: "text/csv",
      };
      const mimeType = ext ? extMap[ext] : undefined;
      if (!mimeType || !FILE_TYPE_MAP[mimeType]) {
        return Response.json(
          { error: "Type de fichier non supporté. Formats acceptés : PDF, DOCX, TXT, HTML, MD, CSV" },
          { status: 400 }
        );
      }
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return Response.json({ error: "Fichier trop volumineux (max 20MB)" }, { status: 400 });
    }

    // Determine file type info
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const extToMime: Record<string, string> = {
      pdf: "application/pdf",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      txt: "text/plain",
      html: "text/html",
      md: "text/markdown",
      csv: "text/csv",
    };
    const resolvedMime = file.type || extToMime[ext] || "";
    const resolvedType = FILE_TYPE_MAP[resolvedMime] ?? { sourceType: "FILE_TXT", parseType: "txt" };

    // Create source in DB
    const source = await prisma.source.create({
      data: {
        agentId,
        type: resolvedType.sourceType as any,
        name: file.name,
        fileName: file.name,
        fileSize: file.size,
        status: "PENDING",
      },
    });

    // Read file into buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Fire-and-forget indexation
    indexFile(source.id, agentId, member.orgId, file.name, buffer, resolvedType.parseType).catch(console.error);

    return Response.json({
      success: true,
      sourceId: source.id,
      fileName: file.name,
      fileSize: file.size,
      status: "INDEXING",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
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
