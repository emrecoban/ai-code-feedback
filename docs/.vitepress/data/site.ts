// Page tree of the site, in sidebar order. English file names are the same in
// every language (src/<page>.md, src/tr/<page>.md, src/es/<page>.md), so the
// language switcher always lands on the matching page. The sidebar shows only
// the pages that exist, and takes each title from the page's frontmatter.

export const topPages = ['index', 'data-at-a-glance', 'data-flow']

/** Data pages: src/data/<category>/<slug>.md */
export const dataTree: { category: string; pages: string[] }[] = [
  { category: 'accounts', pages: ['consent-status', 'feedback-language'] },
  { category: 'asking', pages: ['trigger-source', 'trigger-surface', 'question-type', 'own-question', 'selection-size', 'error-type', 'question-picker-abandoned'] },
  { category: 'before', pages: ['help-offers', 'help-latency', 'edits-before-asking', 'repeated-error', 'time-since-same-error', 'recurring-concept'] },
  { category: 'ladder', pages: ['hint-depth', 'level-timing', 'explanation'] },
  { category: 'reading', pages: ['time-on-screen', 'back-to-code', 'left-without-acting', 'edit-after-fix', 'fix-undone', 'copied', 'reopened'] },
  { category: 'outcomes', pages: ['error-gone', 'fixed-without-asking', 'edits-per-unaided-fix', 'follow-on-errors', 'files-worked-through', 'running-code'] },
  { category: 'self-report', pages: ['helpful-rating', 'outcome', 'confidence'] },
  { category: 'activity', pages: ['sessions', 'active-days', 'active-time', 'lines', 'files-created', 'languages-edited', 'large-pastes', 'left-vscode', 'saves', 'debug-and-task-runs', 'breaks', 'file-switches'] },
  { category: 'learner', pages: ['ai-learning-summary', 'suggested-practice', 'private-notes'] },
  { category: 'indicators', pages: ['independence-trend', 'hint-was-enough', 'sessions-without-help', 'needs-attention', 'online-and-active', 'questions-over-time', 'concepts-and-errors', 'work-rhythm', 'student-panel'] },
  { category: 'system', pages: ['response-time', 'tokens', 'cache', 'failed-requests', 'usage-limits'] },
]

/** One page per table (ids, keys and internal timestamps live here). */
export const referencePages = [
  'profiles', 'consent-log', 'coding-sessions', 'interactions', 'events', 'explanations',
  'learner-profiles', 'usage-counters', 'rate-limits', 'concept-vocabulary', 'dashboard-accounts', 'functions',
]

export const researchPages = ['research/questions', 'research/linking', 'research/cleaning', 'research/codebook']

/** Unpublished until project.ethicsPagePublished is true (visible in docs:dev). */
export const draftPages = ['ethics']

export const endPages = ['changelog']

/** The eight sections every data page has, in order (heading ids). */
export const dataSections = ['what', 'example', 'visual', 'purpose', 'raw', 'research', 'limits', 'teacher']
