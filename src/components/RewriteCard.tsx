import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';

interface RewriteCardProps {
  rewrite: string;
}

export function RewriteCard({ rewrite }: RewriteCardProps) {
  return (
    <div className="glass rounded-2xl border border-primary/30 p-6">
      <div className="mb-3 flex items-center gap-2">
        <Languages className="h-5 w-5 text-primary" />
        <h3 className="font-display text-lg font-bold">Safe Rewrite</h3>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        What the scam is really trying to do, in plain English:
      </p>
      <motion.blockquote
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-3 border-l-2 border-primary/60 bg-primary/5 px-4 py-3 text-sm italic leading-relaxed text-foreground/90"
      >
        “{rewrite}”
      </motion.blockquote>
    </div>
  );
}
