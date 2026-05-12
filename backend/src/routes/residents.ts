import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth, requireEditor } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  listPublic,
  listAdmin,
  getAdmin,
  create,
  update,
  toggleVerified,
  remove,
  bulkImport,
  upsertSchema,
  listQuerySchema,
  adminListQuerySchema,
  bulkSchema,
} from "../controllers/residentController";

const router = Router();

// Public
router.get("/", validate(listQuerySchema, "query"), asyncHandler(listPublic));

// Admin
router.get("/admin", requireAuth, requireEditor, validate(adminListQuerySchema, "query"), asyncHandler(listAdmin));
router.get("/admin/:id", requireAuth, requireEditor, asyncHandler(getAdmin));
router.post("/", requireAuth, requireEditor, validate(upsertSchema), asyncHandler(create));
router.put("/:id", requireAuth, requireEditor, validate(upsertSchema), asyncHandler(update));
router.patch("/:id/verify", requireAuth, requireEditor, asyncHandler(toggleVerified));
router.delete("/:id", requireAuth, requireEditor, asyncHandler(remove));
router.post("/bulk", requireAuth, requireEditor, validate(bulkSchema), asyncHandler(bulkImport));

export default router;
