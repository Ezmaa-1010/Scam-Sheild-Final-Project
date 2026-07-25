import type { RiskLevel } from '@/types';

export interface RiskTheme {
  level: RiskLevel;
  label: string;
  shortLabel: string;
  /** tailwind text color class */
  text: string;
  /** tailwind bg color class (solid) */
  bg: string;
  /** tailwind bg color class (subtle / 10%) */
  bgSubtle: string;
  /** tailwind border color class */
  border: string;
  /** raw hex used by canvas/SVG gauges and PDF */
  hex: string;
  /** hex for a soft glow */
  glowHex: string;
  ring: string;
  shadow: string;
}

const THEMES: Record<RiskLevel, RiskTheme> = {
  Safe: {
    level: 'Safe',
    label: 'SAFE',
    shortLabel: 'Safe',
    text: 'text-success',
    bg: 'bg-success',
    bgSubtle: 'bg-success/10',
    border: 'border-success/40',
    hex: '#10B981',
    glowHex: 'rgba(16,185,129,0.5)',
    ring: 'ring-success/40',
    shadow: 'shadow-glow-success',
  },
  Suspicious: {
    level: 'Suspicious',
    label: 'SUSPICIOUS',
    shortLabel: 'Suspicious',
    text: 'text-warning',
    bg: 'bg-warning',
    bgSubtle: 'bg-warning/10',
    border: 'border-warning/40',
    hex: '#F59E0B',
    glowHex: 'rgba(245,158,11,0.5)',
    ring: 'ring-warning/40',
    shadow: 'shadow-glow-warning',
  },
  Dangerous: {
    level: 'Dangerous',
    label: 'DANGEROUS',
    shortLabel: 'Dangerous',
    text: 'text-destructive',
    bg: 'bg-destructive',
    bgSubtle: 'bg-destructive/10',
    border: 'border-destructive/40',
    hex: '#EF4444',
    glowHex: 'rgba(239,68,68,0.55)',
    ring: 'ring-destructive/40',
    shadow: 'shadow-glow-danger',
  },
};

export function getRiskTheme(level: RiskLevel): RiskTheme {
  return THEMES[level] ?? THEMES.Dangerous;
}

export function riskFromScore(score: number): RiskLevel {
  if (score < 35) return 'Safe';
  if (score < 70) return 'Suspicious';
  return 'Dangerous';
}

export const PSYCHOLOGICAL_TACTIC_ICONS: Record<string, string> = {
  Fear: 'AlertTriangle',
  Greed: 'DollarSign',
  Urgency: 'Zap',
  Authority: 'ShieldAlert',
  Scarcity: 'Hourglass',
  Curiosity: 'Sparkles',
  Trust: 'Handshake',
  Reciprocity: 'Gift',
  SocialProof: 'Users',
  Intimidation: 'Megaphone',
};

export const SCAM_CATEGORIES: string[] = [
  'Bank Phishing',
  'Prize Scam',
  'Investment Scam',
  'Delivery Scam',
  'OTP Scam',
  'Tech Support Scam',
  'Romance Scam',
  'Crypto Scam',
  'Job Scam',
  'Gift Card Scam',
  'Lottery Scam',
  'Refund Scam',
  'Remote Access Scam',
  'Government Impersonation',
  'Social Media Impersonation',
  'Credential Phishing',
  'Invoice Fraud',
  'Other',
];
