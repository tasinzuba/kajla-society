"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/lib/useAuth";
import { isStaff } from "@/lib/auth";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (loading) return;
    if (!user && !isLoginPage) {
      router.replace("/admin/login");
    }
    if (user && isLoginPage) {
      router.replace("/admin");
    }
    if (user && !isStaff(user)) {
      router.replace("/");
    }
  }, [loading, user, isLoginPage, router]);

  // Login page: render naked (no sidebar/topbar)
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-cream">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  if (!user || !isStaff(user)) return null;

  return (
    <div className="min-h-screen flex bg-cream">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="absolute left-0 top-0 h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-surface border-b border-border px-4 lg:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            className="lg:hidden p-2 text-primary"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="text-sm text-muted hidden sm:block">
            Welcome back, <span className="text-primary font-semibold">{user.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-primary">{user.name}</div>
              <div className="text-[10px] text-muted uppercase tracking-wider">
                {user.role.replace("_", " ")}
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-secondary text-white grid place-items-center font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={signOut}
              className="text-xs px-3 py-1.5 rounded border border-border hover:bg-cream text-muted hover:text-danger transition"
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
