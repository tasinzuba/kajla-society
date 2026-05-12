"use client";

import { useCallback, useEffect, useState } from "react";
import { type AuthUser, fetchMe, getUser, clearSession } from "./auth";

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => void;
};

export function useAuth(): AuthState {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const cached = getUser();
      if (cached) setUser(cached);
      const fresh = await fetchMe();
      setUser(fresh);
    } catch {
      clearSession();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { user, loading, refresh, signOut };
}
