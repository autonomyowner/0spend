import { query, mutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { getAuthenticatedAppUser, authComponent } from "./auth";

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    return await getAuthenticatedAppUser(ctx);
  },
});

// Called automatically when an authenticated user has no users table record.
// This bridges the gap between better-auth's internal user and our app's users table.
export const ensureUser = mutation({
  args: {},
  handler: async (ctx) => {
    let authUser;
    try {
      authUser = await authComponent.getAuthUser(ctx);
    } catch {
      return null;
    }
    if (!authUser || !authUser.email) return null;

    const existing = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", authUser.email))
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert("users", {
      email: authUser.email,
      name: authUser.name || undefined,
      plan: "starter",
      createdAt: Date.now(),
    });
  },
});

// Internal query used by actions (e.g., runAnalysis) to get authenticated user server-side
export const getViewer = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await getAuthenticatedAppUser(ctx);
  },
});
