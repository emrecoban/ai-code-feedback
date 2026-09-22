import type { SessionManager } from '../auth/sessionManager';
import { callEdgeFunction } from './client';
import { logger } from '../util/logger';

export type ResearchEventType =
  | 'post_feedback_edit'
  | 'diagnostic_resolved'
  | 'explanation_visibility'
  | 'fix_undone'
  | 'question_picker_abandoned'
  | 'returned_to_code'
  | 'feedback_abandoned'
  | 'request_failed'
  | 'file_cleared'
  | 'feedback_language_changed'
  | 'explanation_reopened'
  | 'explanation_copied'
  | 'run_finished';

export interface ResearchEvent {
  eventType: ResearchEventType;
  /** Deterministic, natural key (e.g. `diagnostic_resolved:<interactionId>`)
   * rather than a random id -- events.client_event_id is unique per user,
   * so a natural key makes a retried or repeated report silently idempotent
   * instead of double-counting. */
  clientEventId: string;
  /** Derived measurements only -- never raw code or text the student wrote. */
  payload: Record<string, unknown>;
  interactionId?: string;
  sessionId?: string;
}

/** [FEEDBACK-EFFECTIVENESS]: single client -> log-event path for research
 * events the server can't observe on its own. Best-effort by design: a
 * lost event costs one data point and is never worth interrupting the
 * student over, so failures are logged and swallowed -- the same tolerance
 * recordLevelReached() already applies. */
export async function logResearchEvent(sessionManager: SessionManager, event: ResearchEvent): Promise<void> {
  try {
    const accessToken = await sessionManager.getAccessToken();
    if (!accessToken) return;
    await callEdgeFunction(
      'log-event',
      {
        eventType: event.eventType,
        clientEventId: event.clientEventId,
        interactionId: event.interactionId ?? null,
        sessionId: event.sessionId ?? null,
        payload: event.payload,
      },
      accessToken,
    );
  } catch (err) {
    logger.error(`logResearchEvent(${event.eventType}) failed`, err);
  }
}
