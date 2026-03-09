export const VISION_EXTRACTION_PROMPT = `You are an expert ad creative analyst. Analyze this ad creative image and extract:

1. **Text Content**: All text visible in the image (headline, subheadline, CTA, fine print)
2. **Layout**: Describe the visual layout (positions of elements, hierarchy)
3. **Colors**: Dominant colors and color scheme
4. **CTA**: Call-to-action text and placement
5. **Visual Elements**: Key images, icons, logos, or graphics
6. **Overall Feel**: Mood, style, target audience impression

Return as JSON:
{
  "headline": "string",
  "subheadline": "string",
  "ctaText": "string",
  "ctaPlacement": "string",
  "colors": ["string"],
  "layout": "string",
  "visualElements": ["string"],
  "overallFeel": "string",
  "targetAudience": "string"
}`;

export const METRIC_SCORING_PROMPT = `You are an expert ad performance analyst. Based on this ad creative analysis, score it on 5 metrics from 1.0 to 10.0 (one decimal place).

Creative Analysis:
{analysis}

Score these metrics:
1. **Hook Strength** (1-10): How well does it grab attention in the first 0.5 seconds? Consider headline impact, visual contrast, pattern interruption.
2. **Visual Clarity** (1-10): Is the message immediately clear? Consider layout hierarchy, readability, whitespace usage.
3. **CTA Power** (1-10): How compelling is the call-to-action? Consider urgency, specificity, placement, contrast.
4. **Brand Alignment** (1-10): Does it feel professional and consistent? Consider typography, color usage, tone.
5. **Emotional Impact** (1-10): Does it trigger an emotion (curiosity, desire, fear of missing out)? Consider storytelling, relatability.

Return as JSON:
{
  "metrics": [
    { "label": "Hook Strength", "value": 8.5, "max": 10 },
    { "label": "Visual Clarity", "value": 7.2, "max": 10 },
    { "label": "CTA Power", "value": 9.1, "max": 10 },
    { "label": "Brand Alignment", "value": 7.8, "max": 10 },
    { "label": "Emotional Impact", "value": 6.9, "max": 10 }
  ]
}`;

export function personaSimulationPrompt(persona: {
  name: string;
  role: string;
  age: number;
  traits: string[];
  description: string;
}) {
  return `You are simulating ${persona.name}, a ${persona.age}-year-old ${persona.role}.

Personality: ${persona.description}
Key traits: ${persona.traits.join(", ")}

You are evaluating an ad creative. Based on the image and this analysis:
{analysis}

Respond IN CHARACTER as ${persona.name}. Provide:
1. A score from 1.0-10.0 based on how effective this ad would be for someone like you
2. Your gut reaction (2-3 sentences, first person, in character)
3. Sentiment: "positive" (score >= 7), "neutral" (5-6.9), or "negative" (< 5)
4. 3 specific highlights (what stood out, good or bad)

Return as JSON:
{
  "score": 7.5,
  "sentiment": "positive",
  "reaction": "Your in-character reaction here...",
  "highlights": ["highlight 1", "highlight 2", "highlight 3"]
}`;
}

export const AGENT_DEBATE_PROMPT = `You are moderating a debate between two AI agents about an ad creative.

Creative Analysis:
{analysis}

Metric Scores:
{metrics}

Generate a structured debate with 4-6 exchanges between:
- **Buyer Agent**: Argues FOR the creative. Finds strengths, conversion potential, and emotional appeal.
- **Skeptic Agent**: Argues AGAINST. Finds weaknesses, missed opportunities, and potential issues.

End with a **Verdict** that summarizes both sides and gives a final recommendation.

Return as JSON:
{
  "exchanges": [
    { "agent": "buyer", "text": "The hook is strong because..." },
    { "agent": "skeptic", "text": "But the discount feels generic..." },
    { "agent": "buyer", "text": "Fair point, however..." },
    { "agent": "skeptic", "text": "The visual hierarchy works for..." },
    { "agent": "buyer", "text": "Data shows that..." },
    { "agent": "verdict", "text": "7.2/10 — Ship with tweaks: ..." }
  ]
}`;

export const FIX_IT_PROMPT = `You are a senior creative director giving specific, actionable rewrite suggestions for an ad creative.

Creative Analysis:
{analysis}

Metric Scores:
{metrics}

Provide 4-5 specific "fix-it" suggestions. For each:
1. Identify the exact element (Headline, Subheading, CTA Button, Fine Print, Social Proof, etc.)
2. Quote the CURRENT text/approach
3. Provide a SPECIFIC rewrite/alternative
4. Rate the impact: "high", "medium", or "low"

Focus on high-impact changes first. Be specific — don't say "make it better", say exactly what to change.

Return as JSON:
{
  "suggestions": [
    {
      "element": "Headline",
      "current": "Get 50% Off Our Premium Plan!",
      "suggested": "Save $149 — Premium Plan, Half Price",
      "impact": "high"
    }
  ]
}`;

export const HEATMAP_PROMPT = `You are an attention analysis expert. Based on this ad creative image, predict where viewers' eyes will focus.

Analyze the image and identify 5-8 visual zones. For each zone, estimate the percentage of viewer attention it receives (all zones should roughly sum to 100%).

Consider:
- F-pattern and Z-pattern reading behavior
- Visual weight (size, color, contrast)
- Face/people detection (eyes are drawn to faces)
- Text hierarchy
- CTA placement
- Motion/animation cues

Return as JSON:
{
  "zones": [
    { "label": "Headline", "attention": 92, "x": 10, "y": 5, "w": 80, "h": 12 },
    { "label": "Hero Image", "attention": 78, "x": 5, "y": 20, "w": 60, "h": 35 }
  ]
}

Where x, y, w, h are percentages of the image dimensions (0-100).`;

export const BENCHMARK_PROMPT = `Based on these metric scores for an ad creative, generate competitive benchmark data.

Metric Scores:
{metrics}

For each metric, provide:
1. The actual score (from input)
2. A realistic industry average (typically 5.0-7.0 range)
3. A top performer score (typically 8.5-9.5 range)

The industry averages should feel realistic — not too close to the actual scores. Top performer scores should be aspirational but achievable.

Return as JSON:
{
  "entries": [
    { "metric": "Hook Strength", "yours": 8.5, "average": 6.2, "topPerformer": 9.3 }
  ]
}`;

// --- VIDEO-SPECIFIC PROMPTS ---

export const VIDEO_VISION_EXTRACTION_PROMPT = `You are an expert video ad analyst. Analyze this video ad and extract:

1. **Opening Hook** (first 3 seconds): What happens visually and textually in the opening?
2. **Scene Breakdown**: List each distinct scene/shot with approximate timestamps and description
3. **Text Content**: All on-screen text (captions, CTAs, lower thirds, end cards)
4. **Pacing**: Fast/medium/slow — how quickly do scenes change?
5. **Audio Cues**: Describe any music, voiceover, or sound effects you can infer from the visuals
6. **CTA**: Call-to-action text and when it appears
7. **Visual Style**: Color grading, transitions, effects, motion graphics
8. **Overall Feel**: Mood, energy level, target audience impression

Return as JSON:
{
  "openingHook": "string",
  "scenes": [{"timestamp": "0-3s", "description": "string"}],
  "textContent": ["string"],
  "pacing": "fast" | "medium" | "slow",
  "audioCues": "string",
  "ctaText": "string",
  "ctaTimestamp": "string",
  "visualStyle": "string",
  "overallFeel": "string",
  "targetAudience": "string"
}`;

export const VIDEO_METRIC_SCORING_PROMPT = `You are an expert video ad performance analyst. Based on this video ad analysis, score it on 5 metrics from 1.0 to 10.0 (one decimal place).

Video Analysis:
{analysis}

Score these metrics:
1. **Hook Strength** (1-10): How well does the first 3 seconds grab attention? Consider pattern interruption, visual impact, and scroll-stopping power.
2. **Visual Clarity** (1-10): Is the message clear throughout? Consider pacing, text legibility, scene transitions, and information overload.
3. **CTA Power** (1-10): How compelling is the call-to-action? Consider timing (does it come at the right moment?), urgency, and clarity.
4. **Brand Alignment** (1-10): Does it feel professional and on-brand? Consider consistency, production quality, and tone.
5. **Emotional Impact** (1-10): Does it trigger engagement (curiosity, desire, excitement)? Consider storytelling arc, music/pacing sync, and relatability.

Return as JSON:
{
  "metrics": [
    { "label": "Hook Strength", "value": 8.5, "max": 10 },
    { "label": "Visual Clarity", "value": 7.2, "max": 10 },
    { "label": "CTA Power", "value": 9.1, "max": 10 },
    { "label": "Brand Alignment", "value": 7.8, "max": 10 },
    { "label": "Emotional Impact", "value": 6.9, "max": 10 }
  ]
}`;

export function videoPersonaSimulationPrompt(persona: {
  name: string;
  role: string;
  age: number;
  traits: string[];
  description: string;
}) {
  return `You are simulating ${persona.name}, a ${persona.age}-year-old ${persona.role}.

Personality: ${persona.description}
Key traits: ${persona.traits.join(", ")}

You are scrolling through your feed and see this video ad. Based on the video and this analysis:
{analysis}

Respond IN CHARACTER as ${persona.name}. Consider:
- Would this stop your scroll in the first 3 seconds?
- Would you watch it to completion or swipe away?
- Does the pacing match your attention span?
- Does the message resonate with someone like you?

Provide:
1. A score from 1.0-10.0 based on how effective this video ad would be for someone like you
2. Your gut reaction (2-3 sentences, first person, in character)
3. Sentiment: "positive" (score >= 7), "neutral" (5-6.9), or "negative" (< 5)
4. 3 specific highlights (what stood out, good or bad)

Return as JSON:
{
  "score": 7.5,
  "sentiment": "positive",
  "reaction": "Your in-character reaction here...",
  "highlights": ["highlight 1", "highlight 2", "highlight 3"]
}`;
}

export const VIDEO_HEATMAP_PROMPT = `You are an attention analysis expert for video ads. Based on this video, predict where viewers' eyes will focus on the representative frame shown.

Analyze the image (a key frame from the video) and identify 5-8 visual zones. For each zone, estimate the percentage of viewer attention it receives (all zones should roughly sum to 100%).

Consider:
- Opening hook visual elements (what grabs attention first)
- Text/caption placement
- Face/people detection (eyes are drawn to faces)
- Motion cues and focal points
- CTA placement
- Brand elements

Return as JSON:
{
  "zones": [
    { "label": "Headline Text", "attention": 92, "x": 10, "y": 5, "w": 80, "h": 12 },
    { "label": "Main Subject", "attention": 78, "x": 5, "y": 20, "w": 60, "h": 35 }
  ]
}

Where x, y, w, h are percentages of the frame dimensions (0-100).`;
