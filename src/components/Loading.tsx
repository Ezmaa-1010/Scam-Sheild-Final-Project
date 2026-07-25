import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

interface LoadingProps {
  label?: string;
}

/**
 * Full loading state shown while the AI inspects a message. Combines an
 * animated shield, a scanning line, and a pulsing status label.
 */
export function Loading({ label = 'AI is inspecting the message…' }: LoadingProps) {
  return (
    <div
      className="glass flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="relative mb-8 h-28 w-28">
        {/* Rotating ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
        />
        {/* Pulsing glow */}
        <motion.div
          className="absolute inset-2 rounded-full bg-primary/10 blur-md"
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Shield core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <ShieldCheck className="h-11 w-11 text-primary" />
        </div>
        {/* Scan line */}
        <motion.div
          className="absolute left-3 right-3 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
          animate={{ top: ['8%', '88%', '8%'] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.p
        className="font-display text-lg font-semibold text-foreground"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        {label}
      </motion.p>
      <p className="mt-2 text-sm text-muted-foreground">
        Checking for urgency, spoofing, credential harvesting and manipulation tactics…
      </p>

      <div className="mt-6 flex gap-1.5" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-primary"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </div>
  );
}
