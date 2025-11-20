'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary component to catch and handle React errors gracefully
 * Prevents the entire app from crashing when a component throws an error
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log error to console (in production, you'd log to an error service)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-4">
          <div className="card bg-base-100 shadow-xl max-w-md">
            <div className="card-body items-center text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-error mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h2 className="card-title text-2xl mb-2">Oops! Something went wrong</h2>
              <p className="text-base opacity-70 mb-4">
                We encountered an unexpected error. Please try refreshing the page.
              </p>
              {this.state.error && (
                <div className="collapse collapse-arrow bg-base-200 w-full">
                  <input type="checkbox" />
                  <div className="collapse-title font-medium text-sm">
                    Show error details
                  </div>
                  <div className="collapse-content">
                    <code className="text-xs break-all">
                      {this.state.error.message}
                    </code>
                  </div>
                </div>
              )}
              <div className="card-actions mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-primary"
                >
                  Refresh Page
                </button>
                <button
                  onClick={() => (window.location.href = '/')}
                  className="btn btn-ghost"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
