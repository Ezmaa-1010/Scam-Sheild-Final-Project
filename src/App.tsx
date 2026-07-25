import { lazy, Suspense, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { useHashRoute } from '@/hooks/useHashRoute';
import { useHistory } from '@/hooks/useHistory';
import type { ScanHistoryEntry } from '@/types';
import './App.css';

const Landing = lazy(() => import('@/pages/Landing').then((m) => ({ default: m.Landing })));
const Dashboard = lazy(() => import('@/pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const HistoryPage = lazy(() => import('@/pages/History').then((m) => ({ default: m.HistoryPage })));
const Learn = lazy(() => import('@/pages/Learn').then((m) => ({ default: m.LearnPage })));
const Quiz = lazy(() => import('@/pages/Quiz').then((m) => ({ default: m.Quiz })));
const About = lazy(() => import('@/pages/About').then((m) => ({ default: m.About })));

function PageFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
    </div>
  );
}

export default function App() {
  const { route, navigate } = useHashRoute();
  const { history, remove, clear } = useHistory();
  const [prefill, setPrefill] = useState<ScanHistoryEntry | null>(null);

  const handleView = (entry: ScanHistoryEntry) => {
    setPrefill(entry);
    navigate('dashboard');
  };

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <div className="flex min-h-screen flex-col bg-background text-foreground">
          <Navbar route={route} navigate={navigate} />

          <main className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={route}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Suspense fallback={<PageFallback />}>
                  {route === 'landing' && <Landing navigate={navigate} />}
                  {route === 'dashboard' && (
                    <Dashboard prefill={prefill} />
                  )}
                  {route === 'history' && (
                    <HistoryPage
                      history={history}
                      onView={handleView}
                      onDelete={remove}
                      onClear={clear}
                      navigate={navigate}
                    />
                  )}
                  {route === 'learn' && <Learn navigate={navigate} />}
                  {route === 'quiz' && <Quiz navigate={navigate} />}
                  {route === 'about' && <About navigate={navigate} />}
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </main>

          <Footer navigate={navigate} />
        </div>
        <Toaster />
      </ErrorBoundary>
    </ThemeProvider>
  );
}
