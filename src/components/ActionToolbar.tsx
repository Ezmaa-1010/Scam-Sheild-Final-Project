import { useState } from 'react';
import { Copy, Download, Eraser, Loader2, Share2, Check } from 'lucide-react';
import type { AnalysisResult } from '@/types';
import { buildShareText, copyToClipboard, downloadReport } from '@/utils/report';
import { useToast } from '@/hooks/use-toast';

interface ActionToolbarProps {
  message: string;
  result: AnalysisResult;
  onClear: () => void;
}

export function ActionToolbar({ message, result, onClear }: ActionToolbarProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const handleCopy = async () => {
    const text = buildShareText(message, result);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      toast({ title: 'Copied', description: 'Analysis copied to clipboard.' });
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast({ title: 'Could not copy', description: 'Your browser blocked clipboard access.', variant: 'destructive' });
    }
  };

  const handleDownload = () => {
    try {
      downloadReport(message, result);
      toast({ title: 'Report downloaded', description: 'Your PDF report has been saved.' });
    } catch {
      toast({
        title: 'Download failed',
        description: 'Could not generate the PDF report.',
        variant: 'destructive',
      });
    }
  };

  const handleShare = async () => {
    const text = buildShareText(message, result);
    setSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({ title: 'ScamShield AI Report', text });
      } else {
        const ok = await copyToClipboard(text);
        toast(
          ok
            ? { title: 'Copied', description: 'Share text copied to clipboard.' }
            : { title: 'Could not share', description: 'Sharing is not supported here.', variant: 'destructive' },
        );
      }
    } catch {
      /* user cancelled share — no toast */
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2.5">
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/60 px-4 py-2.5 text-sm font-medium transition hover:bg-accent"
      >
        {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
        Copy Results
      </button>
      <button
        onClick={handleDownload}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/60 px-4 py-2.5 text-sm font-medium transition hover:bg-accent"
      >
        <Download className="h-4 w-4" />
        Download Report
      </button>
      <button
        onClick={handleShare}
        disabled={sharing}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/60 px-4 py-2.5 text-sm font-medium transition hover:bg-accent disabled:opacity-50"
      >
        {sharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
        Share
      </button>
      <button
        onClick={onClear}
        className="inline-flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive transition hover:bg-destructive/20"
      >
        <Eraser className="h-4 w-4" />
        Clear
      </button>
    </div>
  );
}
