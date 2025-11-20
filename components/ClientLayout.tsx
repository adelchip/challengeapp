'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

/**
 * Client-side wrapper with ErrorBoundary for pages
 */
export function ClientLayout({ children }: { children: ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
