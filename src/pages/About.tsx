import { motion } from 'framer-motion';
import {
  Bot,
  Github,
  Heart,
  Info,
  Lock,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import type { Route } from '@/hooks/useHashRoute';
import { PageHeader } from '@/components/PageHeader';

interface AboutProps {
  navigate: (route: Route) => void;
}

const VALUES = [
  {
    icon: Target,
    title: 'Solves a real problem',
    desc: 'Phishing and online scams cost people billions every year. ScamShield AI helps non-technical users tell a real message from a dangerous one.',
  },
  {
    icon: Bot,
    title: 'AI that explains, not just labels',
    desc: 'Instead of a black-box "phishing" verdict, you get a plain-English explanation of the manipulation, the red flags, and the next steps.',
  },
  {
    icon: Lock,
    title: 'Private by design',
    desc: 'Messages are analyzed and discarded — never stored on our servers. Your scan history lives only in your own browser.',
  },
  {
    icon: Users,
    title: 'Built for everyone',
    desc: 'No security expertise required. The interface is clear, accessible and works across desktop, tablet and mobile.',
  },
];

const STACK = [
  'React + TypeScript',
  'Vite',
  'Tailwind CSS',
  'shadcn/ui',
  'Framer Motion',
  'Lucide Icons',
  'Supabase Edge Functions',
  'Google Gemini 1.5',
];

export function About({ navigate }: AboutProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title="About ScamShield AI"
        subtitle="An AI cybersecurity assistant that explains scam messages in plain English — built as a final-year project to make the internet safer for everyone."
        icon={<Info className="h-5 w-5" />}
      />

      {/* Mission */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong relative mb-8 overflow-hidden rounded-2xl border border-border/60 p-8 sm:p-10"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
        <div className="relative flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-700 shadow-glow-primary">
            <ShieldCheck className="h-6 w-6 text-white" />
          </span>
          <div>
            <h2 className="font-display text-2xl font-bold">Our mission</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Most people can't distinguish a genuine message from a convincing fake. ScamShield AI
              bridges that gap — paste any suspicious email, SMS, WhatsApp or social media message and
              get an instant risk score, the scam category, a plain-English rewrite of what the scammer
              is really after, and a clear safety plan. It turns cybersecurity from a guessing game into
              a decision you can make in seconds.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Values */}
      <div className="mb-10 grid gap-5 sm:grid-cols-2">
        {VALUES.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-2xl border border-border/60 p-6"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <v.icon className="h-5 w-5" />
            </div>
            <h3 className="mb-1.5 font-display text-lg font-bold">{v.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* How AI is used */}
      <div className="mb-10 grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-2xl border border-border/60 p-6">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-display text-lg font-bold">How the AI works</h3>
          </div>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">1</span>
              Your message is wrapped in clear delimiters and sent to a secure server function.
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">2</span>
              Google Gemini analyses it with a cybersecurity system prompt and returns strict JSON.
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">3</span>
              The result is validated and rendered into a clear risk report you can read, copy or download.
            </li>
          </ol>
          <p className="mt-4 rounded-lg border border-warning/30 bg-warning/5 px-3 py-2 text-xs text-muted-foreground">
            The analysis is an automated estimate for education and awareness — not legal or
            professional advice. Always verify with official sources.
          </p>
        </div>

        <div className="glass rounded-2xl border border-border/60 p-6">
          <div className="mb-3 flex items-center gap-2">
            <Lock className="h-5 w-5 text-success" />
            <h3 className="font-display text-lg font-bold">Privacy &amp; security</h3>
          </div>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
              The Gemini API key is stored only on the server — never in the browser.
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
              User content is wrapped in delimiters to resist prompt injection.
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
              Input is sanitised and capped at 5,000 characters.
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
              Scan history is stored locally in your browser, not on our servers.
            </li>
          </ul>
        </div>
      </div>

      {/* Stack */}
      <div className="mb-10 glass rounded-2xl border border-border/60 p-6">
        <h3 className="mb-4 font-display text-lg font-bold">Built with</h3>
        <div className="flex flex-wrap gap-2.5">
          {STACK.map((s) => (
            <span
              key={s}
              className="rounded-full border border-border bg-card/40 px-3.5 py-1.5 text-sm text-muted-foreground"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-card p-6 sm:flex-row">
        <div className="flex items-center gap-3">
          <Heart className="h-5 w-5 text-destructive" />
          <p className="text-sm text-muted-foreground">
            Open-source and made with AI. Try the analyzer or take the safety quiz.
          </p>
        </div>
        <div className="flex gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/40 px-4 py-2.5 text-sm font-medium transition hover:bg-accent"
          >
            <Github className="h-4 w-4" /> GitHub
          </a>
          <button
            onClick={() => navigate('dashboard')}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Try it now
          </button>
        </div>
      </div>
    </div>
  );
}
