export function parseJSON<T>(text: string): T {
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
