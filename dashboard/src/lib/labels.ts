import type { MessageKey } from '../i18n/en';

/** max_level_reached (0-3) as the step the student stopped at. */
export const levelKey = (level: number): MessageKey =>
  level >= 3 ? 'level.fix' : level === 2 ? 'level.rule' : 'level.hint';
