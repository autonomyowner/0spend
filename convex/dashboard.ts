import { query } from "./_generated/server";
import { getAuthenticatedAppUser } from "./auth";

export const stats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) {
      return {
        testCount: 0,
        avgScore: 0,
        completedCount: 0,
        fixItsCount: 0,
      };
    }

    const tests = await ctx.db
      .query("tests")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .collect();

    const completed = tests.filter((t) => t.status === "completed");
    const avgScore =
      completed.length > 0
        ? completed.reduce((sum, t) => sum + (t.overallScore || 0), 0) /
          completed.length
        : 0;

    // Count fix-its efficiently — only check last 20 completed tests max
    let fixItsCount = 0;
    const recentCompleted = completed.slice(0, 20);
    for (const test of recentCompleted) {
      const fixIt = await ctx.db
        .query("fixIts")
        .withIndex("testId", (q) => q.eq("testId", test._id))
        .first();
      if (fixIt) fixItsCount += fixIt.suggestions.length;
    }

    return {
      testCount: tests.length,
      avgScore: Math.round(avgScore * 10) / 10,
      completedCount: completed.length,
      fixItsCount,
    };
  },
});

export const recentTests = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("tests")
      .withIndex("userId_createdAt", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(6);
  },
});

export const scoreTrend = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) return [];

    const tests = await ctx.db
      .query("tests")
      .withIndex("userId_createdAt", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(7);

    return tests
      .filter((t) => t.status === "completed" && t.overallScore)
      .reverse()
      .map((t) => ({
        date: new Date(t.createdAt).toLocaleDateString("en-US", {
          weekday: "short",
        }),
        score: t.overallScore || 0,
      }));
  },
});
