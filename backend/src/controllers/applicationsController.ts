import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { paramStr } from "../utils/params";
import { sendMail } from "../lib/mailer";

// ============================================================
// Shared
// ============================================================

const baseListSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
});

export const statusUpdateSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  adminNote: z.string().max(1000).optional().nullable(),
});

async function notifyAdmin(subject: string, html: string): Promise<void> {
  const admins = await prisma.user.findMany({
    where: { role: { in: ["SUPER_ADMIN", "ADMIN"] }, isActive: true },
    select: { email: true },
  });
  await Promise.all(
    admins.map((a) =>
      sendMail({ to: a.email, subject, html }).catch(() => false)
    )
  );
}

async function notifyApplicant(
  email: string,
  type: string,
  status: string,
  note: string | null
): Promise<void> {
  const statusLabel = status.toLowerCase();
  await sendMail({
    to: email,
    subject: `Your ${type} application has been ${statusLabel}`,
    html: `
      <h2>Kajla Society</h2>
      <p>Your <strong>${type}</strong> application has been <strong>${statusLabel}</strong>.</p>
      ${note ? `<p><strong>Note from admin:</strong> ${note}</p>` : ""}
      <p>Thank you for being part of our community.</p>
    `,
  });
}

// ============================================================
// Membership
// ============================================================

export const membershipSchema = z.object({
  fullName: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().min(5).max(30),
  houseNo: z.string().min(1).max(50),
  road: z.string().max(50).optional().nullable(),
  block: z.string().max(50).optional().nullable(),
  nidNumber: z.string().max(50).optional().nullable(),
  occupation: z.string().max(100).optional().nullable(),
  documents: z.array(z.string()).optional(),
});

export async function submitMembership(req: Request, res: Response): Promise<void> {
  const input = req.body as z.infer<typeof membershipSchema>;
  const created = await prisma.membershipApplication.create({
    data: {
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      houseNo: input.houseNo,
      road: input.road ?? null,
      block: input.block ?? null,
      nidNumber: input.nidNumber ?? null,
      occupation: input.occupation ?? null,
      documents: input.documents ?? [],
    },
  });

  notifyAdmin(
    "New membership application",
    `<p>${input.fullName} (${input.email}) has submitted a membership application.</p>`
  ).catch(() => {});

  res.status(201).json({
    success: true,
    data: { id: created.id, status: created.status },
  });
}

export async function listMembership(req: Request, res: Response): Promise<void> {
  const { page, limit, status } = req.query as unknown as z.infer<typeof baseListSchema>;
  const skip = (page - 1) * limit;
  const where = status ? { status } : {};
  const [items, total] = await Promise.all([
    prisma.membershipApplication.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.membershipApplication.count({ where }),
  ]);
  res.json({
    success: true,
    data: { items, page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function getMembership(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const item = await prisma.membershipApplication.findUnique({ where: { id } });
  if (!item) throw ApiError.notFound();
  res.json({ success: true, data: item });
}

export async function updateMembershipStatus(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const { status, adminNote } = req.body as z.infer<typeof statusUpdateSchema>;
  const item = await prisma.membershipApplication.update({
    where: { id },
    data: { status, adminNote: adminNote ?? null },
  });
  if (status !== "PENDING") {
    notifyApplicant(item.email, "membership", status, adminNote ?? null).catch(() => {});
  }
  res.json({ success: true, data: item });
}

export async function deleteMembership(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  await prisma.membershipApplication.delete({ where: { id } });
  res.json({ success: true });
}

// ============================================================
// Car Sticker
// ============================================================

export const carStickerSchema = z.object({
  fullName: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().min(5).max(30),
  houseNo: z.string().min(1).max(50),
  vehicleType: z.string().min(1).max(50),
  brandModel: z.string().min(1).max(100),
  registrationNo: z.string().min(1).max(50),
  color: z.string().max(50).optional().nullable(),
  documents: z.array(z.string()).optional(),
});

export async function submitCarSticker(req: Request, res: Response): Promise<void> {
  const input = req.body as z.infer<typeof carStickerSchema>;
  const created = await prisma.carStickerApplication.create({
    data: {
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      houseNo: input.houseNo,
      vehicleType: input.vehicleType,
      brandModel: input.brandModel,
      registrationNo: input.registrationNo,
      color: input.color ?? null,
      documents: input.documents ?? [],
    },
  });

  notifyAdmin(
    "New car sticker application",
    `<p>${input.fullName} has applied for a car sticker (${input.registrationNo}).</p>`
  ).catch(() => {});

  res.status(201).json({
    success: true,
    data: { id: created.id, status: created.status },
  });
}

export async function listCarSticker(req: Request, res: Response): Promise<void> {
  const { page, limit, status } = req.query as unknown as z.infer<typeof baseListSchema>;
  const skip = (page - 1) * limit;
  const where = status ? { status } : {};
  const [items, total] = await Promise.all([
    prisma.carStickerApplication.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.carStickerApplication.count({ where }),
  ]);
  res.json({
    success: true,
    data: { items, page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function getCarSticker(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const item = await prisma.carStickerApplication.findUnique({ where: { id } });
  if (!item) throw ApiError.notFound();
  res.json({ success: true, data: item });
}

export async function updateCarStickerStatus(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const { status, adminNote } = req.body as z.infer<typeof statusUpdateSchema>;
  const item = await prisma.carStickerApplication.update({
    where: { id },
    data: { status, adminNote: adminNote ?? null },
  });
  if (status !== "PENDING") {
    notifyApplicant(item.email, "car sticker", status, adminNote ?? null).catch(() => {});
  }
  res.json({ success: true, data: item });
}

export async function deleteCarSticker(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  await prisma.carStickerApplication.delete({ where: { id } });
  res.json({ success: true });
}

// ============================================================
// Adoption (Road / Gate)
// ============================================================

export const adoptionSchema = z.object({
  target: z.enum(["ROAD", "GATE"]),
  applicantName: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().min(5).max(30),
  organization: z.string().max(120).optional().nullable(),
  locationRef: z.string().min(1).max(120),
  message: z.string().max(2000).optional().nullable(),
});

const adoptionListSchema = baseListSchema.extend({
  target: z.enum(["ROAD", "GATE"]).optional(),
});

export async function submitAdoption(req: Request, res: Response): Promise<void> {
  const input = req.body as z.infer<typeof adoptionSchema>;
  const created = await prisma.adoptionRequest.create({
    data: {
      target: input.target,
      applicantName: input.applicantName,
      email: input.email,
      phone: input.phone,
      organization: input.organization ?? null,
      locationRef: input.locationRef,
      message: input.message ?? null,
    },
  });

  notifyAdmin(
    `New ${input.target.toLowerCase()} adoption request`,
    `<p>${input.applicantName} wants to adopt ${input.target.toLowerCase()}: ${input.locationRef}.</p>`
  ).catch(() => {});

  res.status(201).json({
    success: true,
    data: { id: created.id, status: created.status },
  });
}

export async function listAdoption(req: Request, res: Response): Promise<void> {
  const { page, limit, status, target } = req.query as unknown as z.infer<typeof adoptionListSchema>;
  const skip = (page - 1) * limit;
  const where = {
    ...(status ? { status } : {}),
    ...(target ? { target } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.adoptionRequest.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.adoptionRequest.count({ where }),
  ]);
  res.json({
    success: true,
    data: { items, page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function getAdoption(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const item = await prisma.adoptionRequest.findUnique({ where: { id } });
  if (!item) throw ApiError.notFound();
  res.json({ success: true, data: item });
}

export async function updateAdoptionStatus(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  const { status, adminNote } = req.body as z.infer<typeof statusUpdateSchema>;
  const item = await prisma.adoptionRequest.update({
    where: { id },
    data: { status, adminNote: adminNote ?? null },
  });
  if (status !== "PENDING") {
    notifyApplicant(
      item.email,
      `${item.target.toLowerCase()} adoption`,
      status,
      adminNote ?? null
    ).catch(() => {});
  }
  res.json({ success: true, data: item });
}

export async function deleteAdoption(req: Request, res: Response): Promise<void> {
  const id = paramStr(req, "id");
  await prisma.adoptionRequest.delete({ where: { id } });
  res.json({ success: true });
}

export { baseListSchema, adoptionListSchema };
