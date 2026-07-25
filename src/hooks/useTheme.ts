import { useCallback, useEffect, useState } from 'react';
import { loadTheme, saveTheme } from '@/utils/storage';

type Theme = 'dark' | 'light';

/**
 * Theme provider hook. Dark is the default and primary experience for
 * ScamShield AI; light is offered as an accessibility-friendly alternative.
 * Persists choice to localStorage and toggles the `dark` class on <html>.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => loadTheme());

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.style.colorScheme = theme;
    saveTheme(theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggle };
}
