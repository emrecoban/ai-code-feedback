import * as vscode from 'vscode';
import type { AuthState } from '../auth/sessionManager';
import type { ExplainResponse } from '../backend/types';
import type { UserStatsView } from '../stats/statsStore';
import { MIN_PASSWORD_LENGTH } from '../constants';

const EMPTY_STATS: UserStatsView = {
  hasActivity: false,
  narrative: null,
  history: [],
  numbers: [],
  narrativeIsStale: false,
  summaryProgress: 0,
};

type FeedbackLanguage = 'en' | 'tr' | 'es';
type TextSize = 'normal' | 'large';

/**
 * Everything in this webview is text this class generates itself, so
 * unlike vscode.l10n (locked to VS Code's own display language for the
 * whole session -- no API lets an extension re-translate on demand), the
 * sidebar's own strings CAN switch at runtime. The one language picker
 * drives both this table and profiles.feedback_language, so it is
 * genuinely "one picker for feedback and UI" for everything inside the
 * sidebar. Sign-in prompts, notifications, and command titles live
 * outside the webview and still follow VS Code's own display language --
 * no extension API can change that.
 */
const STRINGS: Record<
  FeedbackLanguage,
  {
    appTitle: string;
    welcome: (name: string) => string;
    explainSelection: string;
    signedOutHint: string;
    showRule: string;
    showFix: string;
    cachedNote: string;
    degradedNote: string;
    languageLabel: string;
    loadingText: string;
    decodeLabel: string;
    locateLabel: string;
    conceptLabel: string;
    fixLabel: string;
    usernameLabel: string;
    passwordLabel: string;
    logInSignUp: string;
    authLoadingText: string;
    statsHeading: string;
    passwordTooShort: (min: number) => string;
    narrativeEmptyState: string;
    narrativeGatheringState: string;
    tryThisHeading: string;
    recentHeading: string;
    nextUpdateLabel: string;
    solvedYourselfLabel: string;
    sawRuleLabel: string;
    sawFixLabel: string;
    popoverAskedLabel: string;
    popoverHowLabel: string;
    popoverErrorLabel: string;
    qtWhatDoesThisMean: string;
    qtWhatDoesThisDo: string;
    qtWhyWorks: string;
    qtWhatsWrong: string;
    qtSimplerExample: string;
    qtFreeText: string;
    qtUnspecified: string;
    triggerDiagnostic: string;
    triggerSelection: string;
    helpfulQuestion: string;
    helpfulYes: string;
    helpfulNo: string;
    outcomeQuestion: string;
    outcomeSolved: string;
    outcomeStuck: string;
    selfReportThanks: string;
    confidenceQuestion: string;
    confidenceYes: string;
    confidenceMaybe: string;
    confidenceNo: string;
  }
> = {
  en: {
    appTitle: 'AI Code Feedback',
    welcome: (name) => `Welcome, ${name}!`,
    explainSelection: 'Explain my selection',
    signedOutHint: 'Sign in to receive feedback on your code.',
    showRule: 'Show me the rule',
    showFix: 'Show me the fix',
    cachedNote: 'Showing a previous answer for this.',
    degradedNote: "This touches a concept your course hasn't covered yet, so the rule and fix are held back.",
    languageLabel: 'Language',
    loadingText: 'Getting feedback…',
    decodeLabel: 'Decode',
    locateLabel: 'Locate',
    conceptLabel: 'Concept',
    fixLabel: 'Fix',
    usernameLabel: 'Username',
    passwordLabel: 'Password',
    logInSignUp: 'Log in / Sign Up',
    authLoadingText: 'Signing in…',
    statsHeading: 'Your Stats',
    passwordTooShort: (min) => `Password must be at least ${min} characters.`,
    narrativeEmptyState:
      "As you continue using the extension, a summary of your activity will appear here. I don't have enough data yet.",
    narrativeGatheringState:
      "I don't have enough data yet to summarize this -- check back after a few more explanations.",
    tryThisHeading: 'Try this one',
    recentHeading: 'Recent',
    nextUpdateLabel: 'Next update',
    solvedYourselfLabel: 'solved yourself',
    sawRuleLabel: 'saw the rule',
    sawFixLabel: 'saw the fix',
    popoverAskedLabel: 'Question',
    popoverHowLabel: 'How',
    popoverErrorLabel: 'Error',
    qtWhatDoesThisMean: 'What does this mean?',
    qtWhatDoesThisDo: 'What does this do?',
    qtWhyWorks: 'Why does this work?',
    qtWhatsWrong: "What's wrong here?",
    qtSimplerExample: 'Show me a simpler example',
    qtFreeText: 'A custom question',
    qtUnspecified: 'Not recorded',
    triggerDiagnostic: 'From a warning or error in your code',
    triggerSelection: 'You selected code and asked',
    helpfulQuestion: 'Was this helpful?',
    helpfulYes: 'Yes',
    helpfulNo: 'Not really',
    outcomeQuestion: 'How did it go?',
    outcomeSolved: 'Solved it',
    outcomeStuck: 'Still stuck',
    selfReportThanks: 'Thanks.',
    confidenceQuestion: 'Could you do this one yourself now?',
    confidenceYes: 'Yes',
    confidenceMaybe: 'Maybe',
    confidenceNo: 'Not yet',
  },
  tr: {
    appTitle: 'AI Code Feedback',
    welcome: (name) => `Hoş geldin, ${name}!`,
    explainSelection: 'Seçimimi açıkla',
    signedOutHint: 'Kodun hakkında geri bildirim almak için giriş yap.',
    showRule: 'Kuralı göster',
    showFix: 'Düzeltmeyi göster',
    cachedNote: 'Bunun için daha önceki bir yanıt gösteriliyor.',
    degradedNote: 'Bu, dersinde henüz işlenmemiş bir kavrama değiniyor; bu yüzden kural ve düzeltme şimdilik gösterilmiyor.',
    languageLabel: 'Dil',
    loadingText: 'Geri bildirim alınıyor…',
    decodeLabel: 'Çöz',
    locateLabel: 'Bul',
    conceptLabel: 'Kavram',
    fixLabel: 'Düzeltme',
    usernameLabel: 'Kullanıcı adı',
    passwordLabel: 'Şifre',
    logInSignUp: 'Giriş Yap / Kaydol',
    authLoadingText: 'Giriş yapılıyor…',
    statsHeading: 'İstatistiklerin',
    passwordTooShort: (min) => `Şifre en az ${min} karakter olmalı.`,
    narrativeEmptyState:
      'Uzantıyı kullanmaya devam ettikçe etkinlik özetin burada görünecek. Henüz yeterli verim yok.',
    narrativeGatheringState:
      'Bunu özetlemek için henüz yeterli verim yok -- birkaç açıklama daha sonra tekrar bak.',
    tryThisHeading: 'Bunu dene',
    recentHeading: 'Son etkinlikler',
    nextUpdateLabel: 'Sonraki güncelleme',
    solvedYourselfLabel: 'kendin çözdün',
    sawRuleLabel: 'kuralı gördün',
    sawFixLabel: 'düzeltmeyi gördün',
    popoverAskedLabel: 'Soru',
    popoverHowLabel: 'Nasıl',
    popoverErrorLabel: 'Hata',
    qtWhatDoesThisMean: 'Bu ne anlama geliyor?',
    qtWhatDoesThisDo: 'Bu ne işe yarıyor?',
    qtWhyWorks: 'Bu neden çalışıyor?',
    qtWhatsWrong: 'Burada ne yanlış?',
    qtSimplerExample: 'Bana daha basit bir örnek göster',
    qtFreeText: 'Özel bir soru',
    qtUnspecified: 'Kaydedilmedi',
    triggerDiagnostic: 'Kodundaki bir uyarı veya hatadan',
    triggerSelection: 'Bir kod seçip sordun',
    helpfulQuestion: 'Bu yardımcı oldu mu?',
    helpfulYes: 'Evet',
    helpfulNo: 'Pek değil',
    outcomeQuestion: 'Sonuç ne oldu?',
    outcomeSolved: 'Çözdüm',
    outcomeStuck: 'Hâlâ takıldım',
    selfReportThanks: 'Teşekkürler.',
    confidenceQuestion: 'Bunu şimdi kendin yapabilir misin?',
    confidenceYes: 'Evet',
    confidenceMaybe: 'Belki',
    confidenceNo: 'Henüz değil',
  },
  es: {
    appTitle: 'AI Code Feedback',
    welcome: (name) => `¡Bienvenido/a, ${name}!`,
    explainSelection: 'Explicar mi selección',
    signedOutHint: 'Inicia sesión para recibir comentarios sobre tu código.',
    showRule: 'Mostrar la regla',
    showFix: 'Mostrar la corrección',
    cachedNote: 'Mostrando una respuesta anterior para esto.',
    degradedNote: 'Esto involucra un concepto que tu curso aún no ha cubierto, así que la regla y la corrección se mantienen ocultas por ahora.',
    languageLabel: 'Idioma',
    loadingText: 'Obteniendo retroalimentación…',
    decodeLabel: 'Decodificar',
    locateLabel: 'Ubicar',
    conceptLabel: 'Concepto',
    fixLabel: 'Corrección',
    usernameLabel: 'Nombre de usuario',
    passwordLabel: 'Contraseña',
    logInSignUp: 'Iniciar Sesión / Registrarse',
    authLoadingText: 'Iniciando sesión…',
    statsHeading: 'Tus Estadísticas',
    passwordTooShort: (min) => `La contraseña debe tener al menos ${min} caracteres.`,
    narrativeEmptyState:
      'A medida que sigas usando la extensión, aquí aparecerá un resumen de tu actividad. Todavía no tengo suficientes datos.',
    narrativeGatheringState:
      'Todavía no tengo suficientes datos para resumir esto -- vuelve a mirar después de algunas explicaciones más.',
    tryThisHeading: 'Prueba esto',
    recentHeading: 'Reciente',
    nextUpdateLabel: 'Próxima actualización',
    solvedYourselfLabel: 'lo resolviste tú mismo/a',
    sawRuleLabel: 'viste la regla',
    sawFixLabel: 'viste la corrección',
    popoverAskedLabel: 'Pregunta',
    popoverHowLabel: 'Cómo',
    popoverErrorLabel: 'Error',
    qtWhatDoesThisMean: '¿Qué significa esto?',
    qtWhatDoesThisDo: '¿Qué hace esto?',
    qtWhyWorks: '¿Por qué funciona esto?',
    qtWhatsWrong: '¿Qué está mal aquí?',
    qtSimplerExample: 'Muéstrame un ejemplo más simple',
    qtFreeText: 'Una pregunta personalizada',
    qtUnspecified: 'No registrado',
    triggerDiagnostic: 'De una advertencia o error en tu código',
    triggerSelection: 'Seleccionaste código y preguntaste',
    helpfulQuestion: '¿Te ha servido?',
    helpfulYes: 'Sí',
    helpfulNo: 'No mucho',
    outcomeQuestion: '¿Cómo te fue?',
    outcomeSolved: 'Lo resolví',
    outcomeStuck: 'Sigo atascado/a',
    selfReportThanks: 'Gracias.',
    confidenceQuestion: '¿Podrías hacerlo tú ahora?',
    confidenceYes: 'Sí',
    confidenceMaybe: 'Quizás',
    confidenceNo: 'Todavía no',
  },
};

/**
 * [WELCOMEVIEW] (signed-out state) + the signed-in session view, in one
 * webview that toggles between them. The hover-anchored tier-1 reveal
 * from specs/SPEC_ADDENDUM.md §5 is a follow-up increment; for now this
 * panel (base spec §9.3's "session review log") is also where
 * explanations are read, including the L2/L3 reveal and gating-degraded
 * notes, and where the student picks the language for both the sidebar
 * itself and AI feedback.
 *
 * Auth used to open two sequential QuickInput boxes (VS Code's own
 * command-palette-style input strip, "the SearchBar") outside this
 * webview. That's gone: [WELCOMEVIEW] is a real form embedded here, and
 * the extension host's aiFeedback.signIn command now only reveals this
 * panel rather than driving any UI itself.
 */
export class SidebarViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewId = 'aiFeedback.sidebar';

  private view: vscode.WebviewView | undefined;
  private lastState: AuthState = { signedIn: false };
  private lastExplanation: ExplainResponse | undefined;
  private feedbackLanguage: FeedbackLanguage = 'en';
  private textSize: TextSize = 'normal';
  private loading = false;
  private authLoading = false;
  private authError: string | undefined;
  private stats: UserStatsView = EMPTY_STATS;
  // [FEEDBACK-EFFECTIVENESS]: how long the panel was actually on screen
  // while a given explanation was the current one. Every other engagement
  // measure (levels revealed, time between reveals) assumes the student
  // was looking at the panel; this is what makes that assumption checkable
  // rather than taken on faith, since the sidebar can be collapsed or
  // covered by another view the whole time.
  private webviewVisible = false;
  private explanationDwell:
    | { interactionId: string; visibleAtDelivery: boolean; visibleMs: number; visibleSince?: number }
    | undefined;

  constructor(
    private readonly onExplanationDwell: (
      interactionId: string,
      dwell: { visibleMs: number; visibleAtDelivery: boolean },
    ) => void = () => {},
    /** Fires whenever new feedback becomes visible: level 1 when the
     * explanation arrives (L0 and L1 are shown together), then 2 and 3 as
     * the student reveals them. Both moments are already known here,
     * which is why this lives on the view rather than being threaded
     * through every trigger that can start a request. */
    private readonly onFeedbackShown: (interactionId: string, level: number) => void = () => {},
  ) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    this.view = webviewView;
    this.webviewVisible = webviewView.visible;
    webviewView.onDidChangeVisibility(() => this.handleVisibilityChange(webviewView.visible));
    webviewView.webview.options = { enableScripts: true, localResourceRoots: [] };
    webviewView.webview.html = this.renderHtml();

    webviewView.webview.onDidReceiveMessage(
      (message: {
        type: string;
        language?: string;
        username?: string;
        password?: string;
        interactionId?: string;
        level?: number;
        helpfulRating?: number;
        outcome?: string;
        postConfidence?: string;
      }) => {
        switch (message.type) {
          case 'ready':
            this.postState();
            break;
          case 'authSubmit':
            if (message.username && message.password) {
              void vscode.commands.executeCommand('aiFeedback.submitAuth', message.username, message.password);
            }
            break;
          case 'explainSelection':
            void vscode.commands.executeCommand('aiFeedback.explainSelection', 'sidebar_button');
            break;
          case 'setLanguage':
            if (message.language) void vscode.commands.executeCommand('aiFeedback.setFeedbackLanguage', message.language);
            break;
          case 'reopenExplanation':
            if (message.interactionId) {
              void vscode.commands.executeCommand('aiFeedback.reopenExplanation', message.interactionId);
            }
            break;
          case 'explanationCopied':
            if (message.interactionId) {
              void vscode.commands.executeCommand(
                'aiFeedback.recordExplanationCopied',
                message.interactionId,
                message.level,
              );
            }
            break;
          case 'selfReport':
            if (message.interactionId) {
              void vscode.commands.executeCommand(
                'aiFeedback.recordSelfReport',
                message.interactionId,
                message.helpfulRating,
                message.outcome,
                message.postConfidence,
              );
            }
            break;
          case 'levelReached':
            if (message.interactionId && message.level) {
              this.onFeedbackShown(message.interactionId, message.level);
              void vscode.commands.executeCommand(
                'aiFeedback.recordLevelReached',
                message.interactionId,
                message.level,
              );
            }
            break;
        }
      },
    );
  }

  setAuthState(state: AuthState): void {
    this.lastState = state;
    this.lastExplanation = undefined;
    this.loading = false;
    this.authLoading = false;
    this.authError = undefined;
    if (!state.signedIn) this.stats = EMPTY_STATS;
    this.postState();
  }

  setExplanation(response: ExplainResponse): void {
    // The previous explanation's dwell ends the moment it's replaced.
    this.flushExplanationDwell();
    this.explanationDwell = {
      interactionId: response.interactionId,
      visibleAtDelivery: this.webviewVisible,
      visibleMs: 0,
      visibleSince: this.webviewVisible ? Date.now() : undefined,
    };

    this.lastExplanation = response;
    this.loading = false;
    this.view?.webview.postMessage({ type: 'explanation', response });
    this.onFeedbackShown(response.interactionId, 1);
  }

  /** [FEEDBACK-EFFECTIVENESS]: renders a past explanation again, from the
   * history list. Shares the webview's render path with a live response
   * but deliberately not its instrumentation: re-reading is not a new
   * delivery, so it must not restart dwell tracking or re-arm the
   * attention/fix trackers, which would otherwise record a second,
   * spurious "feedback shown" for an interaction answered days ago. */
  replayExplanation(response: ExplainResponse): void {
    this.lastExplanation = response;
    this.view?.webview.postMessage({ type: 'explanation', response });
  }

  /** Reports the current explanation's dwell and stops tracking it.
   * Called when an explanation is superseded, and once more on shutdown so
   * the last explanation of a session isn't silently dropped. */
  flushExplanationDwell(): void {
    const dwell = this.explanationDwell;
    if (!dwell) return;
    this.explanationDwell = undefined;

    const visibleMs = dwell.visibleMs + (dwell.visibleSince ? Date.now() - dwell.visibleSince : 0);
    this.onExplanationDwell(dwell.interactionId, { visibleMs, visibleAtDelivery: dwell.visibleAtDelivery });
  }

  private handleVisibilityChange(visible: boolean): void {
    this.webviewVisible = visible;
    const dwell = this.explanationDwell;
    if (!dwell) return;

    if (visible) {
      dwell.visibleSince = Date.now();
    } else if (dwell.visibleSince) {
      dwell.visibleMs += Date.now() - dwell.visibleSince;
      dwell.visibleSince = undefined;
    }
  }

  /** [USER-STATS]: whatever the caller passes is rendered as-is, band by
   * band -- the sidebar has no built-in notion of which statistics exist
   * or what the narrative/history bands contain, that lives entirely in
   * stats/statsStore.ts. */
  setStats(stats: UserStatsView): void {
    this.stats = stats;
    this.view?.webview.postMessage({ type: 'stats', stats });
  }

  /** Base spec §9.4 / Appendix C #1: this must never get stuck on --
   * callers set it in a try/finally around the request. */
  setLoading(loading: boolean): void {
    this.loading = loading;
    this.view?.webview.postMessage({ type: 'loading', loading });
  }

  /** [WELCOMEVIEW]'s own loading state -- separate from setLoading(),
   * which is the signed-in explain-request spinner and would otherwise
   * show the wrong copy and disable the wrong controls. Same
   * never-get-stuck guarantee: callers use try/finally. */
  setAuthLoading(loading: boolean): void {
    this.authLoading = loading;
    this.view?.webview.postMessage({ type: 'authLoading', loading });
  }

  /** Pass undefined to clear. Already-localized by the caller (extension
   * host's own i18n/strings.ts), since the failure reasons live there. */
  setAuthError(message: string | undefined): void {
    this.authError = message;
    this.view?.webview.postMessage({ type: 'authError', message });
  }

  setFeedbackLanguage(language: FeedbackLanguage): void {
    this.feedbackLanguage = language;
    this.postState();
  }

  /** [AUTH-TOOLBAR]'s text-size icon. A device-level display preference,
   * not tied to any one account -- it applies to the webview's whole
   * body (signed-in and signed-out views alike), independent of which
   * student is currently signed in. */
  setTextSize(size: TextSize): void {
    this.textSize = size;
    this.postState();
  }

  private postState(): void {
    const t = STRINGS[this.feedbackLanguage];
    this.view?.webview.postMessage({
      type: 'state',
      signedIn: this.lastState.signedIn,
      loading: this.loading,
      authLoading: this.authLoading,
      authError: this.authError,
      feedbackLanguage: this.feedbackLanguage,
      textSize: this.textSize,
      minPasswordLength: MIN_PASSWORD_LENGTH,
      strings: {
        header: this.lastState.username ? t.welcome(this.lastState.username) : t.appTitle,
        explainSelection: t.explainSelection,
        signedOutHint: t.signedOutHint,
        showRule: t.showRule,
        showFix: t.showFix,
        cachedNote: t.cachedNote,
        degradedNote: t.degradedNote,
        languageLabel: t.languageLabel,
        loadingText: t.loadingText,
        decodeLabel: t.decodeLabel,
        locateLabel: t.locateLabel,
        conceptLabel: t.conceptLabel,
        fixLabel: t.fixLabel,
        usernameLabel: t.usernameLabel,
        passwordLabel: t.passwordLabel,
        logInSignUp: t.logInSignUp,
        authLoadingText: t.authLoadingText,
        statsHeading: t.statsHeading,
        passwordTooShort: t.passwordTooShort(MIN_PASSWORD_LENGTH),
        narrativeEmptyState: t.narrativeEmptyState,
        narrativeGatheringState: t.narrativeGatheringState,
        tryThisHeading: t.tryThisHeading,
        recentHeading: t.recentHeading,
        nextUpdateLabel: t.nextUpdateLabel,
        solvedYourselfLabel: t.solvedYourselfLabel,
        sawRuleLabel: t.sawRuleLabel,
        sawFixLabel: t.sawFixLabel,
        popoverAskedLabel: t.popoverAskedLabel,
        popoverHowLabel: t.popoverHowLabel,
        popoverErrorLabel: t.popoverErrorLabel,
        qtWhatDoesThisMean: t.qtWhatDoesThisMean,
        qtWhatDoesThisDo: t.qtWhatDoesThisDo,
        qtWhyWorks: t.qtWhyWorks,
        qtWhatsWrong: t.qtWhatsWrong,
        qtSimplerExample: t.qtSimplerExample,
        qtFreeText: t.qtFreeText,
        qtUnspecified: t.qtUnspecified,
        triggerDiagnostic: t.triggerDiagnostic,
        triggerSelection: t.triggerSelection,
        helpfulQuestion: t.helpfulQuestion,
        helpfulYes: t.helpfulYes,
        helpfulNo: t.helpfulNo,
        outcomeQuestion: t.outcomeQuestion,
        outcomeSolved: t.outcomeSolved,
        outcomeStuck: t.outcomeStuck,
        selfReportThanks: t.selfReportThanks,
        confidenceQuestion: t.confidenceQuestion,
        confidenceYes: t.confidenceYes,
        confidenceMaybe: t.confidenceMaybe,
        confidenceNo: t.confidenceNo,
      },
      explanation: this.lastExplanation,
      stats: this.stats,
    });
  }

  private renderHtml(): string {
    const nonce = getNonce();
    const csp = [`default-src 'none'`, `style-src 'unsafe-inline'`, `script-src 'nonce-${nonce}'`].join('; ');

    return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta http-equiv="Content-Security-Policy" content="${csp}" />
<style>
  /* [AUTH-TOOLBAR] text-size control: everything else in this stylesheet
     sizes text in "em", relative to this base -- scaling it here cascades
     through every rule below without a second scaling mechanism. 1.3x
     ("Large") is deliberately more conservative than the ~3x suggested:
     at 3x, headings/buttons/cards would overflow and wrap badly in a
     narrow side-panel view, whereas 1.3x is still clearly, immediately
     noticeable and stays inside the layout at any panel width. Chrome
     that isn't text (status dots, the progress bar, spinner, padding) is
     sized in fixed px elsewhere and intentionally does NOT scale with this
     -- only the text itself gets larger, per the request. */
  body { font-family: var(--vscode-font-family); font-size: var(--vscode-font-size, 13px);
         color: var(--vscode-foreground); padding: 12px; }
  body.aicf-text-large { font-size: calc(var(--vscode-font-size, 13px) * 1.3); }
  button { display: block; width: 100%; margin-bottom: 8px; padding: 6px 10px; cursor: pointer;
           background: var(--vscode-button-background); color: var(--vscode-button-foreground);
           border: none; border-radius: 2px; text-align: left; font-family: inherit; font-size: inherit; }
  button:hover { background: var(--vscode-button-hoverBackground); }
  button:disabled { opacity: 0.5; cursor: default; }
  select, input[type="text"], input[type="password"] {
    display: block; width: 100%; margin-bottom: 12px; padding: 4px 6px; box-sizing: border-box;
    border-radius: 2px; font-family: inherit; font-size: inherit;
  }
  select { background: var(--vscode-dropdown-background); color: var(--vscode-dropdown-foreground);
           border: 1px solid var(--vscode-dropdown-border, transparent); }
  input[type="text"], input[type="password"] {
    background: var(--vscode-input-background); color: var(--vscode-input-foreground);
    border: 1px solid var(--vscode-input-border, transparent);
  }
  input[type="text"]:disabled, input[type="password"]:disabled { opacity: 0.6; }
  label { display: block; font-size: 0.85em; opacity: 0.8; margin-bottom: 4px; }
  #hint { margin-top: 8px; }
  h3 { margin: 0 0 8px; }
  h4 { margin: 16px 0 8px; font-size: 0.95em; }
  .stats-section { margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--vscode-widget-border, transparent); }
  .stats-section h4 { margin: 0 0 8px; }
  .stat-row { display: flex; justify-content: space-between; gap: 8px; padding: 4px 0; font-size: 0.9em; }
  .stat-label { opacity: 0.75; }
  .stat-value { font-weight: 600; }
  .stats-band { margin-top: 0; }
  .stats-band:not([hidden]) ~ .stats-band:not([hidden]) { margin-top: 14px; }
  .band-heading { font-weight: 600; font-size: 0.8em; opacity: 0.8; margin-bottom: 6px;
                  text-transform: uppercase; letter-spacing: 0.02em; }
  .narrative-text { font-size: 0.9em; line-height: 1.5; margin: 0; white-space: pre-wrap; }
  .summary-progress { margin-top: 8px; }
  .summary-progress-caption { display: flex; justify-content: space-between; font-size: 0.72em;
                                opacity: 0.55; margin-bottom: 3px; }
  .summary-progress-track { height: 4px; border-radius: 2px; overflow: hidden;
                              background: var(--vscode-widget-border, rgba(128, 128, 128, 0.25)); }
  /* Same accent token the sign-in/loading spinner already uses -- one
     "in-progress" color across the whole sidebar rather than a second one
     introduced just for this bar. */
  .summary-progress-fill { height: 100%; border-radius: 2px; transition: width 0.2s ease;
                             background: var(--vscode-progressBar-background, var(--vscode-focusBorder, #0078d4)); }
  .stats-empty { font-size: 0.85em; opacity: 0.75; line-height: 1.5; margin: 0; }
  #historyList { display: flex; flex-direction: column; gap: 6px; }
  .history-card { position: relative; padding: 7px 10px; border: 1px solid var(--vscode-widget-border, transparent);
                  border-radius: 4px; background: transparent;
                  transition: background-color 0.12s ease, border-color 0.12s ease; }
  .history-card:hover { background: var(--vscode-list-hoverBackground, rgba(128, 128, 128, 0.08)); }
  .history-title-row { display: flex; align-items: center; gap: 6px; min-width: 0; }
  .history-title { flex: 1; min-width: 0; font-size: 0.87em; font-weight: 500; overflow: hidden;
                    text-overflow: ellipsis; white-space: nowrap; }
  .history-meta { font-size: 0.78em; opacity: 0.6; margin-top: 4px; }
  /* Extra per-interaction detail that doesn't fit on the card face without
     cluttering it -- shown on hover/focus so it costs nothing until asked
     for. Anchored to the card itself (not the mouse), and also toggled by
     :focus/:focus-within so keyboard users (tabIndex is set on the card in
     script below) get the same information as a mouse hover -- the outcome
     dot's own hover title above already established that color-only /
     hover-only affordances need a keyboard-reachable equivalent in this UI. */
  .history-popover { position: absolute; left: 0; right: 0; top: 100%; margin-top: 4px; z-index: 10;
                      padding: 8px 10px; border: 1px solid var(--vscode-widget-border, transparent);
                      border-radius: 4px; background: var(--vscode-editorHoverWidget-background, var(--vscode-editor-background));
                      color: var(--vscode-editorHoverWidget-foreground, var(--vscode-foreground));
                      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
                      font-size: 0.8em; line-height: 1.5;
                      visibility: hidden; opacity: 0; pointer-events: none;
                      transition: opacity 0.12s ease; }
  .history-card:hover .history-popover,
  .history-card:focus .history-popover,
  .history-card:focus-within .history-popover { visibility: visible; opacity: 1; }
  .popover-time { font-weight: 600; margin-bottom: 4px; }
  .popover-row { display: flex; gap: 6px; }
  .popover-row + .popover-row { margin-top: 2px; }
  .popover-label { opacity: 0.6; flex: none; min-width: 3.5em; }
  .popover-error { margin-top: 4px; opacity: 0.85; word-break: break-word; }
  /* Fixed (not theme-derived) colors: a small dot has no text to check
     contrast against, but keeping all three hand-picked and consistent
     with each other reads better than mixing fixed colors with whatever
     an arbitrary theme's accent happens to be. */
  .outcome-dot { flex: none; width: 7px; height: 7px; border-radius: 50%; }
  .outcome-dot-solved { background: #2e7d32; }
  .outcome-dot-rule { background: #c9a227; }
  .outcome-dot-fix { background: #7a2331; }
  .level { margin-bottom: 10px; padding: 8px 8px 8px 10px; border: 1px solid var(--vscode-widget-border, transparent);
           border-left-width: 3px; border-radius: 4px; }
  .level-label { font-weight: 600; font-size: 0.85em; opacity: 0.8; margin-bottom: 4px; }
  /* Prose inside a level keeps the line breaks the model actually wrote.
     Without this the div defaults to white-space: normal and a multi-line
     example collapses into one run-on line -- the whole reason L2/L3 were
     hard to follow. .narrative-text already did this; the ladder didn't. */
  .level-text { white-space: pre-wrap; }
  /* Code is set apart from the prose around it rather than blending into
     it: monospace, its own tinted panel, and horizontal scrolling instead
     of wrapping, because a wrapped line of code reads as if it were a
     second line of code. Sized in em, not the editor's px font size, so
     [AUTH-TOOLBAR]'s text-size control still scales it. */
  .code-block { margin: 6px 0; padding: 6px 8px; border-radius: 3px; overflow-x: auto;
                background: var(--vscode-textCodeBlock-background, rgba(128, 128, 128, 0.14));
                border: 1px solid var(--vscode-widget-border, rgba(128, 128, 128, 0.25)); }
  .code-block:last-child { margin-bottom: 0; }
  .code-block code { font-family: var(--vscode-editor-font-family, ui-monospace, monospace);
                     font-size: 0.9em; line-height: 1.45; white-space: pre; }
  .inline-code { font-family: var(--vscode-editor-font-family, ui-monospace, monospace);
                 font-size: 0.9em; padding: 0 3px; border-radius: 2px;
                 background: var(--vscode-textCodeBlock-background, rgba(128, 128, 128, 0.14)); }
  /* One fixed hue per hint-ladder level, applied everywhere a level
     appears -- L0 is always this blue, L3 always this amber, regardless
     of when each card renders. color-mix() blends a small amount of that
     fixed hue into the theme's own editor background rather than using a
     flat pastel hex, so the tint stays soft and correctly adapts to
     light/dark themes instead of looking like a mismatched sticker on a
     dark background. Text color is left untouched (still the theme's own
     foreground) precisely so contrast never depends on the tint -- only
     the background wash and the left-edge accent carry the color. */
  .level-l0 { border-left-color: #3b82f6; background: #eaf1fe; background: color-mix(in srgb, #3b82f6 14%, var(--vscode-editor-background)); }
  .level-l1 { border-left-color: #14b8a6; background: #e6f7f5; background: color-mix(in srgb, #14b8a6 14%, var(--vscode-editor-background)); }
  .level-l2 { border-left-color: #8b5cf6; background: #f1ecfe; background: color-mix(in srgb, #8b5cf6 14%, var(--vscode-editor-background)); }
  .level-l3 { border-left-color: #f59e0b; background: #fdf1e0; background: color-mix(in srgb, #f59e0b 14%, var(--vscode-editor-background)); }
  .note { font-size: 0.85em; opacity: 0.75; margin: 4px 0 10px; }
  /* The two self-report rows under an explanation. Deliberately quiet:
     small chips on one line, not full-width buttons like "Show me the
     rule" -- these are optional asides, and should never compete with the
     ladder's own actions for attention. */
  .self-report { margin-top: 12px; padding-top: 10px;
                 border-top: 1px solid var(--vscode-widget-border, rgba(128, 128, 128, 0.25)); }
  .self-report-row { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; margin-bottom: 6px; }
  .self-report-row:last-child { margin-bottom: 0; }
  .self-report-label { font-size: 0.8em; opacity: 0.75; }
  .chip-btn { display: inline-block; width: auto; margin: 0; padding: 2px 9px; font-size: 0.8em;
              border-radius: 10px; background: transparent; color: var(--vscode-foreground);
              border: 1px solid var(--vscode-widget-border, rgba(128, 128, 128, 0.4)); }
  .chip-btn:hover:not([disabled]) { background: var(--vscode-list-hoverBackground, rgba(128, 128, 128, 0.08)); }
  .chip-btn[disabled] { opacity: 0.45; }
  .chip-btn.chip-selected { opacity: 1; font-weight: 600; border-color: var(--vscode-focusBorder, currentColor); }
  .error-text { font-size: 0.85em; color: var(--vscode-errorForeground); margin: 4px 0 10px; }
  /* [hidden] must win over this rule's own display, or toggling the
     "hidden" property from JS has no visual effect -- an element's own
     author-stylesheet "display" always beats the UA default [hidden]
     rule unless it's scoped with :not([hidden]) like this. */
  .loading-row:not([hidden]) { display: flex; align-items: center; gap: 8px; margin: 8px 0; font-size: 0.9em; opacity: 0.85; }
  .spinner { width: 14px; height: 14px; flex: none; border-radius: 50%;
             border: 2px solid var(--vscode-progressBar-background, currentColor);
             border-top-color: transparent; animation: aicf-spin 0.8s linear infinite; }
  @keyframes aicf-spin { to { transform: rotate(360deg); } }
</style>
</head>
<body>
  <h3 id="header"></h3>
  <div id="signedOut" hidden>
    <label id="languageLabelOut" for="languageSelectOut"></label>
    <select id="languageSelectOut">
      <option value="en">English</option>
      <option value="tr">Türkçe</option>
      <option value="es">Español</option>
    </select>
    <p id="signedOutHint"></p>
    <label id="usernameLabel" for="usernameInput"></label>
    <input id="usernameInput" type="text" autocomplete="username" />
    <label id="passwordLabel" for="passwordInput"></label>
    <input id="passwordInput" type="password" autocomplete="current-password" />
    <div id="authError" class="error-text" hidden aria-live="polite"></div>
    <div id="authLoading" class="loading-row" hidden>
      <span class="spinner"></span><span id="authLoadingText"></span>
    </div>
    <button id="logInBtn"></button>
  </div>
  <div id="signedIn" hidden>
    <button id="explainSelectionBtn"></button>
    <div id="loading" class="loading-row" hidden>
      <span class="spinner"></span><span id="loadingText"></span>
    </div>
    <div id="hint"></div>
    <div id="statsSection" class="stats-section">
      <h4 id="statsHeading"></h4>
      <p id="statsEmpty" class="stats-empty stats-band" hidden></p>
      <div id="narrativeBand" class="stats-band" hidden>
        <p id="narrativeText" class="narrative-text"></p>
        <div class="summary-progress">
          <div class="summary-progress-caption">
            <span id="summaryProgressLabel"></span>
            <span id="summaryProgressPct"></span>
          </div>
          <div class="summary-progress-track"><div id="summaryProgressFill" class="summary-progress-fill"></div></div>
        </div>
      </div>
      <div id="practiceBand" class="stats-band" hidden>
        <div id="tryThisHeading" class="band-heading"></div>
        <p id="practiceText" class="narrative-text"></p>
      </div>
      <div id="numbersBand" class="stats-band" hidden>
        <div id="statsList"></div>
      </div>
      <div id="historyBand" class="stats-band" hidden>
        <div id="recentHeading" class="band-heading"></div>
        <div id="historyList"></div>
      </div>
    </div>
  </div>
  <script nonce="${nonce}">
    const vscodeApi = acquireVsCodeApi();
    const header = document.getElementById('header');
    const signedOut = document.getElementById('signedOut');
    const signedIn = document.getElementById('signedIn');
    const signedOutHint = document.getElementById('signedOutHint');
    const explainSelectionBtn = document.getElementById('explainSelectionBtn');
    const hint = document.getElementById('hint');
    const languageLabelOut = document.getElementById('languageLabelOut');
    const languageSelectOut = document.getElementById('languageSelectOut');
    const loadingRow = document.getElementById('loading');
    const loadingText = document.getElementById('loadingText');
    const usernameLabel = document.getElementById('usernameLabel');
    const usernameInput = document.getElementById('usernameInput');
    const passwordLabel = document.getElementById('passwordLabel');
    const passwordInput = document.getElementById('passwordInput');
    const authErrorEl = document.getElementById('authError');
    const authLoadingRow = document.getElementById('authLoading');
    const authLoadingText = document.getElementById('authLoadingText');
    const logInBtn = document.getElementById('logInBtn');
    const statsHeading = document.getElementById('statsHeading');
    const statsEmpty = document.getElementById('statsEmpty');
    const narrativeBand = document.getElementById('narrativeBand');
    const narrativeText = document.getElementById('narrativeText');
    const summaryProgressLabel = document.getElementById('summaryProgressLabel');
    const summaryProgressPct = document.getElementById('summaryProgressPct');
    const summaryProgressFill = document.getElementById('summaryProgressFill');
    const practiceBand = document.getElementById('practiceBand');
    const tryThisHeading = document.getElementById('tryThisHeading');
    const practiceText = document.getElementById('practiceText');
    const historyBand = document.getElementById('historyBand');
    const recentHeading = document.getElementById('recentHeading');
    const historyList = document.getElementById('historyList');
    const numbersBand = document.getElementById('numbersBand');
    const statsList = document.getElementById('statsList');
    let strings = {};
    let minPasswordLength = 8;
    let feedbackLanguage = 'en';

    // [SELECTION-EXPLAIN]: disabled synchronously, in the same tick as the
    // click, before the message even reaches the extension host -- a
    // disabled button also can't fire another click event on its own, so
    // this is what actually rules out a double-click, not a race with
    // whatever comes back over postMessage. The eventual 'loading'
    // message (or a direct setLoading(false) on every early-return path
    // in extension.ts) is what guarantees this always gets re-enabled.
    explainSelectionBtn.addEventListener('click', () => {
      explainSelectionBtn.disabled = true;
      vscodeApi.postMessage({ type: 'explainSelection' });
    });
    languageSelectOut.addEventListener('change', () =>
      vscodeApi.postMessage({ type: 'setLanguage', language: languageSelectOut.value }),
    );

    function submitAuth() {
      const username = usernameInput.value.trim();
      const password = passwordInput.value;
      if (!username || !password) return;
      // Checked here, not just server-side, so the specific message shows
      // instantly with no network round trip (base spec §4.2).
      if (password.length < minPasswordLength) {
        setAuthError(strings.passwordTooShort);
        return;
      }
      setAuthError(undefined);
      vscodeApi.postMessage({ type: 'authSubmit', username, password });
    }
    logInBtn.addEventListener('click', submitAuth);
    passwordInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitAuth();
    });

    function setLoading(isLoading) {
      loadingRow.hidden = !isLoading;
      explainSelectionBtn.disabled = isLoading;
      if (isLoading) {
        loadingText.textContent = strings.loadingText || '';
        while (hint.firstChild) hint.removeChild(hint.firstChild);
      }
    }

    function setAuthLoading(isLoading) {
      authLoadingRow.hidden = !isLoading;
      if (isLoading) authLoadingText.textContent = strings.authLoadingText || '';
      usernameInput.disabled = isLoading;
      passwordInput.disabled = isLoading;
      logInBtn.disabled = isLoading;
    }

    function setAuthError(message) {
      authErrorEl.hidden = !message;
      authErrorEl.textContent = message || '';
    }

    // The model writes prose with fenced code blocks, and occasionally
    // single-backtick spans. Dropped straight into a div, those lose both
    // their line breaks and any visual separation from the sentence around
    // them -- a five-line example arrives as one unreadable run-on line.
    // These three split prose from code instead. Everything goes through
    // textContent / createTextNode, never innerHTML: this is model output.
    const CODE_FENCE = '\`\`\`';

    function renderRichText(container, text) {
      const segments = String(text == null ? '' : text).split(CODE_FENCE);
      for (let i = 0; i < segments.length; i++) {
        // Odd segments sit between fences, even ones are prose. An
        // unclosed fence therefore renders its remainder as code, which
        // is the better guess when the model forgets the closing one.
        if (i % 2 === 1) renderCodeBlock(container, segments[i]);
        else renderProse(container, segments[i]);
      }
    }

    function renderCodeBlock(container, raw) {
      // Strip the model's language tag ("python\\n...") and the blank
      // lines the fences leave behind.
      const body = raw.replace(/^[A-Za-z0-9_+#-]*\\n/, '').replace(/^\\n+|\\s+$/g, '');
      if (!body) return;
      const pre = document.createElement('pre');
      pre.className = 'code-block';
      const codeEl = document.createElement('code');
      codeEl.textContent = body;
      pre.appendChild(codeEl);
      container.appendChild(pre);
    }

    function renderProse(container, raw) {
      const body = raw.replace(/^\\n+|\\n+$/g, '');
      if (!body.trim()) return;
      const block = document.createElement('div');
      block.className = 'level-text';
      const spans = body.split('\`');
      for (let i = 0; i < spans.length; i++) {
        if (!spans[i]) continue;
        if (i % 2 === 1) {
          const codeEl = document.createElement('code');
          codeEl.className = 'inline-code';
          codeEl.textContent = spans[i];
          block.appendChild(codeEl);
        } else {
          block.appendChild(document.createTextNode(spans[i]));
        }
      }
      container.appendChild(block);
    }

    function renderLevel(container, code, label, text) {
      const wrap = document.createElement('div');
      wrap.className = 'level level-' + code.toLowerCase();
      wrap.dataset.level = code; // lets a copy event say which rung it came from
      const labelEl = document.createElement('div');
      labelEl.className = 'level-label';
      labelEl.textContent = code + ' · ' + label;
      wrap.appendChild(labelEl);
      renderRichText(wrap, text);
      container.appendChild(wrap);
    }

    /** One self-report row: a label plus mutually exclusive chips. Once
     * an answer is given the row locks -- this is a single question, not
     * a control the student is meant to keep fiddling with. */
    function renderSelfReportRow(container, labelText, choices, send) {
      const row = document.createElement('div');
      row.className = 'self-report-row';

      const label = document.createElement('span');
      label.className = 'self-report-label';
      label.textContent = labelText;
      row.appendChild(label);

      const buttons = choices.map((choice) => {
        const btn = document.createElement('button');
        btn.className = 'chip-btn';
        btn.textContent = choice.label;
        btn.addEventListener('click', () => {
          buttons.forEach((other) => { other.disabled = true; });
          btn.classList.add('chip-selected');
          send(choice.value);
        }, { once: true });
        row.appendChild(btn);
        return btn;
      });

      container.appendChild(row);
    }

    function renderSelfReport(container, interactionId) {
      const wrap = document.createElement('div');
      wrap.className = 'self-report';

      renderSelfReportRow(
        wrap,
        strings.helpfulQuestion,
        [{ label: strings.helpfulYes, value: 1 }, { label: strings.helpfulNo, value: -1 }],
        (helpfulRating) => vscodeApi.postMessage({ type: 'selfReport', interactionId, helpfulRating }),
      );
      renderSelfReportRow(
        wrap,
        strings.outcomeQuestion,
        [{ label: strings.outcomeSolved, value: 'solved' }, { label: strings.outcomeStuck, value: 'still_stuck' }],
        (outcome) => vscodeApi.postMessage({ type: 'selfReport', interactionId, outcome }),
      );
      renderSelfReportRow(
        wrap,
        strings.confidenceQuestion,
        [
          { label: strings.confidenceYes, value: 'yes' },
          { label: strings.confidenceMaybe, value: 'maybe' },
          { label: strings.confidenceNo, value: 'no' },
        ],
        (postConfidence) => vscodeApi.postMessage({ type: 'selfReport', interactionId, postConfidence }),
      );

      container.appendChild(wrap);
    }

    function renderNote(container, text) {
      const note = document.createElement('div');
      note.className = 'note';
      note.textContent = text;
      container.appendChild(note);
    }

    // Consistent, locale-correct relative time without concatenation
    // (roadmap requirement -- Turkish/Spanish plural and case rules don't
    // follow English's "Xh ago" pattern). Falls back to a weekday name
    // beyond a day, then a short date beyond a week, since a raw "6 days
    // ago" reads worse than "Monday" once you're that far out.
    function formatRelativeTime(iso, locale) {
      const date = new Date(iso);
      const now = new Date();
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
      const diffMin = Math.round((now - date) / 60000);
      if (diffMin < 60) return rtf.format(-diffMin, 'minute');
      const diffHour = Math.round(diffMin / 60);
      const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const diffDay = Math.round((startOfDay(now) - startOfDay(date)) / 86400000);
      if (diffDay === 0) return rtf.format(-diffHour, 'hour');
      if (diffDay === 1) return rtf.format(-1, 'day');
      if (diffDay < 7) return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
      return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(date);
    }

    function renderNumbers(numbers) {
      while (statsList.firstChild) statsList.removeChild(statsList.firstChild);
      for (const stat of numbers || []) {
        const row = document.createElement('div');
        row.className = 'stat-row';
        const label = document.createElement('span');
        label.className = 'stat-label';
        label.textContent = stat.label;
        const value = document.createElement('span');
        value.className = 'stat-value';
        value.textContent = stat.value;
        row.appendChild(label);
        row.appendChild(value);
        statsList.appendChild(row);
      }
    }

    // L0/L1 are always shown immediately when an explanation is
    // generated; L2 (rule) and L3 (fix) only appear once the student
    // clicks to reveal them, which is exactly what max_level_reached
    // tracks. Three outcome buckets, one dot color each.
    function outcomeDotClass(maxLevelReached) {
      if (maxLevelReached >= 3) return 'outcome-dot-fix';
      if (maxLevelReached >= 2) return 'outcome-dot-rule';
      return 'outcome-dot-solved';
    }
    function outcomeLabel(maxLevelReached) {
      if (maxLevelReached >= 3) return strings.sawFixLabel;
      if (maxLevelReached >= 2) return strings.sawRuleLabel;
      return strings.solvedYourselfLabel;
    }
    function levelsLabel(maxLevelReached) {
      const levels = ['L0', 'L1'];
      if (maxLevelReached >= 2) levels.push('L2');
      if (maxLevelReached >= 3) levels.push('L3');
      return levels.join(' · ');
    }

    // question_type/trigger_source are raw DB slugs -- map each to the
    // same phrasing the student already saw when picking it (or, for
    // trigger_source, a plain-language description), rather than
    // surfacing the slug itself.
    function questionTypeLabel(questionType) {
      switch (questionType) {
        case 'what_does_this_mean': return strings.qtWhatDoesThisMean;
        case 'what_does_this_do': return strings.qtWhatDoesThisDo;
        case 'why_works': return strings.qtWhyWorks;
        case 'whats_wrong': return strings.qtWhatsWrong;
        case 'simpler_example': return strings.qtSimplerExample;
        case 'free_text': return strings.qtFreeText;
        default: return strings.qtUnspecified;
      }
    }
    function triggerSourceLabel(triggerSource) {
      if (triggerSource === 'diagnostic') return strings.triggerDiagnostic;
      if (triggerSource === 'selection') return strings.triggerSelection;
      return triggerSource;
    }
    function formatExactTime(iso, locale) {
      return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
    }

    function popoverRow(labelText, valueText) {
      const row = document.createElement('div');
      row.className = 'popover-row';
      const label = document.createElement('span');
      label.className = 'popover-label';
      label.textContent = labelText;
      const value = document.createElement('span');
      value.textContent = valueText;
      row.appendChild(label);
      row.appendChild(value);
      return row;
    }

    // Card layout: a colored dot + title on the first line, the levels
    // reached plus relative time on a second, quieter line underneath --
    // easier to scan than a text badge, especially once titles run long.
    // A hover/focus popover carries the rest of what's already stored for
    // this interaction (exact time, question asked, how it was triggered,
    // the error text when there is one) without cluttering the card face.
    function renderHistory(history) {
      while (historyList.firstChild) historyList.removeChild(historyList.firstChild);
      for (const entry of history || []) {
        const card = document.createElement('div');
        card.className = 'history-card';
        card.tabIndex = 0;
        // Clicking a card re-opens what was said. Keyboard users get the
        // same thing from Enter, since the card is already focusable for
        // the detail popover.
        const reopen = () => vscodeApi.postMessage({ type: 'reopenExplanation', interactionId: entry.id });
        card.addEventListener('click', reopen);
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') reopen();
        });

        const titleRow = document.createElement('div');
        titleRow.className = 'history-title-row';

        const dot = document.createElement('span');
        dot.className = 'outcome-dot ' + outcomeDotClass(entry.maxLevelReached);
        // Color alone shouldn't be the only way this information reaches
        // the student -- a native tooltip covers screen readers and
        // colorblind users without adding visible weight to the card.
        dot.title = outcomeLabel(entry.maxLevelReached);

        const title = document.createElement('span');
        title.className = 'history-title';
        title.textContent = entry.title;

        titleRow.appendChild(dot);
        titleRow.appendChild(title);

        const meta = document.createElement('div');
        meta.className = 'history-meta';
        meta.textContent = levelsLabel(entry.maxLevelReached) + ' · ' + formatRelativeTime(entry.createdAt, feedbackLanguage);

        const popover = document.createElement('div');
        popover.className = 'history-popover';

        const time = document.createElement('div');
        time.className = 'popover-time';
        time.textContent = formatExactTime(entry.createdAt, feedbackLanguage);
        popover.appendChild(time);

        popover.appendChild(popoverRow(strings.popoverAskedLabel, questionTypeLabel(entry.questionType)));
        popover.appendChild(popoverRow(strings.popoverHowLabel, triggerSourceLabel(entry.triggerSource)));

        if (entry.errorSignature) {
          const errorRow = document.createElement('div');
          errorRow.className = 'popover-error';
          errorRow.textContent = strings.popoverErrorLabel + ': ' + entry.errorSignature;
          popover.appendChild(errorRow);
        }

        card.appendChild(titleRow);
        card.appendChild(meta);
        card.appendChild(popover);
        historyList.appendChild(card);
      }
    }

    // [USER-STATS]: one band per section, in display order narrative ->
    // practice -> numbers -> history, so the key figures land before the
    // scrollable detail. Each band is independently
    // toggled via the "hidden" attribute -- adding another band later is
    // a new hidden div (in the right spot in the HTML above) plus a
    // render call here, nothing else in this file has to change. Empty
    // state: zero interactions shows a friendly explanatory line instead
    // of an empty panel; once there's activity but not yet enough for a
    // narrative, the numbers/history bands already have real values even
    // though the narrative band is still "gathering".
    function renderUserStats(view) {
      statsEmpty.hidden = view.hasActivity;
      statsEmpty.textContent = view.hasActivity ? '' : strings.narrativeEmptyState;

      narrativeBand.hidden = !view.hasActivity;
      if (view.hasActivity) {
        narrativeText.textContent = view.narrative ? view.narrative.studentSummary : strings.narrativeGatheringState;
        const pct = Math.round((view.summaryProgress || 0) * 100);
        summaryProgressLabel.textContent = strings.nextUpdateLabel;
        summaryProgressPct.textContent = pct + '%';
        summaryProgressFill.style.width = pct + '%';
      }

      const hasPractice = !!(view.narrative && view.narrative.suggestedPractice);
      practiceBand.hidden = !hasPractice;
      if (hasPractice) {
        tryThisHeading.textContent = strings.tryThisHeading;
        practiceText.textContent = view.narrative.suggestedPractice;
      }

      const hasNumbers = (view.numbers || []).length > 0;
      numbersBand.hidden = !hasNumbers;
      if (hasNumbers) renderNumbers(view.numbers);

      const hasHistory = (view.history || []).length > 0;
      historyBand.hidden = !hasHistory;
      if (hasHistory) {
        recentHeading.textContent = strings.recentHeading;
        renderHistory(view.history);
      }
    }

    function renderExplanation(response) {
      while (hint.firstChild) hint.removeChild(hint.firstChild);
      const levels = response.levels;
      shownInteractionId = response.interactionId;

      // The ladder gets its own container so the reveal buttons and the
      // levels they add stay above the self-report row, which is always
      // last regardless of how far the student climbs.
      const ladder = document.createElement('div');
      hint.appendChild(ladder);
      renderSelfReport(hint, response.interactionId);

      if (response.cacheHit) renderNote(ladder, strings.cachedNote);

      renderLevel(ladder, 'L0', strings.decodeLabel, levels.l0_decode);
      renderLevel(ladder, 'L1', strings.locateLabel, levels.l1_locate);

      if (response.gatingDegraded) {
        renderNote(ladder, strings.degradedNote);
        return;
      }

      // One at a time: "show me the fix" only appears once the rule has
      // actually been revealed, rather than both buttons sitting there
      // together inviting a straight jump to the answer.
      const ruleBtn = document.createElement('button');
      ruleBtn.textContent = strings.showRule;
      ruleBtn.addEventListener('click', () => {
        renderLevel(ladder, 'L2', strings.conceptLabel, levels.l2_concept.rule + '\\n\\n' + levels.l2_concept.example);
        ruleBtn.remove();
        vscodeApi.postMessage({ type: 'levelReached', interactionId: response.interactionId, level: 2 });

        const fixBtn = document.createElement('button');
        fixBtn.textContent = strings.showFix;
        fixBtn.addEventListener('click', () => {
          renderLevel(ladder, 'L3', strings.fixLabel, levels.l3_fix.change + '\\n\\n' + levels.l3_fix.why);
          fixBtn.remove();
          vscodeApi.postMessage({ type: 'levelReached', interactionId: response.interactionId, level: 3 });
        }, { once: true });
        ladder.appendChild(fixBtn);
      }, { once: true });
      ladder.appendChild(ruleBtn);
    }

    // [FEEDBACK-EFFECTIVENESS]: copying out of the explanation is taking
    // the answer, which the overlap measurement on the next edit can miss
    // entirely (pasting into a different file, or much later). Reports
    // which level the selection came from, never the copied text.
    let shownInteractionId;
    hint.addEventListener('copy', () => {
      if (!shownInteractionId) return;
      const anchor = document.getSelection() && document.getSelection().anchorNode;
      const element = anchor && (anchor.nodeType === 1 ? anchor : anchor.parentElement);
      const level = element && element.closest ? element.closest('.level') : null;
      vscodeApi.postMessage({
        type: 'explanationCopied',
        interactionId: shownInteractionId,
        level: level ? level.dataset.level : undefined,
      });
    });

    window.addEventListener('message', (event) => {
      const msg = event.data;
      if (msg.type === 'state') {
        strings = msg.strings;
        header.textContent = strings.header;
        signedOut.hidden = msg.signedIn;
        signedIn.hidden = !msg.signedIn;
        signedOutHint.textContent = strings.signedOutHint;
        explainSelectionBtn.textContent = strings.explainSelection;
        languageLabelOut.textContent = strings.languageLabel;
        languageSelectOut.value = msg.feedbackLanguage || 'en';
        usernameLabel.textContent = strings.usernameLabel;
        passwordLabel.textContent = strings.passwordLabel;
        logInBtn.textContent = strings.logInSignUp;
        statsHeading.textContent = strings.statsHeading;
        minPasswordLength = msg.minPasswordLength || minPasswordLength;
        feedbackLanguage = msg.feedbackLanguage || 'en';
        document.body.classList.toggle('aicf-text-large', msg.textSize === 'large');
        setLoading(msg.loading);
        setAuthLoading(msg.authLoading);
        setAuthError(msg.authError);
        if (msg.explanation) renderExplanation(msg.explanation);
        renderUserStats(msg.stats);
      } else if (msg.type === 'explanation') {
        renderExplanation(msg.response);
      } else if (msg.type === 'stats') {
        renderUserStats(msg.stats);
      } else if (msg.type === 'loading') {
        setLoading(msg.loading);
      } else if (msg.type === 'authLoading') {
        setAuthLoading(msg.loading);
      } else if (msg.type === 'authError') {
        setAuthError(msg.message);
      }
    });

    vscodeApi.postMessage({ type: 'ready' });
  </script>
</body>
</html>`;
  }
}

function getNonce(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
