import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Eraser, Loader2, ScanSearch, Sparkles } from 'lucide-react';
import { useAnalyzer } from '@/hooks/useAnalyzer';
import { useHistory } from '@/hooks/useHistory';
import { useToast } from '@/hooks/use-toast';
import { MAX_MESSAGE_LENGTH, isProbablyEmpty, sanitizeMessage } from '@/utils/sanitize';
import type { ScanHistoryEntry } from '@/types';
import { Loading } from './Loading';
import { ResultCard } from './ResultCard';
import { RedFlagsCard } from './RedFlagsCard';
import { TacticsCard } from './TacticsCard';
import { AdviceCard } from './AdviceCard';
import { RewriteCard } from './RewriteCard';
import { ActionToolbar } from './ActionToolbar';

interface AnalyzerProps {
  /** Optional entry to prefill from history view. */
  prefill?: ScanHistoryEntry | null;
}

const SAMPLES = [
  {
    label: 'Bank phishing',
    text: 'Dear Customer, your account has been suspended due to suspicious activity. Verify your identity immediately or your account will be permanently closed in 24 hours. Click here: http://secure-hsbc-verify.com/login',
  },
  {
    label: 'Delivery scam',
    text: 'Your package is held at the warehouse. Pay £1.45 customs fee to release it: http://royalmail-parcel.redelivery-fee.co',
  },
  {
    label: 'OTP scam',
    text: 'Hi, this is Mark from your bank. We noticed unusual activity and need to verify it is you. Please reply with the 6-digit code we just sent to your phone. Do not tell anyone — this is for your security.',
  },
  {
    label: 'Investment scam',
    text: 'Bro, I made $18,000 in 3 days with this crypto platform. You in? Sign up with my link before spots close tonight: https://bitpro-trade.io/r/4521',
  },
];

export function Analyzer({ prefill }: AnalyzerProps) {
  const { state, analyze, reset } = useAnalyzer();
  const { add } = useHistory();
  const { toast } = useToast();
  const [text, setText] = useState('');
  const [touched, setTouched] = useState(false);

  const remaining = MAX_MESSAGE_LENGTH - text.length;
  const isEmpty = isProbablyEmpty(text);
  const showError = touched && isEmpty && state.status === 'idle';

  const handleAnalyze = async () => {
    setTouched(true);
    const sanitized = sanitizeMessage(text);
    if (isProbablyEmpty(sanitized)) {
      toast({ title: 'Nothing to analyze', description: 'Paste a message first.', variant: 'destructive' });
      return;
    }
    const { result, error } = await analyze(sanitized);
    if (error) {
      toast({ title: 'Analysis failed', description: error.message, variant: 'destructive' });
      return;
    }
    if (result) {
      add({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        date: new Date().toISOString(),
        message: sanitized,
        result,
      });
      toast({ title: 'Analysis complete', description: 'Your scan has been saved to history.' });
    }
  };

  const handleClear = () => {
    setText('');
    setTouched(false);
    reset();
  };

  const loadSample = (sample: string) => {
    setText(sample);
    setTouched(false);
    reset();
  };

  const prefillData = useMemo(() => prefill, [prefill]);

  return (
    <div className="space-y-6">
      {/* Input card */}
      <div className="glass rounded-2xl border border-border/60 p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <label htmlFor="analyzer-input" className="text-sm font-semibold text-foreground">
            Suspicious message
          </label>
          <span className={`text-xs ${remaining < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
            {text.length}/{MAX_MESSAGE_LENGTH}
          </span>
        </div>
        <textarea
          id="analyzer-input"
          value={text}
          onChange={(e) => {
            const next = e.target.value.slice(0, MAX_MESSAGE_LENGTH);
            setText(next);
          }}
          onBlur={() => setTouched(true)}
          placeholder="Paste suspicious email, SMS, WhatsApp message, Instagram DM, Facebook message or bank alert..."
          rows={7}
          maxLength={MAX_MESSAGE_LENGTH}
          className="w-full resize-y rounded-xl border border-input bg-background/50 px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          aria-describedby="analyzer-help"
        />
        <p id="analyzer-help" className="mt-2 text-xs text-muted-foreground">
          Maximum {MAX_MESSAGE_LENGTH.toLocaleString()} characters. Your message is sent securely for
          analysis and never stored on our servers.
        </p>

        {showError && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="h-3.5 w-3.5" /> Please paste a message to analyze.
          </p>
        )}

        {/* Samples + actions */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Try a sample:</span>
            {SAMPLES.map((s) => (
              <button
                key={s.label}
                onClick={() => loadSample(s.text)}
                className="rounded-full border border-border bg-card/40 px-2.5 py-1 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2.5">
          <button
            onClick={handleAnalyze}
            disabled={state.status === 'loading'}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow-primary transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {state.status === 'loading' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Analyzing…
              </>
            ) : (
              <>
                <ScanSearch className="h-4 w-4" /> Analyze Message
              </>
            )}
          </button>
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/40 px-5 py-3 text-sm font-medium transition hover:bg-accent"
          >
            <Eraser className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>

      {/* Prefill banner */}
      {prefillData && state.status === 'idle' && (
        <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          Viewing a saved scan from{' '}
          {new Date(prefillData.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}.
        </div>
      )}

      <AnimatePresence mode="wait">
        {state.status === 'loading' && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Loading />
          </motion.div>
        )}

        {state.status === 'error' && state.error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <ErrorState message={state.error.message} onRetry={() => analyze(state.message)} />
          </motion.div>
        )}

        {state.status === 'success' && state.result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <ActionToolbar message={state.lastAnalyzed} result={state.result} onClear={handleClear} />
            <ResultCard result={state.result} />
            <div className="grid gap-6 lg:grid-cols-2">
              <RedFlagsCard redFlags={state.result.redFlags} />
              <TacticsCard tactics={state.result.psychologicalTactics} />
            </div>
            <AdviceCard
              actions={state.result.recommendedActions}
              shouldReport={state.result.shouldReport}
              shouldBlockSender={state.result.shouldBlockSender}
            />
            <RewriteCard rewrite={state.result.rewrite} />
          </motion.div>
        )}

        {prefillData && state.status === 'idle' && (
          <motion.div
            key="prefill"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <ActionToolbar message={prefillData.message} result={prefillData.result} onClear={handleClear} />
            <ResultCard result={prefillData.result} />
            <div className="grid gap-6 lg:grid-cols-2">
              <RedFlagsCard redFlags={prefillData.result.redFlags} />
              <TacticsCard tactics={prefillData.result.psychologicalTactics} />
            </div>
            <AdviceCard
              actions={prefillData.result.recommendedActions}
              shouldReport={prefillData.result.shouldReport}
              shouldBlockSender={prefillData.result.shouldBlockSender}
            />
            <RewriteCard rewrite={prefillData.result.rewrite} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="glass flex flex-col items-center justify-center rounded-2xl border border-destructive/30 p-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertCircle className="h-7 w-7" />
      </div>
      <h3 className="mb-2 font-display text-xl font-bold">Analysis failed</h3>
      <p className="mb-6 max-w-md text-sm text-muted-foreground">{message}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
      >
        <Sparkles className="h-4 w-4" /> Try again
      </button>
    </div>
  );
}
