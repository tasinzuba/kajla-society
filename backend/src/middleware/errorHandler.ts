import type { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { ApiError } from "../utils/ApiError";
import { isProd } from "../config/env";

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details,
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      details: err.flatten(),
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      res.status(409).json({
        success: false,
        message: "Unique constraint violation",
        details: err.meta,
      });
      return;
    }
    if (err.code === "P2025") {
      res.status(404).json({ success: false, message: "Record not found" });
      return;
    }
  }

  console.error("[Unhandled Error]", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(isProd ? {} : { stack: (err as Error)?.stack }),
  });
};
