import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

const NoticeContext = createContext<((message: string) => void) | null>(null);

/** One short confirmation at a time ("…was reset."), announced to screen
 * readers and gone after a few seconds. */
export function NoticeProvider({ children }: { children: ReactNode }) {
  const [notice, setNotice] = useState<{ id: number; message: string } | null>(null);

  const notify = useCallback((message: string) => setNotice({ id: Date.now(), message }), []);

  useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => setNotice(null), 6_000);
    return () => window.clearTimeout(id);
  }, [notice]);

  return (
    <NoticeContext.Provider value={notify}>
      {children}
      <div className="toast-region" aria-live="polite">
        {notice && (
          <div key={notice.id} className="toast">
            {notice.message}
          </div>
        )}
      </div>
    </NoticeContext.Provider>
  );
}

export function useNotify(): (message: string) => void {
  const ctx = useContext(NoticeContext);
  if (!ctx) throw new Error('useNotify must be used inside NoticeProvider');
  return ctx;
}
