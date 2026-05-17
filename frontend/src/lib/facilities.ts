import { api } from "./api";
import { getToken } from "./auth";

export type FacilityCategory =
  | "RELIGIOUS"
  | "EDUCATIONAL"
  | "HEALTH_EMERGENCY"
  | "CONSTRUCTION"
  | "LOCAL_SERVICES"
  | "GOVERNMENT"
  | "COMMUNITY_ORG";

export type Facility = {
  id: string;
  category: FacilityCategory;
  name: string;
  nameBn: string | null;
  description: string | null;
  address: string | null;
  phone: string | null;
  donationPhone: string | null;
  email: string | null;
  website: string | null;
  image: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type FacilityInput = {
  category: FacilityCategory;
  name: string;
  nameBn?: string | null;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  donationPhone?: string | null;
  email?: string | null;
  website?: string | null;
  image?: string | null;
  order?: number;
  isActive?: boolean;
};

export const CATEGORY_META: Record<
  FacilityCategory,
  { label: string; labelBn: string; icon: string; href: string }
> = {
  RELIGIOUS: { label: "Religious Places", labelBn: "ধর্মীয় স্থান", icon: "🕌", href: "religious" },
  EDUCATIONAL: { label: "Educational Institutions", labelBn: "শিক্ষাপ্রতিষ্ঠান", icon: "🎓", href: "educational" },
  HEALTH_EMERGENCY: { label: "Health & Emergency", labelBn: "স্বাস্থ্য ও জরুরি", icon: "🏥", href: "health" },
  CONSTRUCTION: { label: "Construction Services", labelBn: "নির্মাণ সেবা", icon: "🏗", href: "construction" },
  LOCAL_SERVICES: { label: "Local Services", labelBn: "স্থানীয় সেবা", icon: "🛒", href: "local" },
  GOVERNMENT: { label: "Government Facilities", labelBn: "সরকারি সুবিধা", icon: "🏛", href: "government" },
  COMMUNITY_ORG: { label: "Community Organizations", labelBn: "সম্প্রদায় সংগঠন", icon: "🤝", href: "community" },
};

export const ALL_CATEGORIES = Object.keys(CATEGORY_META) as FacilityCategory[];

// ---- Public ----

export function listFacilitiesPublic(): Promise<Record<FacilityCategory, Facility[]>> {
  return api<Record<FacilityCategory, Facility[]>>("/facilities");
}

// ---- Admin ----

export function adminListFacilities(category?: FacilityCategory): Promise<Facility[]> {
  const qs = category ? `?category=${category}` : "";
  return api<Facility[]>(`/facilities/admin${qs}`, { token: getToken() ?? undefined });
}

export function adminGetFacility(id: string): Promise<Facility> {
  return api<Facility>(`/facilities/admin/${id}`, { token: getToken() ?? undefined });
}

export function createFacility(input: FacilityInput): Promise<Facility> {
  return api<Facility>("/facilities", {
    method: "POST",
    body: JSON.stringify(input),
    token: getToken() ?? undefined,
  });
}

export function updateFacility(id: string, input: FacilityInput): Promise<Facility> {
  return api<Facility>(`/facilities/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
    token: getToken() ?? undefined,
  });
}

export function toggleFacilityActive(id: string): Promise<Facility> {
  return api<Facility>(`/facilities/${id}/toggle`, {
    method: "PATCH",
    token: getToken() ?? undefined,
  });
}

export function deleteFacility(id: string): Promise<void> {
  return api<void>(`/facilities/${id}`, {
    method: "DELETE",
    token: getToken() ?? undefined,
  });
}
