import { api } from "./api";
import { getToken } from "./auth";

export type ArticleListItem = {
  id: string;
  slug: string;
  title: string;
  titleBn: string | null;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt?: string;
  isPublished?: boolean;
  viewCount: number;
  category?: { slug: string; name: string } | null;
  author?: { name: string } | null;
};

export type Article = ArticleListItem & {
  content: string;
  contentBn: string | null;
  categoryId?: string | null;
};

export type Paginated<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  nameBn: string | null;
};

// ---- Public ----

export function listArticles(params: {
  page?: number;
  limit?: number;
  category?: string;
  q?: string;
} = {}): Promise<Paginated<ArticleListItem>> {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  if (params.category) q.set("category", params.category);
  if (params.q) q.set("q", params.q);
  const qs = q.toString();
  return api<Paginated<ArticleListItem>>(`/articles${qs ? "?" + qs : ""}`);
}

export function getArticleBySlug(slug: string): Promise<Article> {
  return api<Article>(`/articles/slug/${slug}`);
}

export function listCategories(): Promise<Category[]> {
  return api<Category[]>("/categories");
}

// ---- Admin ----

export function adminListArticles(params: {
  page?: number;
  q?: string;
} = {}): Promise<Paginated<ArticleListItem>> {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.q) q.set("q", params.q);
  const qs = q.toString();
  return api<Paginated<ArticleListItem>>(`/articles/admin${qs ? "?" + qs : ""}`, {
    token: getToken() ?? undefined,
  });
}

export function adminGetArticle(id: string): Promise<Article> {
  return api<Article>(`/articles/admin/${id}`, {
    token: getToken() ?? undefined,
  });
}

export type ArticleInput = {
  title: string;
  titleBn?: string | null;
  excerpt?: string | null;
  content: string;
  contentBn?: string | null;
  coverImage?: string | null;
  categoryId?: string | null;
  isPublished?: boolean;
};

export function createArticle(input: ArticleInput): Promise<Article> {
  return api<Article>("/articles", {
    method: "POST",
    body: JSON.stringify(input),
    token: getToken() ?? undefined,
  });
}

export function updateArticle(id: string, input: ArticleInput): Promise<Article> {
  return api<Article>(`/articles/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
    token: getToken() ?? undefined,
  });
}

export function deleteArticle(id: string): Promise<void> {
  return api<void>(`/articles/${id}`, {
    method: "DELETE",
    token: getToken() ?? undefined,
  });
}
