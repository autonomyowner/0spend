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
    incomeRange: v.optional(v.string()),
    dailyScreenTime: v.optional(v.string()),
    platformsUsed: v.optional(v.array(v.string())),
    purchaseFrequency: v.optional(v.string()),
    adTolerance: v.optional(v.string()),
    attentionSpan: v.optional(v.string()),
    brandAffinityExamples: v.optional(v.array(v.string())),
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
    sourceUrl: v.optional(v.string()),
    duration: v.optional(v.number()),
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
    format: v.optional(v.string()),
    platform: v.optional(v.string()),
    objective: v.optional(v.string()),
    overallScore: v.optional(v.number()),
    personaCount: v.number(),
    metrics: v.optional(
      v.array(
        v.object({
          label: v.string(),
          value: v.number(),
          max: v.number(),
          confidence: v.optional(v.string()),
        })
      )
    ),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("userId", ["userId"])
    .index("userId_createdAt", ["userId", "createdAt"])
    .index("userId_platform", ["userId", "platform"])
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
        source: v.optional(v.string()),
        confidence: v.optional(v.string()),
      })
    ),
  }).index("testId", ["testId"]),

  emotionalProfiles: defineTable({
    testId: v.id("tests"),
    emotions: v.array(
      v.object({
        emotion: v.string(),
        intensity: v.number(),
        confidence: v.optional(v.string()),
      })
    ),
    dominantEmotion: v.string(),
    emotionalTone: v.string(),
    recommendations: v.array(v.string()),
  }).index("testId", ["testId"]),

  predictedPerformance: defineTable({
    testId: v.id("tests"),
    predictions: v.array(
      v.object({
        metric: v.string(),
        value: v.number(),
        unit: v.string(),
        benchmarkAvg: v.number(),
        benchmarkTop: v.number(),
        percentile: v.number(),
        reasoning: v.string(),
      })
    ),
    overallVerdict: v.string(),
    spendEfficiency: v.string(),
    confidence: v.string(),
  }).index("testId", ["testId"]),
});
