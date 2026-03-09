import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthenticatedAppUser } from "./auth";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedAppUser(ctx);

    // Get all presets
    const presets = await ctx.db
      .query("personas")
      .withIndex("isPreset", (q) => q.eq("isPreset", true))
      .collect();

    // Get user's custom personas
    let custom: typeof presets = [];
    if (user) {
      custom = await ctx.db
        .query("personas")
        .withIndex("userId", (q) => q.eq("userId", user._id))
        .collect();
    }

    return [...presets, ...custom];
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    role: v.string(),
    age: v.number(),
    traits: v.array(v.string()),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Unauthenticated");

    return await ctx.db.insert("personas", {
      userId: user._id,
      name: args.name,
      role: args.role,
      age: args.age,
      traits: args.traits,
      description: args.description,
      isPreset: false,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("personas") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Unauthenticated");
    const persona = await ctx.db.get(args.id);
    if (!persona) throw new Error("Not found");
    if (persona.isPreset) throw new Error("Cannot delete preset personas");
    if (persona.userId !== user._id) throw new Error("Unauthorized");
    await ctx.db.delete(args.id);
  },
});

export const getByIds = query({
  args: { ids: v.array(v.id("personas")) },
  handler: async (ctx, args) => {
    const personas = await Promise.all(
      args.ids.map((id) => ctx.db.get(id))
    );
    return personas.filter(Boolean);
  },
});
