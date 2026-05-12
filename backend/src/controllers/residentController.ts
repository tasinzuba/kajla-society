import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { paramStr } from "../utils/params";

export const upsertSchema = z.object({
  fullName: z.string().min(1).max(120),
  fullNameBn: z.string().max(120).optional().nullable(),
  houseNo: z.string().min(1).max(50),
  road: z.string().max(50).optional().nullable(),
  block: z.string().max(50).optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  email: z.string().email().or(z.literal("")).optional().nullable(),
  membershipNo: z.string().max(50).optional().nullable(),
  photo: z.string().url().or(z.string().startsWith("/uploads/")).optional().nullable(),
  isVerified: z.boolean().optional(),
  isPublic: z.boolean().optional(),
});

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(24),
  q: z.string().optional(),
  block: z.string().optional(),
  road: z.string().optional(),
});

const adminListQuerySchema = listQuerySchema.extend({
  verified: z.coerce.boolean().optional(),
  visibility: z.enum(["public", "private", "all"]).optional(),
});

// Bulk import — accepts an array of resident input objects
const bulkSchema = z.object({
  items: z.array(upsertSchema).min(1).max(500),
});

// ============================================================
// Public — only verified + public residents, searchable
// ============================================================
export async function listPublic(req: Request, res: Response): Promise<void> {
  const { page, limit, q, block, road } = req.query as unknown as z.infer<
    typeof listQuerySchema
  >;
  const skip = (page - 1) * limit;

  const where = {
    isPublic: true,
    isVerified: true,
    ...(block ? { block } : {}),
    ...(road ? { road } : {}),
    ...(q
      ? {
          OR: [
            { fullName: { contains: q, mode: "insensitive" as const } },
            { houseNo: { contains: q, mode: "insensitive" as const } },
            { membershipNo: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.resident.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ houseNo: "asc" }],
      // Don't expose private contact details publicly by default — phone hidden
      select: {
        id: true,
        fullName: true,
        fullNameBn: true,
        houseNo: true,
        road: true,
        block: true,
        membershipNo: true,
        photo: true,
      },
    }),
    prisma.resident.count({ where }),
  ]);

  res.json({
    success: true,
    data: { items, page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

// ============================================================
// Admin — full data + filters
// ============================================================
export async function listAdmin(req: Request, res: Response): Promise<void> {
  const { page, limit, q, block, road, verified, visibility } = req.query as unknown as z.infer<
    typeof adminListQuerySchema
  >;
  const skip = (page - 1) * limit;

  const where = {
    ...(block ? { block } : {}),
    ...(road ? { road } : {}),
    ...(verified !== undefined ? { isVerified: verified } : {}),
    ...(visibility === "public"
      ? { isPublic: true }
      : visibility === "private"
      ? { isPublic: false }
      : {}),
    ...(q
      ? {
          OR: [
            { fullName: { contains: q, mode: "insensitive" as const } },
            { houseNo: { contains: q, mode: "insensitive" as const } },
            { membershipNo: { contains: q, mode: "insensitive" as const } },
            { phone: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.resident.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ updatedAt: "desc" }],
    }),
    prisma.resident.count({ where }),
  ]);

  res.json({
    success: true,
    data: { items, page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function getAdmin(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const item = await prisma.resident.findUnique({ where: { id } });
  if (!item) throw ApiError.notFound();
  res.json({ success: true, data: item });
}

export async function create(req: Request, res: Response): Promise<void> {
  const input = req.body as z.infer<typeof upsertSchema>;
  const item = await prisma.resident.create({
    data: {
      fullName: input.fullName,
      fullNameBn: input.fullNameBn ?? null,
      houseNo: input.houseNo,
      road: input.road ?? null,
      block: input.block ?? null,
      phone: input.phone ?? null,
      email: input.email || null,
      membershipNo: input.membershipNo || null,
      photo: input.photo ?? null,
      isVerified: input.isVerified ?? false,
      isPublic: input.isPublic ?? true,
    },
  });
  res.status(201).json({ success: true, data: item });
}

export async function update(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const input = req.body as z.infer<typeof upsertSchema>;
  const existing = await prisma.resident.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound();

  const item = await prisma.resident.update({
    where: { id },
    data: {
      fullName: input.fullName,
      fullNameBn: input.fullNameBn ?? null,
      houseNo: input.houseNo,
      road: input.road ?? null,
      block: input.block ?? null,
      phone: input.phone ?? null,
      email: input.email || null,
      membershipNo: input.membershipNo || null,
      photo: input.photo ?? null,
      isVerified: input.isVerified ?? existing.isVerified,
      isPublic: input.isPublic ?? existing.isPublic,
    },
  });
  res.json({ success: true, data: item });
}

export async function toggleVerified(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const existing = await prisma.resident.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound();
  const item = await prisma.resident.update({
    where: { id },
    data: { isVerified: !existing.isVerified },
  });
  res.json({ success: true, data: item });
}

export async function remove(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  await prisma.resident.delete({ where: { id } });
  res.json({ success: true });
}

// Bulk import from CSV (frontend parses CSV → JSON)
export async function bulkImport(req: Request, res: Response): Promise<void> {
  const { items } = req.body as z.infer<typeof bulkSchema>;

  let created = 0;
  const errors: Array<{ index: number; error: string }> = [];

  for (let i = 0; i < items.length; i++) {
    const input = items[i];
    try {
      await prisma.resident.create({
        data: {
          fullName: input.fullName,
          fullNameBn: input.fullNameBn ?? null,
          houseNo: input.houseNo,
          road: input.road ?? null,
          block: input.block ?? null,
          phone: input.phone ?? null,
          email: input.email || null,
          membershipNo: input.membershipNo || null,
          photo: input.photo ?? null,
          isVerified: input.isVerified ?? false,
          isPublic: input.isPublic ?? true,
        },
      });
      created++;
    } catch (e) {
      errors.push({ index: i, error: e instanceof Error ? e.message : "Unknown error" });
    }
  }

  res.json({
    success: true,
    data: { created, failed: errors.length, total: items.length, errors },
  });
}

export { listQuerySchema, adminListQuerySchema, bulkSchema };
