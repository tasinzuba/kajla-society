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
  toggleActive,
  remove,
  upsertSchema,
  listQuerySchema,
} from "../controllers/committeeController";

const router = Router();

router.get("/", asyncHandler(listPublic));

router.get("/admin", requireAuth, requireEditor, validate(listQuerySchema, "query"), asyncHandler(listAdmin));
router.get("/admin/:id", requireAuth, requireEditor, asyncHandler(getAdmin));
router.post("/", requireAuth, requireEditor, validate(upsertSchema), asyncHandler(create));
router.put("/:id", requireAuth, requireEditor, validate(upsertSchema), asyncHandler(update));
router.patch("/:id/toggle", requireAuth, requireEditor, asyncHandler(toggleActive));
router.delete("/:id", requireAuth, requireEditor, asyncHandler(remove));

export default router;
