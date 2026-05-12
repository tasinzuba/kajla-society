import { api } from "./api";
import { getToken } from "./auth";

export type DashboardStats = {
  counters: {
    residents: number;
    articlesPublished: number;
    articlesDraft: number;
    events: number;
    upcomingEvents: number;
    notices: number;
    pendingApplications: number;
    pendingByType: {
      membership: number;
      carSticker: number;
      adoption: number;
    };
    unreadMessages: number;
    committeeMembers: number;
  };
  recent: {
    articles: Array<{
      id: string;
      title: string;
      slug: string;
      isPublished: boolean;
      createdAt: string;
    }>;
    events: Array<{
      id: string;
      title: string;
      slug: string;
      startsAt: string;
      createdAt: string;
    }>;
    membershipApplications: Array<{
      id: string;
      fullName: string;
      status: "PENDING" | "APPROVED" | "REJECTED";
      createdAt: string;
    }>;
  };
};

export function getDashboardStats(): Promise<DashboardStats> {
  return api<DashboardStats>("/stats/dashboard", { token: getToken() ?? undefined });
}
