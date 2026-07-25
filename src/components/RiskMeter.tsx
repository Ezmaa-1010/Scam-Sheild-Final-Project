import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { RiskLevel } from '@/types';
import { getRiskTheme } from '@/utils/risk';

interface RiskMeterProps {
  riskLevel: RiskLevel;
  riskScore: number;
  size?: number;
}

/**
 * Animated circular risk gauge. The arc fills from 0 to the risk score,
 * colored by risk level, with a large percentage readout and label inside.
 */
export function RiskMeter({ riskLevel, riskScore, size = 220 }: RiskMeterProps) {
  const theme = getRiskTheme(riskLevel);
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setAnimatedScore(riskScore));
    return () => cancelAnimationFrame(raf);
  }, [riskScore]);

  const dashOffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div
      className="relative flex flex-col items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Risk level ${riskLevel}, score ${riskScore} out of 100`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`risk-grad-${riskLevel}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.hex} stopOpacity="0.7" />
            <stop offset="100%" stopColor={theme.hex} />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={stroke}
          opacity={0.5}
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#risk-grad-${riskLevel})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 6px ${theme.glowHex})` }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="font-display text-5xl font-bold"
          style={{ color: theme.hex }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {Math.round(animatedScore)}%
        </motion.span>
        <span
          className="mt-1 rounded-full px-3 py-0.5 text-xs font-bold tracking-wider"
          style={{
            backgroundColor: `${theme.hex}22`,
            color: theme.hex,
          }}
        >
          {theme.label}
        </span>
      </div>
    </div>
  );
}
