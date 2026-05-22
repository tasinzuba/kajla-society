import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { paramStr } from "../utils/params";

// Public — read a single setting by key
export async function getSetting(req: Request, res: Response): Promise<void> {
  const key = paramStr(req, "key");
  const item = await prisma.setting.findUnique({ where: { key } });
  res.json({ success: true, data: item ? item.value : null });
}

// Admin — upsert a setting
export const upsertSettingSchema = z.object({
  value: z.string().max(100000),
});

export async function upsertSetting(req: Request, res: Response): Promise<void> {
  const key = paramStr(req, "key");
  const { value } = req.body as z.infer<typeof upsertSettingSchema>;
  const item = await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  res.json({ success: true, data: item.value });
}
