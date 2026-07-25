import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Moon, ShieldCheck, Sun, X } from 'lucide-react';
import type { Route } from '@/hooks/useHashRoute';
import { useThemeContext } from './ThemeProvider';
import { cn } from '@/lib/utils';

interface NavbarProps {
  route: Route;
  navigate: (route: Route) => void;
}

const NAV_ITEMS: { label: string; route: Route }[] = [
  { label: 'Dashboard', route: 'dashboard' },
  { label: 'History', route: 'history' },
  { label: 'Learn', route: 'learn' },
  { label: 'Quiz', route: 'quiz' },
  { label: 'About', route: 'about' },
];

export function Navbar({ route, navigate }: NavbarProps) {
  const { theme, toggle } = useThemeContext();
  const [open, setOpen] = useState(false);

  const go = (next: Route) => {
    navigate(next);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => go('landing')}
          className="group flex items-center gap-2.5"
          aria-label="ScamShield AI home"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-700 shadow-glow-primary transition-transform group-hover:scale-105">
            <ShieldCheck className="h-5 w-5 text-white" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            ScamShield<span className="text-primary"> AI</span>
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.route}
              onClick={() => go(item.route)}
              className={cn(
                'relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
                route === item.route
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {item.label}
              {route === item.route && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/50 text-muted-foreground transition hover:text-foreground"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={() => go('dashboard')}
            className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow-primary transition hover:bg-primary/90 sm:inline-flex"
          >
            Analyze Message
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/50 text-foreground md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.route}
                  onClick={() => go(item.route)}
                  className={cn(
                    'block w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors',
                    route === item.route
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                  )}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => go('dashboard')}
                className="mt-2 block w-full rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground"
              >
                Analyze Message
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
