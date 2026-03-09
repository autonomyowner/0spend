import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthenticatedAppUser } from "./auth";

export const createTest = internalMutation({
  args: {
    userId: v.id("users"),
    creativeId: v.id("creatives"),
    name: v.string(),
    personaCount: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tests", {
      userId: args.userId,
      creativeId: args.creativeId,
      name: args.name,
      status: "running",
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
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) return [];
    return await ctx.db
      .query("tests")
      .withIndex("userId_createdAt", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const getTest = query({
  args: { testId: v.id("tests") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.testId);
  },
});
