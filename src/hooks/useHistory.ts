import { useCallback, useEffect, useState } from 'react';
import type { ScanHistoryEntry } from '@/types';
import { addHistoryEntry, clearHistory, loadHistory, saveHistory } from '@/utils/storage';

/**
 * Scan history backed by localStorage. Survives reloads, capped at 50
 * entries, and stays in sync across tabs.
 */
export function useHistory() {
  const [history, setHistory] = useState<ScanHistoryEntry[]>(() => loadHistory());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'scamshield:history') setHistory(loadHistory());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const add = useCallback((entry: ScanHistoryEntry) => {
    setHistory((prev) => {
      const next = addHistoryEntry(prev, entry);
      saveHistory(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setHistory((prev) => {
      const next = prev.filter((e) => e.id !== id);
      saveHistory(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  return { history, add, remove, clear };
}
