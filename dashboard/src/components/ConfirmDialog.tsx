import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { useI18n } from '../i18n';

interface Props {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  /** The confirm button stays disabled until this exact text is typed. */
  confirmText?: string;
  /** A value the action needs (e.g. a temporary password), passed to onConfirm.
   * With repeatLabel, it must be typed twice, identically, before the
   * confirm button unlocks. */
  input?: { label: string; type?: 'text' | 'password'; hint?: string; minLength?: number; repeatLabel?: string };
  /** For extra fields rendered as children: false keeps the confirm button disabled. */
  canConfirm?: boolean;
  /** Red confirm button for actions that remove or lock something. */
  danger?: boolean;
  onConfirm: (value: string) => Promise<void>;
  onClose: () => void;
}

/** Modal confirmation. Focus starts on Cancel, so pressing Enter by reflex
 * never deletes anything. onConfirm may throw; its message is shown. */
export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  confirmText,
  input,
  canConfirm = true,
  danger = true,
  onConfirm,
  onClose,
}: Props) {
  const { t } = useI18n();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typed, setTyped] = useState('');
  const [value, setValue] = useState('');
  const [repeat, setRepeat] = useState('');
  const titleId = useId();
  const typedId = useId();
  const valueId = useId();
  const repeatId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setBusy(false);
      setError(null);
      setTyped('');
      setValue('');
      setRepeat('');
      dialog.showModal();
      cancelRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const mismatch = !!input?.repeatLabel && repeat !== '' && repeat !== value;
  const ready =
    canConfirm &&
    (!confirmText || typed.trim() === confirmText) &&
    (!input || value.length >= (input.minLength ?? 1)) &&
    (!input?.repeatLabel || repeat === value);

  const handleConfirm = async () => {
    if (!ready || busy) return;
    setBusy(true);
    setError(null);
    try {
      await onConfirm(value);
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : t('common.error'));
      setBusy(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      aria-labelledby={titleId}
      onCancel={(e) => {
        // Esc: allowed unless the request is already running.
        e.preventDefault();
        if (!busy) onClose();
      }}
    >
      {open && (
        <form
          method="dialog"
          onSubmit={(e) => {
            e.preventDefault();
            void handleConfirm();
          }}
        >
          <h2 id={titleId}>{title}</h2>
          <div className="dialog-body">{children}</div>
          {input && (
            <div className="field">
              <label htmlFor={valueId}>{input.label}</label>
              <input
                id={valueId}
                type={input.type ?? 'text'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoComplete={input.type === 'password' ? 'new-password' : 'off'}
                disabled={busy}
              />
              {input.hint && <p className="field-hint">{input.hint}</p>}
            </div>
          )}
          {input?.repeatLabel && (
            <div className="field">
              <label htmlFor={repeatId}>{input.repeatLabel}</label>
              <input
                id={repeatId}
                type={input.type ?? 'text'}
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
                autoComplete={input.type === 'password' ? 'new-password' : 'off'}
                aria-invalid={mismatch || undefined}
                aria-describedby={mismatch ? `${repeatId}-error` : undefined}
                disabled={busy}
              />
              {mismatch && (
                <p id={`${repeatId}-error`} className="field-hint is-error">
                  {t('password.mismatch')}
                </p>
              )}
            </div>
          )}
          {confirmText && (
            <div className="field">
              <label htmlFor={typedId}>{t('confirm.type', { text: confirmText })}</label>
              <input
                id={typedId}
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                disabled={busy}
              />
            </div>
          )}
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="dialog-actions">
            <button ref={cancelRef} type="button" className="btn" onClick={onClose} disabled={busy}>
              {t('common.cancel')}
            </button>
            <button type="submit" className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} disabled={!ready || busy}>
              {busy ? t('common.working') : confirmLabel}
            </button>
          </div>
        </form>
      )}
    </dialog>
  );
}
