export type RiskLevel = 'Safe' | 'Suspicious' | 'Dangerous';

export interface AnalysisResult {
  riskLevel: RiskLevel;
  riskScore: number;
  summary: string;
  explanation: string;
  redFlags: string[];
  recommendedActions: string[];
  messageType: string;
  scamCategory: string;
  psychologicalTactics: string[];
  confidence: string;
  rewrite: string;
  shouldReport: boolean;
  shouldBlockSender: boolean;
}

export interface ScanHistoryEntry {
  id: string;
  date: string;
  message: string;
  result: AnalysisResult;
}

export type AnalyzerStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AnalyzerError {
  kind:
    | 'empty'
    | 'too_long'
    | 'network'
    | 'rate_limit'
    | 'invalid_json'
    | 'api'
    | 'config'
    | 'unknown';
  message: string;
}
