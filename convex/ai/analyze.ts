"use node";

import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import Anthropic from "@anthropic-ai/sdk";
import {
  VISION_EXTRACTION_PROMPT,
  METRIC_SCORING_PROMPT,
  personaSimulationPrompt,
  AGENT_DEBATE_PROMPT,
  FIX_IT_PROMPT,
  HEATMAP_PROMPT,
  BENCHMARK_PROMPT,
} from "./prompts";

const MODEL = "anthropic/claude-sonnet-4";

function getClient() {
  return new Anthropic({
    apiKey: process.env.OPENROUTER_API_KEY!,
    baseURL: "https://openrouter.ai/api/v1",
  });
}

async function callClaude(
  client: Anthropic,
  prompt: string,
  imageBase64?: string,
  imageMimeType?: string
): Promise<string> {
  const content: Anthropic.Messages.ContentBlockParam[] = [];

  if (imageBase64 && imageMimeType) {
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: imageMimeType as
          | "image/jpeg"
          | "image/png"
          | "image/gif"
          | "image/webp",
        data: imageBase64,
      },
    });
  }

  content.push({ type: "text", text: prompt });

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [{ role: "user", content }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  return textBlock?.text || "";
}

function parseJSON<T>(text: string): T {
  // Extract JSON from markdown code blocks if present
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = jsonMatch ? jsonMatch[1]!.trim() : text.trim();
  return JSON.parse(jsonStr) as T;
}

export const runAnalysis = action({
  args: {
    creativeId: v.id("creatives"),
    personaIds: v.array(v.id("personas")),
    testName: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args): Promise<{ testId: string; status: string }> => {
    const client = getClient();

    // 1. Get creative from storage
    const creative = await ctx.runQuery(
      internal.ai.analyzeHelpers.getCreative,
      { creativeId: args.creativeId }
    );
    if (!creative) throw new Error("Creative not found");

    const imageUrl = await ctx.storage.getUrl(creative.storageId);
    if (!imageUrl) throw new Error("Image URL not found");

    // Fetch image and convert to base64
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString("base64");
    const imageMimeType = creative.mimeType;

    // 2. Create test record
    const testId = await ctx.runMutation(internal.tests.createTest, {
      userId: args.userId,
      creativeId: args.creativeId,
      name: args.testName,
      personaCount: args.personaIds.length,
    });

    try {
      // 3. Vision extraction
      const visionResponse = await callClaude(
        client,
        VISION_EXTRACTION_PROMPT,
        imageBase64,
        imageMimeType
      );
      const analysis = visionResponse;

      // 4. Metric scoring
      const metricPrompt = METRIC_SCORING_PROMPT.replace("{analysis}", analysis);
      const metricResponse = await callClaude(client, metricPrompt);
      const { metrics } = parseJSON<{
        metrics: { label: string; value: number; max: number }[];
      }>(metricResponse);

      const metricsStr = JSON.stringify(metrics);

      // 5. Persona simulations (parallel, batches of 4)
      const personas = await ctx.runQuery(
        internal.ai.analyzeHelpers.getPersonasByIds,
        { ids: args.personaIds }
      );

      const BATCH_SIZE = 4;
      for (let i = 0; i < personas.length; i += BATCH_SIZE) {
        const batch = personas.slice(i, i + BATCH_SIZE);
        await Promise.all(
          batch.map(async (persona) => {
            const prompt = personaSimulationPrompt({
              name: persona.name,
              role: persona.role,
              age: persona.age,
              traits: persona.traits,
              description: persona.description,
            }).replace("{analysis}", analysis);

            const response = await callClaude(
              client,
              prompt,
              imageBase64,
              imageMimeType
            );
            const result = parseJSON<{
              score: number;
              sentiment: "positive" | "neutral" | "negative";
              reaction: string;
              highlights: string[];
            }>(response);

            await ctx.runMutation(internal.results.savePersonaFeedback, {
              testId,
              personaId: persona._id,
              personaName: persona.name,
              personaRole: `${persona.role}, ${persona.age}`,
              score: result.score,
              sentiment: result.sentiment,
              reaction: result.reaction,
              highlights: result.highlights,
            });
          })
        );
      }

      // 6. Agent debate
      const debatePrompt = AGENT_DEBATE_PROMPT.replace(
        "{analysis}",
        analysis
      ).replace("{metrics}", metricsStr);
      const debateResponse = await callClaude(
        client,
        debatePrompt,
        imageBase64,
        imageMimeType
      );
      const { exchanges } = parseJSON<{
        exchanges: {
          agent: "buyer" | "skeptic" | "verdict";
          text: string;
        }[];
      }>(debateResponse);
      await ctx.runMutation(internal.results.saveDebate, {
        testId,
        exchanges,
      });

      // 7. Fix-it suggestions
      const fixItPrompt = FIX_IT_PROMPT.replace("{analysis}", analysis).replace(
        "{metrics}",
        metricsStr
      );
      const fixItResponse = await callClaude(
        client,
        fixItPrompt,
        imageBase64,
        imageMimeType
      );
      const { suggestions } = parseJSON<{
        suggestions: {
          element: string;
          current: string;
          suggested: string;
          impact: "high" | "medium" | "low";
        }[];
      }>(fixItResponse);
      await ctx.runMutation(internal.results.saveFixIts, {
        testId,
        suggestions,
      });

      // 8. Attention heatmap
      const heatmapResponse = await callClaude(
        client,
        HEATMAP_PROMPT,
        imageBase64,
        imageMimeType
      );
      const { zones } = parseJSON<{
        zones: {
          label: string;
          attention: number;
          x: number;
          y: number;
          w: number;
          h: number;
        }[];
      }>(heatmapResponse);
      await ctx.runMutation(internal.results.saveHeatmap, {
        testId,
        zones,
      });

      // 9. Benchmarks
      const benchmarkPrompt = BENCHMARK_PROMPT.replace("{metrics}", metricsStr);
      const benchmarkResponse = await callClaude(client, benchmarkPrompt);
      const { entries } = parseJSON<{
        entries: {
          metric: string;
          yours: number;
          average: number;
          topPerformer: number;
        }[];
      }>(benchmarkResponse);
      await ctx.runMutation(internal.results.saveBenchmarks, {
        testId,
        entries,
      });

      // 10. Mark test complete
      const overallScore =
        metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
      await ctx.runMutation(internal.tests.completeTest, {
        testId,
        overallScore: Math.round(overallScore * 10) / 10,
        metrics,
      });

      return { testId, status: "completed" };
    } catch (error) {
      // Mark test as failed
      await ctx.runMutation(internal.tests.failTest, { testId });
      throw error;
    }
  },
});
