import { api } from "./api";
import { getToken } from "./auth";
import type { Paginated } from "./articles";

export type EventListItem = {
  id: string;
  slug: string;
  title: string;
  titleBn: string | null;
  coverImage: string | null;
  location: string | null;
  startsAt: string;
  endsAt: string | null;
  isPublished?: boolean;
  createdAt: string;
  updatedAt?: string;
  author?: { name: string } | null;
};

export type EventDetail = EventListItem & {
  description: string;
};

export type EventInput = {
  title: string;
  titleBn?: string | null;
  description: string;
  coverImage?: string | null;
  location?: string | null;
  startsAt: string;
  endsAt?: string | null;
  isPublished?: boolean;
};

export type EventScope = "all" | "upcoming" | "past";

// ---- Public ----

export function listEvents(params: {
  page?: number;
  limit?: number;
  scope?: EventScope;
  q?: string;
} = {}): Promise<Paginated<EventListItem>> {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  if (params.scope) q.set("scope", params.scope);
  if (params.q) q.set("q", params.q);
  const qs = q.toString();
  return api<Paginated<EventListItem>>(`/events${qs ? "?" + qs : ""}`);
}

export function getEventBySlug(slug: string): Promise<EventDetail> {
  return api<EventDetail>(`/events/slug/${slug}`);
}

// ---- Admin ----

export function adminListEvents(params: {
  page?: number;
  q?: string;
} = {}): Promise<Paginated<EventListItem>> {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.q) q.set("q", params.q);
  const qs = q.toString();
  return api<Paginated<EventListItem>>(`/events/admin${qs ? "?" + qs : ""}`, {
    token: getToken() ?? undefined,
  });
}

export function adminGetEvent(id: string): Promise<EventDetail> {
  return api<EventDetail>(`/events/admin/${id}`, { token: getToken() ?? undefined });
}

export function createEvent(input: EventInput): Promise<EventDetail> {
  return api<EventDetail>("/events", {
    method: "POST",
    body: JSON.stringify(input),
    token: getToken() ?? undefined,
  });
}

export function updateEvent(id: string, input: EventInput): Promise<EventDetail> {
  return api<EventDetail>(`/events/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
    token: getToken() ?? undefined,
  });
}

export function deleteEvent(id: string): Promise<void> {
  return api<void>(`/events/${id}`, {
    method: "DELETE",
    token: getToken() ?? undefined,
  });
}
