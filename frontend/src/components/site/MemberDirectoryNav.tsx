"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiOutlineUserGroup,
  HiOutlineUserPlus,
  HiOutlineSparkles,
  HiOutlineGlobeAlt,
  HiOutlineDocumentText,
} from "react-icons/hi2";
import type { IconType } from "react-icons";

type Item = {
  label: string;
  href: string;
  description: string;
  Icon: IconType;
};

const items: Item[] = [
  {
    label: "Member List",
    href: "/member-directory",
    description: "View comprehensive list of all registered society members.",
    Icon: HiOutlineUserGroup,
  },
  {
    label: "Membership Registration",
    href: "/member-directory/registration",
    description: "Register yourself or your family as members of the society.",
    Icon: HiOutlineUserPlus,
  },
  {
    label: "Member Services",
    href: "/member-directory/member-services",
    description: "Access various resources and privileges exclusive to members.",
    Icon: HiOutlineSparkles,
  },
  {
    label: "Non-member Services",
    href: "/member-directory/non-member-services",
    description: "Service information open for non-members and general community.",
    Icon: HiOutlineGlobeAlt,
  },
  {
    label: "Code of Conduct",
    href: "/member-directory/code-of-conduct",
    description: "Rules and guidelines for all members and stakeholders.",
    Icon: HiOutlineDocumentText,
  },
];

export function MemberDirectoryNav() {
  const pathname = usePathname();

  return (
    <aside className="lg:sticky lg:top-28 self-start">
      <nav className="bg-white border border-border rounded-md overflow-hidden shadow-sm">
        {items.map((item, i) => {
          const active =
            item.href === "/member-directory"
              ? pathname === "/member-directory"
              : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-5 py-4 transition-colors ${
                i !== items.length - 1 ? "border-b border-border" : ""
              } ${
                active
                  ? "bg-amber-50 border-l-4 border-l-amber-400"
                  : "hover:bg-amber-50/50"
              }`}
            >
              <div
                className={`flex items-center gap-2.5 font-bold text-sm tracking-tight ${
                  active ? "text-primary-dark" : "text-primary"
                }`}
              >
                <item.Icon className="text-base text-amber-700" />
                {item.label}
              </div>
              <p className="text-xs text-muted mt-1.5 leading-snug ml-[26px]">
                {item.description}
              </p>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
