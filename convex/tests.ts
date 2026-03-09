import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthenticatedAppUser } from "./auth";

export const createTest = internalMutation({
  args: {
    userId: v.id("users"),
    creativeId: v.id("creatives"),
    name: v.string(),
    personaCount: v.number(),
    format: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tests", {
      userId: args.userId,
      creativeId: args.creativeId,
      name: args.name,
      status: "running",
      format: args.format,
      personaCount: args.personaCount,
      createdAt: Date.now(),
    });
  },
});

export const completeTest = internalMutation({
  args: {
    testId: v.id("tests"),
    overallScore: v.number(),
    metrics: v.array(
      v.object({
        label: v.string(),
        value: v.number(),
        max: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.testId, {
      status: "completed",
      overallScore: args.overallScore,
      metrics: args.metrics,
      completedAt: Date.now(),
    });
  },
});

export const failTest = internalMutation({
  args: {
    testId: v.id("tests"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.testId, {
      status: "failed",
      completedAt: Date.now(),
    });
  },
});

export const listUserTests = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) return [];
    const limit = args.limit || 50;
    return await ctx.db
      .query("tests")
      .withIndex("userId_createdAt", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(limit);
  },
});

export const getTest = query({
  args: { testId: v.id("tests") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) return null;
    const test = await ctx.db.get(args.testId);
    if (!test || test.userId !== user._id) return null;
    return test;
  },
});

export const deleteTest = mutation({
  args: { testId: v.id("tests") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Unauthenticated");

    const test = await ctx.db.get(args.testId);
    if (!test || test.userId !== user._id) throw new Error("Not found");

    // Cascade delete all related results
    const feedbacks = await ctx.db
      .query("personaFeedbacks")
      .withIndex("testId", (q) => q.eq("testId", args.testId))
      .collect();
    for (const f of feedbacks) await ctx.db.delete(f._id);

    const debate = await ctx.db
      .query("debates")
      .withIndex("testId", (q) => q.eq("testId", args.testId))
      .first();
    if (debate) await ctx.db.delete(debate._id);

    const heatmap = await ctx.db
      .query("heatmaps")
      .withIndex("testId", (q) => q.eq("testId", args.testId))
      .first();
    if (heatmap) await ctx.db.delete(heatmap._id);

    const fixIt = await ctx.db
      .query("fixIts")
      .withIndex("testId", (q) => q.eq("testId", args.testId))
      .first();
    if (fixIt) await ctx.db.delete(fixIt._id);

    const benchmark = await ctx.db
      .query("benchmarks")
      .withIndex("testId", (q) => q.eq("testId", args.testId))
      .first();
    if (benchmark) await ctx.db.delete(benchmark._id);

    await ctx.db.delete(args.testId);
  },
});
