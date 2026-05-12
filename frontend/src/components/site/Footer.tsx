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
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa6";
import { serviceNav, communityNav } from "@/lib/nav";

export function Footer() {
  return (
    <footer className="mt-24 bg-primary-dark text-white relative overflow-hidden">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-secondary via-primary-light to-secondary" />

      {/* Newsletter / call-to-action strip */}
      <div className="bg-primary py-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-2xl lg:text-3xl font-bold mb-1">
              Be part of our community
            </h3>
            <p className="text-accent text-sm">
              Join Kajla Society and stay connected with your neighbors.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link
              href="/services/membership"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-accent transition-all shadow-md"
            >
              Become a Member
              <HiArrowRight />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-5 py-3 border-2 border-white/30 hover:border-white text-white font-semibold rounded-lg transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand & about */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-white text-primary grid place-items-center font-extrabold text-lg shadow-md">
              KS
            </div>
            <div>
              <div className="text-lg font-extrabold">Kajla Society</div>
              <div className="text-[10px] text-accent font-bn">
                কাজলা সোসাইটি
              </div>
            </div>
          </div>
          <p className="text-sm text-white/75 leading-relaxed">
            Building a vibrant, connected community where neighbors become
            friends and every member feels at home.
          </p>

          {/* Social */}
          <div className="flex gap-2 mt-5">
            {[
              { Icon: FaFacebookF, href: "#", label: "Facebook" },
              { Icon: FaTwitter, href: "#", label: "Twitter" },
              { Icon: FaInstagram, href: "#", label: "Instagram" },
              { Icon: FaYoutube, href: "#", label: "YouTube" },
              { Icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 grid place-items-center rounded-full bg-white/10 hover:bg-white hover:text-primary transition-all"
              >
                <Icon className="text-xs" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-bold mb-4 text-white text-sm uppercase tracking-wider">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { label: "About Us", href: "/about" },
              { label: "Member Directory", href: "/member-directory" },
              { label: "Residence Directory", href: "/residence-directory" },
              { label: "Facilities", href: "/facilities" },
              { label: "Organizations", href: "/organizations" },
              { label: "Contact Us", href: "/contact" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-white/75 hover:text-white hover:translate-x-0.5 inline-block transition-all"
                >
                  → {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-bold mb-4 text-white text-sm uppercase tracking-wider">
            Our Services
          </h4>
          <ul className="space-y-2.5 text-sm">
            {serviceNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-white/75 hover:text-white hover:translate-x-0.5 inline-block transition-all"
                >
                  → {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/admin"
                className="text-white/75 hover:text-white hover:translate-x-0.5 inline-block transition-all"
              >
                → Admin Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold mb-4 text-white text-sm uppercase tracking-wider">
            Contact Info
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3 text-white/75">
              <HiOutlineMapPin className="text-accent flex-shrink-0 mt-0.5" size={18} />
              <span>Kajla, Dhaka, Bangladesh</span>
            </li>
            <li className="flex items-start gap-3 text-white/75">
              <HiOutlinePhone className="text-accent flex-shrink-0 mt-0.5" size={18} />
              <a href="tel:+8801XXXXXXXXX" className="hover:text-white">
                +880 1XXX-XXXXXX
              </a>
            </li>
            <li className="flex items-start gap-3 text-white/75">
              <HiOutlineEnvelope className="text-accent flex-shrink-0 mt-0.5" size={18} />
              <a href="mailto:info@kajla.org" className="hover:text-white">
                info@kajla.org
              </a>
            </li>
            <li className="flex items-start gap-3 text-white/75">
              <HiOutlineClock className="text-accent flex-shrink-0 mt-0.5" size={18} />
              <span>9:00 AM – 5:00 PM</span>
            </li>
          </ul>

          {/* Community quick links */}
          <h4 className="font-bold mt-6 mb-3 text-white text-xs uppercase tracking-wider">
            Community
          </h4>
          <ul className="space-y-2 text-xs">
            {communityNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-white/70 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/60">
          <div>© {new Date().getFullYear()} Kajla Society. All rights reserved.</div>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
