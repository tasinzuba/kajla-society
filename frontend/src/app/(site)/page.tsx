import Link from "next/link";
import {
  HiOutlineUsers,
  HiOutlineCalendarDays,
  HiOutlineSparkles,
  HiOutlineUserGroup,
  HiArrowRight,
  HiOutlineMapPin,
  HiOutlineDocumentText,
  HiOutlineNewspaper,
  HiOutlineClipboardDocumentCheck,
  HiOutlineIdentification,
  HiOutlineTruck,
  HiOutlineMap,
} from "react-icons/hi2";
import {
  FaMosque,
  FaGraduationCap,
  FaHospital,
  FaHelmetSafety,
  FaCartShopping,
  FaLandmark,
  FaHandshake,
  FaPhone,
} from "react-icons/fa6";
import { stockImages } from "@/lib/images";

export default function HomePage() {
  return (
    <>
      {/* ===========================================================
         HERO
      =========================================================== */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={stockImages.heroHome}
          alt="Kajla community"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/95 via-primary/85 to-primary/60" />
        <div className="absolute inset-0 bg-pattern-dots opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white animate-fade-up">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur border border-white/20 rounded-full text-xs uppercase tracking-widest text-accent mb-5">
              <HiOutlineSparkles />
              Welcome to Kajla Society
            </span>
            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] mb-4 tracking-tight">
              Building a vibrant <br />
              <span className="text-accent">connected community</span>
            </h1>
            <p className="text-lg lg:text-xl text-accent font-bn mb-6 leading-relaxed" lang="bn">
              একটি প্রাণবন্ত, সংযুক্ত সমাজ
            </p>
            <p className="text-base lg:text-lg text-white/85 leading-relaxed mb-8 max-w-xl">
              Where neighbors become friends and every member feels at home.
              Join us in creating lasting memories together.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/services/membership"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-primary font-semibold rounded-xl hover:bg-accent transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
              >
                Become a Member
                <HiArrowRight />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center px-6 py-3.5 border-2 border-white/30 backdrop-blur hover:border-white hover:bg-white/10 text-white font-semibold rounded-xl transition"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { Icon: HiOutlineUsers, num: "1,200+", label: "Residents" },
              { Icon: HiOutlineCalendarDays, num: "45", label: "Years strong" },
              { Icon: HiOutlineSparkles, num: "30+", label: "Events / year" },
              { Icon: HiOutlineUserGroup, num: "12", label: "Committees" },
            ].map((s) => (
              <div
                key={s.label}
                className="glass rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all hover:-translate-y-1"
              >
                <s.Icon className="text-3xl text-accent mb-3" />
                <div className="text-3xl lg:text-4xl font-extrabold text-white">
                  {s.num}
                </div>
                <div className="text-sm text-white/80 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* ===========================================================
         OUR GOALS
      =========================================================== */}
      <section className="py-20 bg-background relative">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="inline-block px-3 py-1 bg-accent text-primary text-xs uppercase tracking-widest rounded-full font-semibold mb-4">
            Our Mission
          </span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-primary mb-3 tracking-tight">
            Our Goals
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-8 rounded-full" />
          <p className="text-lg leading-relaxed text-foreground/85 max-w-3xl mx-auto">
            <strong className="text-primary">Kajla Society</strong> offers
            advocacy, coordination, and leadership to protect property
            interests, improve the living environment, and enhance community
            livability. We promote fellowship among residents through social,
            cultural, and advocacy activities.
          </p>
          <p
            className="text-base leading-relaxed text-foreground/85 mt-5 font-bn max-w-3xl mx-auto"
            lang="bn"
          >
            কাজলা সোসাইটি সম্পত্তির স্বার্থ সংরক্ষণ, আবাসিক পরিবেশের উন্নয়ন এবং
            এলাকার বসবাসযোগ্যতা বৃদ্ধির লক্ষ্যে অ্যাডভোকেসি, সমন্বয় ও নেতৃত্ব
            প্রদান করে।
          </p>
        </div>
      </section>

      {/* ===========================================================
         FACILITIES
      =========================================================== */}
      <section className="py-20 bg-cream relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-white text-primary text-xs uppercase tracking-widest rounded-full font-semibold mb-4 shadow-sm">
              Explore
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-primary mb-3 tracking-tight">
              Community Facilities
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
            <p className="text-muted mt-4 max-w-xl mx-auto">
              Everything our residents need — close to home.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { Icon: FaMosque, title: "Religious Places", href: "/facilities#religious", color: "from-blue-500 to-blue-700" },
              { Icon: FaGraduationCap, title: "Educational", href: "/facilities#educational", color: "from-sky-500 to-blue-600" },
              { Icon: FaHospital, title: "Health & Emergency", href: "/facilities#health", color: "from-blue-600 to-blue-800" },
              { Icon: FaHelmetSafety, title: "Construction", href: "/facilities#construction", color: "from-cyan-500 to-blue-700" },
              { Icon: FaCartShopping, title: "Local Services", href: "/facilities#local", color: "from-blue-500 to-indigo-700" },
              { Icon: FaLandmark, title: "Government", href: "/facilities#government", color: "from-indigo-500 to-blue-800" },
              { Icon: FaHandshake, title: "Organizations", href: "/organizations", color: "from-sky-500 to-indigo-700" },
              { Icon: FaPhone, title: "Emergency Contacts", href: "/contact", color: "from-blue-700 to-blue-900" },
            ].map(({ Icon, title, href, color }) => (
              <Link
                key={title}
                href={href}
                className="group bg-white border border-border rounded-2xl p-6 text-center hover:border-secondary hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div
                  className={`w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${color} grid place-items-center text-white text-2xl shadow-md group-hover:scale-110 transition-transform`}
                >
                  <Icon />
                </div>
                <div className="font-semibold text-primary group-hover:text-secondary text-sm transition-colors">
                  {title}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===========================================================
         SERVICES
      =========================================================== */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-accent text-primary text-xs uppercase tracking-widest rounded-full font-semibold mb-4">
              Apply Online
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-primary mb-3 tracking-tight">
              Our Services
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                Icon: HiOutlineIdentification,
                title: "Membership Registration",
                desc: "Join the Kajla Society community.",
                href: "/services/membership",
              },
              {
                Icon: HiOutlineTruck,
                title: "Car Sticker Application",
                desc: "Apply for resident vehicle sticker.",
                href: "/services/car-sticker",
              },
              {
                Icon: HiOutlineMap,
                title: "Adopt a Road",
                desc: "Sponsor a road for maintenance.",
                href: "/services/adopt-road",
              },
              {
                Icon: HiOutlineMapPin,
                title: "Adopt a Gate",
                desc: "Support our security infrastructure.",
                href: "/services/adopt-gate",
              },
            ].map(({ Icon, title, desc, href }) => (
              <Link
                key={href}
                href={href}
                className="group relative block bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors" />
                <Icon className="text-4xl text-accent mb-4 relative" />
                <h3 className="font-bold text-lg mb-1 relative">{title}</h3>
                <p className="text-sm text-white/80 mb-4 relative">{desc}</p>
                <span className="inline-flex items-center gap-1.5 text-xs text-accent group-hover:gap-2.5 transition-all relative">
                  Apply now <HiArrowRight />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===========================================================
         LATEST ACTIVITY
      =========================================================== */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-white text-primary text-xs uppercase tracking-widest rounded-full font-semibold mb-4 shadow-sm">
              Stay Updated
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-primary mb-3 tracking-tight">
              What&apos;s Happening
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                Icon: HiOutlineDocumentText,
                title: "Latest Notices",
                desc: "Official notices and circulars from the society.",
                href: "/notices",
                color: "bg-blue-100 text-blue-700",
              },
              {
                Icon: HiOutlineCalendarDays,
                title: "Upcoming Events",
                desc: "Mark your calendar — community events ahead.",
                href: "/events",
                color: "bg-indigo-100 text-indigo-700",
              },
              {
                Icon: HiOutlineUserGroup,
                title: "Organizations",
                desc: "Community-led groups and associations.",
                href: "/organizations",
                color: "bg-sky-100 text-sky-700",
              },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="bg-white border border-border rounded-2xl p-8 hover:shadow-xl transition-all hover:-translate-y-1 group"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${c.color} grid place-items-center text-2xl mb-4`}
                >
                  <c.Icon />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-secondary transition">
                  {c.title}
                </h3>
                <p className="text-sm text-muted mb-4">{c.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                  View all <HiArrowRight />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===========================================================
         CTA STRIP
      =========================================================== */}
      <section className="py-16 bg-primary-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-20" />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <HiOutlineNewspaper className="text-5xl text-accent mx-auto mb-4" />
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-3 tracking-tight">
            Have a question or suggestion?
          </h2>
          <p className="text-accent text-lg mb-6">
            We&apos;d love to hear from you.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-primary font-semibold rounded-xl hover:bg-accent transition-all shadow-xl"
          >
            <HiOutlineClipboardDocumentCheck />
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
