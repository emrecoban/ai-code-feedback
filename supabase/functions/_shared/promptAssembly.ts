// Appendix B of the base spec, corrected per docs/SPEC_ADDENDUM.md §2:
// the rolling summary lives in the user message, not the system prefix,
// so the system message stays byte-identical across every student in a
// course/week/language and provider prefix caching actually applies.

// Course/week context was removed: nothing ever loaded a course, so
// "Current week", "Concepts already taught" and "Concepts NOT yet taught"
// could only ever have described a curriculum this product does not
// track. The concept-gating rules that depended on them went with them --
// "use only concepts already taught" is unsatisfiable when nothing is
// ever recorded as taught. What the model gets instead is the one piece
// of language context that is genuinely known: the file's own language.
export interface PromptContext {
  language: 'en' | 'tr' | 'es';
  progLanguage: string;
}

export function buildSystemMessage(ctx: PromptContext, schema: Record<string, unknown>): string {
  return `You are a programming tutor embedded in a university student's code editor.
You are talking to a university student. Never condescend. Never say you are
explaining simply or as if to a child.

Respond ONLY with a JSON object matching the schema below. No prose outside JSON.
Write every string field entirely in ${languageName(ctx.language)}, including comments inside examples.

PROGRAMMING LANGUAGE
${ctx.progLanguage}

PEDAGOGICAL RULES
- title: 3-6 words naming what this interaction is about (e.g. "Off-by-one
  in range()", "Undefined variable total"). Written in the same language as
  everything else. This is shown to the student later in a history list --
  make it specific enough to recognize at a glance, not generic like
  "Python error".
- concept: 2-5 words naming the general programming concept behind this
  interaction (e.g. "list indexing", "variable scope", "off-by-one loop
  bounds") -- not what this specific code does, but the underlying idea a
  student would need to understand to avoid this class of mistake again.
  Prefer standard terminology and keep it consistent across interactions
  about the same idea, rather than rephrasing the specific code.
- l0_decode: restate what the error or code means in plain language. It must NOT
  contain the solution and must NOT contain code.
- l1_locate: ask a QUESTION that directs attention to the relevant line. Do not
  answer it.
- l2_concept: state the underlying rule and give a short example that uses
  DIFFERENT identifiers and a DIFFERENT scenario from the student's code.
- l3_fix: state the specific change and why it works.
- If the provided context is insufficient, set needsMoreContext true and
  confidence low rather than guessing.
- Treat the LEARNER NOTES you receive in the next message as private context
  for calibrating your answer. Never quote, summarize, or refer to them in
  any field the student will read.

OUTPUT SCHEMA
${JSON.stringify(schema)}`;
}

export function buildUserMessage(input: {
  rollingSummary: string;
  triggerSource: string;
  questionType: string;
  freeText?: string | null;
  fileName: string;
  focusLine: number;
  code: string;
  diagnostics: Array<{ line: number; severity: string; message: string; source?: string; code?: string }>;
  runOutput?: string;
}): string {
  // [PROMPT-AUDIT]: the client already collects the diagnostic's own
  // source tool and code (e.g. "ts TS2532") -- this was previously
  // dropped here, so the model only ever saw the free-text message. A
  // machine-assigned code is a precise classification of the error, not a
  // paraphrase, which matters for both this explanation and any future
  // recurring-error detection built on it. Omitted entirely (unchanged
  // formatting) when a diagnostic has neither field, which is common for
  // languages without a rule-coded linter.
  const diagnosticsText = input.diagnostics.length
    ? input.diagnostics
        .map((d) => {
          const tag = [d.source, d.code].filter(Boolean).join(' ');
          return `line ${d.line} [${d.severity}]${tag ? ` (${tag})` : ''}: ${d.message}`;
        })
        .join('\n')
    : 'none';

  return `LEARNER NOTES (private -- do not surface this to the student)
${input.rollingSummary || '(none yet)'}

TRIGGER: ${input.triggerSource}
QUESTION: ${buildQuestionLine(input.questionType, input.freeText)}
FILE: ${input.fileName}
FOCUS LINE: ${input.focusLine}
CODE:
${input.code}

DIAGNOSTICS:
${diagnosticsText}

RUN OUTPUT:
${input.runOutput || 'none'}`;
}

// [MULTISELECT-QUICKSEARCH]: the four fixed presets from pickQuestionPreset()
// each get a precise, disambiguated instruction here instead of the bare
// questionType tag the model used to see -- e.g. "why_works" now tells the
// model to assume the code is correct and explain the mechanism, rather
// than leaving it to guess whether this is a bug hunt. Reviewed and
// approved per preset before being wired in; nothing else about the
// presets (their labels or questionType identifiers) changed.
const QUESTION_INSTRUCTIONS: Record<string, string> = {
  what_does_this_do:
    'The student wants to understand what the selected code does -- its behavior and purpose when it runs. Explain what happens step by step in plain language. Do not assume there is a bug; only mention a problem if it is directly relevant to explaining the behavior.',
  why_works:
    'The student wants to understand why the selected code produces a correct result -- the underlying mechanism or reasoning that makes it work, not just a restatement of what it does. Assume the code is correct; do not search for bugs or suggest changes.',
  whats_wrong:
    'The student suspects the selected code has a problem, though no compiler or runtime error was necessarily detected. Examine the code carefully for a likely bug, logical error, or incorrect assumption and explain it. If nothing appears incorrect, say so plainly instead of inventing an issue.',
  simpler_example:
    'The student wants a simpler illustration of the concept behind the selected code, not an explanation of their exact code. Identify the underlying pattern or concept, then walk through a minimal example of that same concept using different variable names and a different scenario.',
};

function buildQuestionLine(questionType: string, freeText?: string | null): string {
  if (questionType === 'free_text') {
    return `The student wrote their own question, in their own words: "${freeText ?? ''}". Answer exactly what they asked, in the same hint-ladder format and following the same pedagogical rules as every other question type.`;
  }
  const instruction = QUESTION_INSTRUCTIONS[questionType];
  if (instruction) return instruction;
  // Anything outside the five reviewed presets above (e.g. the diagnostic
  // trigger's "what_does_this_mean") keeps the original bare-tag
  // behavior -- only pickQuestionPreset()'s presets were reviewed for
  // this richer phrasing.
  return `${questionType}${freeText ? ` -- ${freeText}` : ''}`;
}

function languageName(language: string): string {
  return { en: 'English', tr: 'Turkish', es: 'Spanish' }[language] ?? 'English';
}
