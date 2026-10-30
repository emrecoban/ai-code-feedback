import { getAdminClient } from './authClient.ts';
import { errorResponse } from './http.ts';

// [AI-PAUSE]: an instructor can switch the AI help off from the dashboard
// (public.ai_pause, migrations/0026, addendum §20). explain and
// generate-summary check it before doing anything that would call the
// model. The extension shows any refused request as "Request failed:
// <message>", so the message below is what a student reads.

/** Shown when the instructor left the message empty, in the language the
 * student asked in. Informal address, like the extension's own texts. */
const DEFAULT_MESSAGES: Record<string, string> = {
  en: 'AI help is paused by your instructor. Please try again later.',
  tr: 'Yapay zekâ yardımı eğitmenin tarafından durduruldu. Daha sonra tekrar dene.',
  es: 'Tu profesor ha pausado la ayuda de la IA. Vuelve a intentarlo más tarde.',
};

export interface AiPause {
  paused: boolean;
  /** The instructor's own text, or null for the default. */
  message: string | null;
}

const ACTIVE: AiPause = { paused: false, message: null };

/** Read on every request, so a pause or resume applies to the very next
 * question. A failed read counts as "not paused": a database hiccup must
 * never switch the help off by accident. A pause whose resume_at has
 * passed is over, the same rule dashboard.ai_pause_json() applies. */
export async function getAiPause(): Promise<AiPause> {
  const { data, error } = await getAdminClient()
    .from('ai_pause')
    .select('paused, message, resume_at')
    .maybeSingle();
  if (error) {
    console.error('Reading ai_pause failed; treating the AI help as active:', error);
    return ACTIVE;
  }
  if (!data?.paused) return ACTIVE;
  if (data.resume_at && Date.parse(data.resume_at) <= Date.now()) return ACTIVE;
  return { paused: true, message: data.message };
}

/** 503 with the code `ai_paused`. Not 401, which would read as a sign-in
 * problem, and not 429, which is the rate limit. */
export function pausedResponse(pause: AiPause, language: string): Response {
  const message = pause.message ?? DEFAULT_MESSAGES[language] ?? DEFAULT_MESSAGES.en;
  return errorResponse('ai_paused', message, 503);
}
