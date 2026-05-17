import { api } from "./api";
import { getToken } from "./auth";

export type HeroSlide = {
  id: string;
  image: string;
  title: string | null;
  titleBn: string | null;
  subtitle: string | null;
  subtitleBn: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type HeroSlideInput = {
  image: string;
  title?: string | null;
  titleBn?: string | null;
  subtitle?: string | null;
  subtitleBn?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  order?: number;
  isActive?: boolean;
};

// ---- Public ----

export function listHeroSlides(): Promise<HeroSlide[]> {
  return api<HeroSlide[]>("/hero-slides");
}

// ---- Admin ----

export function adminListHeroSlides(): Promise<HeroSlide[]> {
  return api<HeroSlide[]>("/hero-slides/admin", { token: getToken() ?? undefined });
}

export function adminGetHeroSlide(id: string): Promise<HeroSlide> {
  return api<HeroSlide>(`/hero-slides/admin/${id}`, { token: getToken() ?? undefined });
}

export function createHeroSlide(input: HeroSlideInput): Promise<HeroSlide> {
  return api<HeroSlide>("/hero-slides", {
    method: "POST",
    body: JSON.stringify(input),
    token: getToken() ?? undefined,
  });
}

export function updateHeroSlide(id: string, input: HeroSlideInput): Promise<HeroSlide> {
  return api<HeroSlide>(`/hero-slides/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
    token: getToken() ?? undefined,
  });
}

export function toggleHeroSlideActive(id: string): Promise<HeroSlide> {
  return api<HeroSlide>(`/hero-slides/${id}/toggle`, {
    method: "PATCH",
    token: getToken() ?? undefined,
  });
}

export function deleteHeroSlide(id: string): Promise<void> {
  return api<void>(`/hero-slides/${id}`, {
    method: "DELETE",
    token: getToken() ?? undefined,
  });
}
