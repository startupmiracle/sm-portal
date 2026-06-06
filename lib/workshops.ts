export type WorkshopConfig = {
  slug: string;
  name: string;
  partner: string;
  /** Card / list thumbnail image */
  image: string;
  /** Slide Deck cover image shown in the portal Slide Deck tab */
  deckImage: string;
  /** When true, the Slide Deck tab shows a "Coming Soon" state instead of the live deck */
  comingSoon: boolean;
};

export const DEFAULT_WORKSHOP_SLUG = "claude-smb-area";

export const WORKSHOPS: Record<string, WorkshopConfig> = {
  "claude-smb-area": {
    slug: "claude-smb-area",
    name: "Claude SMB Workshop",
    partner: "Area Centre",
    image:
      "https://res.cloudinary.com/dy7cv4bih/image/upload/v1779932103/SM-Area-workshop-AI_for_SMB-Claude_c8rfvc.png",
    deckImage: "/sm-workshop-assets/workshop-header.jpg",
    comingSoon: false,
  },
  "hermes-first-ai-employee": {
    slug: "hermes-first-ai-employee",
    name: "Hire Your First AI Employee: Hermes",
    partner: "Area Centre",
    image: "/sm-workshop-assets/workshop-hermes.jpg",
    deckImage: "/sm-workshop-assets/workshop-hermes.jpg",
    comingSoon: true,
  },
  "rank-higher-google-chatgpt": {
    slug: "rank-higher-google-chatgpt",
    name: "Rank Higher in Google and Get ChatGPT Visibility on Autopilot",
    partner: "Startup Miracle",
    image: "/sm-workshop-assets/workshop-seo.jpg",
    deckImage: "/sm-workshop-assets/workshop-seo.jpg",
    comingSoon: true,
  },
  "digital-twin-heygen": {
    slug: "digital-twin-heygen",
    name: "How To Create Your Digital Twin with HeyGen",
    partner: "Startup Miracle",
    image: "/sm-workshop-assets/workshop-digital-twin.jpg",
    deckImage: "/sm-workshop-assets/workshop-digital-twin.jpg",
    comingSoon: true,
  },
  "ugc-videos-ai": {
    slug: "ugc-videos-ai",
    name: "Mastering UGC Videos with Claude, ChatGPT & Higgsfield",
    partner: "Startup Miracle",
    image: "/sm-workshop-assets/workshop-ugc.jpg",
    deckImage: "/sm-workshop-assets/workshop-ugc.jpg",
    comingSoon: true,
  },
};

export function getWorkshop(slug: string | null | undefined): WorkshopConfig {
  return WORKSHOPS[slug || DEFAULT_WORKSHOP_SLUG] || WORKSHOPS[DEFAULT_WORKSHOP_SLUG];
}
