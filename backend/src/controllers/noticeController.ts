import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { paramStr } from "../utils/params";

// ============================================================
// Schemas
// ============================================================

export const upsertNoticeSchema = z.object({
  title: z.string().min(1).max(200),
  titleBn: z.string().max(200).optional().nullable(),
  content: z.string().min(1),
  attachment: z.string().url().or(z.string().startsWith("/uploads/")).optional().nullable(),
  isPinned: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  q: z.string().optional(),
});

// ============================================================
// Public
// ============================================================

export async function listPublic(req: Request, res: Response): Promise<void> {
  const { page, limit, q } = req.query as unknown as z.infer<typeof listQuerySchema>;
  const skip = (page - 1) * limit;

  const where = {
    isPublished: true,
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { content: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.notice.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
      select: {
        id: true,
        title: true,
        titleBn: true,
        content: true,
        attachment: true,
        isPinned: true,
        publishedAt: true,
        createdAt: true,
        author: { select: { name: true } },
      },
    }),
    prisma.notice.count({ where }),
  ]);

  res.json({
    success: true,
    data: { items, page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function getPublic(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const notice = await prisma.notice.findUnique({
    where: { id },
    include: { author: { select: { name: true } } },
  });
  if (!notice || !notice.isPublished) throw ApiError.notFound("Notice not found");
  res.json({ success: true, data: notice });
}

// ============================================================
// Admin
// ============================================================

export async function listAdmin(req: Request, res: Response): Promise<void> {
  const { page, limit, q } = req.query as unknown as z.infer<typeof listQuerySchema>;
  const skip = (page - 1) * limit;

  const where = q
    ? { title: { contains: q, mode: "insensitive" as const } }
    : {};

  const [items, total] = await Promise.all([
    prisma.notice.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
      select: {
        id: true,
        title: true,
        attachment: true,
        isPinned: true,
        isPublished: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        author: { select: { name: true } },
      },
    }),
    prisma.notice.count({ where }),
  ]);

  res.json({
    success: true,
    data: { items, page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function getAdmin(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const notice = await prisma.notice.findUnique({
    where: { id },
    include: { author: { select: { id: true, name: true } } },
  });
  if (!notice) throw ApiError.notFound();
  res.json({ success: true, data: notice });
}

export async function createNotice(req: Request, res: Response): Promise<void> {
  if (!req.user) throw ApiError.unauthorized();
  const input = req.body as z.infer<typeof upsertNoticeSchema>;

  const notice = await prisma.notice.create({
    data: {
      title: input.title,
      titleBn: input.titleBn ?? null,
      content: input.content,
      attachment: input.attachment ?? null,
      isPinned: input.isPinned ?? false,
      isPublished: input.isPublished ?? true,
      publishedAt: new Date(),
      authorId: req.user.sub,
    },
  });
  res.status(201).json({ success: true, data: notice });
}

export async function updateNotice(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const input = req.body as z.infer<typeof upsertNoticeSchema>;

  const existing = await prisma.notice.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound();

  const notice = await prisma.notice.update({
    where: { id },
    data: {
      title: input.title,
      titleBn: input.titleBn ?? null,
      content: input.content,
      attachment: input.attachment ?? null,
      isPinned: input.isPinned ?? existing.isPinned,
      isPublished: input.isPublished ?? existing.isPublished,
    },
  });
  res.json({ success: true, data: notice });
}

export async function togglePin(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const existing = await prisma.notice.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound();
  const notice = await prisma.notice.update({
    where: { id },
    data: { isPinned: !existing.isPinned },
  });
  res.json({ success: true, data: notice });
}

export async function deleteNotice(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  await prisma.notice.delete({ where: { id } });
  res.json({ success: true });
}
