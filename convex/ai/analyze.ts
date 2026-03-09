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
    baseURL: "https://openrouter.ai/api",
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
  // Try multiple extraction strategies
  // 1. Try extracting from markdown code blocks
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1]!.trim()) as T;
    } catch {
      // Fall through to other strategies
    }
  }

  // 2. Try parsing the whole text as JSON
  try {
    return JSON.parse(text.trim()) as T;
  } catch {
    // Fall through
  }

  // 3. Try finding JSON object/array in the text
  const objectMatch = text.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    try {
      return JSON.parse(objectMatch[0]) as T;
    } catch {
      // Fall through
    }
  }

  const arrayMatch = text.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    try {
      return JSON.parse(arrayMatch[0]) as T;
    } catch {
      // Fall through
    }
  }

  throw new Error(`Failed to parse JSON from LLM response: ${text.substring(0, 200)}`);
}

async function callClaudeJSON<T>(
  client: Anthropic,
  prompt: string,
  imageBase64?: string,
  imageMimeType?: string,
  retries = 2
): Promise<T> {
  let lastError: Error | null = null;
  for (let i = 0; i <= retries; i++) {
    try {
      const text = await callClaude(client, prompt, imageBase64, imageMimeType);
      return parseJSON<T>(text);
    } catch (err) {
      lastError = err as Error;
      if (i < retries) {
        // Wait briefly before retry
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }
  throw lastError!;
}

export const runAnalysis = action({
  args: {
    creativeId: v.id("creatives"),
    personaIds: v.array(v.id("personas")),
    testName: v.string(),
  },
  handler: async (ctx, args): Promise<{ testId: string; status: string }> => {
    // Derive userId server-side from auth context
    console.log("[runAnalysis] Starting analysis...");
    const user = await ctx.runQuery(internal.users.getViewer);
    if (!user) throw new Error("Unauthenticated");
    console.log("[runAnalysis] User authenticated:", user.email);

    const client = getClient();

    // 1. Get creative from storage
    const creative = await ctx.runQuery(
      internal.ai.analyzeHelpers.getCreative,
      { creativeId: args.creativeId }
    );
    if (!creative) throw new Error("Creative not found");

    // Verify ownership
    if (creative.userId !== user._id) {
      throw new Error("Unauthorized: creative belongs to another user");
    }

    const imageUrl = await ctx.storage.getUrl(creative.storageId);
    if (!imageUrl) throw new Error("Image URL not found");
    console.log("[runAnalysis] Image URL:", imageUrl);

    // Fetch image and convert to base64
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) throw new Error(`Image fetch failed: ${imageResponse.status}`);
    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString("base64");
    const imageMimeType = creative.mimeType;
    console.log("[runAnalysis] Image loaded, size:", Math.round(imageBuffer.byteLength / 1024), "KB, type:", imageMimeType);

    // 2. Create test record
    const testId = await ctx.runMutation(internal.tests.createTest, {
      userId: user._id,
      creativeId: args.creativeId,
      name: args.testName,
      personaCount: args.personaIds.length,
    });

    try {
      // 3. Vision extraction
      console.log("[runAnalysis] Starting vision extraction...");
      const visionResponse = await callClaude(
        client,
        VISION_EXTRACTION_PROMPT,
        imageBase64,
        imageMimeType
      );
      console.log("[runAnalysis] Vision extraction complete");
      const analysis = visionResponse;

      // 4. Metric scoring
      console.log("[runAnalysis] Starting metric scoring...");
      const metricPrompt = METRIC_SCORING_PROMPT.replace("{analysis}", analysis);
      const { metrics } = await callClaudeJSON<{
        metrics: { label: string; value: number; max: number }[];
      }>(client, metricPrompt);
      console.log("[runAnalysis] Metric scoring complete");

      const metricsStr = JSON.stringify(metrics);

      // 5. Persona simulations (parallel, batches of 4)
      console.log("[runAnalysis] Starting persona simulations...");
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

            try {
              const result = await callClaudeJSON<{
                score: number;
                sentiment: "positive" | "neutral" | "negative";
                reaction: string;
                highlights: string[];
              }>(client, prompt, imageBase64, imageMimeType);

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
            } catch (err) {
              // Save a fallback feedback so the user knows this persona failed
              await ctx.runMutation(internal.results.savePersonaFeedback, {
                testId,
                personaId: persona._id,
                personaName: persona.name,
                personaRole: `${persona.role}, ${persona.age}`,
                score: 0,
                sentiment: "neutral",
                reaction: `Analysis failed for this persona: ${(err as Error).message}`,
                highlights: [],
              });
            }
          })
        );
      }

      console.log("[runAnalysis] Persona simulations complete");

      // 6. Agent debate
      console.log("[runAnalysis] Starting agent debate...");
      const debatePrompt = AGENT_DEBATE_PROMPT.replace(
        "{analysis}",
        analysis
      ).replace("{metrics}", metricsStr);
      const { exchanges } = await callClaudeJSON<{
        exchanges: {
          agent: "buyer" | "skeptic" | "verdict";
          text: string;
        }[];
      }>(client, debatePrompt, imageBase64, imageMimeType);
      await ctx.runMutation(internal.results.saveDebate, {
        testId,
        exchanges,
      });

      console.log("[runAnalysis] Agent debate complete");

      // 7. Fix-it suggestions
      console.log("[runAnalysis] Starting fix-it suggestions...");
      const fixItPrompt = FIX_IT_PROMPT.replace("{analysis}", analysis).replace(
        "{metrics}",
        metricsStr
      );
      const { suggestions } = await callClaudeJSON<{
        suggestions: {
          element: string;
          current: string;
          suggested: string;
          impact: "high" | "medium" | "low";
        }[];
      }>(client, fixItPrompt, imageBase64, imageMimeType);
      await ctx.runMutation(internal.results.saveFixIts, {
        testId,
        suggestions,
      });

      console.log("[runAnalysis] Fix-it suggestions complete");

      // 8. Attention heatmap
      console.log("[runAnalysis] Starting heatmap analysis...");
      const { zones } = await callClaudeJSON<{
        zones: {
          label: string;
          attention: number;
          x: number;
          y: number;
          w: number;
          h: number;
        }[];
      }>(client, HEATMAP_PROMPT, imageBase64, imageMimeType);
      await ctx.runMutation(internal.results.saveHeatmap, {
        testId,
        zones,
      });

      console.log("[runAnalysis] Heatmap analysis complete");

      // 9. Benchmarks
      console.log("[runAnalysis] Starting benchmarks...");
      const benchmarkPrompt = BENCHMARK_PROMPT.replace("{metrics}", metricsStr);
      const { entries } = await callClaudeJSON<{
        entries: {
          metric: string;
          yours: number;
          average: number;
          topPerformer: number;
        }[];
      }>(client, benchmarkPrompt);
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
      console.error("[runAnalysis] FAILED:", (error as Error).message, (error as Error).stack);
      await ctx.runMutation(internal.tests.failTest, { testId });
      throw error;
    }
  },
});
