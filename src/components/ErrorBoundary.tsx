import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex items-center justify-center rounded-lg border border-slate-800/50 bg-slate-900/30 px-6 py-12 text-center">
          <div>
            <p className="font-mono text-sm text-slate-400">something broke.</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-3 font-mono text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
