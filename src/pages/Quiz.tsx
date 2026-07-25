import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  CheckCircle2,
  ChevronRight,
  CircleDashed,
  Download,
  RotateCcw,
  Trophy,
  XCircle,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { QUIZ_QUESTIONS } from '@/utils/quizContent';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { Route } from '@/hooks/useHashRoute';

interface QuizProps {
  navigate: (route: Route) => void;
}

type Phase = 'intro' | 'question' | 'answered' | 'result';

export function Quiz({ navigate }: QuizProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [name, setName] = useState('');

  const total = QUIZ_QUESTIONS.length;
  const question = QUIZ_QUESTIONS[current];
  const score = answers.reduce(
    (acc, ans, i) => (ans === QUIZ_QUESTIONS[i].correctIndex ? acc + 1 : acc),
    0,
  );
  const passed = score >= 7;

  const start = () => {
    setPhase('question');
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
  };

  const submit = (index: number) => {
    if (phase !== 'question') return;
    setSelected(index);
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = index;
      return next;
    });
    setPhase('answered');
  };

  const next = () => {
    if (current + 1 >= total) {
      setPhase('result');
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setPhase('question');
    }
  };

  const restart = () => {
    setPhase('intro');
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setName('');
  };

  if (phase === 'intro') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <PageHeader
          title="Cyber Safety Quiz"
          subtitle="10 multiple-choice questions on the scams covered in the Learn section. Score 7 or more to earn your certificate."
          icon={<Trophy className="h-5 w-5" />}
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl border border-border/60 p-8 text-center"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Award className="h-8 w-8" />
          </div>
          <h2 className="font-display text-2xl font-bold">Cyber Safety Beginner</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Answer 10 questions. Each correct answer is explained so you learn as you go. Pass with 7/10
            to download your certificate.
          </p>
          <Button onClick={start} className="mt-6 gap-2" size="lg">
            Start quiz <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    );
  }

  if (phase === 'result') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-strong rounded-2xl border border-border/60 p-8 text-center"
        >
          <div
            className={cn(
              'mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl',
              passed ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning',
            )}
          >
            {passed ? <Award className="h-10 w-10" /> : <CircleDashed className="h-10 w-10" />}
          </div>
          <h2 className="font-display text-3xl font-bold">
            {passed ? 'Congratulations!' : 'Almost there'}
          </h2>
          <p className="mt-2 text-muted-foreground">
            You scored <span className="font-bold text-foreground">{score}/{total}</span>
            {passed ? ' — you passed!' : '. You need 7 to pass.'}
          </p>

          <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className={cn('h-full rounded-full', passed ? 'bg-success' : 'bg-warning')}
              initial={{ width: 0 }}
              animate={{ width: `${(score / total) * 100}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>

          {/* Review */}
          <div className="mt-6 space-y-2 text-left">
            {QUIZ_QUESTIONS.map((q, i) => {
              const correct = answers[i] === q.correctIndex;
              return (
                <div
                  key={q.id}
                  className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-background/40 px-4 py-3 text-sm"
                >
                  {correct ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  )}
                  <span className="text-muted-foreground">
                    <span className="font-medium text-foreground">Q{i + 1}.</span> {q.explanation}
                  </span>
                </div>
              );
            })}
          </div>

          {passed && (
            <div className="mt-6 space-y-3 rounded-xl border border-success/30 bg-success/5 p-5 text-left">
              <label htmlFor="cert-name" className="block text-sm font-semibold text-foreground">
                Name on certificate
              </label>
              <input
                id="cert-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                maxLength={60}
                className="w-full rounded-lg border border-input bg-background/60 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <Button
                onClick={() => downloadCertificate(name.trim() || 'Cyber Safety Learner', score, total)}
                className="w-full gap-2"
              >
                <Download className="h-4 w-4" /> Download certificate
              </Button>
            </div>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="outline" onClick={restart} className="gap-2">
              <RotateCcw className="h-4 w-4" /> Retake quiz
            </Button>
            <Button variant="ghost" onClick={() => navigate('learn')}>
              Back to Learn
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // question / answered phases
  const progressPct = ((current + (phase === 'answered' ? 1 : 0)) / total) * 100;
  const isCorrect = selected === question.correctIndex;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Question {current + 1} of {total}
        </span>
        <span className="text-sm font-semibold text-primary">{Math.round(progressPct)}%</span>
      </div>
      <Progress value={progressPct} className="mb-8 h-2" />

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="glass-strong rounded-2xl border border-border/60 p-6 sm:p-8"
        >
          <h2 className="font-display text-xl font-bold leading-snug">{question.question}</h2>

          <div className="mt-6 space-y-3">
            {question.options.map((opt, i) => {
              const isSel = selected === i;
              const isAnswered = phase === 'answered';
              const isRight = i === question.correctIndex;
              const showCorrect = isAnswered && isRight;
              const showWrong = isAnswered && isSel && !isRight;

              return (
                <button
                  key={i}
                  onClick={() => submit(i)}
                  disabled={isAnswered}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition',
                    !isAnswered && 'border-border bg-background/40 hover:border-primary/50 hover:bg-accent',
                    showCorrect && 'border-success/50 bg-success/10 text-foreground',
                    showWrong && 'border-destructive/50 bg-destructive/10 text-foreground',
                    isAnswered && !showCorrect && !showWrong && 'border-border bg-background/30 opacity-60',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold',
                      showCorrect && 'border-success bg-success text-white',
                      showWrong && 'border-destructive bg-destructive text-white',
                      !isAnswered && 'border-border text-muted-foreground',
                      isAnswered && !showCorrect && !showWrong && 'border-border text-muted-foreground',
                    )}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {showCorrect && <CheckCircle2 className="h-5 w-5 text-success" />}
                  {showWrong && <XCircle className="h-5 w-5 text-destructive" />}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {phase === 'answered' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={cn(
                  'mt-5 rounded-xl border px-4 py-3 text-sm',
                  isCorrect ? 'border-success/30 bg-success/5 text-foreground' : 'border-destructive/30 bg-destructive/5 text-foreground',
                )}
              >
                <p className="font-semibold">
                  {isCorrect ? 'Correct!' : 'Not quite.'}
                </p>
                <p className="mt-1 text-muted-foreground">{question.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {phase === 'answered' && (
            <Button onClick={next} className="mt-6 w-full gap-2">
              {current + 1 >= total ? 'See results' : 'Next question'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function downloadCertificate(name: string, score: number, total: number): void {
  const doc = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'landscape' });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Background
  doc.setFillColor(9, 9, 11);
  doc.rect(0, 0, w, h, 'F');
  // Border frame
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(2);
  doc.rect(24, 24, w - 48, h - 48, 'S');
  doc.setLineWidth(0.5);
  doc.setDrawColor(96, 165, 250);
  doc.rect(34, 34, w - 68, h - 68, 'S');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(96, 165, 250);
  doc.text('SCAMSHIELD AI', w / 2, 90, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(40);
  doc.text('Certificate of Completion', w / 2, 150, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(180, 180, 190);
  doc.text('This certifies that', w / 2, 200, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.setTextColor(37, 99, 235);
  doc.text(name, w / 2, 240, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(180, 180, 190);
  doc.text('has completed the Cyber Safety Beginner quiz', w / 2, 275, { align: 'center' });
  doc.text(`with a score of ${score} / ${total}`, w / 2, 295, { align: 'center' });

  doc.setFontSize(11);
  doc.setTextColor(140, 140, 150);
  doc.text(
    `Issued on ${new Date().toLocaleDateString(undefined, { dateStyle: 'long' })}`,
    w / 2,
    340,
    { align: 'center' },
  );

  doc.setFontSize(9);
  doc.text(
    'ScamShield AI — educational certificate. Verify awareness of common online scams.',
    w / 2,
    h - 50,
    { align: 'center' },
  );

  doc.save(`scamshield-certificate-${Date.now()}.pdf`);
}
