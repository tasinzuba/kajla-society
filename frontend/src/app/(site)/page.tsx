import Link from "next/link";
import {
  HiOutlineCalendarDays,
  HiArrowRight,
  HiOutlineMapPin,
  HiOutlineDocumentText,
  HiOutlineNewspaper,
  HiOutlineClipboardDocumentCheck,
  HiOutlineIdentification,
  HiOutlineTruck,
  HiOutlineMap,
  HiOutlineUserGroup,
  HiOutlineHeart,
  HiOutlineShieldCheck,
  HiOutlineGlobeAsiaAustralia,
  HiOutlineSparkles,
  HiOutlinePlayCircle,
  HiStar,
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
import { stockImages } from "@/lib/images";

export default function HomePage() {
  return (
    <>
      {/* ===========================================================
         HERO — Dynamic multi-image collage
      =========================================================== */}
      <section className="relative overflow-hidden bg-white">
        {/* Animated background blobs */}
        <div className="absolute top-0 -left-32 w-[500px] h-[500px] rounded-full bg-accent/50 blur-3xl pointer-events-none" />
        <div className="absolute -top-20 right-0 w-[380px] h-[380px] rounded-full bg-emerald-pale/60 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-blue-100/50 blur-3xl pointer-events-none" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 pt-12 lg:pt-20 pb-16 lg:pb-24 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* LEFT — Text */}
          <div className="lg:col-span-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-emerald/20 rounded-full text-[11px] uppercase tracking-widest font-bold mb-6 shadow-sm">
              <span className="relative inline-flex">
                <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
                <span className="absolute inset-0 w-2 h-2 rounded-full bg-emerald animate-pulse-ring" />
              </span>
              <span className="text-emerald-dark">Welcome to Kajla Society</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.5rem] font-extrabold leading-[1.02] text-primary-dark mb-6 tracking-tight">
              Building a{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-emerald-dark via-emerald to-primary">
                  vibrant
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 9C50 2 100 2 198 6"
                    stroke="url(#hero-line)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="hero-line" x1="0" x2="200">
                      <stop offset="0" stopColor="#10b981" />
                      <stop offset="1" stopColor="#1e40af" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              <br />
              connected{" "}
              <span className="inline-block bg-gradient-to-br from-primary to-primary-light bg-clip-text text-transparent">
                community.
              </span>
            </h1>

            <p
              className="text-lg lg:text-xl text-emerald-dark/90 font-bn mb-6 leading-relaxed"
              lang="bn"
            >
              একটি প্রাণবন্ত, সংযুক্ত সমাজ
            </p>

            <p className="text-base lg:text-lg text-foreground/70 leading-relaxed mb-8 max-w-xl">
              Where neighbors become friends and every member feels at home.
              Join us in creating lasting memories together — in the heart of Kajla.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                href="/services/membership"
                className="group relative inline-flex items-center gap-2 px-7 py-4 bg-gradient-to-r from-primary via-primary-light to-emerald text-white font-semibold rounded-2xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-emerald/30 hover:-translate-y-0.5 transition-all overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-emerald via-primary-light to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative">Become a Member</span>
                <HiArrowRight className="relative group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-7 py-4 bg-white border-2 border-primary/10 hover:border-emerald text-primary font-semibold rounded-2xl hover:bg-emerald-faint hover:text-emerald-dark transition-all"
              >
                <HiOutlinePlayCircle className="text-xl" />
                Take a Tour
              </Link>
            </div>

            {/* Trust signal */}
            <div className="flex items-center gap-4 flex-wrap pt-6 border-t border-border">
              <div className="flex -space-x-3">
                {[
                  "from-blue-400 to-blue-600",
                  "from-emerald-400 to-emerald-600",
                  "from-sky-400 to-indigo-600",
                  "from-teal-400 to-emerald-700",
                ].map((cls, i) => (
                  <div
                    key={i}
                    className={`w-11 h-11 rounded-full bg-gradient-to-br ${cls} border-2 border-white shadow-md grid place-items-center text-white text-xs font-bold ring-1 ring-black/5`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
                <div className="w-11 h-11 rounded-full bg-white border-2 border-white shadow-md grid place-items-center text-emerald-dark text-[10px] font-bold ring-1 ring-emerald/20">
                  +1.2k
                </div>
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1 mb-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <HiStar key={i} className="text-yellow-400 text-sm" />
                  ))}
                  <span className="ml-1 font-bold text-primary">4.9</span>
                </div>
                <div className="text-muted text-xs">
                  Trusted by 1,200+ community members
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Image collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-square">
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full border-2 border-dashed border-emerald/40 animate-slow-spin pointer-events-none" />
              <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full border-2 border-dashed border-primary/30 animate-slow-spin pointer-events-none" />

              {/* MAIN image — top-left, large */}
              <div className="absolute top-0 left-0 w-[68%] h-[60%] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5 z-10 animate-float">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={stockImages.collageMain}
                  alt="Kajla residential community"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/30 to-transparent" />
              </div>

              {/* SMALL image — top-right */}
              <div className="absolute top-[8%] right-0 w-[38%] h-[38%] rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5 z-20 animate-float-delayed">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={stockImages.collageSmall1}
                  alt="Community gathering"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* SMALL image — bottom-right */}
              <div className="absolute bottom-0 right-[6%] w-[44%] h-[44%] rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5 z-20 animate-float">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={stockImages.collageSmall2}
                  alt="Happy residents"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* SMALL image — bottom-left */}
              <div className="absolute bottom-[8%] left-[6%] w-[34%] h-[32%] rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5 z-20 animate-float-delayed">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={stockImages.collageSmall3}
                  alt="Team meeting"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating stats card — center */}
              <div className="absolute top-[44%] left-[28%] z-30 bg-white rounded-2xl shadow-2xl p-4 max-w-[180px] ring-1 ring-emerald-pale animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald to-emerald-dark grid place-items-center text-white text-lg shadow-md">
                    <HiOutlineUserGroup />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-primary leading-none">
                      1,200<span className="text-emerald">+</span>
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-muted font-bold mt-1">
                      Members
                    </div>
                  </div>
                </div>
              </div>

              {/* Award badge — top-left */}
              <div className="absolute -top-4 -left-4 z-40 w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-2xl grid place-items-center text-white text-center font-extrabold text-[10px] leading-tight -rotate-12 ring-4 ring-white animate-float">
                <div>
                  <div className="text-xl">★</div>
                  <div>SINCE</div>
                  <div className="text-base">1980</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="relative flex justify-center pb-8">
          <div className="flex flex-col items-center gap-2 text-muted text-xs">
            <span className="uppercase tracking-widest font-bold">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-emerald via-primary to-transparent animate-pulse" />
          </div>
        </div>
      </section>

      {/* ===========================================================
         STATS BANNER
      =========================================================== */}
      <section className="relative -mt-2 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-br from-primary via-primary-light to-emerald rounded-3xl shadow-2xl shadow-primary/20 p-8 lg:p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-pattern-dots opacity-20" />
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-emerald/30 blur-3xl" />

            <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 text-white text-center divide-y lg:divide-y-0 lg:divide-x divide-white/10">
              {[
                { num: "1,200+", label: "Active Members", Icon: HiOutlineUserGroup },
                { num: "45", label: "Years Strong", Icon: HiOutlineCalendarDays },
                { num: "30+", label: "Events / Year", Icon: HiOutlineSparkles },
                { num: "12", label: "Committees", Icon: HiOutlineShieldCheck },
              ].map((s) => (
                <div key={s.label} className="py-4 lg:py-0 px-4 group">
                  <s.Icon className="text-3xl text-emerald-pale mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-4xl lg:text-5xl font-extrabold tracking-tight">
                    {s.num}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-white/80 font-semibold mt-1">
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
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full bg-emerald-faint/80 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image with frame */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full rounded-3xl bg-gradient-to-br from-emerald to-primary opacity-20 blur-2xl" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={stockImages.missionImage}
                alt="Community team"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/50 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur rounded-2xl p-5 shadow-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald to-emerald-dark grid place-items-center text-white text-xl flex-shrink-0">
                  <HiOutlineHeart />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-emerald-dark font-bold mb-0.5">
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
              Kajla Society offers advocacy, coordination, and leadership to protect
              property interests, improve the living environment, and enhance
              community livability through social, cultural, and outreach activities.
            </p>

            <ul className="space-y-4 mb-8">
              {[
                {
                  Icon: HiOutlineShieldCheck,
                  title: "Protect & Advocate",
                  desc: "Defend property rights and resident interests with our legal team.",
                },
                {
                  Icon: HiOutlineGlobeAsiaAustralia,
                  title: "Greener Living",
                  desc: "Beautify roads, parks, and shared spaces year-round.",
                },
                {
                  Icon: HiOutlineHeart,
                  title: "Connect & Celebrate",
                  desc: "Host events that bring neighbors together as friends.",
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
         FACILITIES — Color-coded categories
      =========================================================== */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-accent text-primary rounded-full text-[10px] uppercase tracking-widest font-bold mb-4">
              Explore
            </span>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-primary-dark mb-4 tracking-tight">
              Everything within reach
            </h2>
            <p className="text-muted text-lg">
              From religious places to healthcare and education — all the
              facilities a thriving community needs.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[
              { Icon: FaMosque, title: "Religious Places", href: "/facilities#religious", grad: "from-blue-500 to-indigo-700" },
              { Icon: FaGraduationCap, title: "Educational", href: "/facilities#educational", grad: "from-emerald-500 to-teal-700" },
              { Icon: FaHospital, title: "Health & Emergency", href: "/facilities#health", grad: "from-rose-500 to-red-700" },
              { Icon: FaHelmetSafety, title: "Construction", href: "/facilities#construction", grad: "from-amber-500 to-orange-700" },
              { Icon: FaCartShopping, title: "Local Services", href: "/facilities#local", grad: "from-purple-500 to-fuchsia-700" },
              { Icon: FaLandmark, title: "Government", href: "/facilities#government", grad: "from-cyan-500 to-blue-700" },
              { Icon: FaHandshake, title: "Organizations", href: "/organizations", grad: "from-emerald-500 to-green-700" },
              { Icon: FaPhone, title: "Emergency", href: "/contact", grad: "from-pink-500 to-rose-700" },
            ].map(({ Icon, title, href, grad }) => (
              <Link
                key={title}
                href={href}
                className="group relative bg-white border border-border rounded-2xl p-6 text-center hover:border-transparent hover:shadow-2xl transition-all hover:-translate-y-1 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${grad} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className={`relative w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${grad} grid place-items-center text-white text-2xl shadow-md group-hover:scale-110 group-hover:bg-white/20 transition-transform`}>
                  <Icon />
                </div>
                <div className="relative font-bold text-primary group-hover:text-white text-sm transition-colors">
                  {title}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===========================================================
         SERVICES — Gradient cards
      =========================================================== */}
      <section className="py-24 bg-gradient-to-br from-background via-emerald-faint/40 to-background relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 items-end mb-12">
            <div className="lg:col-span-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald text-white rounded-full text-[10px] uppercase tracking-widest font-bold mb-4">
                <HiOutlineClipboardDocumentCheck />
                Apply Online
              </span>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-primary-dark tracking-tight">
                Our services for every <br className="hidden lg:block" />
                <span className="text-emerald-dark">resident & member</span>
              </h2>
            </div>
            <Link
              href="/services/membership"
              className="inline-flex w-fit lg:justify-self-end items-center gap-2 text-primary font-bold hover:text-emerald-dark transition group"
            >
              All services
              <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                Icon: HiOutlineIdentification,
                title: "Membership",
                desc: "Join the Kajla Society community.",
                href: "/services/membership",
                grad: "from-primary to-primary-light",
                accent: "bg-blue-400/30",
              },
              {
                Icon: HiOutlineTruck,
                title: "Car Sticker",
                desc: "Resident vehicle access sticker.",
                href: "/services/car-sticker",
                grad: "from-emerald to-emerald-dark",
                accent: "bg-emerald-400/30",
              },
              {
                Icon: HiOutlineMap,
                title: "Adopt a Road",
                desc: "Sponsor road maintenance.",
                href: "/services/adopt-road",
                grad: "from-primary-light to-emerald",
                accent: "bg-cyan-400/30",
              },
              {
                Icon: HiOutlineMapPin,
                title: "Adopt a Gate",
                desc: "Support security infrastructure.",
                href: "/services/adopt-gate",
                grad: "from-emerald-dark to-primary",
                accent: "bg-teal-400/30",
              },
            ].map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className={`group relative block bg-gradient-to-br ${s.grad} text-white rounded-3xl p-7 hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden`}
              >
                <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${s.accent} blur-2xl group-hover:scale-150 transition-transform`} />
                <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-white/10 blur-xl group-hover:bg-white/20 transition-colors" />

                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur grid place-items-center text-2xl mb-5 group-hover:scale-110 transition-transform">
                    <s.Icon />
                  </div>
                  <h3 className="font-extrabold text-lg lg:text-xl mb-2 tracking-tight">
                    {s.title}
                  </h3>
                  <p className="text-sm text-white/80 mb-5 leading-relaxed">
                    {s.desc}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/90 group-hover:gap-2.5 transition-all">
                    Apply now <HiArrowRight />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
                bg: "bg-gradient-to-br from-blue-50 to-blue-100",
                iconBg: "bg-primary",
              },
              {
                Icon: HiOutlineCalendarDays,
                title: "Upcoming Events",
                desc: "Mark your calendar — community events ahead.",
                href: "/events",
                bg: "bg-gradient-to-br from-emerald-faint to-emerald-pale",
                iconBg: "bg-emerald-dark",
              },
              {
                Icon: HiOutlineNewspaper,
                title: "Community News",
                desc: "Stories, updates, and resident achievements.",
                href: "/news",
                bg: "bg-gradient-to-br from-sky-50 to-cyan-100",
                iconBg: "bg-secondary",
              },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className={`group relative ${c.bg} border border-border rounded-3xl p-8 hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${c.iconBg} text-white grid place-items-center text-2xl mb-5 shadow-lg group-hover:scale-110 transition-transform`}
                >
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
         TESTIMONIALS
      =========================================================== */}
      <section className="py-24 bg-gradient-to-br from-primary-dark via-primary to-emerald-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-10" />
        <div className="absolute -top-32 -right-20 w-96 h-96 rounded-full bg-emerald/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-primary-light/30 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-14 max-w-2xl mx-auto text-white">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur border border-white/20 text-emerald-pale rounded-full text-[10px] uppercase tracking-widest font-bold mb-4">
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
            {[
              {
                quote:
                  "Joining Kajla Society was the best decision for our family. The community feels like extended family.",
                name: "Ayesha Rahman",
                role: "Resident since 2018",
                avatar: stockImages.avatar1,
              },
              {
                quote:
                  "The events, the safety, the green spaces — Kajla is a community in the truest sense. Our kids love it.",
                name: "Karim Hossain",
                role: "Block B resident",
                avatar: stockImages.avatar2,
              },
              {
                quote:
                  "I appreciate how organized and responsive the committee is. Truly setting a standard for societies.",
                name: "Salma Begum",
                role: "Member since 2015",
                avatar: stockImages.avatar3,
              },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-white/95 backdrop-blur rounded-3xl p-7 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all relative"
              >
                <FaQuoteLeft className="absolute -top-3 -left-3 text-3xl text-emerald p-2 bg-white rounded-full shadow-lg" />

                <div className="flex items-center gap-1 mb-4 mt-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <HiStar key={s} className="text-yellow-400 text-base" />
                  ))}
                </div>
                <p className="text-foreground/85 leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-pale"
                  />
                  <div>
                    <div className="font-bold text-primary">{t.name}</div>
                    <div className="text-xs text-muted">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===========================================================
         FINAL CTA
      =========================================================== */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative bg-white border border-border rounded-3xl shadow-2xl p-10 lg:p-16 overflow-hidden">
            <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-gradient-to-br from-emerald to-emerald-dark blur-3xl opacity-30" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-gradient-to-br from-primary to-primary-light blur-3xl opacity-30" />

            <div className="relative grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-pale text-emerald-dark rounded-full text-[10px] uppercase tracking-widest font-bold mb-4">
                  <HiOutlineSparkles />
                  Join Us Today
                </span>
                <h2 className="text-4xl lg:text-5xl font-extrabold text-primary-dark mb-4 tracking-tight leading-tight">
                  Ready to be part of{" "}
                  <span className="text-emerald-dark">Kajla?</span>
                </h2>
                <p className="text-muted text-lg leading-relaxed">
                  Become a member, register your vehicle, or sponsor a road or
                  gate. Your contribution shapes our shared future.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href="/services/membership"
                  className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-gradient-to-r from-primary via-primary-light to-emerald text-white font-semibold rounded-2xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-emerald/30 hover:-translate-y-0.5 transition-all"
                >
                  Become a Member
                  <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-white border-2 border-emerald/30 hover:border-emerald hover:bg-emerald-faint text-emerald-dark font-semibold rounded-2xl transition-all"
                >
                  <FaPhone />
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
