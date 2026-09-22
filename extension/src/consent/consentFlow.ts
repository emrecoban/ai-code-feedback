import * as vscode from 'vscode';
import type { SupabaseClient } from '@supabase/supabase-js';
import { CONSENT_TEXT_VERSION } from '../constants';
import { t } from '../i18n/strings';
import { logger } from '../util/logger';

export type ConsentStatus = 'pending' | 'granted' | 'declined';

/**
 * Shown once, before the first model call or telemetry event (base spec
 * §13.1). Declining does NOT disable AI feedback -- only telemetry -- so
 * callers must not gate the feature itself on the returned status being
 * 'granted'; only on it no longer being 'pending'.
 */
export async function ensureConsent(
  client: SupabaseClient,
  userId: string,
  currentStatus: ConsentStatus,
): Promise<ConsentStatus> {
  if (currentStatus !== 'pending') {
    return currentStatus;
  }

  const grant = t('I agree');
  const decline = t('No thanks');
  const choice = await vscode.window.showInformationMessage(t('CONSENT_TEXT'), { modal: true }, grant, decline);

  if (choice !== grant && choice !== decline) {
    // Dismissed without an answer (e.g. Escape) -- ask again next time
    // rather than silently recording a decision nobody made.
    return 'pending';
  }

  const status: ConsentStatus = choice === grant ? 'granted' : 'declined';
  const now = new Date().toISOString();

  const { error: profileErr } = await client
    .from('profiles')
    .update({ consent_status: status, consent_at: now })
    .eq('id', userId);
  if (profileErr) logger.error('Failed to persist consent status', profileErr);

  const { error: logErr } = await client
    .from('consent_log')
    .insert({ user_id: userId, status, version: CONSENT_TEXT_VERSION });
  if (logErr) logger.error('Failed to write consent_log row', logErr);

  return status;
}
