import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    plan: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("email", ["email"]),

  personas: defineTable({
    userId: v.optional(v.id("users")),
    name: v.string(),
    role: v.string(),
    age: v.number(),
    traits: v.array(v.string()),
    description: v.string(),
    systemPrompt: v.optional(v.string()),
    isPreset: v.boolean(),
  })
    .index("userId", ["userId"])
    .index("isPreset", ["isPreset"]),

  creatives: defineTable({
    userId: v.id("users"),
    storageId: v.id("_storage"),
    fileName: v.string(),
    format: v.string(),
    mimeType: v.string(),
    fileSize: v.number(),
    uploadedAt: v.number(),
  }).index("userId", ["userId"]),

  tests: defineTable({
    userId: v.id("users"),
    creativeId: v.id("creatives"),
    name: v.string(),
    status: v.union(
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed")
    ),
    overallScore: v.optional(v.number()),
    personaCount: v.number(),
    metrics: v.optional(
      v.array(
        v.object({
          label: v.string(),
          value: v.number(),
          max: v.number(),
        })
      )
    ),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("userId", ["userId"])
    .index("userId_createdAt", ["userId", "createdAt"])
    .index("status", ["status"]),

  personaFeedbacks: defineTable({
    testId: v.id("tests"),
    personaId: v.optional(v.id("personas")),
    personaName: v.string(),
    personaRole: v.string(),
    score: v.number(),
    sentiment: v.union(
      v.literal("positive"),
      v.literal("neutral"),
      v.literal("negative")
    ),
    reaction: v.string(),
    highlights: v.array(v.string()),
  }).index("testId", ["testId"]),

  debates: defineTable({
    testId: v.id("tests"),
    exchanges: v.array(
      v.object({
        agent: v.union(
          v.literal("buyer"),
          v.literal("skeptic"),
          v.literal("verdict")
        ),
        text: v.string(),
      })
    ),
  }).index("testId", ["testId"]),

  heatmaps: defineTable({
    testId: v.id("tests"),
    zones: v.array(
      v.object({
        label: v.string(),
        attention: v.number(),
        x: v.number(),
        y: v.number(),
        w: v.number(),
        h: v.number(),
      })
    ),
  }).index("testId", ["testId"]),

  fixIts: defineTable({
    testId: v.id("tests"),
    suggestions: v.array(
      v.object({
        element: v.string(),
        current: v.string(),
        suggested: v.string(),
        impact: v.union(
          v.literal("high"),
          v.literal("medium"),
          v.literal("low")
        ),
      })
    ),
  }).index("testId", ["testId"]),

  benchmarks: defineTable({
    testId: v.id("tests"),
    entries: v.array(
      v.object({
        metric: v.string(),
        yours: v.number(),
        average: v.number(),
        topPerformer: v.number(),
      })
    ),
  }).index("testId", ["testId"]),
});
