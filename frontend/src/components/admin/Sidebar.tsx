"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import {
  HiOutlineSquares2X2,
  HiOutlineDocumentText,
  HiOutlinePencilSquare,
  HiOutlineCalendarDays,
  HiOutlineMegaphone,
  HiOutlinePhoto,
  HiOutlineUserGroup,
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineClipboardDocumentList,
  HiOutlineEnvelope,
  HiOutlinePlayCircle,
  HiOutlineBuildingOffice2,
  HiOutlineCog6Tooth,
} from "react-icons/hi2";

type NavItem = {
  label: string;
  href: string;
  Icon: IconType;
};

type NavGroup = {
  heading?: string;
  items: NavItem[];
};

const groups: NavGroup[] = [
  {
    items: [{ label: "Overview", href: "/admin", Icon: HiOutlineSquares2X2 }],
  },
  {
    heading: "Content",
    items: [
      { label: "Pages", href: "/admin/pages", Icon: HiOutlineDocumentText },
      { label: "Articles", href: "/admin/articles", Icon: HiOutlinePencilSquare },
      { label: "Events", href: "/admin/events", Icon: HiOutlineCalendarDays },
      { label: "Notices", href: "/admin/notices", Icon: HiOutlineMegaphone },
      { label: "Gallery", href: "/admin/gallery", Icon: HiOutlinePhoto },
    ],
  },
  {
    heading: "People",
    items: [
      { label: "Committee", href: "/admin/committee", Icon: HiOutlineUserGroup },
      { label: "Residents", href: "/admin/residents", Icon: HiOutlineHome },
      { label: "Users", href: "/admin/users", Icon: HiOutlineUsers },
    ],
  },
  {
    heading: "Inbox",
    items: [
      {
        label: "Applications",
        href: "/admin/applications/membership",
        Icon: HiOutlineClipboardDocumentList,
      },
      { label: "Messages", href: "/admin/messages", Icon: HiOutlineEnvelope },
    ],
  },
  {
    heading: "Site",
    items: [
      { label: "Hero Slider", href: "/admin/hero-slides", Icon: HiOutlinePlayCircle },
      { label: "Facilities", href: "/admin/facilities", Icon: HiOutlineBuildingOffice2 },
      { label: "Settings", href: "/admin/settings", Icon: HiOutlineCog6Tooth },
    ],
  },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-[#0b1530] text-white flex flex-col h-screen sticky top-0 border-r border-white/[0.06]">
      {/* Brand / workspace */}
      <div className="px-4 py-4 border-b border-white/[0.06]">
        <Link
          href="/admin"
          className="flex items-center gap-2.5 group"
          onClick={onNavigate}
        >
          <div className="w-8 h-8 rounded bg-amber-400 text-[#0b1530] grid place-items-center font-black text-[13px] flex-shrink-0">
            K
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-bold tracking-tight truncate text-white">
              Kajla Society
            </div>
            <div className="text-[10px] text-white/40 font-medium truncate">
              admin.kajla
            </div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {groups.map((group, gi) => (
          <div key={gi} className={gi === 0 ? "mb-3" : "mb-3"}>
            {group.heading && (
              <div className="px-2.5 mt-3 mb-1.5 text-[10px] uppercase tracking-[0.12em] text-white/35 font-semibold">
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
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 mb-0.5 text-[13px] font-medium rounded-md transition ${
                    active
                      ? "bg-white/[0.08] text-white"
                      : "text-white/55 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <item.Icon
                    className={`text-[15px] flex-shrink-0 ${
                      active ? "text-amber-400" : "text-white/40"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/[0.06]">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-[11px] text-white/45 hover:text-white/80 transition"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="font-mono">kajla.org</span>
        </Link>
      </div>
    </aside>
  );
}
