import { mutation, query } from "./_generated/server";
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
      uploadedAt: Date.now(),
    });
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
