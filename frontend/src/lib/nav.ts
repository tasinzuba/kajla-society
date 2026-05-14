export type NavItem = {
  label: string;
  labelBn?: string;
  href: string;
  description?: string;
  children?: NavItem[];
};

export const mainNav: NavItem[] = [
  { label: "Home", labelBn: "হোম", href: "/" },

  { label: "About Us", labelBn: "আমাদের সম্পর্কে", href: "/about" },

  {
    label: "Directory",
    labelBn: "তালিকা",
    href: "/member-directory",
    children: [
      {
        label: "Member Directory",
        labelBn: "সদস্য তালিকা",
        href: "/member-directory",
        description: "Executive committee members — present and past.",
      },
      {
        label: "Residence Directory",
        labelBn: "বাসিন্দা তালিকা",
        href: "/residence-directory",
        description: "Search residents by name, house, road, or block.",
      },
    ],
  },

  {
    label: "Facilities",
    labelBn: "সুবিধাসমূহ",
    href: "/facilities",
    children: [
      {
        label: "All Facilities",
        href: "/facilities",
        description: "Browse every facility by category.",
      },
      { label: "Religious Places", href: "/facilities#religious" },
      { label: "Educational Institutions", href: "/facilities#educational" },
      { label: "Health & Emergency", href: "/facilities#health" },
      { label: "Construction Services", href: "/facilities#construction" },
      { label: "Local Services", href: "/facilities#local" },
      { label: "Government Facilities", href: "/facilities#government" },
    ],
  },

  { label: "Organizations", labelBn: "সংগঠন", href: "/organizations" },

  {
    label: "Media",
    labelBn: "মিডিয়া",
    href: "/media",
    children: [
      {
        label: "All Media",
        href: "/media",
        description: "Photo and video albums in one view.",
      },
      {
        label: "Photo Gallery",
        href: "/media/photos",
        description: "Event photo albums.",
      },
      {
        label: "Video Gallery",
        href: "/media/videos",
        description: "Recorded videos and clips.",
      },
      {
        label: "News & Articles",
        href: "/news",
        description: "Stories and updates.",
      },
    ],
  },

  { label: "Events", labelBn: "ইভেন্ট", href: "/events" },

  { label: "Notice", labelBn: "নোটিশ", href: "/notices" },

  {
    label: "Services",
    labelBn: "সেবা",
    href: "/services/membership",
    children: [
      {
        label: "Membership Registration",
        href: "/services/membership",
        description: "Apply to join Kajla Society.",
      },
      {
        label: "Car Sticker Application",
        href: "/services/car-sticker",
        description: "Vehicle access sticker for residents.",
      },
      {
        label: "Adopt a Road",
        href: "/services/adopt-road",
        description: "Sponsor road maintenance.",
      },
      {
        label: "Adopt a Gate",
        href: "/services/adopt-gate",
        description: "Sponsor a society gate.",
      },
    ],
  },

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
