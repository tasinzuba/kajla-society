import Link from "next/link";
import {
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiOutlineClock,
  HiArrowRight,
} from "react-icons/hi2";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

export function Footer() {
  return (
    <footer className="mt-24 bg-primary-dark text-white relative overflow-hidden">
      {/* Top decorative gradient line */}
      <div className="h-1 bg-gradient-to-r from-secondary via-primary-light to-secondary" />

      {/* ============================================================
         Main grid
      ============================================================ */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
        {/* Brand + about */}
        <div className="lg:col-span-4">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl bg-white text-primary grid place-items-center font-extrabold text-lg shadow-md">
              KS
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight">Kajla Society</div>
              <div className="text-[11px] text-accent uppercase tracking-widest">Est. 1980</div>
            </div>
          </div>
          <p className="text-sm text-white/75 leading-relaxed mb-6 max-w-sm">
            Building a vibrant, connected community where neighbors become
            friends and every member feels at home. Join us in creating lasting
            memories together.
          </p>

          {/* Contact mini list */}
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3 text-white/85">
              <HiOutlineMapPin className="text-accent flex-shrink-0 mt-0.5" size={18} />
              <span>Kajla, Dhaka, Bangladesh</span>
            </li>
            <li className="flex items-start gap-3 text-white/85">
              <HiOutlinePhone className="text-accent flex-shrink-0 mt-0.5" size={18} />
              <a href="tel:+8801XXXXXXXXX" className="hover:text-white transition">
                +880 1XXX-XXXXXX
              </a>
            </li>
            <li className="flex items-start gap-3 text-white/85">
              <HiOutlineEnvelope className="text-accent flex-shrink-0 mt-0.5" size={18} />
              <a href="mailto:info@kajla.org" className="hover:text-white transition">
                info@kajla.org
              </a>
            </li>
            <li className="flex items-start gap-3 text-white/85">
              <HiOutlineClock className="text-accent flex-shrink-0 mt-0.5" size={18} />
              <span>9:00 AM – 5:00 PM</span>
            </li>
          </ul>
        </div>

        {/* Quick links */}
        <div className="lg:col-span-2">
          <h4 className="font-bold mb-5 text-white text-sm uppercase tracking-widest relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-accent">
            Explore
          </h4>
          <ul className="space-y-3 text-sm">
            {[
              { label: "About Us", href: "/about" },
              { label: "Events", href: "/events" },
              { label: "Notice Board", href: "/notices" },
              { label: "Media Gallery", href: "/media" },
              { label: "News", href: "/news" },
              { label: "Contact", href: "/contact" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex items-center gap-1.5 text-white/75 hover:text-accent hover:translate-x-1 transition-all"
                >
                  <span className="text-accent text-[10px]">▸</span>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Community */}
        <div className="lg:col-span-3">
          <h4 className="font-bold mb-5 text-white text-sm uppercase tracking-widest relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-accent">
            Community
          </h4>
          <ul className="space-y-3 text-sm">
            {[
              { label: "Member Directory", href: "/member-directory" },
              { label: "Residence Directory", href: "/residence-directory" },
              { label: "Facilities", href: "/facilities" },
              { label: "Organizations", href: "/organizations" },
              { label: "Photo Gallery", href: "/media/photos" },
              { label: "Video Gallery", href: "/media/videos" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex items-center gap-1.5 text-white/75 hover:text-accent hover:translate-x-1 transition-all"
                >
                  <span className="text-accent text-[10px]">▸</span>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Stay Connected */}
        <div className="lg:col-span-3">
          <h4 className="font-bold mb-5 text-white text-sm uppercase tracking-widest relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-accent">
            Stay Connected
          </h4>
          <p className="text-sm text-white/75 leading-relaxed mb-5">
            Subscribe to community updates, event invites, and important
            society notices straight to your inbox.
          </p>
          <Link
            href="/notices"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg text-sm font-semibold transition-all"
          >
            Browse Notices
            <HiArrowRight className="text-xs" />
          </Link>

          {/* Social */}
          <div className="mt-7">
            <div className="text-[10px] uppercase tracking-widest text-accent font-bold mb-3">
              Follow Us
            </div>
            <div className="flex gap-2">
              {[
                { Icon: FaFacebookF, href: "#", label: "Facebook" },
                { Icon: FaXTwitter, href: "#", label: "X (Twitter)" },
                { Icon: FaInstagram, href: "#", label: "Instagram" },
                { Icon: FaYoutube, href: "#", label: "YouTube" },
                { Icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 grid place-items-center rounded-full bg-white/10 hover:bg-accent hover:text-primary transition-all hover:-translate-y-0.5"
                >
                  <Icon className="text-xs" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
         Bottom strip
      ============================================================ */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/60">
          <div>
            © {new Date().getFullYear()} <span className="text-white">Kajla Society</span>.
            All rights reserved.
          </div>
          <div className="flex flex-wrap gap-5">
            <Link href="/privacy" className="hover:text-accent transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-accent transition">
              Terms of Service
            </Link>
            <Link href="/sitemap" className="hover:text-accent transition">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
