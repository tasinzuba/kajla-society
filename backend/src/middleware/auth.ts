import type { Request, Response, NextFunction } from "express";
import type { Role } from "@prisma/client";
import { ApiError } from "../utils/ApiError";
import { verifyToken } from "../utils/jwt";

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("Missing or invalid Authorization header"));
  }
  const token = header.slice("Bearer ".length).trim();
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(ApiError.unauthorized("Invalid or expired token"));
  }
}

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden(`Requires role: ${roles.join(", ")}`));
    }
    next();
  };
}

export const requireAdmin = requireRole("SUPER_ADMIN", "ADMIN");
export const requireEditor = requireRole("SUPER_ADMIN", "ADMIN", "EDITOR");
export const requireStaff = requireRole("SUPER_ADMIN", "ADMIN", "EDITOR", "MODERATOR");
