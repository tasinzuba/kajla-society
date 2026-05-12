import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { uniqueSlug } from "../utils/slug";
import { paramStr } from "../utils/params";

// ============================================================
// Schemas
// ============================================================

export const upsertArticleSchema = z.object({
  title: z.string().min(1).max(200),
  titleBn: z.string().max(200).optional().nullable(),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string().min(1), // Tiptap JSON or HTML stringified
  contentBn: z.string().optional().nullable(),
  coverImage: z.string().url().or(z.string().startsWith("/uploads/")).optional().nullable(),
  categoryId: z.string().optional().nullable(),
  isPublished: z.boolean().optional(),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  category: z.string().optional(),
  q: z.string().optional(),
});

// ============================================================
// Public
// ============================================================

export async function listPublic(req: Request, res: Response): Promise<void> {
  const { page, limit, category, q } = req.query as unknown as z.infer<typeof listQuerySchema>;
  const skip = (page - 1) * limit;

  const where = {
    isPublished: true,
    ...(category ? { category: { slug: category } } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { excerpt: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.article.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        slug: true,
        title: true,
        titleBn: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
        createdAt: true,
        viewCount: true,
        category: { select: { slug: true, name: true } },
        author: { select: { name: true } },
      },
    }),
    prisma.article.count({ where }),
  ]);

  res.json({
    success: true,
    data: {
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function getBySlug(req: Request, res: Response): Promise<void> {
  const slug = paramStr(req, "slug");
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      category: { select: { slug: true, name: true, nameBn: true } },
      author: { select: { name: true, avatar: true } },
    },
  });

  if (!article || !article.isPublished) throw ApiError.notFound("Article not found");

  // Fire-and-forget view count increment
  prisma.article
    .update({ where: { id: article.id }, data: { viewCount: { increment: 1 } } })
    .catch(() => {});

  res.json({ success: true, data: article });
}

// ============================================================
// Admin
// ============================================================

export async function listAdmin(req: Request, res: Response): Promise<void> {
  const { page, limit, q } = req.query as unknown as z.infer<typeof listQuerySchema>;
  const skip = (page - 1) * limit;

  const where = q
    ? {
        OR: [
          { title: { contains: q, mode: "insensitive" as const } },
          { slug: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.article.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ updatedAt: "desc" }],
      select: {
        id: true,
        slug: true,
        title: true,
        coverImage: true,
        isPublished: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        viewCount: true,
        category: { select: { slug: true, name: true } },
        author: { select: { name: true } },
      },
    }),
    prisma.article.count({ where }),
  ]);

  res.json({
    success: true,
    data: { items, page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function getAdmin(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const article = await prisma.article.findUnique({
    where: { id },
    include: { category: true, author: { select: { id: true, name: true } } },
  });
  if (!article) throw ApiError.notFound();
  res.json({ success: true, data: article });
}

export async function createArticle(req: Request, res: Response): Promise<void> {
  if (!req.user) throw ApiError.unauthorized();
  const input = req.body as z.infer<typeof upsertArticleSchema>;

  const slug = await uniqueSlug("article", input.title);
  const willPublish = input.isPublished ?? false;

  const article = await prisma.article.create({
    data: {
      slug,
      title: input.title,
      titleBn: input.titleBn ?? null,
      excerpt: input.excerpt ?? null,
      content: input.content,
      contentBn: input.contentBn ?? null,
      coverImage: input.coverImage ?? null,
      categoryId: input.categoryId || null,
      isPublished: willPublish,
      publishedAt: willPublish ? new Date() : null,
      authorId: req.user.sub,
    },
  });

  res.status(201).json({ success: true, data: article });
}

export async function updateArticle(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const input = req.body as z.infer<typeof upsertArticleSchema>;

  const existing = await prisma.article.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound();

  // Re-slug if title changed
  const slug =
    existing.title !== input.title
      ? await uniqueSlug("article", input.title, existing.id)
      : existing.slug;

  // Set publishedAt the first time it transitions to published
  let publishedAt: Date | null = existing.publishedAt;
  const willPublish = input.isPublished ?? existing.isPublished;
  if (willPublish && !existing.publishedAt) publishedAt = new Date();
  if (!willPublish) publishedAt = null;

  const article = await prisma.article.update({
    where: { id },
    data: {
      slug,
      title: input.title,
      titleBn: input.titleBn ?? null,
      excerpt: input.excerpt ?? null,
      content: input.content,
      contentBn: input.contentBn ?? null,
      coverImage: input.coverImage ?? null,
      categoryId: input.categoryId || null,
      isPublished: willPublish,
      publishedAt,
    },
  });

  res.json({ success: true, data: article });
}

export async function deleteArticle(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  await prisma.article.delete({ where: { id } });
  res.json({ success: true });
}
