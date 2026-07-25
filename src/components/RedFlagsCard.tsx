import { motion } from 'framer-motion';
import { Flag } from 'lucide-react';

interface RedFlagsCardProps {
  redFlags: string[];
}

export function RedFlagsCard({ redFlags }: RedFlagsCardProps) {
  if (!redFlags.length) {
    return (
      <div className="glass rounded-2xl border border-success/40 p-6">
        <div className="flex items-center gap-2 text-success">
          <Flag className="h-5 w-5" />
          <h3 className="font-display text-lg font-bold">Red Flags</h3>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          No obvious red flags were detected in this message.
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl border border-border/60 p-6">
      <div className="mb-4 flex items-center gap-2">
        <Flag className="h-5 w-5 text-destructive" />
        <h3 className="font-display text-lg font-bold">Red Flags</h3>
        <span className="ml-auto rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">
          {redFlags.length} found
        </span>
      </div>
      <ul className="space-y-2.5">
        {redFlags.map((flag, i) => (
          <motion.li
            key={`${flag}-${i}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-3.5 py-2.5"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-xs font-bold text-destructive">
              !
            </span>
            <span className="text-sm text-foreground/90">{flag}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
