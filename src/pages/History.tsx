import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History as HistoryIcon, Search, Trash2, ShieldOff } from 'lucide-react';
import type { Route } from '@/hooks/useHashRoute';
import type { ScanHistoryEntry } from '@/types';
import { PageHeader } from '@/components/PageHeader';
import { HistoryCard } from '@/components/HistoryCard';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface HistoryPageProps {
  history: ScanHistoryEntry[];
  onView: (entry: ScanHistoryEntry) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  navigate: (route: Route) => void;
}

export function HistoryPage({ history, onView, onDelete, onClear, navigate }: HistoryPageProps) {
  const { toast } = useToast();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return history;
    return history.filter(
      (e) =>
        e.message.toLowerCase().includes(q) ||
        e.result.scamCategory.toLowerCase().includes(q) ||
        e.result.riskLevel.toLowerCase().includes(q) ||
        e.result.summary.toLowerCase().includes(q),
    );
  }, [history, query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title="Scan History"
        subtitle="Every analysis you run is saved privately in your browser. Search, revisit or delete past scans."
        icon={<HistoryIcon className="h-5 w-5" />}
        action={
          history.length > 0 ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-destructive/40 text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" /> Clear all
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all scan history?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes all {history.length} saved scans from this device. This
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      onClear();
                      toast({ title: 'History cleared' });
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Clear all
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : null
        }
      />

      {history.length > 0 && (
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by message, category or risk..."
            className="w-full rounded-xl border border-input bg-background/50 py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      )}

      {history.length === 0 ? (
        <EmptyState navigate={navigate} />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card/30 p-12 text-center">
          <p className="text-sm text-muted-foreground">No scans match "{query}".</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((entry, i) => (
              <HistoryCard
                key={entry.id}
                entry={entry}
                index={i}
                onView={(e) => {
                  onView(e);
                  navigate('dashboard');
                }}
                onDelete={(id) => {
                  onDelete(id);
                  toast({ title: 'Scan deleted' });
                }}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function EmptyState({ navigate }: { navigate: (route: Route) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass flex flex-col items-center justify-center rounded-2xl border border-border/60 px-6 py-16 text-center"
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <ShieldOff className="h-8 w-8" />
      </div>
      <h3 className="mb-2 font-display text-xl font-bold">No scans yet</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        Once you analyze a message, your past scans will appear here for quick reference.
      </p>
      <Button onClick={() => navigate('dashboard')} className="gap-2">
        Analyze a message
      </Button>
    </motion.div>
  );
}
