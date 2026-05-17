"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineArrowTopRightOnSquare,
  HiChevronRight,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/lib/useAuth";
import { isStaff } from "@/lib/auth";

const SEGMENT_LABELS: Record<string, string> = {
  admin: "Admin",
  pages: "Pages",
  articles: "Articles",
  events: "Events",
  notices: "Notices",
  gallery: "Gallery",
  committee: "Committee",
  residents: "Residents",
  users: "Users",
  applications: "Applications",
  membership: "Membership",
  messages: "Messages",
  "hero-slides": "Hero Slider",
  facilities: "Facilities",
  settings: "Settings",
  new: "New",
  edit: "Edit",
};

function buildCrumbs(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return [];
  const crumbs: { label: string; href: string }[] = [];
  let acc = "";
  for (const p of parts) {
    acc += "/" + p;
    const label =
      SEGMENT_LABELS[p] ??
      (p.length > 12 ? p.slice(0, 8) + "…" : p);
    crumbs.push({ label, href: acc });
  }
  return crumbs;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";
  const crumbs = useMemo(() => buildCrumbs(pathname), [pathname]);

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

  // Close user menu on path change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#fafaf7]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-[3px] border-amber-200 border-t-amber-500 animate-spin" />
          <div className="text-muted text-[13px]">Loading workspace</div>
        </div>
      </div>
    );
  }

  if (!user || !isStaff(user)) return null;

  return (
    <div className="min-h-screen flex bg-[#fafaf7]">
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
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
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
        <header className="bg-white border-b border-border h-14 px-4 lg:px-6 flex items-center gap-4 sticky top-0 z-30">
          <button
            className="lg:hidden p-1.5 -ml-1.5 text-primary-dark rounded hover:bg-amber-50"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            {mobileOpen ? <HiOutlineXMark size={20} /> : <HiOutlineBars3 size={20} />}
          </button>

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-[13px] min-w-0 flex-1">
            {crumbs.map((c, i) => {
              const isLast = i === crumbs.length - 1;
              return (
                <span key={c.href} className="inline-flex items-center gap-1.5 min-w-0">
                  {i > 0 && <HiChevronRight className="text-muted/40 flex-shrink-0" />}
                  {isLast ? (
                    <span className="font-semibold text-primary-dark truncate">
                      {c.label}
                    </span>
                  ) : (
                    <Link
                      href={c.href}
                      className="text-muted hover:text-primary-dark truncate"
                    >
                      {c.label}
                    </Link>
                  )}
                </span>
              );
            })}
          </nav>

          {/* Search (visual only for now) */}
          <div className="hidden md:flex items-center gap-2 px-3 h-8 bg-[#fafaf7] border border-border rounded text-[12px] text-muted/70 cursor-default w-64">
            <HiOutlineMagnifyingGlass className="text-[14px]" />
            <span className="truncate">Search…</span>
            <span className="ml-auto font-mono text-[10px] px-1.5 py-0.5 rounded bg-white border border-border text-muted/60">
              ⌘K
            </span>
          </div>

          {/* View site */}
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-medium text-muted hover:text-primary-dark hover:bg-[#fafaf7] rounded transition"
            title="Open public site"
          >
            <HiOutlineArrowTopRightOnSquare className="text-[14px]" />
            View site
          </Link>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 pl-2 pr-2 py-1 rounded hover:bg-[#fafaf7] transition"
            >
              <div className="w-7 h-7 rounded bg-primary-dark text-amber-400 grid place-items-center font-bold text-[12px]">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-[13px] font-semibold text-primary-dark hidden sm:inline">
                {user.name.split(" ")[0]}
              </span>
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-border rounded-md shadow-lg z-40 py-1">
                  <div className="px-3 py-2 border-b border-border">
                    <div className="text-[13px] font-bold text-primary-dark truncate">
                      {user.name}
                    </div>
                    <div className="text-[11px] text-muted truncate font-mono">
                      {user.email}
                    </div>
                    <div className="text-[10px] mt-1 uppercase tracking-wider text-amber-700 font-bold">
                      {user.role.replace("_", " ")}
                    </div>
                  </div>
                  <Link
                    href="/admin/settings"
                    className="block px-3 py-1.5 text-[13px] text-primary-dark hover:bg-[#fafaf7]"
                  >
                    Settings
                  </Link>
                  <Link
                    href="/"
                    target="_blank"
                    className="block px-3 py-1.5 text-[13px] text-primary-dark hover:bg-[#fafaf7]"
                  >
                    View public site ↗
                  </Link>
                  <div className="my-1 border-t border-border" />
                  <button
                    onClick={signOut}
                    className="block w-full text-left px-3 py-1.5 text-[13px] text-red-600 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
