import Link from "next/link";
import {
  HiOutlineIdentification,
  HiOutlineTruck,
  HiOutlineMap,
  HiOutlineMapPin,
} from "react-icons/hi2";
import type { IconType } from "react-icons";
import { PageHero } from "./PageHero";
import { stockImages } from "@/lib/images";

type Service = {
  href: string;
  label: string;
  Icon: IconType;
};

const services: Service[] = [
  { href: "/services/membership", label: "Membership Registration", Icon: HiOutlineIdentification },
  { href: "/services/car-sticker", label: "Car Sticker Application", Icon: HiOutlineTruck },
  { href: "/services/adopt-road", label: "Adopt a Road", Icon: HiOutlineMap },
  { href: "/services/adopt-gate", label: "Adopt a Gate", Icon: HiOutlineMapPin },
];

export function ApplicationLayout({
  title,
  subtitle,
  current,
  children,
}: {
  title: string;
  subtitle?: string;
  current: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHero
        title={title}
        subtitle={subtitle}
        image={stockImages.heroContact}
        crumbs={[{ label: "Services" }, { label: title }]}
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-[280px,1fr] gap-8">
          {/* Sidebar */}
          <aside className="space-y-1">
            <h3 className="text-xs uppercase tracking-widest text-muted font-bold mb-3 px-3">
              Our Services
            </h3>
            {services.map((s) => {
              const active = s.href === current;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                    active
                      ? "bg-gradient-to-r from-primary to-primary-light text-white font-semibold shadow-md"
                      : "text-foreground hover:bg-accent/40"
                  }`}
                >
                  <s.Icon
                    className={`text-xl ${active ? "text-white" : "text-primary"}`}
                  />
                  <span>{s.label}</span>
                </Link>
              );
            })}
          </aside>

          {/* Main */}
          <main>{children}</main>
        </div>
      </div>
    </>
  );
}
