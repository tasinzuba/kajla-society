import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { paramStr } from "../utils/params";

export const upsertTestimonialSchema = z.object({
  name: z.string().min(1).max(120),
  role: z.string().max(120).optional().nullable(),
  quote: z.string().min(1).max(2000),
  avatar: z.string().optional().nullable(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  order: z.coerce.number().int().optional(),
  isActive: z.boolean().optional(),
});

// Public — active only
export async function listPublic(_req: Request, res: Response): Promise<void> {
  const items = await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  res.json({ success: true, data: items });
}

// Admin — all
export async function listAdmin(_req: Request, res: Response): Promise<void> {
  const items = await prisma.testimonial.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  res.json({ success: true, data: items });
}

export async function getAdmin(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const item = await prisma.testimonial.findUnique({ where: { id } });
  if (!item) throw ApiError.notFound();
  res.json({ success: true, data: item });
}

export async function createTestimonial(req: Request, res: Response): Promise<void> {
  const input = req.body as z.infer<typeof upsertTestimonialSchema>;
  const item = await prisma.testimonial.create({
    data: {
      name: input.name,
      role: input.role ?? null,
      quote: input.quote,
      avatar: input.avatar ?? null,
      rating: input.rating ?? 5,
      order: input.order ?? 0,
      isActive: input.isActive ?? true,
    },
  });
  res.status(201).json({ success: true, data: item });
}

export async function updateTestimonial(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const input = req.body as z.infer<typeof upsertTestimonialSchema>;
  const existing = await prisma.testimonial.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound();
  const item = await prisma.testimonial.update({
    where: { id },
    data: {
      name: input.name,
      role: input.role ?? null,
      quote: input.quote,
      avatar: input.avatar ?? null,
      rating: input.rating ?? existing.rating,
      order: input.order ?? existing.order,
      isActive: input.isActive ?? existing.isActive,
    },
  });
  res.json({ success: true, data: item });
}

export async function deleteTestimonial(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  await prisma.testimonial.delete({ where: { id } });
  res.json({ success: true });
}
