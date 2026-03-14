import { internalQuery } from "../_generated/server";
import { v } from "convex/values";

export const getCreative = internalQuery({
  args: { creativeId: v.id("creatives") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.creativeId);
  },
});

export const getPersonasByIds = internalQuery({
  args: { ids: v.array(v.id("personas")) },
  handler: async (ctx, args) => {
    const personas = await Promise.all(
      args.ids.map((id) => ctx.db.get(id))
    );
    return personas.filter(
      (p): p is NonNullable<typeof p> => p !== null
    );
  },
});

export const getUserHistoricalAverages = internalQuery({
  args: {
    userId: v.id("users"),
    platform: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let tests;
    if (args.platform && args.platform !== "generic") {
      tests = await ctx.db
        .query("tests")
        .withIndex("userId_platform", (q) =>
          q.eq("userId", args.userId).eq("platform", args.platform)
        )
        .collect();
    } else {
      tests = await ctx.db
        .query("tests")
        .withIndex("userId", (q) => q.eq("userId", args.userId))
        .collect();
    }

    const completed = tests.filter(
      (t) => t.status === "completed" && t.metrics && t.metrics.length > 0
    );

    if (completed.length < 3) return null;

    const metricTotals: Record<string, { sum: number; count: number }> = {};
    for (const test of completed) {
      for (const m of test.metrics!) {
        if (!metricTotals[m.label]) {
          metricTotals[m.label] = { sum: 0, count: 0 };
        }
        metricTotals[m.label].sum += m.value;
        metricTotals[m.label].count += 1;
      }
    }

    return Object.entries(metricTotals).map(([metric, { sum, count }]) => ({
      metric,
      average: Math.round((sum / count) * 10) / 10,
      count,
    }));
  },
});
