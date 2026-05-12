import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { paramStr } from "../utils/params";

export const upsertSchema = z.object({
  name: z.string().min(1).max(120),
  nameBn: z.string().max(120).optional().nullable(),
  role: z.string().min(1).max(120),
  roleBn: z.string().max(120).optional().nullable(),
  photo: z.string().url().or(z.string().startsWith("/uploads/")).optional().nullable(),
  bio: z.string().max(2000).optional().nullable(),
  email: z.string().email().or(z.literal("")).optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  term: z.string().min(1).max(50),
  order: z.coerce.number().int().optional(),
  isActive: z.boolean().optional(),
});

const listQuerySchema = z.object({
  term: z.string().optional(),
  active: z.coerce.boolean().optional(),
});

// ============================================================
// Public — grouped by term, only active members
// ============================================================
export async function listPublic(_req: Request, res: Response): Promise<void> {
  const items = await prisma.committeeMember.findMany({
    where: { isActive: true },
    orderBy: [{ term: "desc" }, { order: "asc" }, { name: "asc" }],
  });

  // Group by term
  const grouped: Record<string, typeof items> = {};
  for (const item of items) {
    if (!grouped[item.term]) grouped[item.term] = [];
    grouped[item.term].push(item);
  }

  // Latest term first (terms are typically "YYYY-YYYY")
  const terms = Object.keys(grouped).sort().reverse();
  const ordered = terms.map((term) => ({ term, members: grouped[term] }));

  res.json({ success: true, data: ordered });
}

// ============================================================
// Admin
// ============================================================
export async function listAdmin(req: Request, res: Response): Promise<void> {
  const { term, active } = req.query as unknown as z.infer<typeof listQuerySchema>;
  const where = {
    ...(term ? { term } : {}),
    ...(active !== undefined ? { isActive: active } : {}),
  };
  const items = await prisma.committeeMember.findMany({
    where,
    orderBy: [{ term: "desc" }, { order: "asc" }],
  });
  res.json({ success: true, data: items });
}

export async function getAdmin(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const item = await prisma.committeeMember.findUnique({ where: { id } });
  if (!item) throw ApiError.notFound();
  res.json({ success: true, data: item });
}

export async function create(req: Request, res: Response): Promise<void> {
  const input = req.body as z.infer<typeof upsertSchema>;
  const item = await prisma.committeeMember.create({
    data: {
      name: input.name,
      nameBn: input.nameBn ?? null,
      role: input.role,
      roleBn: input.roleBn ?? null,
      photo: input.photo ?? null,
      bio: input.bio ?? null,
      email: input.email || null,
      phone: input.phone ?? null,
      term: input.term,
      order: input.order ?? 0,
      isActive: input.isActive ?? true,
    },
  });
  res.status(201).json({ success: true, data: item });
}

export async function update(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const input = req.body as z.infer<typeof upsertSchema>;
  const existing = await prisma.committeeMember.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound();

  const item = await prisma.committeeMember.update({
    where: { id },
    data: {
      name: input.name,
      nameBn: input.nameBn ?? null,
      role: input.role,
      roleBn: input.roleBn ?? null,
      photo: input.photo ?? null,
      bio: input.bio ?? null,
      email: input.email || null,
      phone: input.phone ?? null,
      term: input.term,
      order: input.order ?? existing.order,
      isActive: input.isActive ?? existing.isActive,
    },
  });
  res.json({ success: true, data: item });
}

export async function toggleActive(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const existing = await prisma.committeeMember.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound();
  const item = await prisma.committeeMember.update({
    where: { id },
    data: { isActive: !existing.isActive },
  });
  res.json({ success: true, data: item });
}

export async function remove(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  await prisma.committeeMember.delete({ where: { id } });
  res.json({ success: true });
}

export { listQuerySchema };
