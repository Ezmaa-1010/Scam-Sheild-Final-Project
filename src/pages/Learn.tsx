import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bitcoin,
  ChevronDown,
  Facebook,
  GraduationCap,
  Heart,
  Instagram,
  KeyRound,
  Landmark,
  Lightbulb,
  Mail,
  MessageCircle,
  Quote,
  QrCode,
  ShieldQuestion,
  ShoppingBag,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { LEARN_TOPICS } from '@/utils/learnContent';
import { PageHeader } from '@/components/PageHeader';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { Route } from '@/hooks/useHashRoute';

interface LearnPageProps {
  navigate: (route: Route) => void;
}

const TOPIC_ICONS: Record<string, LucideIcon> = {
  Mail,
  Landmark,
  MessageCircle,
  Instagram,
  Facebook,
  TrendingUp,
  Bitcoin,
  Heart,
  KeyRound,
  QrCode,
  ShoppingBag,
};

function iconFor(name: string): LucideIcon {
  return TOPIC_ICONS[name] ?? ShieldQuestion;
}

export function LearnPage({ navigate }: LearnPageProps) {
  const [selected, setSelected] = useState<string>(LEARN_TOPICS[0].id);
  const topic = LEARN_TOPICS.find((t) => t.id === selected) ?? LEARN_TOPICS[0];
  const TopicIcon = iconFor(topic.icon);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title="Learn About Scams"
        subtitle="Understand how the most common online scams work, with real examples and concrete safety tips for each."
        icon={<GraduationCap className="h-5 w-5" />}
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Topic list */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="glass rounded-2xl border border-border/60 p-3">
            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {LEARN_TOPICS.length} topics
            </p>
            <ul className="space-y-1">
              {LEARN_TOPICS.map((t) => {
                const Icon = iconFor(t.icon);
                const active = t.id === selected;
                return (
                  <li key={t.id}>
                    <button
                      onClick={() => setSelected(t.id)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                        active
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {t.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Topic detail */}
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="glass-strong rounded-2xl border border-border/60 p-6 sm:p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <TopicIcon className="h-6 w-6" />
                </div>
                <h2 className="font-display text-2xl font-bold">{topic.title}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{topic.description}</p>
              </div>

              {/* Examples */}
              <div className="glass rounded-2xl border border-border/60 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Quote className="h-5 w-5 text-warning" />
                  <h3 className="font-display text-lg font-bold">Real-world examples</h3>
                </div>
                <ul className="space-y-3">
                  {topic.examples.map((ex, i) => (
                    <li
                      key={i}
                      className="rounded-lg border border-warning/20 bg-warning/5 px-4 py-3 text-sm italic leading-relaxed text-foreground/85"
                    >
                      “{ex}”
                    </li>
                  ))}
                </ul>
              </div>

              {/* Safety tips */}
              <div className="glass rounded-2xl border border-success/30 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-success" />
                  <h3 className="font-display text-lg font-bold">How to stay safe</h3>
                </div>
                <ul className="space-y-2.5">
                  {topic.safetyTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground/90">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-xs font-bold text-success">
                        ✓
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Quick FAQ accordion */}
          <div className="mt-8">
            <h3 className="mb-3 font-display text-lg font-bold">Quick answers</h3>
            <Accordion type="single" collapsible className="space-y-2">
              <AccordionItem value="q1" className="glass rounded-xl border border-border/60 px-4">
                <AccordionTrigger className="hover:no-underline">
                  How reliable is the AI risk score?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  The score is a strong automated estimate, not a guarantee. Always use it alongside
                  common sense and verify with official sources for anything involving money.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2" className="glass rounded-xl border border-border/60 px-4">
                <AccordionTrigger className="hover:no-underline">
                  Is my message stored anywhere?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Your message is sent to the AI analysis service and discarded — it is never stored
                  on our servers. Your scan history lives only in your browser.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3" className="glass rounded-xl border border-border/60 px-4">
                <AccordionTrigger className="hover:no-underline">
                  What should I do immediately after clicking a suspicious link?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Don't enter any details. Close the page, run a malware scan, and if you typed a
                  password, change it from a known-safe device. If you shared an OTP, secure that
                  account right away.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Quiz CTA */}
          <div className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-card p-6">
            <div>
              <h3 className="font-display text-lg font-bold">Test your knowledge</h3>
              <p className="text-sm text-muted-foreground">
                Take the 10-question cyber safety quiz and earn a certificate.
              </p>
            </div>
            <button
              onClick={() => navigate('quiz')}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Start quiz <ChevronDown className="h-4 w-4 -rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
