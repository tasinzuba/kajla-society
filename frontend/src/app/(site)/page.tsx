import Link from "next/link";
import {
  HiOutlineCalendarDays,
  HiArrowRight,
  HiOutlineDocumentText,
  HiOutlineNewspaper,
  HiOutlineUserGroup,
  HiOutlineHeart,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiStar,
  HiOutlineMegaphone,
} from "react-icons/hi2";
import {
  FaMosque,
  FaGraduationCap,
  FaHospital,
  FaHelmetSafety,
  FaCartShopping,
  FaLandmark,
  FaHandshake,
  FaQuoteLeft,
  FaPhone,
} from "react-icons/fa6";
import { stockImages, unsplashUrl } from "@/lib/images";
import { listHeroSlides } from "@/lib/hero-slides";
import { listArticles, type ArticleListItem } from "@/lib/articles";
import { listGalleriesPublic, type GallerySummary } from "@/lib/galleries";
import { listTestimonialsPublic, type Testimonial } from "@/lib/testimonials";
import { HeroSlider } from "@/components/site/HeroSlider";
import { HomeGallery } from "@/components/site/HomeGallery";
import { mediaUrl } from "@/lib/media";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [slides, articlesData, galleries, testimonials] = await Promise.all([
    listHeroSlides().catch(() => []),
    listArticles({ limit: 4 }).catch(() => null),
    listGalleriesPublic().catch(() => [] as GallerySummary[]),
    listTestimonialsPublic().catch(() => [] as Testimonial[]),
  ]);
  const latestNews: ArticleListItem[] = articlesData?.items ?? [];
  const photoGalleries = galleries.filter((g) => g.type === "PHOTO");
  const videoGalleries = galleries.filter((g) => g.type === "VIDEO");

  return (
    <>
      {/* ===========================================================
         ANNOUNCEMENT BANNER — continuous marquee ticker
      =========================================================== */}
      <section className="bg-white text-primary-dark border-y border-border">
        <div className="marquee-wrap flex items-center gap-3 py-2.5 overflow-hidden">
          <span className="flex-shrink-0 inline-flex items-center gap-1.5 pl-4 pr-3 text-amber-700 border-r border-border">
            <HiOutlineMegaphone className="text-lg" />
            <span className="text-[10px] uppercase tracking-widest font-bold hidden sm:inline">
              Notice
            </span>
          </span>
          <div className="overflow-hidden flex-1">
            <div className="animate-marquee">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="text-[13px] lg:text-sm font-medium text-primary-dark/85"
                  aria-hidden={i !== 0}
                >
                  Due to organizational restructuring, all previous websites have
                  been discontinued. Going forward, this website will serve as the
                  official platform for monitoring, managing, and controlling all
                  activities. Please follow this website for all future information
                  and updates.
                  <span className="text-amber-600 px-6">✦</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===========================================================
         HERO — Admin-controlled full-screen image slider
      =========================================================== */}
      <HeroSlider slides={slides} />

      {/* ===========================================================
         STATS BANNER
      =========================================================== */}
      <section className="relative -mt-16 lg:-mt-20 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-primary-dark border-t-4 border-amber-400 rounded-md shadow-xl p-8 lg:p-10 relative">
            <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 text-white text-center divide-y lg:divide-y-0 lg:divide-x divide-white/10">
              {[
                { num: "1,200+", label: "Active Members", Icon: HiOutlineUserGroup },
                { num: "45", label: "Years Strong", Icon: HiOutlineCalendarDays },
                { num: "30+", label: "Events / Year", Icon: HiOutlineSparkles },
                { num: "12", label: "Committees", Icon: HiOutlineShieldCheck },
              ].map((s) => (
                <div key={s.label} className="py-4 lg:py-0 px-4 group">
                  <s.Icon className="text-3xl text-amber-400 mx-auto mb-3" />
                  <div className="text-4xl lg:text-5xl font-extrabold tracking-tight">
                    {s.num}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-white/70 font-semibold mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===========================================================
         MISSION — Image + content
      =========================================================== */}
      <section className="py-24 bg-background relative">
        <div className="relative max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image with frame */}
          <div className="relative">
            <div className="relative rounded-md overflow-hidden shadow-xl ring-1 ring-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={stockImages.missionImage}
                alt="Community team"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/50 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur rounded-md p-5 shadow-lg flex items-center gap-4">
                <div className="w-12 h-12 rounded-md bg-amber-400 grid place-items-center text-primary-dark text-xl flex-shrink-0">
                  <HiOutlineHeart />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-amber-700 font-bold mb-0.5">
                    Our Promise
                  </div>
                  <div className="text-sm font-semibold text-primary">
                    A safer, greener Kajla — for every family.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-pale text-emerald-dark rounded-full text-[10px] uppercase tracking-widest font-bold mb-5">
              <HiOutlineSparkles />
              Our Mission
            </span>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-primary-dark mb-5 tracking-tight leading-tight">
              Working together for a{" "}
              <span className="text-emerald-dark">better community</span>.
            </h2>
            <p className="text-base lg:text-lg text-foreground/75 leading-relaxed mb-7">
              Kajla Society works to build a safer, stronger, and more caring
              community by protecting residents&apos; interests, promoting welfare
              activities, supporting education and youth counselling, encouraging
              public interaction, and raising awareness against drugs and social
              problems. Through unity and responsible leadership, the society aims
              to create a better living environment for every family.
            </p>

            <ul className="space-y-4 mb-8">
              {[
                {
                  Icon: HiOutlineUserGroup,
                  title: "Community Welfare & Public Support",
                  desc: "Building a supportive network, encouraging public interaction, and helping families with social, educational, and community concerns.",
                },
                {
                  Icon: HiOutlineSparkles,
                  title: "Youth Counselling & Progress Monitoring",
                  desc: "Counselling, awareness programs, and education monitoring to keep residents focused on self-improvement and positive social values.",
                },
                {
                  Icon: HiOutlineShieldCheck,
                  title: "Drug Awareness & Social Protection",
                  desc: "Raising awareness, involving families, and working with authorities for a drug-free, safe community.",
                },
              ].map((item) => (
                <li
                  key={item.title}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-border hover:border-emerald/30 hover:shadow-md transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-faint to-emerald-pale text-emerald-dark grid place-items-center text-xl flex-shrink-0">
                    <item.Icon />
                  </div>
                  <div>
                    <div className="font-bold text-primary">{item.title}</div>
                    <div className="text-sm text-muted mt-0.5">{item.desc}</div>
                  </div>
                </li>
              ))}
            </ul>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-primary font-bold hover:text-emerald-dark transition group"
            >
              Read our full story
              <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===========================================================
         FACILITIES — Editorial image cards (bento grid)
      =========================================================== */}
      <section className="py-24 bg-white relative">
        <div className="absolute inset-0 bg-grid opacity-25 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-pale text-emerald-dark rounded-full text-[10px] uppercase tracking-widest font-bold mb-4">
                <HiOutlineSparkles />
                Explore Kajla
              </span>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-primary-dark mb-4 tracking-tight leading-tight">
                Everything within{" "}
                <span className="text-emerald-dark">reach</span>
              </h2>
              <p className="text-muted text-lg leading-relaxed">
                From religious places and educational institutions to hospitals,
                markets, emergency services, and community support centers — Kajla
                Society helps residents easily find essential facilities and
                services near them.
              </p>
            </div>
            <Link
              href="/facilities"
              className="inline-flex w-fit items-center gap-2 px-5 py-3 bg-amber-400 text-primary-dark font-bold rounded-md hover:bg-amber-300 transition-all hover:-translate-y-0.5 shadow-lg"
            >
              Browse all facilities
              <HiArrowRight />
            </Link>
          </div>

          {/* Card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {[
              {
                Icon: FaMosque,
                title: "Religious Places",
                desc: "Mosques, prayer halls, and spiritual centers serving the community.",
                href: "/facilities?category=RELIGIOUS",
                image: unsplashUrl("1542319630-4ea90fc0d24b", 800),
                accent: "bg-blue-500",
              },
              {
                Icon: FaGraduationCap,
                title: "Educational",
                desc: "Schools, colleges, and learning institutions near you.",
                href: "/facilities?category=EDUCATIONAL",
                image: unsplashUrl("1503676260728-1c00da094a0b", 800),
                accent: "bg-emerald-500",
              },
              {
                Icon: FaHospital,
                title: "Health & Emergency",
                desc: "Hospitals, clinics, and pharmacies for round-the-clock care.",
                href: "/facilities?category=HEALTH_EMERGENCY",
                image: unsplashUrl("1538108149393-fbbd81895907", 800),
                accent: "bg-rose-500",
              },
              {
                Icon: FaHelmetSafety,
                title: "Construction",
                desc: "Trusted builders, contractors, and construction services.",
                href: "/facilities?category=CONSTRUCTION",
                image: unsplashUrl("1503387762-592deb58ef4e", 800),
                accent: "bg-amber-500",
              },
              {
                Icon: FaCartShopping,
                title: "Local Services",
                desc: "Markets, shops, and everyday essentials at your doorstep.",
                href: "/facilities?category=LOCAL_SERVICES",
                image: unsplashUrl("1604719312566-8912e9227c6a", 800),
                accent: "bg-purple-500",
              },
              {
                Icon: FaLandmark,
                title: "Government",
                desc: "Civic offices and public services for resident needs.",
                href: "/facilities?category=GOVERNMENT",
                image: unsplashUrl("1555560037-7e0e8c7d6f1d", 800),
                accent: "bg-cyan-500",
              },
              {
                Icon: FaHandshake,
                title: "Organizations",
                desc: "Community groups, NGOs, and welfare organizations.",
                href: "/organizations",
                image: stockImages.heroOrganizations,
                accent: "bg-teal-500",
              },
              {
                Icon: FaPhone,
                title: "Emergency",
                desc: "Important contacts available 24/7 for urgent situations.",
                href: "/contact",
                image: unsplashUrl("1587058524137-90d1d39e93a8", 800),
                accent: "bg-pink-500",
              },
            ].map(({ Icon, title, desc, href, image, accent }) => (
              <div
                key={title}
                className="group bg-surface rounded-3xl overflow-hidden border border-border shadow-md hover:shadow-2xl transition-all hover:-translate-y-1 flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-cream">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Icon badge */}
                  <div className={`absolute top-3 left-3 w-10 h-10 rounded-xl ${accent} text-white grid place-items-center text-base shadow-lg ring-2 ring-white`}>
                    <Icon />
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 lg:p-6 flex flex-col flex-1">
                  <h3 className="text-lg lg:text-xl font-extrabold text-primary-dark tracking-tight mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed mb-5 flex-1">
                    {desc}
                  </p>
                  <Link
                    href={href}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-400 text-primary-dark rounded-md font-bold text-sm hover:bg-amber-300 transition-colors w-full group/btn"
                  >
                    Explore
                    <HiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===========================================================
         LATEST NEWS — Editorial cards
      =========================================================== */}
      <section className="py-24 bg-background relative">
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 items-end mb-12">
            <div className="lg:col-span-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-400 text-primary-dark rounded-md text-[10px] uppercase tracking-widest font-bold mb-4">
                <HiOutlineNewspaper />
                Latest News
              </span>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-primary-dark tracking-tight leading-tight">
                Fresh from the{" "}
                <span className="text-emerald-dark">community</span>
              </h2>
            </div>
            <Link
              href="/news"
              className="inline-flex w-fit lg:justify-self-end items-center gap-2 text-primary font-bold hover:text-emerald-dark transition group"
            >
              All news
              <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {latestNews.length === 0 ? (
            <div className="bg-surface border border-border rounded-3xl py-16 text-center">
              <HiOutlineNewspaper className="text-5xl text-muted/40 mx-auto mb-4" />
              <p className="text-muted">No news published yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
              {latestNews.map((n) => {
                const cover = mediaUrl(n.coverImage);
                return (
                  <Link
                    key={n.id}
                    href={`/news/${n.slug}`}
                    className="group bg-surface rounded-3xl overflow-hidden border border-border shadow-md hover:shadow-2xl transition-all hover:-translate-y-1 flex flex-col"
                  >
                    {/* Cover image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-cream">
                      {cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cover}
                          alt={n.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="absolute inset-0 grid place-items-center bg-primary-dark text-amber-400">
                          <HiOutlineNewspaper className="text-5xl opacity-60" />
                        </div>
                      )}
                      {n.category && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 backdrop-blur text-emerald-dark rounded text-[10px] uppercase tracking-widest font-bold">
                          {n.category.name}
                        </span>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-5 lg:p-6 flex flex-col flex-1">
                      <h3 className="text-lg font-extrabold text-primary-dark tracking-tight leading-snug mb-2 group-hover:text-emerald-dark transition-colors line-clamp-2">
                        {n.title}
                      </h3>
                      {n.excerpt && (
                        <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-2 flex-1">
                          {n.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-muted mt-auto pt-3 border-t border-border">
                        <span className="inline-flex items-center gap-1.5">
                          <HiOutlineCalendarDays />
                          {formatDate(n.publishedAt ?? n.createdAt)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-emerald-dark font-bold uppercase tracking-wider group-hover:gap-2 transition-all">
                          Read
                          <HiArrowRight />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ===========================================================
         COMMUNITY GALLERY — Admin-controlled photos & videos
      =========================================================== */}
      <HomeGallery photos={photoGalleries} videos={videoGalleries} />

      {/* ===========================================================
         RECENT ACTIVITY
      =========================================================== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-pale text-emerald-dark rounded-full text-[10px] uppercase tracking-widest font-bold mb-4">
              Stay Updated
            </span>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-primary-dark mb-3 tracking-tight">
              What&apos;s happening at Kajla
            </h2>
            <p className="text-muted text-lg">
              Latest notices, upcoming events, and community stories.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                Icon: HiOutlineDocumentText,
                title: "Latest Notices",
                desc: "Official notices and circulars from the society.",
                href: "/notices",
              },
              {
                Icon: HiOutlineCalendarDays,
                title: "Upcoming Events",
                desc: "Mark your calendar — community events ahead.",
                href: "/events",
              },
              {
                Icon: HiOutlineNewspaper,
                title: "Community News",
                desc: "Stories, updates, and resident achievements.",
                href: "/news",
              },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group relative bg-white border border-border rounded-md p-8 hover:shadow-lg hover:border-amber-400 transition-all"
              >
                <div className="w-14 h-14 rounded-md bg-primary-dark text-amber-400 grid place-items-center text-2xl mb-5">
                  <c.Icon />
                </div>
                <h3 className="text-xl font-extrabold text-primary mb-2 tracking-tight">
                  {c.title}
                </h3>
                <p className="text-sm text-foreground/70 mb-5 leading-relaxed">
                  {c.desc}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:text-emerald-dark group-hover:gap-2.5 transition-all">
                  View all <HiArrowRight />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===========================================================
         TESTIMONIALS — Admin-controlled
      =========================================================== */}
      {testimonials.length > 0 && (
      <section className="py-24 bg-primary-dark relative">
        <div className="absolute inset-0 bg-pattern-dots opacity-10" />

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-14 max-w-2xl mx-auto text-white">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur border border-white/20 text-amber-300 rounded-full text-[10px] uppercase tracking-widest font-bold mb-4">
              <FaQuoteLeft />
              Community Voices
            </span>
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight">
              Loved by our residents
            </h2>
            <p className="text-accent text-lg">
              Real stories from people who call Kajla home.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => {
              const avatar = mediaUrl(t.avatar);
              return (
                <div
                  key={t.id}
                  className="bg-white/95 backdrop-blur rounded-3xl p-7 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all relative"
                >
                  <FaQuoteLeft className="absolute -top-3 -left-3 text-3xl text-amber-600 p-2 bg-white rounded-full shadow-lg" />

                  <div className="flex items-center gap-1 mb-4 mt-2">
                    {Array.from({ length: Math.max(1, Math.min(5, t.rating)) }).map(
                      (_, s) => (
                        <HiStar key={s} className="text-amber-400 text-base" />
                      )
                    )}
                  </div>
                  <p className="text-foreground/85 leading-relaxed mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-5 border-t border-border">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-amber-100 bg-accent grid place-items-center flex-shrink-0">
                      {avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={avatar}
                          alt={t.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-extrabold text-primary">
                          {t.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-primary">{t.name}</div>
                      {t.role && (
                        <div className="text-xs text-muted">{t.role}</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* ===========================================================
         FINAL CTA
      =========================================================== */}
      <section className="py-24 bg-background relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative bg-white border border-border rounded-md shadow-lg p-10 lg:p-16">
            <div className="relative grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400 text-primary-dark rounded-md text-[10px] uppercase tracking-widest font-bold mb-4">
                  <HiOutlineSparkles />
                  Get In Touch
                </span>
                <h2 className="text-4xl lg:text-5xl font-extrabold text-primary-dark mb-4 tracking-tight leading-tight">
                  Have a question about Kajla?
                </h2>
                <p className="text-muted text-lg leading-relaxed">
                  Reach out to the society office for any queries, suggestions,
                  or to learn more about our community initiatives.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-amber-400 hover:bg-amber-300 text-primary-dark font-bold rounded-md shadow-md transition-all"
                >
                  <FaPhone />
                  Contact Us
                  <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/about"
                  className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-white border-2 border-primary-dark hover:bg-primary-dark hover:text-white text-primary-dark font-semibold rounded-md transition-all"
                >
                  Learn More About Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
