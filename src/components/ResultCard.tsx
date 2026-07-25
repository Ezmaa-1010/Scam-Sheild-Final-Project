import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, ShieldQuestion, FileText, BadgeInfo } from 'lucide-react';
import type { AnalysisResult } from '@/types';
import { getRiskTheme } from '@/utils/risk';
import { RiskMeter } from './RiskMeter';

interface ResultCardProps {
  result: AnalysisResult;
}

const RISK_ICON = {
  Safe: ShieldCheck,
  Suspicious: ShieldQuestion,
  Dangerous: ShieldAlert,
} as const;

export function ResultCard({ result }: ResultCardProps) {
  const theme = getRiskTheme(result.riskLevel);
  const Icon = RISK_ICON[result.riskLevel];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`glass-strong relative overflow-hidden rounded-2xl border ${theme.border} p-6 sm:p-8`}
    >
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: `${theme.hex}15` }}
        aria-hidden="true"
      />

      <div className="relative flex flex-col items-center gap-8 sm:flex-row sm:items-start">
        <RiskMeter riskLevel={result.riskLevel} riskScore={result.riskScore} size={220} />

        <div className="flex-1 space-y-5">
          <div className="flex items-start gap-3">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${theme.bgSubtle}`}>
              <Icon className={`h-6 w-6 ${theme.text}`} />
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold">
                {result.riskLevel === 'Safe'
                  ? 'This message looks safe'
                  : result.riskLevel === 'Suspicious'
                    ? 'This message is suspicious'
                    : 'This message is dangerous'}
              </h2>
              <p className={`text-sm font-medium ${theme.text}`}>
                {result.scamCategory} · {result.messageType}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-background/40 p-4">
            <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <BadgeInfo className="h-3.5 w-3.5" /> AI Summary
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">{result.summary}</p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <Stat label="Confidence" value={result.confidence} />
            <Stat label="Risk Score" value={`${result.riskScore}/100`} />
            <Stat label="Should Report" value={result.shouldReport ? 'Yes' : 'No'} />
            <Stat label="Block Sender" value={result.shouldBlockSender ? 'Yes' : 'No'} />
          </div>
        </div>
      </div>

      <div className="relative mt-6 border-t border-border/60 pt-6">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <FileText className="h-3.5 w-3.5" /> Detailed Explanation
        </div>
        <p className="text-sm leading-relaxed text-foreground/85">{result.explanation}</p>
      </div>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/40 px-3 py-2">
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 font-semibold text-foreground">{value}</div>
    </div>
  );
}
