import { motion } from 'framer-motion';
import {
  AlertTriangle,
  BadgeCheck,
  Brain,
  DollarSign,
  Gift,
  Handshake,
  Heart,
  HeartHandshake,
  Hourglass,
  Megaphone,
  Sparkles,
  ShieldAlert,
  Timer,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react';

interface TacticsCardProps {
  tactics: string[];
}

const TACTIC_ICONS: { key: string; icon: LucideIcon }[] = [
  { key: 'fear', icon: AlertTriangle },
  { key: 'greed', icon: DollarSign },
  { key: 'urgency', icon: Zap },
  { key: 'authority', icon: ShieldAlert },
  { key: 'scarcity', icon: Hourglass },
  { key: 'curiosity', icon: Sparkles },
  { key: 'trust', icon: Handshake },
  { key: 'reciprocity', icon: Gift },
  { key: 'social proof', icon: Users },
  { key: 'social engineering', icon: Brain },
  { key: 'intimidation', icon: Megaphone },
  { key: 'pressure', icon: Timer },
  { key: 'flattery', icon: Heart },
  { key: 'pity', icon: HeartHandshake },
  { key: 'authority impersonation', icon: BadgeCheck },
];

function iconForTactic(tactic: string): LucideIcon {
  const key = tactic.toLowerCase();
  for (const entry of TACTIC_ICONS) {
    if (key.includes(entry.key)) return entry.icon;
  }
  return Brain;
}

const TACTIC_COLORS = [
  'border-destructive/30 bg-destructive/5 text-destructive',
  'border-warning/30 bg-warning/5 text-warning',
  'border-primary/30 bg-primary/5 text-primary',
  'border-chart-5/30 bg-chart-5/5 text-chart-5',
];

export function TacticsCard({ tactics }: TacticsCardProps) {
  if (!tactics.length) return null;

  return (
    <div className="glass rounded-2xl border border-border/60 p-6">
      <div className="mb-4 flex items-center gap-2">
        <Brain className="h-5 w-5 text-chart-5" />
        <h3 className="font-display text-lg font-bold">Psychological Tricks</h3>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {tactics.map((tactic, i) => {
          const Icon = iconForTactic(tactic);
          const color = TACTIC_COLORS[i % TACTIC_COLORS.length];
          return (
            <motion.span
              key={`${tactic}-${i}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium ${color}`}
            >
              <Icon className="h-4 w-4" />
              {tactic}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}
