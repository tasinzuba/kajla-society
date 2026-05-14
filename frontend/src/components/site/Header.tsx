"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiOutlineClock,
  HiChevronDown,
  HiArrowRight,
} from "react-icons/hi2";
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa6";
import { mainNav, type NavItem } from "@/lib/nav";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50">
      {/* ============================================================
         Utility bar
      ============================================================ */}
      <div className="bg-primary-dark text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-5">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-white/85">
              <HiOutlineMapPin className="text-sm text-accent" />
              <span>Kajla, Dhaka</span>
            </span>
            <a
              href="tel:+8801XXXXXXXXX"
              className="inline-flex items-center gap-1.5 hover:text-accent transition"
            >
              <HiOutlinePhone className="text-sm text-accent" />
              <span>+880 1XXX-XXXXXX</span>
            </a>
            <a
              href="mailto:info@kajla.org"
              className="hidden md:inline-flex items-center gap-1.5 hover:text-accent transition"
            >
              <HiOutlineEnvelope className="text-sm text-accent" />
              <span>info@kajla.org</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-white/80">
              <HiOutlineClock className="text-sm text-accent" />
              <span>9 AM – 5 PM</span>
            </span>
            <div className="flex items-center gap-1.5">
              <SocialIconLink href="#" label="Facebook" Icon={FaFacebookF} />
              <SocialIconLink href="#" label="YouTube" Icon={FaYoutube} />
              <SocialIconLink href="#" label="Instagram" Icon={FaInstagram} />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
         Main bar
      ============================================================ */}
      <div
        className={`transition-all duration-200 ${
          scrolled ? "bg-white/95 backdrop-blur shadow-md" : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white grid place-items-center font-extrabold text-lg shadow-md group-hover:shadow-lg transition-shadow">
              KS
            </div>
            <div className="hidden sm:block">
              <div className="text-base lg:text-lg font-extrabold text-primary leading-tight tracking-tight">
                Kajla Society
              </div>
              <div className="text-[10px] text-muted font-bn">কাজলা সোসাইটি</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center gap-0.5 flex-1 justify-center">
            {mainNav.map((item) => (
              <DesktopNavItem key={item.href + item.label} item={item} pathname={pathname} />
            ))}
          </nav>

          {/* CTA + mobile button */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href="/services/membership"
              className="hidden lg:inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all"
            >
              Join Society
              <HiArrowRight className="text-sm" />
            </Link>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="xl:hidden p-2 text-primary rounded-md hover:bg-accent transition"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <HiOutlineXMark size={26} /> : <HiOutlineBars3 size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <MobileMenu pathname={pathname} onClose={() => setMobileOpen(false)} />
        )}
      </div>
    </header>
  );
}

// ============================================================
// Desktop nav item with dropdown
// ============================================================
function DesktopNavItem({ item, pathname }: { item: NavItem; pathname: string }) {
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
        className={`inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
          active
            ? "text-primary bg-accent"
            : "text-foreground hover:text-primary hover:bg-accent/60"
        }`}
        aria-haspopup={hasChildren || undefined}
        aria-expanded={hasChildren ? open : undefined}
      >
        {item.label}
        {hasChildren && (
          <HiChevronDown
            className={`text-xs transition-transform ${open ? "rotate-180" : ""}`}
          />
        )}
      </Link>

      {hasChildren && open && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-10"
          style={{ minWidth: "280px" }}
        >
          <div className="bg-white border border-border rounded-xl shadow-xl overflow-hidden py-2 animate-fade-up">
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
                  className={`block px-4 py-2.5 transition-colors ${
                    childActive
                      ? "bg-accent text-primary"
                      : "text-foreground hover:bg-accent/40 hover:text-primary"
                  }`}
                >
                  <div className="text-sm font-semibold">{child.label}</div>
                  {child.description && (
                    <div className="text-xs text-muted mt-0.5 leading-snug">
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
// Mobile menu with accordion submenus
// ============================================================
function MobileMenu({
  pathname,
  onClose,
}: {
  pathname: string;
  onClose: () => void;
}) {
  return (
    <nav className="xl:hidden border-t border-border bg-white shadow-lg max-h-[calc(100vh-7rem)] overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col">
        {mainNav.map((item) => (
          <MobileNavItem
            key={item.href + item.label}
            item={item}
            pathname={pathname}
            onClose={onClose}
          />
        ))}
        <Link
          href="/services/membership"
          onClick={onClose}
          className="mt-5 mb-3 inline-flex justify-center items-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-primary-light text-white text-sm font-semibold rounded-xl shadow-md"
        >
          Join Society <HiArrowRight />
        </Link>
      </div>
    </nav>
  );
}

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
        className={`px-3 py-3 text-sm font-medium border-b border-border last:border-0 flex items-center justify-between ${
          active ? "text-primary" : "text-foreground"
        }`}
      >
        <span>{item.label}</span>
        {item.labelBn && (
          <span className="text-xs text-muted font-bn">{item.labelBn}</span>
        )}
      </Link>
    );
  }

  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full px-3 py-3 text-sm font-medium flex items-center justify-between transition-colors ${
          childActive ? "text-primary" : "text-foreground"
        }`}
        aria-expanded={open}
      >
        <span>{item.label}</span>
        <HiChevronDown
          className={`text-base transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="pb-2 pl-3 border-l-2 border-accent ml-3">
          {item.children!.map((child) => (
            <Link
              key={child.href + child.label}
              href={child.href}
              onClick={onClose}
              className={`block px-3 py-2 text-sm transition-colors ${
                pathname === child.href
                  ? "text-primary font-semibold"
                  : "text-foreground/80 hover:text-primary"
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

// ============================================================
// Small helpers
// ============================================================
function SocialIconLink({
  href,
  label,
  Icon,
}: {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-6 h-6 grid place-items-center rounded-full text-white/70 hover:text-accent hover:bg-white/10 transition"
    >
      <Icon className="text-[10px]" />
    </a>
  );
}
