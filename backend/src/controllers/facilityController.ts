import type { Request, Response } from "express";
import { z } from "zod";
import { FacilityCategory } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { paramStr } from "../utils/params";

const CATEGORY_ENUM = z.nativeEnum(FacilityCategory);

const committeeMemberSchema = z.object({
  name: z.string().max(120),
  title: z.string().max(120).optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  photo: z.string().optional().nullable(),
});

export const upsertFacilitySchema = z.object({
  category: CATEGORY_ENUM,
  name: z.string().min(1).max(120),
  nameBn: z.string().max(120).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  address: z.string().max(300).optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  donationPhone: z.string().max(50).optional().nullable(),
  email: z.string().email().or(z.literal("")).optional().nullable(),
  website: z.string().url().or(z.literal("")).optional().nullable(),
  image: z.string().url().or(z.string().startsWith("/uploads/")).optional().nullable(),
  committee: z.array(committeeMemberSchema).optional().nullable(),
  eventPhotos: z.array(z.string()).optional(),
  order: z.coerce.number().int().optional(),
  isActive: z.boolean().optional(),
});

// Public — grouped by category (active only)
export async function listPublic(_req: Request, res: Response): Promise<void> {
  const items = await prisma.facility.findMany({
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { order: "asc" }, { name: "asc" }],
  });

  // Group by category
  const grouped: Record<string, typeof items> = {};
  for (const item of items) {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  }

  res.json({ success: true, data: grouped });
}

// Public — single facility by id (active only)
export async function getPublic(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const item = await prisma.facility.findFirst({
    where: { id, isActive: true },
  });
  if (!item) throw ApiError.notFound();
  res.json({ success: true, data: item });
}

// Admin — all facilities, optional category filter
const adminListSchema = z.object({
  category: CATEGORY_ENUM.optional(),
});

export async function listAdmin(req: Request, res: Response): Promise<void> {
  const { category } = req.query as unknown as z.infer<typeof adminListSchema>;
  const items = await prisma.facility.findMany({
    where: category ? { category } : {},
    orderBy: [{ category: "asc" }, { order: "asc" }, { name: "asc" }],
  });
  res.json({ success: true, data: items });
}

export async function getAdmin(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const item = await prisma.facility.findUnique({ where: { id } });
  if (!item) throw ApiError.notFound();
  res.json({ success: true, data: item });
}

export async function createFacility(req: Request, res: Response): Promise<void> {
  const input = req.body as z.infer<typeof upsertFacilitySchema>;
  const item = await prisma.facility.create({
    data: {
      category: input.category,
      name: input.name,
      nameBn: input.nameBn ?? null,
      description: input.description ?? null,
      address: input.address ?? null,
      phone: input.phone ?? null,
      donationPhone: input.donationPhone ?? null,
      email: input.email || null,
      website: input.website || null,
      image: input.image ?? null,
      committee: input.committee ?? [],
      eventPhotos: input.eventPhotos ?? [],
      order: input.order ?? 0,
      isActive: input.isActive ?? true,
    },
  });
  res.status(201).json({ success: true, data: item });
}

export async function updateFacility(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const input = req.body as z.infer<typeof upsertFacilitySchema>;
  const existing = await prisma.facility.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound();

  const item = await prisma.facility.update({
    where: { id },
    data: {
      category: input.category,
      name: input.name,
      nameBn: input.nameBn ?? null,
      description: input.description ?? null,
      address: input.address ?? null,
      phone: input.phone ?? null,
      donationPhone: input.donationPhone ?? null,
      email: input.email || null,
      website: input.website || null,
      image: input.image ?? null,
      committee: input.committee ?? [],
      eventPhotos: input.eventPhotos ?? [],
      order: input.order ?? existing.order,
      isActive: input.isActive ?? existing.isActive,
    },
  });
  res.json({ success: true, data: item });
}

export async function toggleActive(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const existing = await prisma.facility.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound();
  const item = await prisma.facility.update({
    where: { id },
    data: { isActive: !existing.isActive },
  });
  res.json({ success: true, data: item });
}

export async function deleteFacility(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  await prisma.facility.delete({ where: { id } });
  res.json({ success: true });
}

export { adminListSchema };
