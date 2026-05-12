"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import { mainNav } from "@/lib/nav";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50">
      {/* Utility bar */}
      <div className="bg-primary-dark text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-5">
            <a
              href="tel:+8801XXXXXXXXX"
              className="inline-flex items-center gap-1.5 hover:text-accent transition"
            >
              <HiOutlinePhone className="text-sm" />
              <span>+880 1XXX-XXXXXX</span>
            </a>
            <a
              href="mailto:info@kajla.org"
              className="hidden sm:inline-flex items-center gap-1.5 hover:text-accent transition"
            >
              <HiOutlineEnvelope className="text-sm" />
              <span>info@kajla.org</span>
            </a>
          </div>
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 hover:text-accent transition"
          >
            <HiOutlineUserCircle className="text-sm" />
            <span>Admin Login</span>
          </Link>
        </div>
      </div>

      {/* Main bar */}
      <div
        className={`transition-all ${
          scrolled
            ? "bg-white/95 backdrop-blur shadow-md"
            : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white grid place-items-center font-extrabold text-lg shadow-md group-hover:shadow-lg transition-shadow">
              KS
            </div>
            <div>
              <div className="text-base lg:text-lg font-extrabold text-primary leading-tight tracking-tight">
                Kajla Society
              </div>
              <div className="text-[10px] text-muted font-bn">
                কাজলা সোসাইটি
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center gap-0.5">
            {mainNav.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                    active
                      ? "text-primary bg-accent"
                      : "text-foreground hover:text-primary hover:bg-accent/60"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA + mobile button */}
          <div className="flex items-center gap-2">
            <Link
              href="/services/membership"
              className="hidden md:inline-flex items-center px-4 py-2 bg-primary hover:bg-primary-light text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all"
            >
              Join Society
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="xl:hidden p-2 text-primary rounded-md hover:bg-accent"
              aria-label="Toggle menu"
            >
              {open ? <HiOutlineXMark size={26} /> : <HiOutlineBars3 size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <nav className="xl:hidden border-t border-border bg-white shadow-lg max-h-[calc(100vh-7rem)] overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col">
              {mainNav.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-3 text-sm font-medium border-b border-border last:border-0 flex items-center justify-between ${
                      active ? "text-primary" : "text-foreground"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.labelBn && (
                      <span className="text-xs text-muted font-bn">
                        {item.labelBn}
                      </span>
                    )}
                  </Link>
                );
              })}
              <Link
                href="/services/membership"
                className="mt-4 mb-2 inline-flex justify-center items-center px-4 py-3 bg-primary hover:bg-primary-light text-white text-sm font-semibold rounded-lg shadow-sm"
              >
                Join Society
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
