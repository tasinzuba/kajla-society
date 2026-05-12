import { api } from "./api";
import { getToken } from "./auth";

export type CommitteeMember = {
  id: string;
  name: string;
  nameBn: string | null;
  role: string;
  roleBn: string | null;
  photo: string | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
  term: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TermGroup = { term: string; members: CommitteeMember[] };

export type CommitteeInput = {
  name: string;
  nameBn?: string | null;
  role: string;
  roleBn?: string | null;
  photo?: string | null;
  bio?: string | null;
  email?: string | null;
  phone?: string | null;
  term: string;
  order?: number;
  isActive?: boolean;
};

export function listCommitteePublic(): Promise<TermGroup[]> {
  return api<TermGroup[]>("/committee");
}

export function adminListCommittee(params: { term?: string; active?: boolean } = {}) {
  const q = new URLSearchParams();
  if (params.term) q.set("term", params.term);
  if (params.active !== undefined) q.set("active", String(params.active));
  const qs = q.toString();
  return api<CommitteeMember[]>(`/committee/admin${qs ? "?" + qs : ""}`, {
    token: getToken() ?? undefined,
  });
}

export function adminGetCommitteeMember(id: string): Promise<CommitteeMember> {
  return api<CommitteeMember>(`/committee/admin/${id}`, { token: getToken() ?? undefined });
}

export function createCommitteeMember(input: CommitteeInput): Promise<CommitteeMember> {
  return api<CommitteeMember>("/committee", {
    method: "POST",
    body: JSON.stringify(input),
    token: getToken() ?? undefined,
  });
}

export function updateCommitteeMember(
  id: string,
  input: CommitteeInput
): Promise<CommitteeMember> {
  return api<CommitteeMember>(`/committee/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
    token: getToken() ?? undefined,
  });
}

export function toggleCommitteeActive(id: string): Promise<CommitteeMember> {
  return api<CommitteeMember>(`/committee/${id}/toggle`, {
    method: "PATCH",
    token: getToken() ?? undefined,
  });
}

export function deleteCommitteeMember(id: string): Promise<void> {
  return api<void>(`/committee/${id}`, { method: "DELETE", token: getToken() ?? undefined });
}
