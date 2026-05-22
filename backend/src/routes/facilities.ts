import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth, requireEditor } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  listPublic,
  getPublic,
  listAdmin,
  getAdmin,
  createFacility,
  updateFacility,
  toggleActive,
  deleteFacility,
  upsertFacilitySchema,
  adminListSchema,
} from "../controllers/facilityController";

const router = Router();

// Public
router.get("/", asyncHandler(listPublic));
router.get("/item/:id", asyncHandler(getPublic));

// Admin
router.get("/admin", requireAuth, requireEditor, validate(adminListSchema, "query"), asyncHandler(listAdmin));
router.get("/admin/:id", requireAuth, requireEditor, asyncHandler(getAdmin));
router.post("/", requireAuth, requireEditor, validate(upsertFacilitySchema), asyncHandler(createFacility));
router.put("/:id", requireAuth, requireEditor, validate(upsertFacilitySchema), asyncHandler(updateFacility));
router.patch("/:id/toggle", requireAuth, requireEditor, asyncHandler(toggleActive));
router.delete("/:id", requireAuth, requireEditor, asyncHandler(deleteFacility));

export default router;
