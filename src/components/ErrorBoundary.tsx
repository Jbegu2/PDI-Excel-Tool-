import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="step-container">
          <div className="card">
            <h1 style={{ color: 'var(--error-red)', marginBottom: 'var(--spacing-md)' }}>
              Something went wrong
            </h1>
            <p style={{ marginBottom: 'var(--spacing-md)' }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              className="btn btn-primary"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
            >
              Reload Page
            </button>
            <details style={{ marginTop: 'var(--spacing-lg)' }}>
              <summary style={{ cursor: 'pointer', marginBottom: 'var(--spacing-sm)' }}>
                Error Details
              </summary>
              <pre style={{
                background: 'var(--abb-graphite)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                overflow: 'auto',
                fontSize: 'var(--font-size-sm)'
              }}>
                {this.state.error?.stack}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
