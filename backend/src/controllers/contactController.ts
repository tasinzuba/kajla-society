import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { paramStr } from "../utils/params";
import { sendMail } from "../lib/mailer";

export const contactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().max(30).optional().nullable(),
  subject: z.string().max(200).optional().nullable(),
  message: z.string().min(1).max(5000),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  unread: z.coerce.boolean().optional(),
});

export async function submit(req: Request, res: Response): Promise<void> {
  const input = req.body as z.infer<typeof contactSchema>;
  const msg = await prisma.contactMessage.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      subject: input.subject ?? null,
      message: input.message,
    },
  });

  // Notify admin (no-op if SMTP not configured)
  prisma.user
    .findMany({
      where: { role: { in: ["SUPER_ADMIN", "ADMIN"] }, isActive: true },
      select: { email: true },
    })
    .then((admins) =>
      Promise.all(
        admins.map((a) =>
          sendMail({
            to: a.email,
            subject: `New contact message: ${input.subject ?? "(no subject)"}`,
            html: `
              <h3>New message from ${input.name}</h3>
              <p><strong>Email:</strong> ${input.email}</p>
              ${input.phone ? `<p><strong>Phone:</strong> ${input.phone}</p>` : ""}
              ${input.subject ? `<p><strong>Subject:</strong> ${input.subject}</p>` : ""}
              <p><strong>Message:</strong></p>
              <p style="white-space:pre-wrap;">${input.message}</p>
            `,
          })
        )
      )
    )
    .catch(() => {});

  res.status(201).json({ success: true, data: { id: msg.id } });
}

export async function list(req: Request, res: Response): Promise<void> {
  const { page, limit, unread } = req.query as unknown as z.infer<typeof listQuerySchema>;
  const skip = (page - 1) * limit;
  const where = unread ? { isRead: false } : {};

  const [items, total, unreadCount] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ isRead: "asc" }, { createdAt: "desc" }],
    }),
    prisma.contactMessage.count({ where }),
    prisma.contactMessage.count({ where: { isRead: false } }),
  ]);

  res.json({
    success: true,
    data: {
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      unreadCount,
    },
  });
}

export async function get(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const msg = await prisma.contactMessage.findUnique({ where: { id } });
  if (!msg) throw ApiError.notFound();
  // Auto-mark read on fetch
  if (!msg.isRead) {
    await prisma.contactMessage.update({ where: { id }, data: { isRead: true } });
    msg.isRead = true;
  }
  res.json({ success: true, data: msg });
}

export async function markRead(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const msg = await prisma.contactMessage.update({
    where: { id },
    data: { isRead: true },
  });
  res.json({ success: true, data: msg });
}

export async function remove(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  await prisma.contactMessage.delete({ where: { id } });
  res.json({ success: true });
}
