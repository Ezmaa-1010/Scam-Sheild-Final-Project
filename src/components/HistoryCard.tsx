import { motion } from 'framer-motion';
import { Eye, Trash2 } from 'lucide-react';
import type { ScanHistoryEntry } from '@/types';
import { getRiskTheme } from '@/utils/risk';
import { truncatePreview } from '@/utils/sanitize';
import { cn } from '@/lib/utils';

interface HistoryCardProps {
  entry: ScanHistoryEntry;
  index: number;
  onView: (entry: ScanHistoryEntry) => void;
  onDelete: (id: string) => void;
}

export function HistoryCard({ entry, index, onView, onDelete }: HistoryCardProps) {
  const theme = getRiskTheme(entry.result.riskLevel);
  const date = new Date(entry.date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4) }}
      className={cn(
        'glass group flex flex-col gap-3 rounded-xl border p-4 transition hover:border-primary/40',
        theme.border,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className={cn('flex h-9 w-9 items-center justify-center rounded-lg', theme.bgSubtle)}>
            <span className={cn('h-2.5 w-2.5 rounded-full', theme.bg)} />
          </span>
          <div>
            <div className={cn('text-sm font-bold', theme.text)}>{entry.result.riskLevel}</div>
            <div className="text-xs text-muted-foreground">{entry.result.scamCategory}</div>
          </div>
        </div>
        <div className="text-right">
          <div className={cn('font-display text-xl font-bold', theme.text)}>
            {entry.result.riskScore}%
          </div>
          <div className="text-[11px] text-muted-foreground">
            {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>

      <p className="line-clamp-2 text-sm text-muted-foreground">{truncatePreview(entry.message, 120)}</p>

      <div className="mt-auto flex gap-2 opacity-0 transition group-hover:opacity-100">
        <button
          onClick={() => onView(entry)}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-background/40 px-3 py-1.5 text-xs font-medium transition hover:bg-accent"
        >
          <Eye className="h-3.5 w-3.5" /> View
        </button>
        <button
          onClick={() => onDelete(entry.id)}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-1.5 text-xs font-medium text-destructive transition hover:bg-destructive/15"
          aria-label="Delete entry"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
