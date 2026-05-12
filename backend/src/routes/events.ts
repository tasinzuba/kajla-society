import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth, requireEditor } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  listPublic,
  listAdmin,
  getBySlug,
  getAdmin,
  createEvent,
  updateEvent,
  deleteEvent,
  upsertEventSchema,
  listQuerySchema,
} from "../controllers/eventController";

const router = Router();

router.get("/", validate(listQuerySchema, "query"), asyncHandler(listPublic));
router.get("/slug/:slug", asyncHandler(getBySlug));

router.get("/admin", requireAuth, requireEditor, validate(listQuerySchema, "query"), asyncHandler(listAdmin));
router.get("/admin/:id", requireAuth, requireEditor, asyncHandler(getAdmin));
router.post("/", requireAuth, requireEditor, validate(upsertEventSchema), asyncHandler(createEvent));
router.put("/:id", requireAuth, requireEditor, validate(upsertEventSchema), asyncHandler(updateEvent));
router.delete("/:id", requireAuth, requireEditor, asyncHandler(deleteEvent));

export default router;
