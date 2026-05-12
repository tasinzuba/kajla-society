import { api } from "./api";
import { getToken } from "./auth";

export type MediaType = "PHOTO" | "VIDEO";

export type MediaItem = {
  id: string;
  url: string;
  thumbnail: string | null;
  caption: string | null;
  type: MediaType;
  order: number;
  createdAt: string;
};

export type GallerySummary = {
  id: string;
  slug: string;
  title: string;
  titleBn?: string | null;
  description?: string | null;
  coverImage: string | null;
  type: MediaType;
  createdAt: string;
  updatedAt?: string;
  _count: { media: number };
};

export type GalleryDetail = Omit<GallerySummary, "_count"> & {
  media: MediaItem[];
};

export type GalleryInput = {
  title: string;
  titleBn?: string | null;
  description?: string | null;
  coverImage?: string | null;
  type: MediaType;
};

// ---- Public ----

export function listGalleriesPublic(type?: MediaType): Promise<GallerySummary[]> {
  const qs = type ? `?type=${type}` : "";
  return api<GallerySummary[]>(`/galleries${qs}`);
}

export function getGalleryBySlug(slug: string): Promise<GalleryDetail> {
  return api<GalleryDetail>(`/galleries/slug/${slug}`);
}

// ---- Admin ----

export function adminListGalleries(): Promise<GallerySummary[]> {
  return api<GallerySummary[]>("/galleries/admin", { token: getToken() ?? undefined });
}

export function adminGetGallery(id: string): Promise<GalleryDetail> {
  return api<GalleryDetail>(`/galleries/admin/${id}`, { token: getToken() ?? undefined });
}

export function createGallery(input: GalleryInput): Promise<GalleryDetail> {
  return api<GalleryDetail>("/galleries", {
    method: "POST",
    body: JSON.stringify(input),
    token: getToken() ?? undefined,
  });
}

export function updateGallery(id: string, input: GalleryInput): Promise<GalleryDetail> {
  return api<GalleryDetail>(`/galleries/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
    token: getToken() ?? undefined,
  });
}

export function deleteGallery(id: string): Promise<void> {
  return api<void>(`/galleries/${id}`, { method: "DELETE", token: getToken() ?? undefined });
}

export function addMediaItem(
  galleryId: string,
  input: { url: string; caption?: string | null }
): Promise<MediaItem> {
  return api<MediaItem>(`/galleries/${galleryId}/media`, {
    method: "POST",
    body: JSON.stringify(input),
    token: getToken() ?? undefined,
  });
}

export function removeMediaItem(galleryId: string, mediaId: string): Promise<void> {
  return api<void>(`/galleries/${galleryId}/media/${mediaId}`, {
    method: "DELETE",
    token: getToken() ?? undefined,
  });
}
