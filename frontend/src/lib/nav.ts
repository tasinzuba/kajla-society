export type NavItem = {
  label: string;
  labelBn?: string;
  href: string;
  description?: string;
  children?: NavItem[];
};

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },

  { label: "About", href: "/about" },

  { label: "Members", href: "/member-directory" },

  { label: "Residents", href: "/residence-directory" },

  {
    label: "Facilities",
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

  { label: "Organizations", href: "/organizations" },

  {
    label: "Media",
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

  { label: "Events", href: "/events" },

  { label: "Notice", href: "/notices" },
];

export const communityNav: NavItem[] = [
  { label: "Upcoming Events", href: "/events" },
  { label: "Photo Gallery", href: "/media/photos" },
  { label: "Video Gallery", href: "/media/videos" },
  { label: "Community News", href: "/news" },
];
