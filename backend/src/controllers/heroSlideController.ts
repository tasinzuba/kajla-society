import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { paramStr } from "../utils/params";

export const upsertHeroSlideSchema = z.object({
  image: z.string().url().or(z.string().startsWith("/uploads/")),
  title: z.string().max(160).optional().nullable(),
  titleBn: z.string().max(160).optional().nullable(),
  subtitle: z.string().max(300).optional().nullable(),
  subtitleBn: z.string().max(300).optional().nullable(),
  ctaLabel: z.string().max(60).optional().nullable(),
  ctaHref: z.string().max(500).optional().nullable(),
  order: z.coerce.number().int().optional(),
  isActive: z.boolean().optional(),
});

// Public — active slides only, ordered
export async function listPublic(_req: Request, res: Response): Promise<void> {
  const items = await prisma.heroSlide.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  res.json({ success: true, data: items });
}

// Admin — all slides
export async function listAdmin(_req: Request, res: Response): Promise<void> {
  const items = await prisma.heroSlide.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  res.json({ success: true, data: items });
}

export async function getAdmin(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const item = await prisma.heroSlide.findUnique({ where: { id } });
  if (!item) throw ApiError.notFound();
  res.json({ success: true, data: item });
}

export async function createHeroSlide(req: Request, res: Response): Promise<void> {
  const input = req.body as z.infer<typeof upsertHeroSlideSchema>;
  const item = await prisma.heroSlide.create({
    data: {
      image: input.image,
      title: input.title ?? null,
      titleBn: input.titleBn ?? null,
      subtitle: input.subtitle ?? null,
      subtitleBn: input.subtitleBn ?? null,
      ctaLabel: input.ctaLabel ?? null,
      ctaHref: input.ctaHref ?? null,
      order: input.order ?? 0,
      isActive: input.isActive ?? true,
    },
  });
  res.status(201).json({ success: true, data: item });
}

export async function updateHeroSlide(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const input = req.body as z.infer<typeof upsertHeroSlideSchema>;
  const existing = await prisma.heroSlide.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound();

  const item = await prisma.heroSlide.update({
    where: { id },
    data: {
      image: input.image,
      title: input.title ?? null,
      titleBn: input.titleBn ?? null,
      subtitle: input.subtitle ?? null,
      subtitleBn: input.subtitleBn ?? null,
      ctaLabel: input.ctaLabel ?? null,
      ctaHref: input.ctaHref ?? null,
      order: input.order ?? existing.order,
      isActive: input.isActive ?? existing.isActive,
    },
  });
  res.json({ success: true, data: item });
}

export async function toggleActive(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const existing = await prisma.heroSlide.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound();
  const item = await prisma.heroSlide.update({
    where: { id },
    data: { isActive: !existing.isActive },
  });
  res.json({ success: true, data: item });
}

export async function deleteHeroSlide(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  await prisma.heroSlide.delete({ where: { id } });
  res.json({ success: true });
}
