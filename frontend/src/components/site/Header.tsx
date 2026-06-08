"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  HiOutlineBars3,
  HiOutlineXMark,
  HiChevronDown,
  HiArrowRight,
  HiOutlinePhone,
  HiOutlineMapPin,
} from "react-icons/hi2";
import { mainNav, type NavItem } from "@/lib/nav";

const SISTER_SITES = [
  {
    label: process.env.NEXT_PUBLIC_SITE_2_LABEL ?? "Site 2",
    url: process.env.NEXT_PUBLIC_SITE_2_URL ?? "http://localhost:3004",
    hint: "Forest Green theme",
  },
  {
    label: process.env.NEXT_PUBLIC_SITE_3_LABEL ?? "Site 3",
    url: process.env.NEXT_PUBLIC_SITE_3_URL ?? "http://localhost:3003",
    hint: "Burgundy + Rose Gold theme",
  },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* ============================================================
         TOP BAR — Navy with seal logo + big title + CTA
      ============================================================ */}
      <div className="bg-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo + Name */}
          <Link
            href="/"
            className="flex items-center gap-4 group flex-shrink-0 min-w-0"
          >
            {/* Circular seal-style logo */}
            <div className="relative w-14 h-14 lg:w-[68px] lg:h-[68px] rounded-full bg-gradient-to-br from-white to-accent grid place-items-center shadow-lg ring-2 ring-white/20 flex-shrink-0">
              <div className="absolute inset-1 rounded-full border-[1.5px] border-primary-dark/40" />
              <div className="relative text-primary-dark font-extrabold text-lg lg:text-xl tracking-tight leading-none">
                KS
              </div>
              <div className="absolute bottom-1 text-[7px] text-primary-dark/70 font-bold">
                1980
              </div>
            </div>

            <div className="min-w-0">
              <div className="text-lg sm:text-2xl lg:text-[34px] font-extrabold tracking-wide uppercase leading-none whitespace-nowrap">
                Kajla Society
              </div>
              <div className="hidden sm:block text-[11px] lg:text-xs text-emerald-light/90 mt-1.5 tracking-wider uppercase">
                A Connected Community · Est. 1980
              </div>
            </div>
          </Link>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <SiteSwitcher />
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center gap-2 px-5 lg:px-6 py-3 bg-amber-400 hover:bg-amber-300 text-primary-dark font-bold rounded-md shadow-lg transition-all hover:-translate-y-0.5 text-sm uppercase tracking-wide"
            >
              <HiOutlinePhone className="text-base" />
              <span>Contact Us</span>
            </Link>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="xl:hidden p-2 text-white rounded-md hover:bg-white/10 transition"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <HiOutlineXMark size={28} /> : <HiOutlineBars3 size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================
         NAV BAR — Amber gold strip with navy bold links
      ============================================================ */}
      <div className="bg-amber-400 hidden xl:block">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center justify-center gap-0 flex-nowrap">
            {mainNav.map((item) => (
              <EmeraldNavItem
                key={item.href + item.label}
                item={item}
                pathname={pathname}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="xl:hidden bg-amber-400 shadow-lg max-h-[calc(100vh-7rem)] overflow-y-auto">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col">
            {mainNav.map((item) => (
              <MobileNavItem
                key={item.href + item.label}
                item={item}
                pathname={pathname}
                onClose={() => setMobileOpen(false)}
              />
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-5 mb-2 inline-flex justify-center items-center gap-2 px-4 py-3 bg-primary-dark hover:bg-primary text-white font-bold rounded-md shadow-md uppercase tracking-wide"
            >
              Contact Us
              <HiArrowRight />
            </Link>

            <div className="mt-3 pt-4 border-t border-amber-500/40">
              <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-widest text-primary-dark/70">
                Switch Area
              </div>
              {SISTER_SITES.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-3 text-sm font-extrabold uppercase tracking-wider text-black border-b border-amber-500/30 last:border-0"
                >
                  <span className="inline-flex items-center gap-2">
                    <HiOutlineMapPin className="text-base" />
                    {s.label}
                  </span>
                  <div className="text-[11px] font-normal normal-case tracking-normal text-primary-dark/70 mt-0.5">
                    {s.hint}
                  </div>
                </a>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

// ============================================================
// Site switcher — dropdown linking to sister sites
// ============================================================
function SiteSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative hidden md:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-md text-sm uppercase tracking-wide transition"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <HiOutlineMapPin className="text-base" />
        <span>Switch Area</span>
        <HiChevronDown
          className={`text-xs transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute top-full right-0 pt-2 z-50"
          style={{ minWidth: "260px" }}
        >
          <div className="bg-white border-t-4 border-amber-400 rounded-b-md shadow-2xl overflow-hidden py-2 animate-fade-up">
            {SISTER_SITES.map((s) => (
              <a
                key={s.url}
                href={s.url}
                className="block px-5 py-3 border-l-4 border-transparent hover:bg-amber-50 hover:border-amber-400 transition-colors"
              >
                <div className="text-sm font-bold uppercase tracking-wider text-primary-dark">
                  {s.label}
                </div>
                <div className="text-xs text-muted mt-0.5 leading-snug normal-case tracking-normal font-normal">
                  {s.hint}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Emerald strip nav item with dropdown
// ============================================================
function EmeraldNavItem({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasChildren = (item.children?.length ?? 0) > 0;

  const active =
    pathname === item.href ||
    (item.href !== "/" && pathname.startsWith(item.href)) ||
    item.children?.some(
      (c) => pathname === c.href || pathname.startsWith(c.href.split("#")[0])
    );

  function handleEnter() {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    if (hasChildren) setOpen(true);
  }

  function handleLeave() {
    if (!hasChildren) return;
    closeTimeoutRef.current = setTimeout(() => setOpen(false), 120);
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <Link
        href={item.href}
        className={`relative inline-flex items-center gap-1.5 px-3 lg:px-4 py-4 text-[14px] font-semibold uppercase tracking-wide transition-colors whitespace-nowrap ${
          active
            ? "bg-[#FEAC00] text-black"
            : "text-black hover:bg-amber-500/40"
        }`}
        aria-haspopup={hasChildren || undefined}
        aria-expanded={hasChildren ? open : undefined}
      >
        {item.label}
        {hasChildren && (
          <HiChevronDown
            className={`text-xs transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        )}
      </Link>

      {hasChildren && open && (
        <div
          className="absolute top-full left-0 pt-1 z-10"
          style={{ minWidth: "280px" }}
        >
          <div className="bg-white border-t-4 border-amber-400 rounded-b-md shadow-2xl overflow-hidden py-2 animate-fade-up">
            {item.children!.map((child) => {
              const childActive =
                pathname === child.href ||
                (child.href !== "/" &&
                  child.href.indexOf("#") === -1 &&
                  pathname.startsWith(child.href));
              return (
                <Link
                  key={child.href + child.label}
                  href={child.href}
                  className={`block px-5 py-3 transition-colors border-l-4 ${
                    childActive
                      ? "bg-amber-50 border-amber-400 text-primary-dark"
                      : "border-transparent text-foreground hover:bg-amber-50 hover:border-amber-400 hover:text-primary-dark"
                  }`}
                >
                  <div className="text-sm font-bold uppercase tracking-wider">
                    {child.label}
                  </div>
                  {child.description && (
                    <div className="text-xs text-muted mt-0.5 leading-snug normal-case tracking-normal font-normal">
                      {child.description}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Mobile nav item with accordion
// ============================================================
function MobileNavItem({
  item,
  pathname,
  onClose,
}: {
  item: NavItem;
  pathname: string;
  onClose: () => void;
}) {
  const hasChildren = (item.children?.length ?? 0) > 0;
  const active = pathname === item.href;
  const childActive = item.children?.some(
    (c) => pathname === c.href || pathname.startsWith(c.href.split("#")[0])
  );
  const [open, setOpen] = useState(Boolean(childActive));

  if (!hasChildren) {
    return (
      <Link
        href={item.href}
        onClick={onClose}
        className={`px-3 py-3 text-sm font-extrabold uppercase tracking-wider border-b border-amber-500/30 last:border-0 flex items-center justify-between ${
          active
            ? "bg-[#FEAC00] text-black"
            : "text-black"
        }`}
      >
        <span>{item.label}</span>
      </Link>
    );
  }

  return (
    <div className="border-b border-amber-500/30 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full px-3 py-3 text-sm font-extrabold uppercase tracking-wider flex items-center justify-between transition-colors ${
          childActive
            ? "bg-[#FEAC00] text-black"
            : "text-black"
        }`}
        aria-expanded={open}
      >
        <span>{item.label}</span>
        <HiChevronDown
          className={`text-base transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="pb-2 pl-3 border-l-4 border-amber-500/50 ml-3 bg-amber-300/40">
          {item.children!.map((child) => (
            <Link
              key={child.href + child.label}
              href={child.href}
              onClick={onClose}
              className={`block px-3 py-2 text-sm font-semibold transition-colors ${
                pathname === child.href
                  ? "text-primary-dark"
                  : "text-primary-dark/80 hover:text-primary-dark"
              }`}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
