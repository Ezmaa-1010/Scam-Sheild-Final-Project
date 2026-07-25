import type { ScanHistoryEntry } from '@/types';

const HISTORY_KEY = 'scamshield:history';
const THEME_KEY = 'scamshield:theme';
const HISTORY_LIMIT = 50;

export function loadHistory(): ScanHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ScanHistoryEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidEntry);
  } catch {
    return [];
  }
}

function isValidEntry(entry: unknown): entry is ScanHistoryEntry {
  return (
    typeof entry === 'object' &&
    entry !== null &&
    'id' in entry &&
    'date' in entry &&
    'message' in entry &&
    'result' in entry
  );
}

export function saveHistory(entries: ScanHistoryEntry[]): void {
  try {
    const trimmed = entries.slice(0, HISTORY_LIMIT);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch {
    /* storage full or unavailable — fail silently, history is non-critical */
  }
}

export function addHistoryEntry(
  entries: ScanHistoryEntry[],
  entry: ScanHistoryEntry,
): ScanHistoryEntry[] {
  return [entry, ...entries].slice(0, HISTORY_LIMIT);
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

export function loadTheme(): 'dark' | 'light' {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    if (raw === 'light' || raw === 'dark') return raw;
  } catch {
    /* ignore */
  }
  return 'dark';
}

export function saveTheme(theme: 'dark' | 'light'): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* ignore */
  }
}
