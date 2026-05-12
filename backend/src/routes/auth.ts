import { Router } from "express";
import rateLimit from "express-rate-limit";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../middleware/validate";
import { requireAuth } from "../middleware/auth";
import { login, loginSchema, me } from "../controllers/authController";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many login attempts, try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/login", loginLimiter, validate(loginSchema), asyncHandler(login));
router.get("/me", requireAuth, asyncHandler(me));

export default router;
