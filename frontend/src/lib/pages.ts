import { api } from "./api";
import { getToken } from "./auth";

export type PageSummary = {
  id: string;
  slug: string;
  title: string;
  titleBn: string | null;
  isPublished: boolean;
  updatedAt: string;
  author?: { name: string } | null;
};

export type Page = {
  id: string;
  slug: string;
  title: string;
  titleBn: string | null;
  content: string;
  contentBn: string | null;
  metaTitle: string | null;
  metaDesc: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PageInput = {
  slug?: string;
  title: string;
  titleBn?: string | null;
  content: string;
  contentBn?: string | null;
  metaTitle?: string | null;
  metaDesc?: string | null;
  isPublished?: boolean;
};

export function getPublicPage(slug: string): Promise<Page> {
  return api<Page>(`/pages/slug/${slug}`);
}

export function adminListPages(): Promise<PageSummary[]> {
  return api<PageSummary[]>("/pages/admin", { token: getToken() ?? undefined });
}

export function adminGetPage(id: string): Promise<Page> {
  return api<Page>(`/pages/admin/${id}`, { token: getToken() ?? undefined });
}

export function createPage(input: PageInput): Promise<Page> {
  return api<Page>("/pages", {
    method: "POST",
    body: JSON.stringify(input),
    token: getToken() ?? undefined,
  });
}

export function updatePage(id: string, input: PageInput): Promise<Page> {
  return api<Page>(`/pages/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
    token: getToken() ?? undefined,
  });
}

export function deletePage(id: string): Promise<void> {
  return api<void>(`/pages/${id}`, { method: "DELETE", token: getToken() ?? undefined });
}
