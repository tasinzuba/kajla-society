import { Router } from "express";
import rateLimit from "express-rate-limit";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth, requireStaff } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  submit,
  list,
  get,
  markRead,
  remove,
  contactSchema,
  listQuerySchema,
} from "../controllers/contactController";

const router = Router();

const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many submissions — please try again later" },
});

router.post("/", submitLimiter, validate(contactSchema), asyncHandler(submit));

router.get("/", requireAuth, requireStaff, validate(listQuerySchema, "query"), asyncHandler(list));
router.get("/:id", requireAuth, requireStaff, asyncHandler(get));
router.patch("/:id/read", requireAuth, requireStaff, asyncHandler(markRead));
router.delete("/:id", requireAuth, requireStaff, asyncHandler(remove));

export default router;
