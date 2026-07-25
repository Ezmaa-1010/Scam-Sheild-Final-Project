import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  History as HistoryIcon,
  Lock,
  Mail,
  MessageSquare,
  Phone,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type { Route } from '@/hooks/useHashRoute';

interface LandingProps {
  navigate: (route: Route) => void;
}

const STATS = [
  { value: '4.7B+', label: 'phishing emails sent yearly' },
  { value: '$10B+', label: 'lost to scams in 2024' },
  { value: '1 in 3', label: 'people targeted monthly' },
];

const FEATURES = [
  {
    icon: Bot,
    title: 'AI Risk Analysis',
    desc: 'Google Gemini inspects every message for urgency, spoofing, credential harvesting and manipulation — then explains it in plain English.',
  },
  {
    icon: ShieldCheck,
    title: 'Clear Risk Score',
    desc: 'A 0–100 score with a Safe, Suspicious or Dangerous verdict so you instantly know how seriously to take a message.',
  },
  {
    icon: FileText,
    title: 'Downloadable Reports',
    desc: 'Export a clean PDF of any analysis to keep for your records or send to family, your bank, or authorities.',
  },
  {
    icon: HistoryIcon,
    title: 'Scan History',
    desc: 'Every check is saved on your device so you can revisit past warnings and track patterns over time.',
  },
  {
    icon: GraduationCap,
    title: 'Learn & Quiz',
    desc: 'Bite-sized lessons on 11 scam types plus an interactive quiz that awards a Cyber Safety Beginner certificate.',
  },
  {
    icon: Lock,
    title: 'Private by Design',
    desc: 'Messages are analyzed and never stored on our servers. Your history lives only in your browser.',
  },
];

const MESSAGE_TYPES = [
  { icon: Mail, label: 'Phishing Emails' },
  { icon: MessageSquare, label: 'WhatsApp & SMS' },
  { icon: Phone, label: 'Fake Bank Alerts' },
  { icon: Sparkles, label: 'Social Media DMs' },
];

export function Landing({ navigate }: LandingProps) {
  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" aria-hidden="true" />
        <div className="absolute inset-0 bg-radial-glow" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28 lg:px-8 lg:pb-28 lg:pt-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: copy */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                AI-Powered Scam Detection
              </div>

              <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                ScamShield <span className="text-gradient-primary">AI</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
                Detect phishing emails, fake bank messages, WhatsApp scams, SMS fraud and social
                media scams using AI — before you become the next victim.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('dashboard')}
                  className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow-primary transition hover:bg-primary/90"
                >
                  Analyze Message
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  onClick={() => navigate('learn')}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/50 px-6 py-3.5 text-sm font-semibold transition hover:bg-accent"
                >
                  Learn About Scams
                </button>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
                {MESSAGE_TYPES.map((m) => (
                  <div key={m.label} className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <m.icon className="h-4 w-4 text-primary" />
                    {m.label}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative mx-auto flex w-full max-w-md items-center justify-center"
            >
              <HeroIllustration />
            </motion.div>
          </div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 grid grid-cols-3 gap-4 rounded-2xl border border-border/60 bg-card/30 p-6 backdrop-blur-sm"
          >
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-2xl font-bold text-gradient-primary sm:text-3xl">
                  {s.value}
                </div>
                <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Everything you need to stay safe
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            ScamShield AI doesn't just say "phishing." It explains why a message is dangerous and
            exactly what you should do next.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass group rounded-2xl border border-border/60 p-6 transition hover:border-primary/40"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:scale-110">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-display text-lg font-bold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-border/60 bg-card/20">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">How it works</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Three steps from a suspicious message to a clear, actionable verdict.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: '01', title: 'Paste the message', desc: 'Email, SMS, WhatsApp, DM or bank alert — up to 5,000 characters.' },
              { step: '02', title: 'AI inspects it', desc: 'Google Gemini checks for urgency, spoofing, fake links and manipulation tactics.' },
              { step: '03', title: 'Get a clear plan', desc: 'Risk score, red flags, plain-English rewrite and exactly what to do next.' },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="mb-4 font-display text-5xl font-bold text-primary/20">{s.step}</div>
                <h3 className="mb-2 font-display text-xl font-bold">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-10 text-center sm:p-16">
          <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-chart-5/20 blur-3xl" aria-hidden="true" />
          <div className="relative">
            <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Don't guess. Let AI check it first.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Paste any suspicious message and get an instant, plain-English risk report.
            </p>
            <button
              onClick={() => navigate('dashboard')}
              className="group mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow-primary transition hover:bg-primary/90"
            >
              Start Analyzing
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" /> No sign-up needed
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-success" /> Results in seconds
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-success" /> Private by design
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroIllustration() {
  return (
    <div className="relative aspect-square w-full max-w-sm">
      {/* Orbit ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-primary/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-primary shadow-glow-primary" />
      </motion.div>
      <motion.div
        className="absolute inset-8 rounded-full border border-border"
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-chart-2" />
      </motion.div>

      {/* Center shield */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="relative flex h-40 w-40 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-md border border-primary/30 shadow-glow-primary">
          <ShieldCheck className="h-20 w-20 text-primary" />
          <motion.div
            className="absolute inset-x-6 h-0.5 bg-primary/60 blur-[1px]"
            animate={{ top: ['20%', '80%', '20%'] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>

      {/* Floating chips */}
      <FloatingChip icon={Mail} label="Email" className="left-0 top-1/4" delay={0} />
      <FloatingChip icon={MessageSquare} label="SMS" className="right-0 top-1/3" delay={0.6} />
      <FloatingChip icon={Phone} label="Bank" className="bottom-8 left-6" delay={1.2} />
      <FloatingChip icon={Lock} label="OTP" className="bottom-12 right-4" delay={1.8} />
    </div>
  );
}

function FloatingChip({
  icon: Icon,
  label,
  className,
  delay,
}: {
  icon: typeof Mail;
  label: string;
  className: string;
  delay: number;
}) {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <div className="flex items-center gap-1.5 rounded-full border border-border/80 bg-card/80 px-3 py-1.5 text-xs font-medium shadow-soft backdrop-blur-md">
        <Icon className="h-3.5 w-3.5 text-primary" />
        {label}
      </div>
    </motion.div>
  );
}
