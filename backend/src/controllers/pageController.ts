import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { paramStr } from "../utils/params";
import { uniqueSlug } from "../utils/slug";

export const upsertPageSchema = z.object({
  slug: z.string().min(1).max(80).optional(), // server-generated for create if missing
  title: z.string().min(1).max(200),
  titleBn: z.string().max(200).optional().nullable(),
  content: z.string(), // Tiptap HTML
  contentBn: z.string().optional().nullable(),
  metaTitle: z.string().max(200).optional().nullable(),
  metaDesc: z.string().max(500).optional().nullable(),
  isPublished: z.boolean().optional(),
});

// Public — fetch a page by slug (for /about, /privacy, etc.)
export async function getPublicBySlug(req: Request, res: Response): Promise<void> {
  const slug = paramStr(req, "slug");
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page || !page.isPublished) throw ApiError.notFound("Page not found");
  res.json({ success: true, data: page });
}

// Admin — list all pages (no pagination — there are only a few)
export async function listAdmin(_req: Request, res: Response): Promise<void> {
  const items = await prisma.page.findMany({
    orderBy: { slug: "asc" },
    select: {
      id: true,
      slug: true,
      title: true,
      titleBn: true,
      isPublished: true,
      updatedAt: true,
      author: { select: { name: true } },
    },
  });
  res.json({ success: true, data: items });
}

// Admin — fetch by id (full content)
export async function getAdminById(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const page = await prisma.page.findUnique({
    where: { id },
    include: { author: { select: { id: true, name: true } } },
  });
  if (!page) throw ApiError.notFound();
  res.json({ success: true, data: page });
}

// Admin — create custom page
export async function createPage(req: Request, res: Response): Promise<void> {
  if (!req.user) throw ApiError.unauthorized();
  const input = req.body as z.infer<typeof upsertPageSchema>;
  const slug = input.slug
    ? await uniqueSlug("page", input.slug)
    : await uniqueSlug("page", input.title);

  const page = await prisma.page.create({
    data: {
      slug,
      title: input.title,
      titleBn: input.titleBn ?? null,
      content: input.content,
      contentBn: input.contentBn ?? null,
      metaTitle: input.metaTitle ?? null,
      metaDesc: input.metaDesc ?? null,
      isPublished: input.isPublished ?? true,
      authorId: req.user.sub,
    },
  });
  res.status(201).json({ success: true, data: page });
}

// Admin — update
export async function updatePage(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const input = req.body as z.infer<typeof upsertPageSchema>;
  const existing = await prisma.page.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound();

  const page = await prisma.page.update({
    where: { id },
    data: {
      title: input.title,
      titleBn: input.titleBn ?? null,
      content: input.content,
      contentBn: input.contentBn ?? null,
      metaTitle: input.metaTitle ?? null,
      metaDesc: input.metaDesc ?? null,
      isPublished: input.isPublished ?? existing.isPublished,
    },
  });
  res.json({ success: true, data: page });
}

// Admin — delete (protect well-known slugs)
const PROTECTED_SLUGS = new Set(["home", "about", "contact"]);

export async function deletePage(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const page = await prisma.page.findUnique({ where: { id }, select: { slug: true } });
  if (!page) throw ApiError.notFound();
  if (PROTECTED_SLUGS.has(page.slug)) {
    throw ApiError.badRequest(`Cannot delete protected page "${page.slug}"`);
  }
  await prisma.page.delete({ where: { id } });
  res.json({ success: true });
}
