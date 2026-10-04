// [FINE-TUNING-DATA]: turning training records into JSONL lines. The records
// and every export line come ready-made from the database
// (dashboard.training_record, migrations/0025); this only serialises them.
import type { TrainingExport, TrainingRecord } from './types';

export type TrainingLine = TrainingExport['records'][number];

/** The step a preview shows: the whole answer, one hint level, or KTO. */
export type TrainingStep = { view: 'sft' } | { view: 'level'; level: number } | { view: 'kto' };

/** One record as the export writes it for that step: the training fields
 * plus the record's metadata (with the level for a per-level line), the
 * same assembly as dashboard_training_export. */
export function lineFor(record: TrainingRecord, step: TrainingStep): TrainingLine | null {
  const { metadata, views } = record;
  if (step.view === 'sft') return views.sft && { ...views.sft, metadata };
  if (step.view === 'kto') return views.kto && { ...views.kto, metadata };
  const level = views.levels.find((l) => l.level === step.level);
  return level ? { messages: level.messages, metadata: { ...metadata, level: level.level } } : null;
}

/** One JSON object per line. Without metadata a line carries only the
 * training fields, which is all some fine-tuning services accept. */
export function toJsonl(lines: TrainingLine[], withMetadata: boolean): string {
  return lines
    .map((line) => {
      if (withMetadata) return JSON.stringify(line);
      const { metadata: _metadata, ...training } = line;
      return JSON.stringify(training);
    })
    .map((text) => `${text}\n`)
    .join('');
}
