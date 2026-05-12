import slugify from "slugify";
import { prisma } from "../lib/prisma";

export async function uniqueSlug(
  model: "article" | "event" | "page" | "gallery",
  text: string,
  ignoreId?: string
): Promise<string> {
  const base = slugify(text, { lower: true, strict: true, trim: true }) || "untitled";
  let slug = base;
  let i = 2;

  const delegate = prisma[model] as unknown as {
    findUnique: (args: { where: { slug: string } }) => Promise<{ id: string } | null>;
  };

  while (true) {
    const existing = await delegate.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    slug = `${base}-${i++}`;
    if (i > 100) throw new Error("Could not generate unique slug");
  }
}
