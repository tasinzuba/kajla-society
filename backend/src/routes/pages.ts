import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth, requireEditor } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  getPublicBySlug,
  listAdmin,
  getAdminById,
  createPage,
  updatePage,
  deletePage,
  upsertPageSchema,
} from "../controllers/pageController";

const router = Router();

// Public
router.get("/slug/:slug", asyncHandler(getPublicBySlug));

// Admin
router.get("/admin", requireAuth, requireEditor, asyncHandler(listAdmin));
router.get("/admin/:id", requireAuth, requireEditor, asyncHandler(getAdminById));
router.post("/", requireAuth, requireEditor, validate(upsertPageSchema), asyncHandler(createPage));
router.put("/:id", requireAuth, requireEditor, validate(upsertPageSchema), asyncHandler(updatePage));
router.delete("/:id", requireAuth, requireEditor, asyncHandler(deletePage));

export default router;
