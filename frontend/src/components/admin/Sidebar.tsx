"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: string;
};

type NavGroup = {
  heading?: string;
  items: NavItem[];
};

const groups: NavGroup[] = [
  {
    items: [{ label: "Dashboard", href: "/admin", icon: "▣" }],
  },
  {
    heading: "Content",
    items: [
      { label: "Pages", href: "/admin/pages", icon: "▤" },
      { label: "Articles / News", href: "/admin/articles", icon: "✎" },
      { label: "Events", href: "/admin/events", icon: "📅" },
      { label: "Notices", href: "/admin/notices", icon: "📌" },
      { label: "Gallery", href: "/admin/gallery", icon: "🖼" },
    ],
  },
  {
    heading: "People",
    items: [
      { label: "Member Directory", href: "/admin/committee", icon: "👥" },
      { label: "Residence Directory", href: "/admin/residents", icon: "🏠" },
      { label: "Users", href: "/admin/users", icon: "👤" },
    ],
  },
  {
    heading: "Applications",
    items: [
      { label: "Membership", href: "/admin/applications/membership", icon: "📋" },
      { label: "Car Sticker", href: "/admin/applications/car-sticker", icon: "🚗" },
      { label: "Adoptions", href: "/admin/applications/adoptions", icon: "🤝" },
      { label: "Messages", href: "/admin/messages", icon: "✉" },
    ],
  },
  {
    heading: "Site",
    items: [
      { label: "Facilities", href: "/admin/facilities", icon: "🏢" },
      { label: "Settings", href: "/admin/settings", icon: "⚙" },
    ],
  },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-primary-dark text-white flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <Link
        href="/admin"
        className="flex items-center gap-3 px-5 py-5 border-b border-white/10"
        onClick={onNavigate}
      >
        <div className="w-9 h-9 rounded-full bg-accent text-primary grid place-items-center font-bold">
          KS
        </div>
        <div>
          <div className="font-bold text-sm">Kajla Society</div>
          <div className="text-[10px] text-accent uppercase tracking-wider">
            Admin Panel
          </div>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4">
        {groups.map((group, gi) => (
          <div key={gi} className="mb-4">
            {group.heading && (
              <div className="px-5 py-2 text-[10px] uppercase tracking-wider text-white/40 font-semibold">
                {group.heading}
              </div>
            )}
            {group.items.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 px-5 py-2.5 text-sm transition border-l-2",
                    active
                      ? "bg-primary border-accent text-accent"
                      : "border-transparent text-white/80 hover:bg-primary/50 hover:text-white"
                  )}
                >
                  <span className="w-5 text-center">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/10 text-[11px] text-white/50">
        <Link href="/" className="hover:text-accent">
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}
