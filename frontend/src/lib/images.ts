/**
 * Curated stock image URLs (Unsplash) used as defaults across the site.
 * These can be overridden when admin uploads custom images.
 */

const u = (id: string, w = 1600, q = 80) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;

export const stockImages = {
  // Heroes & banners
  heroHome: u("1486325212027-8081e485255e"),         // modern residential community
  heroAbout: u("1582407947304-fd86f028f716"),         // community gathering
  heroEvents: u("1511795409834-ef04bbd61622"),        // event/celebration
  heroFacilities: u("1486406146926-c627a92ad1ab"),    // city/neighborhood
  heroMembers: u("1531058020387-3be344556be6"),       // team meeting
  heroResidents: u("1568605114967-8130f3a36994"),     // residential houses
  heroNotices: u("1586281380349-632531db7ed4"),       // bulletin
  heroMedia: u("1542038784456-1ea8e935640e"),         // camera photos
  heroOrganizations: u("1521737604893-d14cc237f11d"), // team handshake
  heroContact: u("1497366216548-37526070297c"),       // office desk

  // Hero collage (used together)
  collageMain: u("1568605114967-8130f3a36994", 900),     // residential houses
  collageSmall1: u("1582407947304-fd86f028f716", 600),   // community gathering
  collageSmall2: u("1517245386807-bb43f82c33c4", 600),   // happy people
  collageSmall3: u("1531058020387-3be344556be6", 600),   // team meeting

  // Mission section
  missionImage: u("1559027615-cd4628902d4a", 1000),       // green park / nature

  // Card fallbacks
  defaultArticle: u("1499750310107-5fef28a66643", 800),
  defaultEvent: u("1492684223066-81342ee5ff30", 800),
  defaultFacility: u("1497366754035-f200968a6e72", 800),

  // Testimonial avatars
  avatar1: u("1494790108377-be9c29b29330", 200),
  avatar2: u("1507003211169-0a1dd7228f2d", 200),
  avatar3: u("1438761681033-6461ffad8d80", 200),

  // Login background
  loginBg: u("1519681393784-d120267933ba"),
};

/** Build an Unsplash URL on the fly */
export function unsplashUrl(id: string, w = 1600, q = 80): string {
  return u(id, w, q);
}
