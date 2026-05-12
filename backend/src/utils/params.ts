import type { Request } from "express";

/**
 * Express 5 types `req.params[key]` as `string | string[]` because of wildcard routes.
 * For plain `/:id` routes the value is always a string — narrow it here.
 */
export function paramStr(req: Request, key: string): string {
  const v = req.params[key];
  if (typeof v !== "string") {
    throw new Error(`Param "${key}" is missing or not a string`);
  }
  return v;
}
