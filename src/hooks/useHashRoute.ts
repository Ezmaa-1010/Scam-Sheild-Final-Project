import { useCallback, useEffect, useState } from 'react';

export type Route = 'landing' | 'dashboard' | 'history' | 'learn' | 'quiz' | 'about';

const ROUTES: Route[] = ['landing', 'dashboard', 'history', 'learn', 'quiz', 'about'];

function parseHash(): Route {
  const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0] as Route;
  return ROUTES.includes(hash) ? hash : 'landing';
}

/**
 * Lightweight hash-based router. Avoids pulling in react-router for a
 * single-page marketing+app experience, keeps URLs shareable (#/dashboard),
 * and scrolls to top on navigation.
 */
export function useHashRoute(): {
  route: Route;
  navigate: (route: Route) => void;
} {
  const [route, setRoute] = useState<Route>(() => parseHash());

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((next: Route) => {
    if (parseHash() === next) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.location.hash = `/${next}`;
  }, []);

  return { route, navigate };
}
