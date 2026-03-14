// --- IMAGE PROMPTS ---

export function visionExtractionPrompt(platformContext: string = ""): string {
  return `You are an expert ad creative analyst. Analyze this ad creative image and extract:

1. **Text Content**: All text visible in the image (headline, subheadline, CTA, fine print)
2. **Layout**: Describe the visual layout (positions of elements, hierarchy)
3. **Colors**: Dominant colors and color scheme
4. **CTA**: Call-to-action text and placement
5. **Visual Elements**: Key images, icons, logos, or graphics
6. **Overall Feel**: Mood, style, target audience impression

${platformContext ? `\n--- PLATFORM CONTEXT ---\n${platformContext}\n---\nEvaluate the creative specifically in the context of this platform and its constraints.\n` : ""}
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
}

export function metricScoringPrompt(analysis: string, platformContext: string = ""): string {
  return `You are an expert ad performance analyst with calibrated scoring. Based on this ad creative analysis, score it on 5 metrics from 1.0 to 10.0 (one decimal place).

Creative Analysis:
${analysis}

${platformContext ? `\n--- PLATFORM CONTEXT ---\n${platformContext}\n---\n` : ""}

## SCORING CALIBRATION — READ CAREFULLY

You MUST use the full 1-10 range. DO NOT cluster scores between 6-8. Here are calibration anchors:

**Score 9.0-10.0 (Exceptional):** Reserved for top 5% of ads. Example: Apple "Shot on iPhone" billboards — perfect visual clarity, instantly understood message, iconic simplicity. Nike "Just Do It" campaigns — universal emotional resonance. Only give 9+ if the creative genuinely rivals best-in-class work.

**Score 5.0-6.9 (Average):** This is where MOST ads land. A typical small business Facebook ad with a stock photo, basic headline, and generic CTA is a 5-6. A decent ad with good intentions but nothing remarkable is a 6-6.5. Do NOT inflate average work above this range.

**Score 1.0-4.0 (Below Average to Poor):** Actively problematic creatives. A 3-4 has unclear messaging, poor hierarchy, or a weak/missing CTA. A 1-2 is nearly incomprehensible or actively off-putting.

## SCORING RULES
- Each metric MUST be scored independently. Do NOT anchor all scores to the same range.
- If the creative is mediocre, give it mediocre scores (5-6). Do not be generous.
- The spread between your highest and lowest metric should typically be 2+ points.
- Consider the platform context when scoring — a TikTok-optimized ad should score poorly on LinkedIn metrics and vice versa.

## CONFIDENCE
For each metric, rate your confidence: "high" (clear evidence), "medium" (reasonable inference), "low" (limited info/guessing).

Score these metrics:
1. **Hook Strength** (1-10): How well does it grab attention in the first 0.5 seconds? Consider headline impact, visual contrast, pattern interruption.
2. **Visual Clarity** (1-10): Is the message immediately clear? Consider layout hierarchy, readability, whitespace usage.
3. **CTA Power** (1-10): How compelling is the call-to-action? Consider urgency, specificity, placement, contrast.
4. **Brand Alignment** (1-10): Does it feel professional and consistent? Consider typography, color usage, tone.
5. **Emotional Impact** (1-10): Does it trigger an emotion (curiosity, desire, fear of missing out)? Consider storytelling, relatability.

Return as JSON:
{
  "metrics": [
    { "label": "Hook Strength", "value": 8.5, "max": 10, "confidence": "high" },
    { "label": "Visual Clarity", "value": 5.2, "max": 10, "confidence": "medium" },
    { "label": "CTA Power", "value": 3.8, "max": 10, "confidence": "high" },
    { "label": "Brand Alignment", "value": 7.1, "max": 10, "confidence": "medium" },
    { "label": "Emotional Impact", "value": 6.0, "max": 10, "confidence": "low" }
  ]
}`;
}

export function personaSimulationPrompt(persona: {
  name: string;
  role: string;
  age: number;
  traits: string[];
  description: string;
  incomeRange?: string;
  dailyScreenTime?: string;
  platformsUsed?: string[];
  purchaseFrequency?: string;
  adTolerance?: string;
  attentionSpan?: string;
  brandAffinityExamples?: string[];
}, platformContext: string = "") {
  const behaviorBlock = [
    persona.incomeRange && `Income: ${persona.incomeRange}`,
    persona.dailyScreenTime && `Daily screen time: ${persona.dailyScreenTime}`,
    persona.platformsUsed?.length && `Platforms used: ${persona.platformsUsed.join(", ")}`,
    persona.purchaseFrequency && `Purchase frequency: ${persona.purchaseFrequency}`,
    persona.adTolerance && `Ad tolerance: ${persona.adTolerance}`,
    persona.attentionSpan && `Attention span: ${persona.attentionSpan}`,
    persona.brandAffinityExamples?.length && `Brands they like: ${persona.brandAffinityExamples.join(", ")}`,
  ].filter(Boolean).join("\n");

  return `You are simulating ${persona.name}, a ${persona.age}-year-old ${persona.role}.

Personality: ${persona.description}
Key traits: ${persona.traits.join(", ")}
${behaviorBlock ? `\nBehavioral Profile:\n${behaviorBlock}` : ""}
${platformContext ? `\n--- PLATFORM CONTEXT ---\n${platformContext}\n---` : ""}

You are evaluating an ad creative. Based on the image and this analysis:
{analysis}

Respond IN CHARACTER as ${persona.name}. Consider:
- Your attention span and ad tolerance when scoring
- Whether this platform matches where you spend time
- Your typical purchase behavior and decision-making process
- Brands you actually buy from and whether this creative matches that quality level

Provide:
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

export function agentDebatePrompt(analysis: string, metrics: string, platformContext: string = ""): string {
  return `You are moderating a debate between two AI agents about an ad creative.

Creative Analysis:
${analysis}

Metric Scores:
${metrics}

${platformContext ? `\n--- PLATFORM CONTEXT ---\n${platformContext}\n---\n` : ""}

Generate a structured debate with 4-6 exchanges between:
- **Buyer Agent**: Argues FOR the creative. Finds strengths, conversion potential, and emotional appeal. MUST cite specific elements from the analysis (quote text, reference colors, mention specific layout choices). Reference platform best practices when relevant.
- **Skeptic Agent**: Argues AGAINST. Finds weaknesses, missed opportunities, and potential issues. MUST cite specific elements and reference platform constraints (character limits, aspect ratios, audience expectations).

End with a **Verdict** that:
1. Lists 2-3 must-fix items (specific, actionable)
2. Gives a final recommendation: "Ship" (score 8+), "Iterate" (score 5-7.9), or "Kill" (score <5)
3. Explains the reasoning in 1-2 sentences

Return as JSON:
{
  "exchanges": [
    { "agent": "buyer", "text": "The hook is strong because [specific element]..." },
    { "agent": "skeptic", "text": "But [specific element] doesn't follow [platform] best practices..." },
    { "agent": "buyer", "text": "Fair point, however [specific counter]..." },
    { "agent": "skeptic", "text": "The [specific metric] score of X.X reflects..." },
    { "agent": "buyer", "text": "Looking at the data..." },
    { "agent": "verdict", "text": "X.X/10 — [Ship/Iterate/Kill]. Must-fix: 1) ..., 2) ..., 3) .... [reasoning]" }
  ]
}`;
}

export function fixItPrompt(analysis: string, metrics: string, platformContext: string = ""): string {
  return `You are a senior creative director giving specific, actionable rewrite suggestions for an ad creative.

Creative Analysis:
${analysis}

Metric Scores:
${metrics}

${platformContext ? `\n--- PLATFORM CONTEXT ---\n${platformContext}\n---\nIMPORTANT: All suggested copy MUST fit within the platform character limits listed above. Note any aspect ratio or format issues specific to this platform.\n` : ""}

Provide 4-5 specific "fix-it" suggestions. For each:
1. Identify the exact element (Headline, Subheading, CTA Button, Fine Print, Social Proof, etc.)
2. Quote the CURRENT text/approach
3. Provide a SPECIFIC rewrite/alternative that respects platform character limits
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
}

export function benchmarkPrompt(
  metrics: string,
  platformContext: string = "",
  historicalAverages?: { metric: string; average: number; count: number }[] | null
): string {
  let historicalBlock = "";
  if (historicalAverages && historicalAverages.length > 0) {
    historicalBlock = `\n## HISTORICAL DATA (from user's previous tests)
Use these as the "average" values. These are REAL data from the user's own testing history.
${historicalAverages.map((h) => `- ${h.metric}: ${h.average} (from ${h.count} tests)`).join("\n")}

Mark these entries with source: "historical" and confidence: "high".
For any metrics not in the historical data, estimate reasonable industry averages and mark with source: "ai_estimated" and confidence: "medium".\n`;
  } else {
    historicalBlock = `\nNo historical data available. Estimate reasonable industry averages.
Mark ALL entries with source: "ai_estimated" and confidence: "medium".
Be transparent — these are estimates, not real benchmarks.\n`;
  }

  return `Based on these metric scores for an ad creative, generate competitive benchmark data.

Metric Scores:
${metrics}

${platformContext ? `\n--- PLATFORM CONTEXT ---\n${platformContext}\n---\n` : ""}
${historicalBlock}

For each metric, provide:
1. The actual score (from input)
2. The average (from historical data if available, otherwise a realistic estimate in the 4.5-6.5 range)
3. A top performer score (typically 8.5-9.5 range)
4. Source: "historical" or "ai_estimated"
5. Confidence: "high", "medium", or "low"

The averages should feel realistic — not too close to the actual scores. Top performer scores should be aspirational but achievable.

Return as JSON:
{
  "entries": [
    { "metric": "Hook Strength", "yours": 8.5, "average": 6.2, "topPerformer": 9.3, "source": "ai_estimated", "confidence": "medium" }
  ]
}`;
}

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

// --- VIDEO-SPECIFIC PROMPTS ---

export function videoVisionExtractionPrompt(platformContext: string = ""): string {
  return `You are an expert video ad analyst. Analyze this video ad and extract:

1. **Opening Hook** (first 3 seconds): What happens visually and textually in the opening?
2. **Scene Breakdown**: List each distinct scene/shot with approximate timestamps and description
3. **Text Content**: All on-screen text (captions, CTAs, lower thirds, end cards)
4. **Pacing**: Fast/medium/slow — how quickly do scenes change?
5. **Audio Cues**: Describe any music, voiceover, or sound effects you can infer from the visuals
6. **CTA**: Call-to-action text and when it appears
7. **Visual Style**: Color grading, transitions, effects, motion graphics
8. **Overall Feel**: Mood, energy level, target audience impression

${platformContext ? `\n--- PLATFORM CONTEXT ---\n${platformContext}\n---\nEvaluate the video specifically for this platform.\n` : ""}
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
}

export function videoMetricScoringPrompt(analysis: string, platformContext: string = ""): string {
  return `You are an expert video ad performance analyst with calibrated scoring. Based on this video ad analysis, score it on 5 metrics from 1.0 to 10.0 (one decimal place).

Video Analysis:
${analysis}

${platformContext ? `\n--- PLATFORM CONTEXT ---\n${platformContext}\n---\n` : ""}

## SCORING CALIBRATION — READ CAREFULLY

You MUST use the full 1-10 range. DO NOT cluster scores between 6-8. Here are calibration anchors:

**Score 9.0-10.0 (Exceptional):** Reserved for top 5% of video ads. Think Super Bowl-tier production or viral TikTok with perfect hook-to-CTA flow. Only give 9+ if genuinely best-in-class.

**Score 5.0-6.9 (Average):** Where MOST video ads land. A decent product demo with standard editing is a 5-6. Good effort but nothing that would go viral is 6-6.5.

**Score 1.0-4.0 (Below Average to Poor):** Confusing messaging, poor pacing, or missed opportunities. A 3-4 has some merit but significant issues. A 1-2 would cause viewers to immediately skip.

## SCORING RULES
- Each metric MUST be scored independently
- The spread between your highest and lowest metric should typically be 2+ points
- If it's average, score it average (5-6)

## CONFIDENCE
For each metric, rate: "high" (clear evidence), "medium" (reasonable inference), "low" (limited info).

Score these metrics:
1. **Hook Strength** (1-10): How well does the first 3 seconds grab attention? Consider pattern interruption, visual impact, and scroll-stopping power.
2. **Visual Clarity** (1-10): Is the message clear throughout? Consider pacing, text legibility, scene transitions, and information overload.
3. **CTA Power** (1-10): How compelling is the call-to-action? Consider timing, urgency, and clarity.
4. **Brand Alignment** (1-10): Does it feel professional and on-brand? Consider consistency, production quality, and tone.
5. **Emotional Impact** (1-10): Does it trigger engagement? Consider storytelling arc, music/pacing sync, and relatability.

Return as JSON:
{
  "metrics": [
    { "label": "Hook Strength", "value": 8.5, "max": 10, "confidence": "high" },
    { "label": "Visual Clarity", "value": 5.2, "max": 10, "confidence": "medium" },
    { "label": "CTA Power", "value": 3.8, "max": 10, "confidence": "high" },
    { "label": "Brand Alignment", "value": 7.1, "max": 10, "confidence": "medium" },
    { "label": "Emotional Impact", "value": 6.0, "max": 10, "confidence": "low" }
  ]
}`;
}

export function videoPersonaSimulationPrompt(persona: {
  name: string;
  role: string;
  age: number;
  traits: string[];
  description: string;
  incomeRange?: string;
  dailyScreenTime?: string;
  platformsUsed?: string[];
  purchaseFrequency?: string;
  adTolerance?: string;
  attentionSpan?: string;
  brandAffinityExamples?: string[];
}, platformContext: string = "") {
  const behaviorBlock = [
    persona.incomeRange && `Income: ${persona.incomeRange}`,
    persona.dailyScreenTime && `Daily screen time: ${persona.dailyScreenTime}`,
    persona.platformsUsed?.length && `Platforms used: ${persona.platformsUsed.join(", ")}`,
    persona.purchaseFrequency && `Purchase frequency: ${persona.purchaseFrequency}`,
    persona.adTolerance && `Ad tolerance: ${persona.adTolerance}`,
    persona.attentionSpan && `Attention span: ${persona.attentionSpan}`,
    persona.brandAffinityExamples?.length && `Brands they like: ${persona.brandAffinityExamples.join(", ")}`,
  ].filter(Boolean).join("\n");

  return `You are simulating ${persona.name}, a ${persona.age}-year-old ${persona.role}.

Personality: ${persona.description}
Key traits: ${persona.traits.join(", ")}
${behaviorBlock ? `\nBehavioral Profile:\n${behaviorBlock}` : ""}
${platformContext ? `\n--- PLATFORM CONTEXT ---\n${platformContext}\n---` : ""}

You are scrolling through your feed and see this video ad. Based on the video and this analysis:
{analysis}

Respond IN CHARACTER as ${persona.name}. Consider:
- Would this stop your scroll in the first 3 seconds?
- Would you watch it to completion or swipe away?
- Does the pacing match your attention span?
- Does the message resonate with someone like you?
- Is this on a platform you actually use?

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

// --- EMOTIONAL PROFILE PROMPT ---

export function emotionAnalysisPrompt(analysis: string, platformContext: string = ""): string {
  return `You are an expert in emotional response analysis for advertising. Based on this creative analysis, predict which emotions the ad triggers in viewers using Plutchik's 8 primary emotions.

Creative Analysis:
${analysis}

${platformContext ? `\n--- PLATFORM CONTEXT ---\n${platformContext}\n---\n` : ""}

## PLUTCHIK'S 8 PRIMARY EMOTIONS
Score each emotion from 0.0 to 10.0 (one decimal place):
1. **Joy** — happiness, delight, satisfaction
2. **Trust** — acceptance, credibility, reliability
3. **Surprise** — unexpected elements, novelty
4. **Anticipation** — excitement, forward-looking desire
5. **Fear** — urgency, FOMO, anxiety
6. **Anger** — frustration with status quo, injustice
7. **Sadness** — empathy, pain points, loss
8. **Disgust** — rejection of alternatives, dissatisfaction

## CALIBRATION
- Most effective ads trigger 2-3 strong emotions (7+), not all 8
- A typical ad has 4-5 emotions below 3.0 — that's normal
- Fear/urgency-based ads (limited time offers) should score high on Fear and Anticipation
- Trust-building ads (testimonials, guarantees) should score high on Trust and Joy
- Problem-aware ads should score higher on Sadness/Anger (pain points) AND Anticipation (solution)
- Do NOT inflate scores — a generic ad should have mostly low scores

## CONFIDENCE
For each emotion: "high" (clear evidence in creative), "medium" (reasonable inference), "low" (weak signal)

## OUTPUT
Identify the single dominant emotion and describe the overall emotional tone in 1 sentence (e.g., "Urgency-driven with aspirational undertones").

Provide 2-3 actionable recommendations for emotional optimization (e.g., "Add social proof to boost Trust from 4.2 to 7+", "Introduce scarcity element to amplify Fear/FOMO").

Return as JSON:
{
  "emotions": [
    { "emotion": "Joy", "intensity": 6.5, "confidence": "high" },
    { "emotion": "Trust", "intensity": 7.2, "confidence": "medium" },
    { "emotion": "Surprise", "intensity": 3.1, "confidence": "low" },
    { "emotion": "Anticipation", "intensity": 8.0, "confidence": "high" },
    { "emotion": "Fear", "intensity": 2.0, "confidence": "medium" },
    { "emotion": "Anger", "intensity": 1.5, "confidence": "low" },
    { "emotion": "Sadness", "intensity": 4.0, "confidence": "medium" },
    { "emotion": "Disgust", "intensity": 0.5, "confidence": "low" }
  ],
  "dominantEmotion": "Anticipation",
  "emotionalTone": "Aspirational with trust-building elements",
  "recommendations": [
    "Add urgency copy to boost Fear/FOMO from 2.0 to 5+",
    "Include a testimonial to elevate Trust from 7.2 to 8.5+"
  ]
}`;
}

// --- PREDICTED PERFORMANCE PROMPT ---

export function predictedPerformancePrompt(
  analysis: string,
  metrics: string,
  platformContext: string = ""
): string {
  return `You are a senior performance marketing analyst who predicts real-world ad performance metrics. Based on the creative analysis and quality scores, predict actual campaign performance numbers.

Creative Analysis:
${analysis}

Quality Scores:
${metrics}

${platformContext ? `\n--- PLATFORM CONTEXT ---\n${platformContext}\n---\n` : ""}

## YOUR TASK

Predict these 5 real-world performance metrics for this ad creative:

1. **CTR (Click-Through Rate)** — What % of impressions will result in clicks?
   - Platform benchmarks: Facebook avg 0.9%, Instagram avg 0.8%, TikTok avg 0.8%, Google Display avg 0.5%, LinkedIn avg 0.4%, YouTube avg 0.6%, X avg 0.3%, Generic avg 0.7%
   - Top performers: Facebook 2.5%, Instagram 2.0%, TikTok 2.5%, Google 1.5%, LinkedIn 1.0%, YouTube 1.5%, X 0.8%

2. **Conversion Rate** — Of those who click, what % will convert (purchase, sign up, etc.)?
   - Platform benchmarks: Facebook avg 2.3%, Instagram avg 1.8%, TikTok avg 1.5%, Google avg 3.5%, LinkedIn avg 2.7%, YouTube avg 1.2%, X avg 1.0%, Generic avg 2.0%
   - Top performers: Facebook 5.0%, Instagram 4.0%, TikTok 4.0%, Google 7.0%, LinkedIn 5.5%, YouTube 3.0%, X 2.5%

3. **CPM (Cost Per Mille)** — Estimated cost per 1000 impressions in USD
   - Platform benchmarks: Facebook avg $10, Instagram avg $12, TikTok avg $6, Google avg $8, LinkedIn avg $30, YouTube avg $15, X avg $7, Generic avg $10
   - Good CPM is lower than average

4. **Estimated ROAS** — If $1 is spent, how much revenue is predicted to return?
   - Platform benchmarks: Facebook avg 2.5x, Instagram avg 2.0x, TikTok avg 1.8x, Google avg 4.0x, LinkedIn avg 1.5x, YouTube avg 1.8x, X avg 1.2x, Generic avg 2.0x
   - Top performers: 5x-10x+

5. **Scroll-Stop Rate** — What % of users will stop scrolling to view the ad?
   - Platform benchmarks: avg 15-25%
   - Top performers: 40-60%

## PREDICTION CALIBRATION

- A creative with quality scores averaging 5.0-6.0 should predict AVERAGE benchmarks
- Quality scores averaging 7.0-8.0 predict above-average (top 25th percentile)
- Quality scores averaging 8.5+ predict top performer numbers
- Quality scores averaging <5.0 predict below-average numbers
- Consider the specific platform — a TikTok-optimized ad shown on LinkedIn will underperform
- Factor in the emotional profile and hook strength heavily for scroll-stop rate
- Factor in CTA power heavily for CTR and conversion rate
- BE REALISTIC. Most ads perform at or below average. Only exceptional creatives hit top performer numbers.

## PERCENTILE
For each metric, estimate what percentile this ad falls in (1-99) relative to all ads on the platform.
- 50th percentile = average
- 75th = above average
- 90th+ = exceptional

## OVERALL VERDICT
Provide a one-line verdict on spend efficiency:
- "High ROI potential — this creative will likely outperform your average spend" (scores 7.5+)
- "Moderate ROI — expect average returns, consider A/B testing variations" (scores 5.5-7.4)
- "Low ROI risk — significant improvements needed before scaling spend" (scores <5.5)

Also rate confidence: "high" (strong creative with clear signals), "medium" (decent creative with some uncertainty), "low" (weak signals or mismatched platform fit)

And provide a spend efficiency summary (1-2 sentences): "For every $1,000 spent on [platform], this creative is predicted to generate approximately $X,XXX in revenue based on estimated [CTR]% CTR and [CR]% conversion rate."

Return as JSON:
{
  "predictions": [
    {
      "metric": "CTR",
      "value": 1.2,
      "unit": "%",
      "benchmarkAvg": 0.9,
      "benchmarkTop": 2.5,
      "percentile": 68,
      "reasoning": "Strong hook and clear CTA drive above-average click intent"
    },
    {
      "metric": "Conversion Rate",
      "value": 2.8,
      "unit": "%",
      "benchmarkAvg": 2.3,
      "benchmarkTop": 5.0,
      "percentile": 62,
      "reasoning": "Clear value proposition but generic CTA may limit conversions"
    },
    {
      "metric": "CPM",
      "value": 8.50,
      "unit": "$",
      "benchmarkAvg": 10.00,
      "benchmarkTop": 5.00,
      "percentile": 65,
      "reasoning": "Good engagement signals should lead to favorable CPM"
    },
    {
      "metric": "ROAS",
      "value": 3.2,
      "unit": "x",
      "benchmarkAvg": 2.5,
      "benchmarkTop": 8.0,
      "percentile": 70,
      "reasoning": "Above average CTR and decent conversion predict solid return"
    },
    {
      "metric": "Scroll-Stop Rate",
      "value": 28,
      "unit": "%",
      "benchmarkAvg": 20,
      "benchmarkTop": 50,
      "percentile": 65,
      "reasoning": "High hook strength score indicates good attention capture"
    }
  ],
  "overallVerdict": "Moderate ROI — expect above-average returns for this platform, but CTA optimization could push this into high-performer territory",
  "spendEfficiency": "For every $1,000 spent on Facebook, this creative is predicted to generate approximately $3,200 in revenue based on estimated 1.2% CTR and 2.8% conversion rate.",
  "confidence": "medium"
}`;
}

// --- BACKWARD COMPATIBILITY ALIASES ---
// Old constant-style exports call the new functions with empty context

export const VISION_EXTRACTION_PROMPT = visionExtractionPrompt();
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

export const AGENT_DEBATE_PROMPT = agentDebatePrompt("{analysis}", "{metrics}");
export const FIX_IT_PROMPT = fixItPrompt("{analysis}", "{metrics}");
export const BENCHMARK_PROMPT = benchmarkPrompt("{metrics}");
export const VIDEO_VISION_EXTRACTION_PROMPT = videoVisionExtractionPrompt();
export const VIDEO_METRIC_SCORING_PROMPT = videoMetricScoringPrompt("{analysis}");
