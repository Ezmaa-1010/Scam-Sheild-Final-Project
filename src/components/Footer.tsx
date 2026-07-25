import { Github, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import type { Route } from '@/hooks/useHashRoute';

interface FooterProps {
  navigate: (route: Route) => void;
}

export function Footer({ navigate }: FooterProps) {
  return (
    <footer className="border-t border-border/60 bg-background/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-blue-700">
                <ShieldCheck className="h-4.5 w-4.5 text-white" />
              </span>
              <span className="font-display text-base font-bold">
                ScamShield<span className="text-primary"> AI</span>
              </span>
            </div>
            <p className="max-w-xs text-sm text-muted-foreground">
              AI-powered scam and phishing detection. Understand why a message is dangerous —
              in plain English.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Explore</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Dashboard', route: 'dashboard' as Route },
                { label: 'History', route: 'history' as Route },
                { label: 'Learn', route: 'learn' as Route },
                { label: 'Quiz', route: 'quiz' as Route },
                { label: 'About', route: 'about' as Route },
              ].map((item) => (
                <li key={item.route}>
                  <button
                    onClick={() => navigate(item.route)}
                    className="text-muted-foreground transition hover:text-primary"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Project</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-muted-foreground transition hover:text-primary"
                >
                  <Github className="h-4 w-4" /> GitHub
                </a>
              </li>
              <li className="inline-flex items-center gap-2 text-muted-foreground">
                <Lock className="h-4 w-4" /> Privacy — messages are analyzed, not stored
              </li>
              <li className="inline-flex items-center gap-2 text-muted-foreground">
                <Sparkles className="h-4 w-4" /> Made with AI
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
          <p>
            ScamShield AI provides an automated risk estimate for educational purposes. It is not
            legal, financial, or professional advice. Always verify with official sources.
          </p>
          <p className="mt-2">© {new Date().getFullYear()} ScamShield AI. Built for a safer internet.</p>
        </div>
      </div>
    </footer>
  );
}
