"use client";

import { api } from "./api";

export type Role = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "MODERATOR" | "MEMBER";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar: string | null;
  phone?: string | null;
};

const TOKEN_KEY = "kajla_token";
const USER_KEY = "kajla_user";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setSession(token: string, user: AuthUser): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function login(
  email: string,
  password: string
): Promise<{ token: string; user: AuthUser }> {
  const data = await api<{ token: string; user: AuthUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setSession(data.token, data.user);
  return data;
}

export async function fetchMe(): Promise<AuthUser> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  return api<AuthUser>("/auth/me", { token });
}

export function logout(): void {
  clearSession();
  if (typeof window !== "undefined") {
    window.location.href = "/admin/login";
  }
}

export function isStaff(user: AuthUser | null): boolean {
  if (!user) return false;
  return ["SUPER_ADMIN", "ADMIN", "EDITOR", "MODERATOR"].includes(user.role);
}
