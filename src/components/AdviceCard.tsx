import { motion } from 'framer-motion';
import { CheckCircle2, ListChecks } from 'lucide-react';

interface AdviceCardProps {
  actions: string[];
  shouldReport: boolean;
  shouldBlockSender: boolean;
}

export function AdviceCard({ actions, shouldReport, shouldBlockSender }: AdviceCardProps) {
  const fullActions = [
    ...actions,
    ...(shouldReport ? ['Report this message as phishing to the relevant platform or authority.'] : []),
    ...(shouldBlockSender ? ['Block the sender to prevent further messages.'] : []),
  ];

  return (
    <div className="glass rounded-2xl border border-success/30 p-6">
      <div className="mb-4 flex items-center gap-2">
        <ListChecks className="h-5 w-5 text-success" />
        <h3 className="font-display text-lg font-bold">What To Do</h3>
      </div>
      <ul className="space-y-2.5">
        {fullActions.map((action, i) => (
          <motion.li
            key={`${action}-${i}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-3"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
            <span className="text-sm text-foreground/90">{action}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
