import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth, requireEditor } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  listPublic,
  listAdmin,
  getAdmin,
  createHeroSlide,
  updateHeroSlide,
  toggleActive,
  deleteHeroSlide,
  upsertHeroSlideSchema,
} from "../controllers/heroSlideController";

const router = Router();

// Public
router.get("/", asyncHandler(listPublic));

// Admin
router.get("/admin", requireAuth, requireEditor, asyncHandler(listAdmin));
router.get("/admin/:id", requireAuth, requireEditor, asyncHandler(getAdmin));
router.post("/", requireAuth, requireEditor, validate(upsertHeroSlideSchema), asyncHandler(createHeroSlide));
router.put("/:id", requireAuth, requireEditor, validate(upsertHeroSlideSchema), asyncHandler(updateHeroSlide));
router.patch("/:id/toggle", requireAuth, requireEditor, asyncHandler(toggleActive));
router.delete("/:id", requireAuth, requireEditor, asyncHandler(deleteHeroSlide));

export default router;
