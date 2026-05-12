import type { Request, Response } from "express";
import { z } from "zod";
import { MediaType } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { paramStr } from "../utils/params";
import { uniqueSlug } from "../utils/slug";
import { youtubeId, youtubeThumb } from "../utils/youtube";

const MEDIA_TYPE = z.nativeEnum(MediaType);

export const upsertGallerySchema = z.object({
  title: z.string().min(1).max(200),
  titleBn: z.string().max(200).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  coverImage: z.string().url().or(z.string().startsWith("/uploads/")).optional().nullable(),
  type: MEDIA_TYPE.default("PHOTO"),
});

export const addMediaSchema = z.object({
  url: z.string().min(1),
  caption: z.string().max(300).optional().nullable(),
  type: MEDIA_TYPE.optional(),
});

const listQuerySchema = z.object({
  type: MEDIA_TYPE.optional(),
});

// ============================================================
// Public
// ============================================================

export async function listPublic(req: Request, res: Response): Promise<void> {
  const { type } = req.query as unknown as z.infer<typeof listQuerySchema>;
  const items = await prisma.gallery.findMany({
    where: type ? { type } : {},
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      titleBn: true,
      description: true,
      coverImage: true,
      type: true,
      createdAt: true,
      _count: { select: { media: true } },
    },
  });
  res.json({ success: true, data: items });
}

export async function getBySlug(req: Request, res: Response): Promise<void> {
  const slug = paramStr(req, "slug");
  const gallery = await prisma.gallery.findUnique({
    where: { slug },
    include: {
      media: { orderBy: [{ order: "asc" }, { createdAt: "asc" }] },
    },
  });
  if (!gallery) throw ApiError.notFound("Gallery not found");
  res.json({ success: true, data: gallery });
}

// ============================================================
// Admin — Galleries
// ============================================================

export async function listAdmin(_req: Request, res: Response): Promise<void> {
  const items = await prisma.gallery.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      coverImage: true,
      type: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { media: true } },
    },
  });
  res.json({ success: true, data: items });
}

export async function getAdmin(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const gallery = await prisma.gallery.findUnique({
    where: { id },
    include: {
      media: { orderBy: [{ order: "asc" }, { createdAt: "asc" }] },
    },
  });
  if (!gallery) throw ApiError.notFound();
  res.json({ success: true, data: gallery });
}

export async function createGallery(req: Request, res: Response): Promise<void> {
  const input = req.body as z.infer<typeof upsertGallerySchema>;
  const slug = await uniqueSlug("gallery", input.title);
  const gallery = await prisma.gallery.create({
    data: {
      slug,
      title: input.title,
      titleBn: input.titleBn ?? null,
      description: input.description ?? null,
      coverImage: input.coverImage ?? null,
      type: input.type,
    },
  });
  res.status(201).json({ success: true, data: gallery });
}

export async function updateGallery(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const input = req.body as z.infer<typeof upsertGallerySchema>;
  const existing = await prisma.gallery.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound();

  const slug =
    existing.title !== input.title
      ? await uniqueSlug("gallery", input.title, existing.id)
      : existing.slug;

  const gallery = await prisma.gallery.update({
    where: { id },
    data: {
      slug,
      title: input.title,
      titleBn: input.titleBn ?? null,
      description: input.description ?? null,
      coverImage: input.coverImage ?? null,
      type: input.type,
    },
  });
  res.json({ success: true, data: gallery });
}

export async function deleteGallery(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  // Cascade deletes media (defined in schema)
  await prisma.gallery.delete({ where: { id } });
  res.json({ success: true });
}

// ============================================================
// Admin — Media items within a gallery
// ============================================================

export async function addMedia(req: Request, res: Response): Promise<void> {
  const galleryId = paramStr(req, "id");
  const input = req.body as z.infer<typeof addMediaSchema>;

  const gallery = await prisma.gallery.findUnique({ where: { id: galleryId } });
  if (!gallery) throw ApiError.notFound("Gallery not found");

  const mediaType = input.type ?? gallery.type;
  let url = input.url;
  let thumbnail: string | null = null;

  if (mediaType === "VIDEO") {
    const vid = youtubeId(input.url);
    if (!vid) {
      throw ApiError.badRequest(
        "Video URL must be a YouTube URL (youtu.be/<id> or youtube.com/watch?v=<id>)"
      );
    }
    url = `https://www.youtube.com/embed/${vid}`;
    thumbnail = youtubeThumb(vid);
  }

  // Get current max order for this gallery
  const last = await prisma.media.findFirst({
    where: { galleryId },
    orderBy: { order: "desc" },
    select: { order: true },
  });
  const nextOrder = (last?.order ?? -1) + 1;

  const media = await prisma.media.create({
    data: {
      url,
      thumbnail,
      caption: input.caption ?? null,
      type: mediaType,
      order: nextOrder,
      galleryId,
    },
  });

  // Auto-set cover image to first photo if not set
  if (!gallery.coverImage && mediaType === "PHOTO") {
    await prisma.gallery.update({
      where: { id: galleryId },
      data: { coverImage: media.url },
    });
  }

  res.status(201).json({ success: true, data: media });
}

export async function removeMedia(req: Request, res: Response): Promise<void> {
  const mediaId = paramStr(req, "mediaId");
  await prisma.media.delete({ where: { id: mediaId } });
  res.json({ success: true });
}

export { listQuerySchema };
