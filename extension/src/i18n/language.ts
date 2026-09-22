import * as vscode from 'vscode';

const SUPPORTED = ['en', 'tr', 'es'] as const;
export type FeedbackLanguage = (typeof SUPPORTED)[number];

/**
 * Seeds the initial value of aiFeedback.feedbackLanguage only. VS Code's
 * own display language -- not this -- decides which l10n bundle loads for
 * UI strings; vscode.l10n has no runtime-switchable override, so
 * aiFeedback.uiLanguage only takes effect if the user also changes VS
 * Code's own display language.
 */
export function guessDefaultFeedbackLanguage(): FeedbackLanguage {
  const base = vscode.env.language.split('-')[0].toLowerCase();
  return (SUPPORTED as readonly string[]).includes(base) ? (base as FeedbackLanguage) : 'en';
}
