import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth, requireEditor } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  listPublic,
  getBySlug,
  listAdmin,
  getAdmin,
  createGallery,
  updateGallery,
  deleteGallery,
  addMedia,
  removeMedia,
  upsertGallerySchema,
  addMediaSchema,
  listQuerySchema,
} from "../controllers/galleryController";

const router = Router();

// Public
router.get("/", validate(listQuerySchema, "query"), asyncHandler(listPublic));
router.get("/slug/:slug", asyncHandler(getBySlug));

// Admin — galleries
router.get("/admin", requireAuth, requireEditor, asyncHandler(listAdmin));
router.get("/admin/:id", requireAuth, requireEditor, asyncHandler(getAdmin));
router.post("/", requireAuth, requireEditor, validate(upsertGallerySchema), asyncHandler(createGallery));
router.put("/:id", requireAuth, requireEditor, validate(upsertGallerySchema), asyncHandler(updateGallery));
router.delete("/:id", requireAuth, requireEditor, asyncHandler(deleteGallery));

// Admin — media within a gallery
router.post("/:id/media", requireAuth, requireEditor, validate(addMediaSchema), asyncHandler(addMedia));
router.delete("/:id/media/:mediaId", requireAuth, requireEditor, asyncHandler(removeMedia));

export default router;
