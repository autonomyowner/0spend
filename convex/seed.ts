import { mutation } from "./_generated/server";

const presetPersonas = [
  {
    name: "Sarah K.",
    role: "Impulse Buyer",
    age: 24,
    traits: ["FOMO-driven", "Mobile-first", "Social proof seeker"],
    description:
      "Gen Z consumer who shops on impulse. Responds strongly to urgency, limited offers, and social proof.",
  },
  {
    name: "Marcus D.",
    role: "Enterprise CTO",
    age: 42,
    traits: ["Data-driven", "Risk-averse", "ROI-focused"],
    description:
      "Senior tech leader who needs hard data before any buying decision. Immune to hype, values specifics.",
  },
  {
    name: "Priya L.",
    role: "Budget-Conscious Mom",
    age: 35,
    traits: ["Value-seeker", "Trust-dependent", "Review reader"],
    description:
      "Careful spender who compares thoroughly before purchasing. Fine print and trust signals matter.",
  },
  {
    name: "Devon R.",
    role: "Trend-Following Creator",
    age: 28,
    traits: ["Aesthetic-driven", "Early adopter", "Brand-conscious"],
    description:
      "Content creator who values visual design and brand identity. Influenced by trends and creator endorsements.",
  },
  {
    name: "Helen W.",
    role: "Retired Professional",
    age: 65,
    traits: ["Skeptical", "Loyalty-driven", "Clear messaging"],
    description:
      "Prefers straightforward messaging. Distrusts flashy marketing and values established brands.",
  },
  {
    name: "James O.",
    role: "Startup Founder",
    age: 31,
    traits: ["Efficiency-obsessed", "Tool-savvy", "Growth-oriented"],
    description:
      "Bootstrapped founder looking for productivity multipliers. Values clear value prop and quick ROI.",
  },
  {
    name: "Aisha M.",
    role: "Social Media Manager",
    age: 27,
    traits: ["Platform-savvy", "Performance-minded", "Creative eye"],
    description:
      "Manages campaigns across 5+ platforms. Evaluates ads from a professional marketer perspective.",
  },
  {
    name: "Robert C.",
    role: "CFO",
    age: 48,
    traits: ["Budget-gatekeeper", "Metrics-driven", "Conservative"],
    description:
      "Controls the budget and approves purchases. Needs clear financial justification for every dollar.",
  },
  {
    name: "Lena K.",
    role: "DTC Brand Owner",
    age: 33,
    traits: ["Creative", "Customer-centric", "A/B test believer"],
    description:
      "Runs a direct-to-consumer brand. Understands ads from both creator and consumer perspectives.",
  },
  {
    name: "Tech Skeptic",
    role: "IT Security Lead",
    age: 39,
    traits: ["Paranoid", "Detail-oriented", "Anti-marketing"],
    description:
      "Actively dislikes being marketed to. Tests how your creative performs with hostile audiences.",
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
