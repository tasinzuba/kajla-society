import Link from "next/link";
import { HiOutlineHome, HiChevronRight } from "react-icons/hi2";

type Crumb = { label: string; href?: string };

type Props = {
  title: string;
  titleBn?: string | null;
  subtitle?: string;
  image: string;
  crumbs?: Crumb[];
};

export function PageHero({ title, titleBn, subtitle, image, crumbs }: Props) {
  return (
    <section className="relative h-[280px] md:h-[340px] overflow-hidden">
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/85 via-primary/75 to-primary/50" />
      <div className="absolute inset-0 bg-pattern-dots opacity-10" />

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-center">
        {/* Breadcrumbs */}
        {crumbs && crumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-white/80 mb-3">
            <Link href="/" className="inline-flex items-center gap-1 hover:text-white">
              <HiOutlineHome />
              <span>Home</span>
            </Link>
            {crumbs.map((c) => (
              <span key={c.label} className="inline-flex items-center gap-1">
                <HiChevronRight className="text-white/50" />
                {c.href ? (
                  <Link href={c.href} className="hover:text-white">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-white">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          {title}
        </h1>
        {titleBn && (
          <p className="text-base md:text-lg text-accent font-bn mt-2" lang="bn">
            {titleBn}
          </p>
        )}
        {subtitle && (
          <p className="text-sm md:text-base text-white/80 mt-3 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
