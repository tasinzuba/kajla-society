import { api } from "./api";
import { getToken } from "./auth";

export type ContactInput = {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
};

export type ContactMessage = ContactInput & {
  id: string;
  isRead: boolean;
  createdAt: string;
};

export type ContactList = {
  items: ContactMessage[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  unreadCount: number;
};

export function submitContact(input: ContactInput) {
  return api<{ id: string }>("/contact", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function listMessages(params: { page?: number; unread?: boolean } = {}) {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.unread) q.set("unread", "true");
  const qs = q.toString();
  return api<ContactList>(`/contact${qs ? "?" + qs : ""}`, {
    token: getToken() ?? undefined,
  });
}

export function getMessage(id: string) {
  return api<ContactMessage>(`/contact/${id}`, { token: getToken() ?? undefined });
}

export function markRead(id: string) {
  return api<ContactMessage>(`/contact/${id}/read`, {
    method: "PATCH",
    token: getToken() ?? undefined,
  });
}

export function deleteMessage(id: string) {
  return api<void>(`/contact/${id}`, { method: "DELETE", token: getToken() ?? undefined });
}
