import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth, requireEditor } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  getSetting,
  upsertSetting,
  upsertSettingSchema,
} from "../controllers/settingController";

const router = Router();

// Public
router.get("/:key", asyncHandler(getSetting));

// Admin
router.put(
  "/:key",
  requireAuth,
  requireEditor,
  validate(upsertSettingSchema),
  asyncHandler(upsertSetting)
);

export default router;
