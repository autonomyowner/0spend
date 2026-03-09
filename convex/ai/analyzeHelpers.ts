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
