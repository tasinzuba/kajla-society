import type { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { signToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as z.infer<typeof loginSchema>;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw ApiError.unauthorized("Invalid credentials");

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const token = signToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    },
  });
}

export async function me(req: Request, res: Response): Promise<void> {
  if (!req.user) throw ApiError.unauthorized();

  const user = await prisma.user.findUnique({
    where: { id: req.user.sub },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
      phone: true,
      lastLoginAt: true,
    },
  });
  if (!user) throw ApiError.unauthorized();

  res.json({ success: true, data: user });
}
