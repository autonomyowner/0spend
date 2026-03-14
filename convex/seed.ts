import { mutation } from "./_generated/server";

const presetPersonas = [
  {
    name: "Sarah K.",
    role: "Impulse Buyer",
    age: 24,
    traits: ["FOMO-driven", "Mobile-first", "Social proof seeker"],
    description:
      "Gen Z consumer who shops on impulse. Responds strongly to urgency, limited offers, and social proof.",
    incomeRange: "$25K-$45K",
    dailyScreenTime: "6+ hrs",
    platformsUsed: ["TikTok", "Instagram", "YouTube"],
    purchaseFrequency: "Weekly impulse",
    adTolerance: "High",
    attentionSpan: "Very short (1-2s)",
    brandAffinityExamples: ["Shein", "Glossier", "CeraVe"],
  },
  {
    name: "Marcus D.",
    role: "Enterprise CTO",
    age: 42,
    traits: ["Data-driven", "Risk-averse", "ROI-focused"],
    description:
      "Senior tech leader who needs hard data before any buying decision. Immune to hype, values specifics.",
    incomeRange: "$200K-$350K",
    dailyScreenTime: "2-3 hrs personal",
    platformsUsed: ["LinkedIn", "YouTube", "X"],
    purchaseFrequency: "Quarterly after evaluation",
    adTolerance: "Very low",
    attentionSpan: "Long for relevant content",
    brandAffinityExamples: ["Datadog", "AWS", "Gartner"],
  },
  {
    name: "Priya L.",
    role: "Budget-Conscious Mom",
    age: 35,
    traits: ["Value-seeker", "Trust-dependent", "Review reader"],
    description:
      "Careful spender who compares thoroughly before purchasing. Fine print and trust signals matter.",
    incomeRange: "$50K-$75K",
    dailyScreenTime: "3-4 hrs",
    platformsUsed: ["Facebook", "Instagram", "Pinterest"],
    purchaseFrequency: "Monthly planned",
    adTolerance: "Medium",
    attentionSpan: "Medium",
    brandAffinityExamples: ["Amazon", "Target", "Costco"],
  },
  {
    name: "Devon R.",
    role: "Trend-Following Creator",
    age: 28,
    traits: ["Aesthetic-driven", "Early adopter", "Brand-conscious"],
    description:
      "Content creator who values visual design and brand identity. Influenced by trends and creator endorsements.",
    incomeRange: "$40K-$80K",
    dailyScreenTime: "8+ hrs",
    platformsUsed: ["Instagram", "TikTok", "YouTube"],
    purchaseFrequency: "Bi-weekly, trend-driven",
    adTolerance: "High for native content",
    attentionSpan: "Short-medium",
    brandAffinityExamples: ["Apple", "Nike", "Notion"],
  },
  {
    name: "Helen W.",
    role: "Retired Professional",
    age: 65,
    traits: ["Skeptical", "Loyalty-driven", "Clear messaging"],
    description:
      "Prefers straightforward messaging. Distrusts flashy marketing and values established brands.",
    incomeRange: "$60K-$90K pension",
    dailyScreenTime: "1-2 hrs",
    platformsUsed: ["Facebook", "YouTube"],
    purchaseFrequency: "Monthly, brand-loyal",
    adTolerance: "Very low",
    attentionSpan: "Long for clear messaging",
    brandAffinityExamples: ["AARP", "Costco", "PBS"],
  },
  {
    name: "James O.",
    role: "Startup Founder",
    age: 31,
    traits: ["Efficiency-obsessed", "Tool-savvy", "Growth-oriented"],
    description:
      "Bootstrapped founder looking for productivity multipliers. Values clear value prop and quick ROI.",
    incomeRange: "$80K-$150K",
    dailyScreenTime: "10+ hrs",
    platformsUsed: ["X", "LinkedIn", "YouTube", "ProductHunt"],
    purchaseFrequency: "Weekly for tools",
    adTolerance: "Medium for B2B",
    attentionSpan: "Short unless ROI clear",
    brandAffinityExamples: ["Stripe", "Notion", "Linear"],
  },
  {
    name: "Aisha M.",
    role: "Social Media Manager",
    age: 27,
    traits: ["Platform-savvy", "Performance-minded", "Creative eye"],
    description:
      "Manages campaigns across 5+ platforms. Evaluates ads from a professional marketer perspective.",
    incomeRange: "$45K-$65K",
    dailyScreenTime: "8+ hrs",
    platformsUsed: ["Instagram", "TikTok", "Facebook", "LinkedIn", "X"],
    purchaseFrequency: "Professional evaluator",
    adTolerance: "High — studies ads professionally",
    attentionSpan: "Analytical, thorough",
    brandAffinityExamples: ["HubSpot", "Canva", "Later"],
  },
  {
    name: "Robert C.",
    role: "CFO",
    age: 48,
    traits: ["Budget-gatekeeper", "Metrics-driven", "Conservative"],
    description:
      "Controls the budget and approves purchases. Needs clear financial justification for every dollar.",
    incomeRange: "$250K-$400K",
    dailyScreenTime: "2 hrs personal",
    platformsUsed: ["LinkedIn", "WSJ"],
    purchaseFrequency: "Quarterly budgets",
    adTolerance: "Very low",
    attentionSpan: "Scans quickly for data",
    brandAffinityExamples: ["Bloomberg", "McKinsey"],
  },
  {
    name: "Lena K.",
    role: "DTC Brand Owner",
    age: 33,
    traits: ["Creative", "Customer-centric", "A/B test believer"],
    description:
      "Runs a direct-to-consumer brand. Understands ads from both creator and consumer perspectives.",
    incomeRange: "$70K-$120K",
    dailyScreenTime: "6+ hrs",
    platformsUsed: ["Instagram", "TikTok", "Facebook"],
    purchaseFrequency: "Studies competitor ads",
    adTolerance: "High — learns from ads",
    attentionSpan: "Medium-long",
    brandAffinityExamples: ["Shopify", "Klaviyo", "Allbirds"],
  },
  {
    name: "Tech Skeptic",
    role: "IT Security Lead",
    age: 39,
    traits: ["Paranoid", "Detail-oriented", "Anti-marketing"],
    description:
      "Actively dislikes being marketed to. Tests how your creative performs with hostile audiences.",
    incomeRange: "$120K-$180K",
    dailyScreenTime: "4 hrs personal",
    platformsUsed: ["Reddit", "HackerNews", "YouTube"],
    purchaseFrequency: "Researches 2+ weeks",
    adTolerance: "Actively hostile",
    attentionSpan: "Zero for marketing content",
    brandAffinityExamples: ["Open source tools", "ThinkPad"],
  },
];

export const seedPersonas = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("personas")
      .withIndex("isPreset", (q) => q.eq("isPreset", true))
      .first();

    if (existing) return "Already seeded";

    for (const persona of presetPersonas) {
      await ctx.db.insert("personas", {
        ...persona,
        isPreset: true,
      });
    }

    return `Seeded ${presetPersonas.length} personas`;
  },
});

export const reseedPersonas = mutation({
  args: {},
  handler: async (ctx) => {
    const existingPresets = await ctx.db
      .query("personas")
      .withIndex("isPreset", (q) => q.eq("isPreset", true))
      .collect();

    let updated = 0;
    for (const existing of existingPresets) {
      const match = presetPersonas.find((p) => p.name === existing.name);
      if (match) {
        await ctx.db.patch(existing._id, {
          incomeRange: match.incomeRange,
          dailyScreenTime: match.dailyScreenTime,
          platformsUsed: match.platformsUsed,
          purchaseFrequency: match.purchaseFrequency,
          adTolerance: match.adTolerance,
          attentionSpan: match.attentionSpan,
          brandAffinityExamples: match.brandAffinityExamples,
          traits: match.traits,
          description: match.description,
        });
        updated++;
      }
    }

    return `Updated ${updated} preset personas with behavioral data`;
  },
});
