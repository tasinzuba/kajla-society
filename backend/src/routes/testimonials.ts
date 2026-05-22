import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth, requireEditor } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  listPublic,
  listAdmin,
  getAdmin,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  upsertTestimonialSchema,
} from "../controllers/testimonialController";

const router = Router();

// Public
router.get("/", asyncHandler(listPublic));

// Admin
router.get("/admin", requireAuth, requireEditor, asyncHandler(listAdmin));
router.get("/admin/:id", requireAuth, requireEditor, asyncHandler(getAdmin));
router.post("/", requireAuth, requireEditor, validate(upsertTestimonialSchema), asyncHandler(createTestimonial));
router.put("/:id", requireAuth, requireEditor, validate(upsertTestimonialSchema), asyncHandler(updateTestimonial));
router.delete("/:id", requireAuth, requireEditor, asyncHandler(deleteTestimonial));

export default router;
