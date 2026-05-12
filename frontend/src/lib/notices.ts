import { api } from "./api";
import { getToken } from "./auth";
import type { Paginated } from "./articles";

export type NoticeListItem = {
  id: string;
  title: string;
  titleBn: string | null;
  content?: string;
  attachment: string | null;
  isPinned: boolean;
  isPublished?: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt?: string;
  author?: { name: string } | null;
};

export type NoticeDetail = NoticeListItem & {
  content: string;
};

export type NoticeInput = {
  title: string;
  titleBn?: string | null;
  content: string;
  attachment?: string | null;
  isPinned?: boolean;
  isPublished?: boolean;
};

// ---- Public ----

export function listNotices(params: { page?: number; q?: string } = {}): Promise<
  Paginated<NoticeListItem>
> {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.q) q.set("q", params.q);
  const qs = q.toString();
  return api<Paginated<NoticeListItem>>(`/notices${qs ? "?" + qs : ""}`);
}

export function getNotice(id: string): Promise<NoticeDetail> {
  return api<NoticeDetail>(`/notices/${id}`);
}

// ---- Admin ----

export function adminListNotices(params: { page?: number; q?: string } = {}): Promise<
  Paginated<NoticeListItem>
> {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.q) q.set("q", params.q);
  const qs = q.toString();
  return api<Paginated<NoticeListItem>>(`/notices/admin/list${qs ? "?" + qs : ""}`, {
    token: getToken() ?? undefined,
  });
}

export function adminGetNotice(id: string): Promise<NoticeDetail> {
  return api<NoticeDetail>(`/notices/admin/${id}`, { token: getToken() ?? undefined });
}

export function createNotice(input: NoticeInput): Promise<NoticeDetail> {
  return api<NoticeDetail>("/notices", {
    method: "POST",
    body: JSON.stringify(input),
    token: getToken() ?? undefined,
  });
}

export function updateNotice(id: string, input: NoticeInput): Promise<NoticeDetail> {
  return api<NoticeDetail>(`/notices/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
    token: getToken() ?? undefined,
  });
}

export function togglePin(id: string): Promise<NoticeDetail> {
  return api<NoticeDetail>(`/notices/${id}/pin`, {
    method: "PATCH",
    token: getToken() ?? undefined,
  });
}

export function deleteNotice(id: string): Promise<void> {
  return api<void>(`/notices/${id}`, {
    method: "DELETE",
    token: getToken() ?? undefined,
  });
}
