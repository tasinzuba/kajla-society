import { api } from "./api";
import { getToken } from "./auth";

export type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  quote: string;
  avatar: string | null;
  rating: number;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TestimonialInput = {
  name: string;
  role?: string | null;
  quote: string;
  avatar?: string | null;
  rating?: number;
  order?: number;
  isActive?: boolean;
};

// Public
export function listTestimonialsPublic(): Promise<Testimonial[]> {
  return api<Testimonial[]>("/testimonials");
}

// Admin
export function adminListTestimonials(): Promise<Testimonial[]> {
  return api<Testimonial[]>("/testimonials/admin", { token: getToken() ?? undefined });
}

export function adminGetTestimonial(id: string): Promise<Testimonial> {
  return api<Testimonial>(`/testimonials/admin/${id}`, { token: getToken() ?? undefined });
}

export function createTestimonial(input: TestimonialInput): Promise<Testimonial> {
  return api<Testimonial>("/testimonials", {
    method: "POST",
    body: JSON.stringify(input),
    token: getToken() ?? undefined,
  });
}

export function updateTestimonial(id: string, input: TestimonialInput): Promise<Testimonial> {
  return api<Testimonial>(`/testimonials/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
    token: getToken() ?? undefined,
  });
}

export function deleteTestimonial(id: string): Promise<void> {
  return api<void>(`/testimonials/${id}`, { method: "DELETE", token: getToken() ?? undefined });
}
