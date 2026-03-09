import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthenticatedAppUser } from "./auth";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Unauthenticated");
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveCreative = mutation({
  args: {
    storageId: v.id("_storage"),
    fileName: v.string(),
    format: v.string(),
    mimeType: v.string(),
    fileSize: v.number(),
    sourceUrl: v.optional(v.string()),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) throw new Error("Unauthenticated");

    return await ctx.db.insert("creatives", {
      userId: user._id,
      storageId: args.storageId,
      fileName: args.fileName,
      format: args.format,
      mimeType: args.mimeType,
      fileSize: args.fileSize,
      sourceUrl: args.sourceUrl,
      duration: args.duration,
      uploadedAt: Date.now(),
    });
  },
});

export const saveCreativeInternal = internalMutation({
  args: {
    userId: v.id("users"),
    storageId: v.id("_storage"),
    fileName: v.string(),
    format: v.string(),
    mimeType: v.string(),
    fileSize: v.number(),
    sourceUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("creatives", {
      userId: args.userId,
      storageId: args.storageId,
      fileName: args.fileName,
      format: args.format,
      mimeType: args.mimeType,
      fileSize: args.fileSize,
      sourceUrl: args.sourceUrl,
      uploadedAt: Date.now(),
    });
  },
});

export const getCreative = query({
  args: { creativeId: v.id("creatives") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) return null;
    const creative = await ctx.db.get(args.creativeId);
    if (!creative || creative.userId !== user._id) return null;
    return creative;
  },
});

export const getCreativeUrl = query({
  args: { creativeId: v.id("creatives") },
  handler: async (ctx, args) => {
    const creative = await ctx.db.get(args.creativeId);
    if (!creative) return null;
    return await ctx.storage.getUrl(creative.storageId);
  },
});

export const listCreatives = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedAppUser(ctx);
    if (!user) return [];
    return await ctx.db
      .query("creatives")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});
