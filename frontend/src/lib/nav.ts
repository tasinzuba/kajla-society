export type NavItem = {
  label: string;
  labelBn?: string;
  href: string;
  children?: NavItem[];
};

export const mainNav: NavItem[] = [
  { label: "Home", labelBn: "হোম", href: "/" },
  { label: "About Us", labelBn: "আমাদের সম্পর্কে", href: "/about" },
  { label: "Member Directory", labelBn: "সদস্য তালিকা", href: "/member-directory" },
  { label: "Residence Directory", labelBn: "বাসিন্দা তালিকা", href: "/residence-directory" },
  { label: "Facilities", labelBn: "সুবিধাসমূহ", href: "/facilities" },
  { label: "Organizations", labelBn: "সংগঠন", href: "/organizations" },
  { label: "Media", labelBn: "মিডিয়া", href: "/media" },
  { label: "Events", labelBn: "ইভেন্ট", href: "/events" },
  { label: "Notice", labelBn: "নোটিশ", href: "/notices" },
  { label: "Contact", labelBn: "যোগাযোগ", href: "/contact" },
];

export const serviceNav: NavItem[] = [
  { label: "Membership Registration", href: "/services/membership" },
  { label: "Car Sticker Application", href: "/services/car-sticker" },
  { label: "Adopt a Road", href: "/services/adopt-road" },
  { label: "Adopt a Gate", href: "/services/adopt-gate" },
];

export const communityNav: NavItem[] = [
  { label: "Upcoming Events", href: "/events" },
  { label: "Photo Gallery", href: "/media/photos" },
  { label: "Video Gallery", href: "/media/videos" },
  { label: "Community News", href: "/news" },
];
