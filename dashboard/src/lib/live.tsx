import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type DependencyList,
  type ReactNode,
} from 'react';
import {
  POLL_WITH_REALTIME_MS,
  POLL_WITHOUT_REALTIME_MS,
  REALTIME_CHANNEL,
  REALTIME_DEBOUNCE_MS,
  REALTIME_MIN_GAP_MS,
} from '../config';
import { usePolling } from '../hooks/usePolling';
import { client } from './api';
import { useApiErrorHandler, useSession } from './auth';
import { loadRange, saveRange, type DateRange } from './range';

interface LiveValue {
  range: DateRange;
  setRange: (range: DateRange) => void;
  /** Bumped whenever everything on screen should reload. */
  tick: number;
  refresh: () => void;
  paused: boolean;
  setPaused: (paused: boolean) => void;
  realtime: boolean;
  lastUpdated: number | null;
  failing: boolean;
  reportResult: (ok: boolean) => void;
}

const LiveContext = createContext<LiveValue | null>(null);

/** Date range, refresh signal and connection status for everything behind
 * the login. Reloads come from three places: the database's change
 * announcements (0021_dashboard_realtime.sql), a timer, and the Refresh
 * button. */
export function LiveProvider({ children }: { children: ReactNode }) {
  const [range, setRangeState] = useState<DateRange>(loadRange);
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [realtime, setRealtime] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [failing, setFailing] = useState(false);
  const lastBump = useRef(0);
  const pending = useRef<number | null>(null);
  const pausedRef = useRef(paused);

  const refresh = useCallback(() => {
    lastBump.current = Date.now();
    setTick((t) => t + 1);
  }, []);

  const setRange = useCallback((next: DateRange) => {
    setRangeState(next);
    saveRange(next);
  }, []);

  // Resuming catches up straight away instead of waiting for the next tick.
  useEffect(() => {
    const resumed = pausedRef.current && !paused;
    pausedRef.current = paused;
    if (resumed) refresh();
  }, [paused, refresh]);

  // Announcements arrive in bursts (a student's flush touches several
  // tables); collect them and reload at most once per REALTIME_MIN_GAP_MS.
  // Hidden tabs skip them: becoming visible triggers a reload anyway.
  useEffect(() => {
    const onChange = () => {
      if (pausedRef.current || document.visibilityState !== 'visible' || pending.current != null) return;
      const wait = Math.max(REALTIME_DEBOUNCE_MS, lastBump.current + REALTIME_MIN_GAP_MS - Date.now());
      pending.current = window.setTimeout(() => {
        pending.current = null;
        refresh();
      }, wait);
    };
    const channel = client
      .channel(REALTIME_CHANNEL)
      .on('broadcast', { event: 'change' }, onChange)
      .subscribe((status) => setRealtime(status === 'SUBSCRIBED'));
    return () => {
      if (pending.current != null) window.clearTimeout(pending.current);
      pending.current = null;
      void client.removeChannel(channel);
    };
  }, [refresh]);

  usePolling(refresh, realtime ? POLL_WITH_REALTIME_MS : POLL_WITHOUT_REALTIME_MS, !paused);

  const reportResult = useCallback((ok: boolean) => {
    setFailing(!ok);
    if (ok) setLastUpdated(Date.now());
  }, []);

  const value = useMemo(
    () => ({ range, setRange, tick, refresh, paused, setPaused, realtime, lastUpdated, failing, reportResult }),
    [range, setRange, tick, refresh, paused, realtime, lastUpdated, failing, reportResult],
  );
  return <LiveContext.Provider value={value}>{children}</LiveContext.Provider>;
}

export function useLive(): LiveValue {
  const ctx = useContext(LiveContext);
  if (!ctx) throw new Error('useLive must be used inside LiveProvider');
  return ctx;
}

interface QueryState<T> {
  data: T | null;
  error: boolean;
  loading: boolean;
}

/** Loads data with the session token, and again on every refresh signal or
 * whenever `deps` change. The previous data stays on screen while a reload
 * runs, and only the newest request's answer is kept. */
export function useLiveQuery<T>(load: (token: string) => Promise<T>, deps: DependencyList) {
  const { token } = useSession();
  const handleError = useApiErrorHandler();
  const { tick, reportResult } = useLive();
  const [state, setState] = useState<QueryState<T>>({ data: null, error: false, loading: true });
  const latest = useRef(0);
  const loadRef = useRef(load);
  loadRef.current = load;

  const run = useCallback(async () => {
    const request = ++latest.current;
    setState((s) => ({ ...s, loading: true }));
    try {
      const data = await loadRef.current(token);
      if (request !== latest.current) return;
      setState({ data, error: false, loading: false });
      reportResult(true);
    } catch (err) {
      if (handleError(err) || request !== latest.current) return;
      setState((s) => ({ ...s, error: true, loading: false }));
      reportResult(false);
    }
  }, [token, handleError, reportResult]);

  useEffect(() => {
    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, tick, ...deps]);

  return { ...state, reload: run };
}
