import { useCallback, useRef, useState } from 'react';
import type { AnalysisResult, AnalyzerError, AnalyzerStatus } from '@/types';
import { analyzeMessage } from '@/services/analyze';

export interface AnalyzerState {
  status: AnalyzerStatus;
  message: string;
  result: AnalysisResult | null;
  error: AnalyzerError | null;
  lastAnalyzed: string;
}

const INITIAL: AnalyzerState = {
  status: 'idle',
  message: '',
  result: null,
  error: null,
  lastAnalyzed: '',
};

/**
 * Orchestrates a single analysis run: validates input, calls the edge
 * function, surfaces loading/error/success states, and holds the most
 * recent result. Prevents overlapping concurrent runs.
 */
export function useAnalyzer() {
  const [state, setState] = useState<AnalyzerState>(INITIAL);
  const inFlight = useRef(false);

  const analyze = useCallback(
    async (
      message: string,
    ): Promise<{ result: AnalysisResult | null; error: AnalyzerError | null }> => {
      if (inFlight.current) {
        return { result: null, error: null };
      }
      inFlight.current = true;
      setState({ ...INITIAL, status: 'loading', message });
      try {
        const { result, error } = await analyzeMessage(message);
        if (error) {
          setState({ ...INITIAL, status: 'error', message, error });
          return { result: null, error };
        }
        if (result) {
          setState({
            status: 'success',
            message,
            result,
            error: null,
            lastAnalyzed: message,
          });
          return { result, error: null };
        }
        const fallback: AnalyzerError = {
          kind: 'unknown',
          message: 'Something went wrong. Please try again.',
        };
        setState({ ...INITIAL, status: 'error', message, error: fallback });
        return { result: null, error: fallback };
      } finally {
        inFlight.current = false;
      }
    },
    [],
  );

  const reset = useCallback(() => setState(INITIAL), []);

  return { state, analyze, reset };
}
