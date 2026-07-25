import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface State {
  hasError: boolean;
  message: string;
}

interface Props {
  children: ReactNode;
}

/**
 * Catches render-time errors anywhere in the tree and shows a friendly,
 * recoverable error screen instead of a blank page.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || 'An unexpected error occurred.' };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ScamShield AI crashed:', error, info);
  }

  private handleReset = () => {
    this.setState({ hasError: false, message: '' });
  };

  render() {
    if (this.state.hasError) {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h2 className="mb-2 font-display text-2xl font-bold">Something broke</h2>
          <p className="mb-6 max-w-md text-muted-foreground">
            The app hit an unexpected error. You can try again — your scan history is safe.
          </p>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
