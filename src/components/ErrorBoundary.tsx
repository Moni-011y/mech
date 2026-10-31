import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-950/40 border border-red-500/50 rounded-2xl text-red-200 my-4 space-y-3 font-mono">
          <div className="flex items-center gap-2 text-red-400 font-bold text-base">
            <span>⚠️</span>
            <span>{this.props.fallbackTitle || 'Component Error'}</span>
          </div>
          <p className="text-xs text-red-300 font-sans">
            {this.state.error?.message || 'An unexpected error occurred while rendering this 3D component.'}
          </p>
          <pre className="text-[11px] bg-black/60 p-3 rounded-lg overflow-x-auto text-red-400 max-h-48">
            {this.state.error?.stack || String(this.state.error)}
          </pre>
          <button
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition"
          >
            Retry Component
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
