import { ScanSearch } from 'lucide-react';
import type { ScanHistoryEntry } from '@/types';
import { PageHeader } from '@/components/PageHeader';
import { Analyzer } from '@/components/Analyzer';

interface DashboardProps {
  prefill?: ScanHistoryEntry | null;
}

export function Dashboard({ prefill }: DashboardProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title="Message Analyzer"
        subtitle="Paste any suspicious message and ScamShield AI will assess the risk, explain why it's dangerous, and tell you exactly what to do."
        icon={<ScanSearch className="h-5 w-5" />}
      />
      <Analyzer prefill={prefill} />
    </div>
  );
}
