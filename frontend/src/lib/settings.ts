import { api } from "./api";
import { getToken } from "./auth";

// ---- Generic setting access ----

export function getSetting(key: string): Promise<string | null> {
  return api<string | null>(`/settings/${key}`);
}

export function updateSetting(key: string, value: string): Promise<string> {
  return api<string>(`/settings/${key}`, {
    method: "PUT",
    body: JSON.stringify({ value }),
    token: getToken() ?? undefined,
  });
}

// ============================================================
// About page — structured, admin-editable content
// ============================================================

export type AboutFocusArea = { title: string; desc: string };

export type AboutContent = {
  heroSubtitle: string;
  introHeading: string;
  introText1: string;
  introText2: string;
  mission: string;
  vision: string;
  focusAreas: AboutFocusArea[];
};

export const ABOUT_DEFAULTS: AboutContent = {
  heroSubtitle:
    "A connected community working together for a safer, stronger, and more caring Kajla.",
  introHeading: "A community built on care and cooperation",
  introText1:
    "Kajla Society works to build a safer, stronger, and more caring community by protecting residents' interests, promoting welfare activities, supporting education and youth counselling, encouraging public interaction, and raising awareness against drugs and social problems.",
  introText2:
    "Through unity and responsible leadership, the society aims to create a better living environment for every family in Kajla.",
  mission:
    "To protect residents' interests, promote welfare, and create a peaceful, secure, and well-organized environment where every family can thrive.",
  vision:
    "A united, drug-free, and progressive Kajla — where neighbours support one another and the next generation grows with discipline and positive values.",
  focusAreas: [
    {
      title: "Community Welfare & Public Support",
      desc: "Working for the welfare of local residents by creating a supportive community network, encouraging public interaction, and helping families address social, educational, and community-related concerns.",
    },
    {
      title: "Youth Counselling & Progress Monitoring",
      desc: "Guiding residents through counselling, awareness programs, and education progress monitoring — so they stay focused on self-improvement, discipline, career development, and positive social values.",
    },
    {
      title: "Drug Awareness & Social Protection",
      desc: "Supporting a drug-free and safe community by raising awareness, encouraging family involvement, identifying social risks, and working with responsible authorities to protect young people and residents.",
    },
  ],
};

export const ABOUT_SETTING_KEY = "about_page";

/** Parse stored JSON, merging with defaults so missing fields stay populated. */
export function parseAboutContent(raw: string | null): AboutContent {
  if (!raw) return ABOUT_DEFAULTS;
  try {
    const parsed = JSON.parse(raw) as Partial<AboutContent>;
    return {
      ...ABOUT_DEFAULTS,
      ...parsed,
      focusAreas:
        Array.isArray(parsed.focusAreas) && parsed.focusAreas.length > 0
          ? parsed.focusAreas
          : ABOUT_DEFAULTS.focusAreas,
    };
  } catch {
    return ABOUT_DEFAULTS;
  }
}

export async function getAboutContent(): Promise<AboutContent> {
  try {
    const raw = await getSetting(ABOUT_SETTING_KEY);
    return parseAboutContent(raw);
  } catch {
    return ABOUT_DEFAULTS;
  }
}
