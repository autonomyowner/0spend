export type Platform =
  | "facebook"
  | "instagram"
  | "tiktok"
  | "google_ads"
  | "linkedin"
  | "youtube"
  | "x"
  | "generic";

export type Objective =
  | "awareness"
  | "consideration"
  | "conversion"
  | "app_installs"
  | "lead_gen";

interface PlatformData {
  label: string;
  maxPrimaryText: number;
  maxHeadline: number;
  maxDescription: number;
  aspectRatios: string[];
  bestPractices: string[];
  audienceCharacteristics: string;
}

interface ObjectiveData {
  label: string;
  scoringFocus: string;
  keyMetrics: string[];
  guidance: string;
}

export const PLATFORMS: Record<Platform, PlatformData> = {
  facebook: {
    label: "Facebook",
    maxPrimaryText: 125,
    maxHeadline: 40,
    maxDescription: 30,
    aspectRatios: ["1:1", "4:5", "16:9"],
    bestPractices: [
      "Lead with the value proposition in the first line of primary text",
      "Use faces and people for higher engagement",
      "Mobile-first — 98% of users access via mobile",
      "Text overlay should cover <20% of the image",
      "Carousel and video outperform static images on average",
    ],
    audienceCharacteristics:
      "Broad demographics skewing 25-54. Users scroll quickly — you have ~1.7 seconds to grab attention. High ad density in feed means competition for eyeballs.",
  },
  instagram: {
    label: "Instagram",
    maxPrimaryText: 125,
    maxHeadline: 40,
    maxDescription: 30,
    aspectRatios: ["1:1", "4:5", "9:16"],
    bestPractices: [
      "Visual-first — image quality matters more than text",
      "Aesthetic consistency with brand feed",
      "Reels outperform static posts for reach",
      "Stories ads: place CTA in the bottom third",
      "Use native-looking content over polished ads",
    ],
    audienceCharacteristics:
      "Younger demographics (18-34). Highly visual audience. Users expect polished aesthetics. Strong influencer culture — native-feeling content outperforms overt ads.",
  },
  tiktok: {
    label: "TikTok",
    maxPrimaryText: 100,
    maxHeadline: 34,
    maxDescription: 40,
    aspectRatios: ["9:16"],
    bestPractices: [
      "Hook in the first 1 second — not 3",
      "Vertical format only (9:16)",
      "Lo-fi, creator-style content outperforms polished ads",
      "Use trending audio and transitions",
      "Text overlays with fast pacing",
      "CTA should feel natural, not salesy",
    ],
    audienceCharacteristics:
      "Gen Z and young millennials. Extremely short attention spans (~1s to decide). Reward authenticity and humor. Algorithm-driven discovery — creative quality is the targeting.",
  },
  google_ads: {
    label: "Google Ads",
    maxPrimaryText: 90,
    maxHeadline: 30,
    maxDescription: 90,
    aspectRatios: ["1.91:1", "1:1"],
    bestPractices: [
      "Headline must match search intent",
      "Include the primary keyword in the headline",
      "Clear, specific value proposition",
      "Use numbers and statistics for credibility",
      "Strong CTA with urgency or specificity",
    ],
    audienceCharacteristics:
      "High-intent users actively searching. They want relevance and speed. Display ads have lower engagement than search — visual must be immediately clear.",
  },
  linkedin: {
    label: "LinkedIn",
    maxPrimaryText: 150,
    maxHeadline: 70,
    maxDescription: 100,
    aspectRatios: ["1.91:1", "1:1", "4:5"],
    bestPractices: [
      "Professional tone — avoid hype and clickbait",
      "Thought leadership content outperforms hard sells",
      "Use data points and metrics in copy",
      "Document-style posts and carousels perform well",
      "Targeting is precise — speak to the specific role",
    ],
    audienceCharacteristics:
      "B2B professionals, decision-makers. Higher education and income. Skeptical of marketing fluff — want substance. Longer form content is acceptable.",
  },
  youtube: {
    label: "YouTube",
    maxPrimaryText: 100,
    maxHeadline: 100,
    maxDescription: 100,
    aspectRatios: ["16:9", "1:1", "9:16"],
    bestPractices: [
      "First 5 seconds are everything (pre-roll skip threshold)",
      "Show the brand/product in the first 5 seconds",
      "Thumbnail must be scroll-stopping",
      "For Shorts: same rules as TikTok (vertical, fast-paced)",
      "End card CTAs drive click-through",
    ],
    audienceCharacteristics:
      "Broad audience. Users have higher intent to watch (vs. scroll). Pre-roll ads must hook before Skip button appears at 5s. Longer attention span than social feeds.",
  },
  x: {
    label: "X (Twitter)",
    maxPrimaryText: 280,
    maxHeadline: 70,
    maxDescription: 200,
    aspectRatios: ["16:9", "1:1"],
    bestPractices: [
      "Concise, punchy copy — every word counts",
      "Controversy and strong opinions get engagement",
      "Use threads for longer narratives",
      "Video auto-plays in feed — hook immediately",
      "Hashtags can help discovery but don't overuse",
    ],
    audienceCharacteristics:
      "News-oriented, opinionated users. Tech-savvy early adopters. Fast-moving feed — content has short lifespan. Users value wit and directness.",
  },
  generic: {
    label: "Generic / Multi-Platform",
    maxPrimaryText: 150,
    maxHeadline: 40,
    maxDescription: 90,
    aspectRatios: ["1:1", "4:5", "16:9", "9:16"],
    bestPractices: [
      "Mobile-first design",
      "Clear visual hierarchy",
      "Strong, contrasting CTA",
      "Minimal text overlay",
      "Consistent brand identity",
    ],
    audienceCharacteristics:
      "Mixed audience. Optimize for the most common denominator: mobile viewing, short attention spans, clear messaging.",
  },
};

export const OBJECTIVES: Record<Objective, ObjectiveData> = {
  awareness: {
    label: "Brand Awareness",
    scoringFocus:
      "Brand recall, visual memorability, emotional connection. Less emphasis on CTA strength.",
    keyMetrics: ["Hook Strength", "Emotional Impact", "Brand Alignment"],
    guidance:
      "For awareness campaigns, prioritize memorability over direct response. The creative should make the brand/product stick in memory even without a click.",
  },
  consideration: {
    label: "Consideration",
    scoringFocus:
      "Information clarity, benefit communication, trust-building. Balanced emphasis on all metrics.",
    keyMetrics: [
      "Visual Clarity",
      "Emotional Impact",
      "Hook Strength",
      "CTA Power",
    ],
    guidance:
      "For consideration campaigns, the creative should educate and build interest. Clear benefits, social proof, and credibility markers matter most.",
  },
  conversion: {
    label: "Conversion",
    scoringFocus:
      "CTA prominence, urgency, friction reduction. CTA Power and Hook Strength weighted heavily.",
    keyMetrics: ["CTA Power", "Hook Strength", "Visual Clarity"],
    guidance:
      "For conversion campaigns, every element should drive toward the action. Strong CTA, clear value proposition, and urgency/scarcity signals.",
  },
  app_installs: {
    label: "App Installs",
    scoringFocus:
      "App value demonstration, UI preview clarity, platform store badges. CTA must say 'Install' or 'Download'.",
    keyMetrics: ["CTA Power", "Visual Clarity", "Hook Strength"],
    guidance:
      "For app install campaigns, show the app in action. Include device mockups, highlight key features, and make the install CTA unmistakable.",
  },
  lead_gen: {
    label: "Lead Generation",
    scoringFocus:
      "Trust signals, value exchange clarity (what they get for submitting info), form friction awareness.",
    keyMetrics: [
      "CTA Power",
      "Visual Clarity",
      "Brand Alignment",
      "Emotional Impact",
    ],
    guidance:
      "For lead gen campaigns, clearly communicate what the user gets in exchange for their information. Trust badges, privacy reassurance, and a compelling offer are critical.",
  },
};

export function buildPlatformContext(
  platform?: string,
  objective?: string
): string {
  const parts: string[] = [];

  const p = PLATFORMS[(platform as Platform) || "generic"] || PLATFORMS.generic;
  parts.push(`## Platform: ${p.label}`);
  parts.push(`Character limits: Primary text ${p.maxPrimaryText} chars, Headline ${p.maxHeadline} chars, Description ${p.maxDescription} chars.`);
  parts.push(`Recommended aspect ratios: ${p.aspectRatios.join(", ")}`);
  parts.push(`Best practices:\n${p.bestPractices.map((bp) => `- ${bp}`).join("\n")}`);
  parts.push(`Audience: ${p.audienceCharacteristics}`);

  if (objective) {
    const o = OBJECTIVES[objective as Objective];
    if (o) {
      parts.push(`\n## Campaign Objective: ${o.label}`);
      parts.push(`Scoring focus: ${o.scoringFocus}`);
      parts.push(`Key metrics to weight more heavily: ${o.keyMetrics.join(", ")}`);
      parts.push(`Guidance: ${o.guidance}`);
    }
  }

  return parts.join("\n");
}
