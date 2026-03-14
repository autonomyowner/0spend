"use node";

import { parseJSON } from "./utils";

const GEMINI_MODEL = "google/gemini-2.5-flash";

interface GeminiContentPart {
  type: "text" | "image_url" | "video_url";
  text?: string;
  image_url?: { url: string };
  video_url?: { url: string };
}

/**
 * Call Gemini via OpenRouter.
 * For video: pass a base64 data URL (data:video/mp4;base64,...) since
 * OpenRouter's Gemini provider requires base64 for non-YouTube video URLs.
 */
export async function callGemini(
  prompt: string,
  mediaDataUrl?: string,
  mediaType?: "video" | "image"
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not set");

  const content: GeminiContentPart[] = [];

  if (mediaDataUrl && mediaType === "video") {
    content.push({ type: "video_url", video_url: { url: mediaDataUrl } });
  } else if (mediaDataUrl && mediaType === "image") {
    content.push({ type: "image_url", image_url: { url: mediaDataUrl } });
  }

  content.push({ type: "text", text: prompt });

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GEMINI_MODEL,
      max_tokens: 8192,
      messages: [{ role: "user", content }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "";
  if (!text) {
    throw new Error(`Gemini returned empty response: ${JSON.stringify(data).substring(0, 500)}`);
  }
  return text;
}

export async function callGeminiJSON<T>(
  prompt: string,
  mediaDataUrl?: string,
  mediaType?: "video" | "image",
  retries = 2
): Promise<T> {
  let lastError: Error | null = null;
  for (let i = 0; i <= retries; i++) {
    try {
      const text = await callGemini(prompt, mediaDataUrl, mediaType);
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
