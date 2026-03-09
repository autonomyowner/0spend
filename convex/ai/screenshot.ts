"use node";

import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";

export const captureScreenshot = action({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args): Promise<{ creativeId: string }> => {
    console.log("[captureScreenshot] Capturing:", args.url);

    const user = await ctx.runQuery(internal.users.getViewer);
    if (!user) throw new Error("Unauthenticated");

    const apiKey = process.env.SCREENSHOTONE_API_KEY;
    if (!apiKey) throw new Error("SCREENSHOTONE_API_KEY not set");

    // Build ScreenshotOne URL
    const params = new URLSearchParams({
      access_key: apiKey,
      url: args.url,
      viewport_width: "1280",
      viewport_height: "800",
      full_page: "true",
      format: "png",
      delay: "3",
      block_ads: "true",
      block_cookie_banners: "true",
    });

    const screenshotUrl = `https://api.screenshotone.com/take?${params.toString()}`;

    const response = await fetch(screenshotUrl);
    if (!response.ok) {
      throw new Error(`Screenshot capture failed (${response.status}): ${await response.text()}`);
    }

    const imageBuffer = await response.arrayBuffer();
    console.log("[captureScreenshot] Screenshot captured, size:", Math.round(imageBuffer.byteLength / 1024), "KB");

    // Upload to Convex storage
    const uploadUrl = await ctx.storage.generateUploadUrl();
    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": "image/png" },
      body: imageBuffer,
    });

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload screenshot to storage");
    }

    const { storageId } = await uploadResponse.json();

    // Create creative record
    const hostname = new URL(args.url).hostname;
    const creativeId = await ctx.runMutation(internal.creatives.saveCreativeInternal, {
      userId: user._id,
      storageId,
      fileName: `${hostname}-screenshot.png`,
      format: "landing_page",
      mimeType: "image/png",
      fileSize: imageBuffer.byteLength,
      sourceUrl: args.url,
    });

    console.log("[captureScreenshot] Creative saved:", creativeId);
    return { creativeId };
  },
});
