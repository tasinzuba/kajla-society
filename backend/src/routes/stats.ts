import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth, requireStaff } from "../middleware/auth";
import { prisma } from "../lib/prisma";

const router = Router();

router.get(
  "/dashboard",
  requireAuth,
  requireStaff,
  asyncHandler(async (_req, res) => {
    const [
      residents,
      articlesPublished,
      articlesDraft,
      events,
      upcomingEvents,
      notices,
      pendingMembership,
      pendingCarSticker,
      pendingAdoption,
      unreadMessages,
      committeeMembers,
    ] = await Promise.all([
      prisma.resident.count(),
      prisma.article.count({ where: { isPublished: true } }),
      prisma.article.count({ where: { isPublished: false } }),
      prisma.event.count({ where: { isPublished: true } }),
      prisma.event.count({ where: { isPublished: true, startsAt: { gte: new Date() } } }),
      prisma.notice.count({ where: { isPublished: true } }),
      prisma.membershipApplication.count({ where: { status: "PENDING" } }),
      prisma.carStickerApplication.count({ where: { status: "PENDING" } }),
      prisma.adoptionRequest.count({ where: { status: "PENDING" } }),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.committeeMember.count({ where: { isActive: true } }),
    ]);

    // Recent activity — 5 latest items mixed
    const [recentArticles, recentEvents, recentApplications] = await Promise.all([
      prisma.article.findMany({
        take: 3,
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, isPublished: true, createdAt: true, slug: true },
      }),
      prisma.event.findMany({
        take: 3,
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, startsAt: true, createdAt: true, slug: true },
      }),
      prisma.membershipApplication.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, fullName: true, status: true, createdAt: true },
      }),
    ]);

    res.json({
      success: true,
      data: {
        counters: {
          residents,
          articlesPublished,
          articlesDraft,
          events,
          upcomingEvents,
          notices,
          pendingApplications: pendingMembership + pendingCarSticker + pendingAdoption,
          pendingByType: {
            membership: pendingMembership,
            carSticker: pendingCarSticker,
            adoption: pendingAdoption,
          },
          unreadMessages,
          committeeMembers,
        },
        recent: {
          articles: recentArticles,
          events: recentEvents,
          membershipApplications: recentApplications,
        },
      },
    });
  })
);

export default router;
