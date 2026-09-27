/** Models reached through an OpenAI-compatible gateway honour
 * `response_format` to wildly different degrees. The ones that do return
 * a bare JSON object; the ones that don't wrap it in a ```json fence, or
 * introduce it with a sentence, or both. Parsing the raw string works for
 * the first group and fails for the rest, which is indistinguishable from
 * a genuinely broken answer by the time it reaches the validators.
 *
 * This pulls the first complete JSON object out of whatever came back.
 * Shared by explain's hint ladder and generate-summary, since both parse
 * model-authored JSON and both hit the same gateways. */
export function extractJsonObject(raw: string): string | null {
  const text = typeof raw === 'string' ? raw.trim() : '';
  if (!text) return null;

  // Prefer a fenced block when there is one: a model that both explains
  // itself and emits JSON usually puts only the JSON inside the fence.
  const fenced = text.match(/```[A-Za-z0-9_+-]*\r?\n?([\s\S]*?)```/);
  const candidate = (fenced ? fenced[1] : text).trim();

  const start = candidate.indexOf('{');
  if (start === -1) return null;

  // Brace matching rather than a regex, so a brace inside a string
  // literal (common in an example that contains code) doesn't end the
  // object early.
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < candidate.length; i++) {
    const ch = candidate[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === '{') depth++;
    else if (ch === '}' && --depth === 0) return candidate.slice(start, i + 1);
  }

  // Unbalanced: the answer was cut off mid-object. Reporting null lets
  // the caller say "truncated" instead of "malformed".
  return null;
}
