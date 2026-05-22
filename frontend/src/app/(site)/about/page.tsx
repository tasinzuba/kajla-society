import Link from "next/link";
import {
  HiOutlineUserGroup,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineHeart,
  HiOutlineFlag,
  HiOutlineEye,
  HiArrowRight,
  HiOutlineAcademicCap,
  HiOutlineHandRaised,
} from "react-icons/hi2";
import { FaPhone } from "react-icons/fa6";
import { getAboutContent } from "@/lib/settings";
import { PageHero } from "@/components/site/PageHero";
import { stockImages } from "@/lib/images";

export const dynamic = "force-dynamic";

export const metadata = { title: "About Us" };

const FOCUS_ICONS = [
  HiOutlineUserGroup,
  HiOutlineAcademicCap,
  HiOutlineShieldCheck,
];

const VALUES = [
  { Icon: HiOutlineHeart, label: "Care for every family" },
  { Icon: HiOutlineHandRaised, label: "Responsible leadership" },
  { Icon: HiOutlineSparkles, label: "Unity & cooperation" },
  { Icon: HiOutlineShieldCheck, label: "Safety & protection" },
];

export default async function AboutPage() {
  const about = await getAboutContent();

  return (
    <>
      <PageHero
        title="About Kajla Society"
        subtitle={about.heroSubtitle}
        image={stockImages.heroAbout}
        crumbs={[{ label: "About" }]}
      />

      {/* ============ Who we are ============ */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={stockImages.heroMembers}
                alt="Kajla Society community"
                className="w-full aspect-[4/3] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-2 sm:right-6 bg-primary-dark text-white rounded-xl px-6 py-4 shadow-lg">
              <div className="text-3xl font-extrabold text-amber-400">Est. 1980</div>
              <div className="text-[11px] uppercase tracking-widest text-white/70">
                Serving Kajla
              </div>
            </div>
          </div>

          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-md text-[10px] uppercase tracking-widest font-bold mb-4">
              <HiOutlineSparkles />
              Who we are
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-primary-dark mb-5 tracking-tight leading-tight">
              {about.introHeading}
            </h2>
            <p className="text-foreground/75 leading-relaxed mb-4">
              {about.introText1}
            </p>
            {about.introText2 && (
              <p className="text-foreground/75 leading-relaxed mb-6">
                {about.introText2}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              {VALUES.map((v) => (
                <span
                  key={v.label}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-lg text-sm font-medium text-primary-dark"
                >
                  <v.Icon className="text-amber-700" />
                  {v.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ Mission & Vision ============ */}
      <section className="py-16 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-6">
          <div className="bg-background border border-border rounded-2xl p-8">
            <div className="w-12 h-12 rounded-md bg-primary-dark text-amber-400 grid place-items-center text-xl mb-4">
              <HiOutlineFlag />
            </div>
            <h3 className="text-xl font-extrabold text-primary-dark mb-2 tracking-tight">
              Our Mission
            </h3>
            <p className="text-foreground/75 leading-relaxed">{about.mission}</p>
          </div>
          <div className="bg-background border border-border rounded-2xl p-8">
            <div className="w-12 h-12 rounded-md bg-amber-400 text-primary-dark grid place-items-center text-xl mb-4">
              <HiOutlineEye />
            </div>
            <h3 className="text-xl font-extrabold text-primary-dark mb-2 tracking-tight">
              Our Vision
            </h3>
            <p className="text-foreground/75 leading-relaxed">{about.vision}</p>
          </div>
        </div>
      </section>

      {/* ============ Focus areas ============ */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-md text-[10px] uppercase tracking-widest font-bold mb-4">
              What we focus on
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-primary-dark tracking-tight">
              Our key focus areas
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {about.focusAreas.map((a, i) => {
              const Icon = FOCUS_ICONS[i] ?? HiOutlineUserGroup;
              return (
                <div
                  key={i}
                  className="bg-white border border-border rounded-2xl p-7 hover:border-amber-400 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-md bg-primary-dark text-amber-400 grid place-items-center text-xl flex-shrink-0">
                      <Icon />
                    </div>
                    <span className="text-3xl font-extrabold text-border">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-primary-dark mb-2 tracking-tight leading-snug">
                    {a.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{a.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="py-20 bg-white border-t border-border">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-background border border-border rounded-2xl p-10 lg:p-14 text-center">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-primary-dark tracking-tight mb-3">
              Want to know more or get involved?
            </h2>
            <p className="text-muted mb-7 max-w-xl mx-auto">
              Reach out to the society office for any queries, suggestions, or to
              learn more about our community initiatives.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-primary-dark font-bold rounded-md transition uppercase tracking-wider text-sm"
              >
                <FaPhone />
                Contact Us
              </Link>
              <Link
                href="/member-directory"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white border-2 border-primary-dark hover:bg-primary-dark hover:text-white text-primary-dark font-bold rounded-md transition uppercase tracking-wider text-sm"
              >
                Member Directory
                <HiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
