import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth, requireEditor } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { paramStr } from "../utils/params";
import slugify from "slugify";

const router = Router();

const upsertSchema = z.object({
  name: z.string().min(1).max(80),
  nameBn: z.string().max(80).optional().nullable(),
  slug: z.string().optional(),
});

// Public list
router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const items = await prisma.category.findMany({ orderBy: { name: "asc" } });
    res.json({ success: true, data: items });
  })
);

// Create
router.post(
  "/",
  requireAuth,
  requireEditor,
  validate(upsertSchema),
  asyncHandler(async (req, res) => {
    const input = req.body as z.infer<typeof upsertSchema>;
    const slug =
      input.slug?.trim() ||
      slugify(input.name, { lower: true, strict: true });
    const cat = await prisma.category.create({
      data: { name: input.name, nameBn: input.nameBn ?? null, slug },
    });
    res.status(201).json({ success: true, data: cat });
  })
);

// Update
router.put(
  "/:id",
  requireAuth,
  requireEditor,
  validate(upsertSchema),
  asyncHandler(async (req, res) => {
    const id = paramStr(req, "id");
    const input = req.body as z.infer<typeof upsertSchema>;
    const cat = await prisma.category.update({
      where: { id },
      data: {
        name: input.name,
        nameBn: input.nameBn ?? null,
        ...(input.slug ? { slug: input.slug } : {}),
      },
    });
    res.json({ success: true, data: cat });
  })
);

// Delete
router.delete(
  "/:id",
  requireAuth,
  requireEditor,
  asyncHandler(async (req, res) => {
    const id = paramStr(req, "id");
    const articlesCount = await prisma.article.count({ where: { categoryId: id } });
    if (articlesCount > 0) {
      throw ApiError.badRequest(
        `Cannot delete: ${articlesCount} article(s) use this category`
      );
    }
    await prisma.category.delete({ where: { id } });
    res.json({ success: true });
  })
);

export default router;
