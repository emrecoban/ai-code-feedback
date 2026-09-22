// Appendix A of the base spec, plus the addendum §2 anti-leak check.

export const HINT_LADDER_SCHEMA: Record<string, unknown> = {
  type: 'object',
  required: ['title', 'concept', 'confidence', 'needsMoreContext', 'l0_decode', 'l1_locate', 'l2_concept', 'l3_fix'],
  additionalProperties: false,
  properties: {
    // [USER-STATS]'s history list -- 3-6 words, generated alongside the
    // ladder itself rather than as a separate request (no extra cost,
    // and localized for free since it's produced in the same language).
    title: { type: 'string', minLength: 5, maxLength: 60 },
    // [FEEDBACK-EFFECTIVENESS]: a short, general name for the underlying
    // concept (e.g. "list indexing", not "off-by-one in range()") --
    // deliberately separate from `title`, which names this interaction,
    // not the idea behind it. Lets recurrence detection generalize across
    // different-looking errors that share one misconception, which
    // error_signature_normalized's exact-text match cannot.
    concept: { type: 'string', minLength: 2, maxLength: 40 },
    confidence: { enum: ['high', 'low'] },
    needsMoreContext: { type: 'boolean' },
    l0_decode: { type: 'string', minLength: 20, maxLength: 600 },
    l1_locate: { type: 'string', minLength: 15, maxLength: 400 },
    l2_concept: {
      type: 'object',
      required: ['rule', 'example'],
      properties: {
        rule: { type: 'string', maxLength: 500 },
        example: { type: 'string', maxLength: 500 },
      },
    },
    l3_fix: {
      type: 'object',
      required: ['change', 'why'],
      properties: {
        change: { type: 'string', maxLength: 600 },
        why: { type: 'string', maxLength: 400 },
      },
    },
  },
};

export interface HintLadder {
  title: string;
  concept: string;
  confidence: 'high' | 'low';
  needsMoreContext: boolean;
  l0_decode: string;
  l1_locate: string;
  l2_concept: { rule: string; example: string };
  l3_fix: { change: string; why: string };
}

export function validateStructure(raw: string): { valid: boolean; value?: HintLadder; errors: string[] } {
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    return { valid: false, errors: ['not valid JSON'] };
  }
  if (typeof obj !== 'object' || obj === null) return { valid: false, errors: ['not a JSON object'] };

  const o = obj as Record<string, unknown>;
  const errors: string[] = [];
  const allowedKeys = new Set([
    'title',
    'concept',
    'confidence',
    'needsMoreContext',
    'l0_decode',
    'l1_locate',
    'l2_concept',
    'l3_fix',
  ]);
  for (const key of Object.keys(o)) {
    if (!allowedKeys.has(key)) errors.push(`unexpected field "${key}"`);
  }

  checkString(o.title, 'title', 5, 60, errors);
  checkString(o.concept, 'concept', 2, 40, errors);
  if (o.confidence !== 'high' && o.confidence !== 'low') errors.push('confidence must be "high" or "low"');
  if (typeof o.needsMoreContext !== 'boolean') errors.push('needsMoreContext must be a boolean');
  checkString(o.l0_decode, 'l0_decode', 20, 600, errors);
  checkString(o.l1_locate, 'l1_locate', 15, 400, errors);
  checkObjectStrings(o.l2_concept, 'l2_concept', ['rule', 'example'], { rule: 500, example: 500 }, errors);
  checkObjectStrings(o.l3_fix, 'l3_fix', ['change', 'why'], { change: 600, why: 400 }, errors);

  if (errors.length > 0) return { valid: false, errors };
  return { valid: true, value: o as unknown as HintLadder, errors: [] };
}

function checkString(value: unknown, field: string, min: number, max: number, errors: string[]): void {
  if (typeof value !== 'string') {
    errors.push(`${field} must be a string`);
    return;
  }
  if (value.length < min || value.length > max) {
    errors.push(`${field} must be ${min}-${max} characters (got ${value.length})`);
  }
}

function checkObjectStrings(
  value: unknown,
  field: string,
  required: string[],
  maxLengths: Record<string, number>,
  errors: string[],
): void {
  if (typeof value !== 'object' || value === null) {
    errors.push(`${field} must be an object`);
    return;
  }
  const o = value as Record<string, unknown>;
  for (const key of required) {
    checkString(o[key], `${field}.${key}`, 0, maxLengths[key], errors);
  }
}

// ---------- Pedagogical validators (Appendix A "Post-generation validators") ----------

export function hasNoFixLeak(ladder: HintLadder): boolean {
  if (ladder.l0_decode.includes('```')) return false;
  const change = ladder.l3_fix.change.trim();
  return change.length === 0 || !ladder.l0_decode.includes(change);
}

export function l1IsQuestion(ladder: HintLadder): boolean {
  return ladder.l1_locate.trim().endsWith('?');
}

/** Loose identifier-overlap check: the L2 example shouldn't reuse the
 * student's own variable/function names (base spec Appendix A #3). */
export function l2ExampleIsIndependent(ladder: HintLadder, studentCode: string): boolean {
  const studentIdentifiers = new Set(extractIdentifiers(studentCode));
  if (studentIdentifiers.size === 0) return true;
  const exampleIdentifiers = extractIdentifiers(ladder.l2_concept.example);
  return exampleIdentifiers.every((id) => !studentIdentifiers.has(id));
}

function extractIdentifiers(code: string): string[] {
  const matches = code.match(/\b[a-zA-Z_][a-zA-Z0-9_]{2,}\b/g) ?? [];
  const commonKeywords = new Set([
    'def', 'return', 'if', 'else', 'elif', 'for', 'while', 'import', 'from', 'class',
    'function', 'const', 'let', 'var', 'public', 'private', 'static', 'void', 'int',
    'string', 'float', 'double', 'bool', 'true', 'false', 'null', 'none', 'and', 'or', 'not',
  ]);
  return matches.map((m) => m.toLowerCase()).filter((m) => !commonKeywords.has(m));
}

const LANGUAGE_MARKERS: Record<string, RegExp> = {
  tr: /[ğşıöüçİĞŞÖÜÇ]|(\bve\b|\bbir\b|\bbu\b|\bne\b|\bile\b)/i,
  es: /[ñáéíóú¿¡]|(\bel\b|\bla\b|\bque\b|\bpara\b|\beste\b)/i,
};

/** Script/stopword heuristic (base spec Appendix A #5) -- approximate by
 * design; only meant to catch a gross language mismatch. */
export function languageMatches(ladder: HintLadder, language: string): boolean {
  if (language === 'en') return true;
  const marker = LANGUAGE_MARKERS[language];
  if (!marker) return true;
  const sample = `${ladder.l0_decode} ${ladder.l1_locate}`;
  return marker.test(sample);
}

/** docs/SPEC_ADDENDUM.md §2: the rolling summary now travels in the same
 * message as the visible fields, so guard against the model echoing it
 * back to the student. */
export function noRollingSummaryLeak(ladder: HintLadder, rollingSummary: string): boolean {
  const trimmed = rollingSummary.trim();
  if (trimmed.length < 20) return true;
  const haystack = `${ladder.l0_decode} ${ladder.l1_locate} ${ladder.l2_concept.rule} ${ladder.l3_fix.why}`;
  return !haystack.includes(trimmed.slice(0, 40));
}
