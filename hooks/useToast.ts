/**
 * Custom hook for managing toast notifications
 * Provides simple API for showing toasts
 */

import { useState, useCallback } from 'react';
import { ToastType } from '@/components/Toast';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

/**
 * Hook for managing toast notifications
 * 
 * @returns Object with toasts array and methods to show/remove toasts
 * 
 * @example
 * const { toasts, showToast, removeToast } = useToast();
 * 
 * // Show success toast
 * showToast('Profile created successfully!', 'success');
 * 
 * // Show error toast
 * showToast('Failed to save changes', 'error');
 */
export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return {
    toasts,
    showToast,
    removeToast
  };
}
