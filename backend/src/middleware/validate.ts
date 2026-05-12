import type { Request, Response, NextFunction } from "express";
import type { ZodTypeAny, infer as ZodInfer } from "zod";

type Source = "body" | "query" | "params";

export function validate<S extends ZodTypeAny>(schema: S, source: Source = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      next(result.error);
      return;
    }
    // Replace the validated section with parsed data
    (req as unknown as Record<Source, ZodInfer<S>>)[source] = result.data;
    next();
  };
}
