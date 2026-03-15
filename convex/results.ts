import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthenticatedAppUser } from "./auth";

// --- Internal mutations (called from AI pipeline) ---

export const savePersonaFeedback = internalMutation({
  args: {
    testId: v.id("tests"),
    personaId: v.optional(v.id("personas")),
    personaName: v.string(),
    personaRole: v.string(),
    score: v.number(),
    sentiment: v.union(
      v.literal("positive"),
      v.literal("neutral"),
      v.literal("negative")
    ),
    reaction: v.string(),
    highlights: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("personaFeedbacks", args);
  },
});

export const saveDebate = internalMutation({
  args: {
    testId: v.id("tests"),
    exchanges: v.array(
      v.object({
        agent: v.union(
          v.literal("buyer"),
          v.literal("skeptic"),
          v.literal("verdict")
        ),
        text: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("debates", args);
  },
});

export const saveHeatmap = internalMutation({
  args: {
    testId: v.id("tests"),
    zones: v.array(
      v.object({
        label: v.string(),
        attention: v.number(),
        x: v.number(),
        y: v.number(),
        w: v.number(),
        h: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("heatmaps", args);
  },
});

export const saveFixIts = internalMutation({
  args: {
    testId: v.id("tests"),
    suggestions: v.array(
      v.object({
        element: v.string(),
        current: v.string(),
        suggested: v.string(),
        impact: v.union(
          v.literal("high"),
          v.literal("medium"),
          v.literal("low")
        ),
      })
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("fixIts", args);
  },
});

export const saveBenchmarks = internalMutation({
  args: {
    testId: v.id("tests"),
    entries: v.array(
      v.object({
        metric: v.string(),
        yours: v.number(),
        average: v.number(),
        topPerformer: v.number(),
        source: v.optional(v.string()),
        confidence: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("benchmarks", args);
  },
});

export const saveEmotionalProfile = internalMutation({
  args: {
    testId: v.id("tests"),
    emotions: v.array(
      v.object({
        emotion: v.string(),
        intensity: v.number(),
        confidence: v.optional(v.string()),
      })
    ),
    dominantEmotion: v.string(),
    emotionalTone: v.string(),
    recommendations: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("emotionalProfiles", args);
  },
});

export const savePredictedPerformance = internalMutation({
  args: {
    testId: v.id("tests"),
    predictions: v.array(
      v.object({
        metric: v.string(),
        value: v.number(),
        unit: v.string(),
        benchmarkAvg: v.number(),
        benchmarkTop: v.number(),
        percentile: v.number(),
        reasoning: v.string(),
      })
    ),
    overallVerdict: v.string(),
    spendEfficiency: v.string(),
    confidence: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("predictedPerformance", args);
  },
});

// --- Auth helper: verify user owns the test ---

async function verifyTestOwnership(
  ctx: any,
  testId: any
): Promise<boolean> {
  const user = await getAuthenticatedAppUser(ctx);
  if (!user) return false;
  const test = await ctx.db.get(testId);
  if (!test || test.userId !== user._id) return false;
  return true;
}

// --- Public queries (all with auth + ownership checks) ---

export const getPersonaFeedbacks = query({
  args: { testId: v.id("tests") },
  handler: async (ctx, args) => {
    if (!(await verifyTestOwnership(ctx, args.testId))) return [];
    return await ctx.db
      .query("personaFeedbacks")
      .withIndex("testId", (q) => q.eq("testId", args.testId))
      .collect();
  },
});

export const getDebate = query({
  args: { testId: v.id("tests") },
  handler: async (ctx, args) => {
    if (!(await verifyTestOwnership(ctx, args.testId))) return null;
    return await ctx.db
      .query("debates")
      .withIndex("testId", (q) => q.eq("testId", args.testId))
      .first();
  },
});

export const getHeatmap = query({
  args: { testId: v.id("tests") },
  handler: async (ctx, args) => {
    if (!(await verifyTestOwnership(ctx, args.testId))) return null;
    return await ctx.db
      .query("heatmaps")
      .withIndex("testId", (q) => q.eq("testId", args.testId))
      .first();
  },
});

export const getFixIts = query({
  args: { testId: v.id("tests") },
  handler: async (ctx, args) => {
    if (!(await verifyTestOwnership(ctx, args.testId))) return null;
    return await ctx.db
      .query("fixIts")
      .withIndex("testId", (q) => q.eq("testId", args.testId))
      .first();
  },
});

export const getBenchmarks = query({
  args: { testId: v.id("tests") },
  handler: async (ctx, args) => {
    if (!(await verifyTestOwnership(ctx, args.testId))) return null;
    return await ctx.db
      .query("benchmarks")
      .withIndex("testId", (q) => q.eq("testId", args.testId))
      .first();
  },
});

export const getEmotionalProfile = query({
  args: { testId: v.id("tests") },
  handler: async (ctx, args) => {
    if (!(await verifyTestOwnership(ctx, args.testId))) return null;
    return await ctx.db
      .query("emotionalProfiles")
      .withIndex("testId", (q) => q.eq("testId", args.testId))
      .first();
  },
});

export const getPredictedPerformance = query({
  args: { testId: v.id("tests") },
  handler: async (ctx, args) => {
    if (!(await verifyTestOwnership(ctx, args.testId))) return null;
    return await ctx.db
      .query("predictedPerformance")
      .withIndex("testId", (q) => q.eq("testId", args.testId))
      .first();
  },
});

// --- Actual Results (Validation Feedback Loop) ---

export const saveActualResults = mutation({
  args: {
    testId: v.id("tests"),
    results: v.array(
      v.object({
        metric: v.string(),
        value: v.number(),
        unit: v.string(),
      })
    ),
    totalSpend: v.optional(v.number()),
    totalRevenue: v.optional(v.number()),
    impressions: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Unauthenticated");

    const test = await ctx.db.get(args.testId);
    if (!test || test.userId !== user._id) throw new Error("Not found");

    // Prevent duplicate submissions
    const existing = await ctx.db
      .query("actualResults")
      .withIndex("testId", (q) => q.eq("testId", args.testId))
      .first();
    if (existing) throw new Error("Actual results already submitted for this test");

    await ctx.db.insert("actualResults", {
      testId: args.testId,
      userId: user._id,
      results: args.results,
      totalSpend: args.totalSpend,
      totalRevenue: args.totalRevenue,
      impressions: args.impressions,
      notes: args.notes,
      submittedAt: Date.now(),
    });
  },
});

export const getActualResults = query({
  args: { testId: v.id("tests") },
  handler: async (ctx, args) => {
    if (!(await verifyTestOwnership(ctx, args.testId))) return null;
    return await ctx.db
      .query("actualResults")
      .withIndex("testId", (q) => q.eq("testId", args.testId))
      .first();
  },
});
