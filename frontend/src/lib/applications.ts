import { api } from "./api";
import { getToken } from "./auth";
import type { Paginated } from "./articles";

export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

// ============================================================
// Membership
// ============================================================

export type MembershipInput = {
  fullName: string;
  email: string;
  phone: string;
  houseNo: string;
  road?: string | null;
  block?: string | null;
  nidNumber?: string | null;
  occupation?: string | null;
  documents?: string[];
};

export type MembershipApplication = MembershipInput & {
  id: string;
  status: ApplicationStatus;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
};

export function submitMembership(input: MembershipInput) {
  return api<{ id: string; status: ApplicationStatus }>(
    "/applications/membership",
    { method: "POST", body: JSON.stringify(input) }
  );
}

export function listMembershipApplications(params: { page?: number; status?: ApplicationStatus } = {}) {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.status) q.set("status", params.status);
  const qs = q.toString();
  return api<Paginated<MembershipApplication>>(
    `/applications/membership${qs ? "?" + qs : ""}`,
    { token: getToken() ?? undefined }
  );
}

export function getMembershipApplication(id: string) {
  return api<MembershipApplication>(`/applications/membership/${id}`, {
    token: getToken() ?? undefined,
  });
}

export function updateMembershipStatus(
  id: string,
  status: ApplicationStatus,
  adminNote?: string
) {
  return api<MembershipApplication>(`/applications/membership/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, adminNote }),
    token: getToken() ?? undefined,
  });
}

export function deleteMembership(id: string) {
  return api<void>(`/applications/membership/${id}`, {
    method: "DELETE",
    token: getToken() ?? undefined,
  });
}

// ============================================================
// Car Sticker
// ============================================================

export type CarStickerInput = {
  fullName: string;
  email: string;
  phone: string;
  houseNo: string;
  vehicleType: string;
  brandModel: string;
  registrationNo: string;
  color?: string | null;
  documents?: string[];
};

export type CarStickerApplication = CarStickerInput & {
  id: string;
  status: ApplicationStatus;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
};

export function submitCarSticker(input: CarStickerInput) {
  return api<{ id: string; status: ApplicationStatus }>(
    "/applications/car-sticker",
    { method: "POST", body: JSON.stringify(input) }
  );
}

export function listCarStickerApplications(params: { page?: number; status?: ApplicationStatus } = {}) {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.status) q.set("status", params.status);
  const qs = q.toString();
  return api<Paginated<CarStickerApplication>>(
    `/applications/car-sticker${qs ? "?" + qs : ""}`,
    { token: getToken() ?? undefined }
  );
}

export function getCarStickerApplication(id: string) {
  return api<CarStickerApplication>(`/applications/car-sticker/${id}`, {
    token: getToken() ?? undefined,
  });
}

export function updateCarStickerStatus(
  id: string,
  status: ApplicationStatus,
  adminNote?: string
) {
  return api<CarStickerApplication>(`/applications/car-sticker/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, adminNote }),
    token: getToken() ?? undefined,
  });
}

export function deleteCarSticker(id: string) {
  return api<void>(`/applications/car-sticker/${id}`, {
    method: "DELETE",
    token: getToken() ?? undefined,
  });
}

// ============================================================
// Adoption (Road / Gate)
// ============================================================

export type AdoptionTarget = "ROAD" | "GATE";

export type AdoptionInput = {
  target: AdoptionTarget;
  applicantName: string;
  email: string;
  phone: string;
  organization?: string | null;
  locationRef: string;
  message?: string | null;
};

export type AdoptionRequest = AdoptionInput & {
  id: string;
  status: ApplicationStatus;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
};

export function submitAdoption(input: AdoptionInput) {
  return api<{ id: string; status: ApplicationStatus }>(
    "/applications/adoption",
    { method: "POST", body: JSON.stringify(input) }
  );
}

export function listAdoptionRequests(params: {
  page?: number;
  status?: ApplicationStatus;
  target?: AdoptionTarget;
} = {}) {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.status) q.set("status", params.status);
  if (params.target) q.set("target", params.target);
  const qs = q.toString();
  return api<Paginated<AdoptionRequest>>(
    `/applications/adoption${qs ? "?" + qs : ""}`,
    { token: getToken() ?? undefined }
  );
}

export function getAdoptionRequest(id: string) {
  return api<AdoptionRequest>(`/applications/adoption/${id}`, {
    token: getToken() ?? undefined,
  });
}

export function updateAdoptionStatus(
  id: string,
  status: ApplicationStatus,
  adminNote?: string
) {
  return api<AdoptionRequest>(`/applications/adoption/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, adminNote }),
    token: getToken() ?? undefined,
  });
}

export function deleteAdoption(id: string) {
  return api<void>(`/applications/adoption/${id}`, {
    method: "DELETE",
    token: getToken() ?? undefined,
  });
}
