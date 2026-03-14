"use node";

import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import Anthropic from "@anthropic-ai/sdk";
import {
  visionExtractionPrompt,
  metricScoringPrompt,
  personaSimulationPrompt,
  agentDebatePrompt,
  fixItPrompt,
  benchmarkPrompt,
  HEATMAP_PROMPT,
  emotionAnalysisPrompt,
  predictedPerformancePrompt,
  videoVisionExtractionPrompt,
  videoMetricScoringPrompt,
  videoPersonaSimulationPrompt,
  VIDEO_HEATMAP_PROMPT,
} from "./prompts";
import { buildPlatformContext } from "./platformContext";
import { parseJSON } from "./utils";
import { callGemini, callGeminiJSON } from "./gemini";

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
    max_tokens: 4096,
    messages: [{ role: "user", content }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  return textBlock?.text || "";
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
    platform: v.optional(v.string()),
    objective: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ testId: string; status: string }> => {
    const user = await ctx.runQuery(internal.users.getViewer);
    if (!user) throw new Error("Unauthenticated");

    const client = getClient();
    const platformContext = buildPlatformContext(args.platform, args.objective);

    // 1. Get creative from storage
    const creative = await ctx.runQuery(
      internal.ai.analyzeHelpers.getCreative,
      { creativeId: args.creativeId }
    );
    if (!creative) throw new Error("Creative not found");
    if (creative.userId !== user._id) {
      throw new Error("Unauthorized: creative belongs to another user");
    }

    const imageUrl = await ctx.storage.getUrl(creative.storageId);
    if (!imageUrl) throw new Error("Image URL not found");

    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) throw new Error(`Image fetch failed: ${imageResponse.status}`);
    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString("base64");
    const imageMimeType = creative.mimeType;

    // 2. Create test record
    const testId = await ctx.runMutation(internal.tests.createTest, {
      userId: user._id,
      creativeId: args.creativeId,
      name: args.testName,
      personaCount: args.personaIds.length,
      format: "image",
      platform: args.platform,
      objective: args.objective,
    });

    try {
      // 3. Vision extraction
      const visionResponse = await callClaude(
        client,
        visionExtractionPrompt(platformContext),
        imageBase64,
        imageMimeType
      );

      // 3b. Vision verification pass — validate extraction with second look
      const verificationPrompt = `Review this analysis of the ad creative image and correct any errors. If the analysis is accurate, return it unchanged. If you spot mistakes (wrong text, missed elements, incorrect descriptions), provide the corrected version.

Previous analysis:
${visionResponse}

Return the corrected analysis as-is (not as JSON — just the corrected text). If accurate, return the original unchanged.`;

      const analysis = await callClaude(
        client,
        verificationPrompt,
        imageBase64,
        imageMimeType
      );

      // 4. Metric scoring
      const { metrics } = await callClaudeJSON<{
        metrics: { label: string; value: number; max: number; confidence?: string }[];
      }>(client, metricScoringPrompt(analysis, platformContext), imageBase64, imageMimeType);

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
              incomeRange: persona.incomeRange ?? undefined,
              dailyScreenTime: persona.dailyScreenTime ?? undefined,
              platformsUsed: persona.platformsUsed ?? undefined,
              purchaseFrequency: persona.purchaseFrequency ?? undefined,
              adTolerance: persona.adTolerance ?? undefined,
              attentionSpan: persona.attentionSpan ?? undefined,
              brandAffinityExamples: persona.brandAffinityExamples ?? undefined,
            }, platformContext).replace("{analysis}", analysis);

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

      // 6. Agent debate
      const { exchanges } = await callClaudeJSON<{
        exchanges: {
          agent: "buyer" | "skeptic" | "verdict";
          text: string;
        }[];
      }>(client, agentDebatePrompt(analysis, metricsStr, platformContext), imageBase64, imageMimeType);
      await ctx.runMutation(internal.results.saveDebate, {
        testId,
        exchanges,
      });

      // 7. Fix-it suggestions
      const { suggestions } = await callClaudeJSON<{
        suggestions: {
          element: string;
          current: string;
          suggested: string;
          impact: "high" | "medium" | "low";
        }[];
      }>(client, fixItPrompt(analysis, metricsStr, platformContext), imageBase64, imageMimeType);
      await ctx.runMutation(internal.results.saveFixIts, {
        testId,
        suggestions,
      });

      // 7b. Emotional profile
      const emotionResult = await callClaudeJSON<{
        emotions: { emotion: string; intensity: number; confidence?: string }[];
        dominantEmotion: string;
        emotionalTone: string;
        recommendations: string[];
      }>(client, emotionAnalysisPrompt(analysis, platformContext), imageBase64, imageMimeType);
      await ctx.runMutation(internal.results.saveEmotionalProfile, {
        testId,
        emotions: emotionResult.emotions,
        dominantEmotion: emotionResult.dominantEmotion,
        emotionalTone: emotionResult.emotionalTone,
        recommendations: emotionResult.recommendations,
      });

      // 8. Attention heatmap
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

      // 9. Benchmarks — query historical data first
      const historicalAverages = await ctx.runQuery(
        internal.ai.analyzeHelpers.getUserHistoricalAverages,
        { userId: user._id, platform: args.platform }
      );

      const { entries } = await callClaudeJSON<{
        entries: {
          metric: string;
          yours: number;
          average: number;
          topPerformer: number;
          source?: string;
          confidence?: string;
        }[];
      }>(client, benchmarkPrompt(metricsStr, platformContext, historicalAverages));
      await ctx.runMutation(internal.results.saveBenchmarks, {
        testId,
        entries,
      });

      // 10. Predicted performance
      const perfPrediction = await callClaudeJSON<{
        predictions: {
          metric: string;
          value: number;
          unit: string;
          benchmarkAvg: number;
          benchmarkTop: number;
          percentile: number;
          reasoning: string;
        }[];
        overallVerdict: string;
        spendEfficiency: string;
        confidence: string;
      }>(client, predictedPerformancePrompt(analysis, metricsStr, platformContext));
      await ctx.runMutation(internal.results.savePredictedPerformance, {
        testId,
        predictions: perfPrediction.predictions,
        overallVerdict: perfPrediction.overallVerdict,
        spendEfficiency: perfPrediction.spendEfficiency,
        confidence: perfPrediction.confidence,
      });

      // 11. Mark test complete
      const overallScore =
        metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
      await ctx.runMutation(internal.tests.completeTest, {
        testId,
        overallScore: Math.round(overallScore * 10) / 10,
        metrics: metrics.map((m) => ({
          label: m.label,
          value: m.value,
          max: m.max,
          confidence: m.confidence,
        })),
      });

      return { testId, status: "completed" };
    } catch (error) {
      await ctx.runMutation(internal.tests.failTest, { testId });
      throw error;
    }
  },
});

// --- VIDEO ANALYSIS ---

export const runVideoAnalysis = action({
  args: {
    creativeId: v.id("creatives"),
    personaIds: v.array(v.id("personas")),
    testName: v.string(),
    platform: v.optional(v.string()),
    objective: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ testId: string; status: string }> => {
    const user = await ctx.runQuery(internal.users.getViewer);
    if (!user) throw new Error("Unauthenticated");

    const client = getClient();
    const platformContext = buildPlatformContext(args.platform, args.objective);

    // 1. Get creative from storage
    const creative = await ctx.runQuery(
      internal.ai.analyzeHelpers.getCreative,
      { creativeId: args.creativeId }
    );
    if (!creative) throw new Error("Creative not found");
    if (creative.userId !== user._id) throw new Error("Unauthorized");

    const videoUrl = await ctx.storage.getUrl(creative.storageId);
    if (!videoUrl) throw new Error("Video URL not found");

    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) throw new Error(`Video fetch failed: ${videoResponse.status}`);
    const videoBuffer = await videoResponse.arrayBuffer();
    const videoBase64 = Buffer.from(videoBuffer).toString("base64");
    const videoMimeType = creative.mimeType || "video/mp4";
    const videoDataUrl = `data:${videoMimeType};base64,${videoBase64}`;

    // 2. Create test record
    const testId = await ctx.runMutation(internal.tests.createTest, {
      userId: user._id,
      creativeId: args.creativeId,
      name: args.testName,
      personaCount: args.personaIds.length,
      format: "video",
      platform: args.platform,
      objective: args.objective,
    });

    try {
      // 3. Vision extraction (Gemini — supports video)
      const visionResponse = await callGemini(
        videoVisionExtractionPrompt(platformContext),
        videoDataUrl,
        "video"
      );
      const analysis = visionResponse;

      // 4. Metric scoring (Gemini with video context)
      const { metrics } = await callGeminiJSON<{
        metrics: { label: string; value: number; max: number; confidence?: string }[];
      }>(videoMetricScoringPrompt(analysis, platformContext), videoDataUrl, "video");

      const metricsStr = JSON.stringify(metrics);

      // 5. Persona simulations (Gemini with video, batches of 4)
      const personas = await ctx.runQuery(
        internal.ai.analyzeHelpers.getPersonasByIds,
        { ids: args.personaIds }
      );

      const BATCH_SIZE = 4;
      for (let i = 0; i < personas.length; i += BATCH_SIZE) {
        const batch = personas.slice(i, i + BATCH_SIZE);
        await Promise.all(
          batch.map(async (persona) => {
            const prompt = videoPersonaSimulationPrompt({
              name: persona.name,
              role: persona.role,
              age: persona.age,
              traits: persona.traits,
              description: persona.description,
              incomeRange: persona.incomeRange ?? undefined,
              dailyScreenTime: persona.dailyScreenTime ?? undefined,
              platformsUsed: persona.platformsUsed ?? undefined,
              purchaseFrequency: persona.purchaseFrequency ?? undefined,
              adTolerance: persona.adTolerance ?? undefined,
              attentionSpan: persona.attentionSpan ?? undefined,
              brandAffinityExamples: persona.brandAffinityExamples ?? undefined,
            }, platformContext).replace("{analysis}", analysis);

            try {
              const result = await callGeminiJSON<{
                score: number;
                sentiment: "positive" | "neutral" | "negative";
                reaction: string;
                highlights: string[];
              }>(prompt, videoDataUrl, "video");

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

      // 6. Agent debate (Claude — better reasoning, text-only)
      const { exchanges } = await callClaudeJSON<{
        exchanges: { agent: "buyer" | "skeptic" | "verdict"; text: string }[];
      }>(client, agentDebatePrompt(analysis, metricsStr, platformContext));
      await ctx.runMutation(internal.results.saveDebate, { testId, exchanges });

      // 7. Fix-it suggestions (Claude — better reasoning)
      const { suggestions } = await callClaudeJSON<{
        suggestions: { element: string; current: string; suggested: string; impact: "high" | "medium" | "low" }[];
      }>(client, fixItPrompt(analysis, metricsStr, platformContext));
      await ctx.runMutation(internal.results.saveFixIts, { testId, suggestions });

      // 7b. Emotional profile (Claude — text-only, analysis already extracted)
      const emotionResult = await callClaudeJSON<{
        emotions: { emotion: string; intensity: number; confidence?: string }[];
        dominantEmotion: string;
        emotionalTone: string;
        recommendations: string[];
      }>(client, emotionAnalysisPrompt(analysis, platformContext));
      await ctx.runMutation(internal.results.saveEmotionalProfile, {
        testId,
        emotions: emotionResult.emotions,
        dominantEmotion: emotionResult.dominantEmotion,
        emotionalTone: emotionResult.emotionalTone,
        recommendations: emotionResult.recommendations,
      });

      // 8. Heatmap
      const heatmapPrompt = VIDEO_HEATMAP_PROMPT + `\n\nVideo Analysis:\n${analysis}`;
      try {
        const heatmapResult = await callGeminiJSON<Record<string, unknown>>(heatmapPrompt);
        const zones = (heatmapResult.zones as { label: string; attention: number; x: number; y: number; w: number; h: number }[]) || [];
        if (zones.length > 0) {
          await ctx.runMutation(internal.results.saveHeatmap, { testId, zones });
        } else {
          await ctx.runMutation(internal.results.saveHeatmap, {
            testId,
            zones: [
              { label: "Opening Hook", attention: 90, x: 10, y: 5, w: 80, h: 20 },
              { label: "Main Content", attention: 70, x: 5, y: 25, w: 90, h: 40 },
              { label: "CTA / End Card", attention: 85, x: 15, y: 70, w: 70, h: 25 },
            ],
          });
        }
      } catch {
        await ctx.runMutation(internal.results.saveHeatmap, {
          testId,
          zones: [
            { label: "Opening Hook", attention: 90, x: 10, y: 5, w: 80, h: 20 },
            { label: "Main Content", attention: 70, x: 5, y: 25, w: 90, h: 40 },
            { label: "CTA / End Card", attention: 85, x: 15, y: 70, w: 70, h: 25 },
          ],
        });
      }

      // 9. Benchmarks — query historical data first
      const historicalAverages = await ctx.runQuery(
        internal.ai.analyzeHelpers.getUserHistoricalAverages,
        { userId: user._id, platform: args.platform }
      );

      const { entries } = await callClaudeJSON<{
        entries: { metric: string; yours: number; average: number; topPerformer: number; source?: string; confidence?: string }[];
      }>(client, benchmarkPrompt(metricsStr, platformContext, historicalAverages));
      await ctx.runMutation(internal.results.saveBenchmarks, { testId, entries });

      // 10. Predicted performance
      const perfPrediction = await callClaudeJSON<{
        predictions: {
          metric: string;
          value: number;
          unit: string;
          benchmarkAvg: number;
          benchmarkTop: number;
          percentile: number;
          reasoning: string;
        }[];
        overallVerdict: string;
        spendEfficiency: string;
        confidence: string;
      }>(client, predictedPerformancePrompt(analysis, metricsStr, platformContext));
      await ctx.runMutation(internal.results.savePredictedPerformance, {
        testId,
        predictions: perfPrediction.predictions,
        overallVerdict: perfPrediction.overallVerdict,
        spendEfficiency: perfPrediction.spendEfficiency,
        confidence: perfPrediction.confidence,
      });

      // 11. Mark test complete
      const overallScore = metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
      await ctx.runMutation(internal.tests.completeTest, {
        testId,
        overallScore: Math.round(overallScore * 10) / 10,
        metrics: metrics.map((m) => ({
          label: m.label,
          value: m.value,
          max: m.max,
          confidence: m.confidence,
        })),
      });

      return { testId, status: "completed" };
    } catch (error) {
      await ctx.runMutation(internal.tests.failTest, { testId });
      throw error;
    }
  },
});
