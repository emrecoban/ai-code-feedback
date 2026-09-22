# Change Log

All notable changes to the "ai-code-feedback" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.2.0] - 22 Sep 2026

A complete rewrite. The extension no longer watches you type and no longer
needs an API key of your own. Feedback is now something you ask for, and it
arrives in four steps you open one at a time.

### Added

- Four-level hint ladder for every explanation: Decode (what the error says), Locate (a question pointing at the line), Concept (the underlying rule, with a different example), Fix (the specific change and why it works). Decode and Locate appear immediately; the rule and the fix only open if you choose to open them.
- "What does this mean?" beside both errors and warnings, reachable from the CodeLens above the line, the gutter icon, or the lightbulb menu.
- "Ask about this selection" for any highlighted code, with four preset questions (what does this do / why does this work / what's wrong here / show me a simpler example) or a question in your own words. Reachable from the CodeLens, the gutter icon, the status bar, or Ctrl+Alt+Space (Cmd+Alt+Space on macOS).
- Student accounts with sign-in, and a consent notice shown before the first model call.
- Progress panel: your own totals, a short written summary of your recent activity, and a suggested practice problem.
- Recent activity list — hover a card for detail, click it to re-read an explanation you received earlier.
- One-click self-report under each explanation: whether it helped, whether you solved the problem, and whether you could do it yourself now.
- Runtime language switching for both the interface and the feedback (English, Türkçe, Español) — no VS Code restart, and each student on a shared machine can choose their own.
- Larger text option for the panel.
- Redaction of likely secrets (API keys, tokens, private keys) and e-mail addresses before any code leaves your machine.
- Research instrumentation for the study this extension supports: which explanations were opened and how far, how long before help was asked for, whether the reported problem was fixed afterwards, and related editor activity.

### Changed

- Feedback is no longer generated in real time or after an idle period. It is only ever produced when you explicitly ask.
- AI provider and model are configured on the server. You no longer supply, store, or pay for an API key.
- The panel is now a full session view (explanation, progress, history) rather than a feedback log.
- Minimum supported VS Code version is now 1.90.

### Removed

- The `aiFeedback.apiKey`, `aiFeedback.provider`, `aiFeedback.model`, `aiFeedback.idleMs` and `aiFeedback.language` settings.
- The `aiFeedback.changeLanguage` and `aiFeedback.clearFeedback` commands. Language is now changed from the panel; there is no feedback log to clear.

### Upgrading from 0.0.1

- Settings from 0.0.1 are no longer read. In particular, **`aiFeedback.apiKey` still holds your old provider key in plain text in `settings.json` — delete it.** The extension no longer stores keys on your machine.
- Any custom keybinding pointing at `aiFeedback.changeLanguage` or `aiFeedback.clearFeedback` will no longer resolve.
- On VS Code older than 1.90 the update will not be offered and 0.0.1 stays installed.

## [0.0.1] - 20 Aug 2025

### Added

- Initial release of AI Code Feedback extension
- Real-time feedback generation when cursor is idle or code is selected
- Support for three AI providers: ChatGPT, Gemini, and Claude
- Three language options for feedback: English, Turkish, and Spanish
- Configurable idle time before feedback generation
- Feedback history panel with visual indicators for active and past feedback
- Settings page for configuring AI provider, API key, model, and language
- Error handling for API failures and missing configurations
- Extension icon and improved UI with better readability

### Fixed

- TypeScript compilation errors for API response types
- Model name validation for Gemini API
- Network error handling and detailed error messages

### Known Issues

- Some AI models may occasionally return longer responses than expected
- Feedback generation may be delayed with slow network connections
