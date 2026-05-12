import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { uniqueSlug } from "../utils/slug";
import { paramStr } from "../utils/params";

// ============================================================
// Schemas
// ============================================================

export const upsertEventSchema = z.object({
  title: z.string().min(1).max(200),
  titleBn: z.string().max(200).optional().nullable(),
  description: z.string().min(1),
  coverImage: z.string().url().or(z.string().startsWith("/uploads/")).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  startsAt: z.string().datetime().or(z.coerce.date()),
  endsAt: z.string().datetime().or(z.coerce.date()).optional().nullable(),
  isPublished: z.boolean().optional(),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  scope: z.enum(["all", "upcoming", "past"]).default("all"),
  q: z.string().optional(),
});

// ============================================================
// Public
// ============================================================

export async function listPublic(req: Request, res: Response): Promise<void> {
  const { page, limit, scope, q } = req.query as unknown as z.infer<typeof listQuerySchema>;
  const skip = (page - 1) * limit;
  const now = new Date();

  const where = {
    isPublished: true,
    ...(scope === "upcoming" ? { startsAt: { gte: now } } : {}),
    ...(scope === "past" ? { startsAt: { lt: now } } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { location: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const orderBy =
    scope === "past"
      ? { startsAt: "desc" as const }
      : { startsAt: "asc" as const };

  const [items, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: {
        id: true,
        slug: true,
        title: true,
        titleBn: true,
        coverImage: true,
        location: true,
        startsAt: true,
        endsAt: true,
        createdAt: true,
        author: { select: { name: true } },
      },
    }),
    prisma.event.count({ where }),
  ]);

  res.json({
    success: true,
    data: { items, page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function getBySlug(req: Request, res: Response): Promise<void> {
  const slug = paramStr(req, "slug");
  const event = await prisma.event.findUnique({
    where: { slug },
    include: { author: { select: { name: true, avatar: true } } },
  });
  if (!event || !event.isPublished) throw ApiError.notFound("Event not found");
  res.json({ success: true, data: event });
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
    prisma.event.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ startsAt: "desc" }],
      select: {
        id: true,
        slug: true,
        title: true,
        coverImage: true,
        location: true,
        startsAt: true,
        endsAt: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
        author: { select: { name: true } },
      },
    }),
    prisma.event.count({ where }),
  ]);

  res.json({
    success: true,
    data: { items, page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function getAdmin(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const event = await prisma.event.findUnique({
    where: { id },
    include: { author: { select: { id: true, name: true } } },
  });
  if (!event) throw ApiError.notFound();
  res.json({ success: true, data: event });
}

export async function createEvent(req: Request, res: Response): Promise<void> {
  if (!req.user) throw ApiError.unauthorized();
  const input = req.body as z.infer<typeof upsertEventSchema>;
  const slug = await uniqueSlug("event", input.title);

  const event = await prisma.event.create({
    data: {
      slug,
      title: input.title,
      titleBn: input.titleBn ?? null,
      description: input.description,
      coverImage: input.coverImage ?? null,
      location: input.location ?? null,
      startsAt: new Date(input.startsAt),
      endsAt: input.endsAt ? new Date(input.endsAt) : null,
      isPublished: input.isPublished ?? true,
      authorId: req.user.sub,
    },
  });
  res.status(201).json({ success: true, data: event });
}

export async function updateEvent(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const input = req.body as z.infer<typeof upsertEventSchema>;

  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound();

  const slug =
    existing.title !== input.title
      ? await uniqueSlug("event", input.title, existing.id)
      : existing.slug;

  const event = await prisma.event.update({
    where: { id },
    data: {
      slug,
      title: input.title,
      titleBn: input.titleBn ?? null,
      description: input.description,
      coverImage: input.coverImage ?? null,
      location: input.location ?? null,
      startsAt: new Date(input.startsAt),
      endsAt: input.endsAt ? new Date(input.endsAt) : null,
      isPublished: input.isPublished ?? existing.isPublished,
    },
  });
  res.json({ success: true, data: event });
}

export async function deleteEvent(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  await prisma.event.delete({ where: { id } });
  res.json({ success: true });
}
