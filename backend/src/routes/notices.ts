import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth, requireEditor } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  listPublic,
  listAdmin,
  getPublic,
  getAdmin,
  createNotice,
  updateNotice,
  deleteNotice,
  togglePin,
  upsertNoticeSchema,
  listQuerySchema,
} from "../controllers/noticeController";

const router = Router();

// Public
router.get("/", validate(listQuerySchema, "query"), asyncHandler(listPublic));
router.get("/:id", asyncHandler(getPublic));

// Admin
router.get("/admin/list", requireAuth, requireEditor, validate(listQuerySchema, "query"), asyncHandler(listAdmin));
router.get("/admin/:id", requireAuth, requireEditor, asyncHandler(getAdmin));
router.post("/", requireAuth, requireEditor, validate(upsertNoticeSchema), asyncHandler(createNotice));
router.put("/:id", requireAuth, requireEditor, validate(upsertNoticeSchema), asyncHandler(updateNotice));
router.patch("/:id/pin", requireAuth, requireEditor, asyncHandler(togglePin));
router.delete("/:id", requireAuth, requireEditor, asyncHandler(deleteNotice));

export default router;
