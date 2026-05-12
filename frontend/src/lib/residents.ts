import { api } from "./api";
import { getToken } from "./auth";
import type { Paginated } from "./articles";

export type PublicResident = {
  id: string;
  fullName: string;
  fullNameBn: string | null;
  houseNo: string;
  road: string | null;
  block: string | null;
  membershipNo: string | null;
  photo: string | null;
};

export type Resident = PublicResident & {
  phone: string | null;
  email: string | null;
  isVerified: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ResidentInput = {
  fullName: string;
  fullNameBn?: string | null;
  houseNo: string;
  road?: string | null;
  block?: string | null;
  phone?: string | null;
  email?: string | null;
  membershipNo?: string | null;
  photo?: string | null;
  isVerified?: boolean;
  isPublic?: boolean;
};

// ---- Public ----

export function listResidentsPublic(params: {
  page?: number;
  limit?: number;
  q?: string;
  block?: string;
  road?: string;
} = {}): Promise<Paginated<PublicResident>> {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  if (params.q) q.set("q", params.q);
  if (params.block) q.set("block", params.block);
  if (params.road) q.set("road", params.road);
  const qs = q.toString();
  return api<Paginated<PublicResident>>(`/residents${qs ? "?" + qs : ""}`);
}

// ---- Admin ----

export function adminListResidents(params: {
  page?: number;
  limit?: number;
  q?: string;
  block?: string;
  road?: string;
  verified?: boolean;
  visibility?: "public" | "private" | "all";
} = {}): Promise<Paginated<Resident>> {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  if (params.q) q.set("q", params.q);
  if (params.block) q.set("block", params.block);
  if (params.road) q.set("road", params.road);
  if (params.verified !== undefined) q.set("verified", String(params.verified));
  if (params.visibility) q.set("visibility", params.visibility);
  const qs = q.toString();
  return api<Paginated<Resident>>(`/residents/admin${qs ? "?" + qs : ""}`, {
    token: getToken() ?? undefined,
  });
}

export function adminGetResident(id: string): Promise<Resident> {
  return api<Resident>(`/residents/admin/${id}`, { token: getToken() ?? undefined });
}

export function createResident(input: ResidentInput): Promise<Resident> {
  return api<Resident>("/residents", {
    method: "POST",
    body: JSON.stringify(input),
    token: getToken() ?? undefined,
  });
}

export function updateResident(id: string, input: ResidentInput): Promise<Resident> {
  return api<Resident>(`/residents/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
    token: getToken() ?? undefined,
  });
}

export function toggleResidentVerified(id: string): Promise<Resident> {
  return api<Resident>(`/residents/${id}/verify`, {
    method: "PATCH",
    token: getToken() ?? undefined,
  });
}

export function deleteResident(id: string): Promise<void> {
  return api<void>(`/residents/${id}`, { method: "DELETE", token: getToken() ?? undefined });
}

export function bulkImportResidents(
  items: ResidentInput[]
): Promise<{ created: number; failed: number; total: number; errors: Array<{ index: number; error: string }> }> {
  return api("/residents/bulk", {
    method: "POST",
    body: JSON.stringify({ items }),
    token: getToken() ?? undefined,
  });
}
