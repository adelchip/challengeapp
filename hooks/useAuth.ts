import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types';

/**
 * Custom hook for managing authentication state
 * Centralizes all localStorage logic and provides a clean API for auth operations
 */
export function useAuth() {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user on mount
    loadCurrentUser();

    // Listen for user changes (from other components)
    const handleUserChanged = () => {
      loadCurrentUser();
    };

    window.addEventListener('userChanged', handleUserChanged);
    return () => window.removeEventListener('userChanged', handleUserChanged);
  }, []);

  async function loadCurrentUser() {
    try {
      const userId = localStorage.getItem('currentUserId');
      
      if (!userId) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        // User not found, clear session
        localStorage.removeItem('currentUserId');
        setCurrentUser(null);
      } else {
        setCurrentUser(data);
      }
    } catch (error) {
      console.error('Error loading current user:', error);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }

  function login(userId: string) {
    localStorage.setItem('currentUserId', userId);
    window.dispatchEvent(new Event('userChanged'));
  }

  function logout() {
    localStorage.removeItem('currentUserId');
    setCurrentUser(null);
    window.dispatchEvent(new Event('userChanged'));
  }

  function checkAuth(): string | null {
    return localStorage.getItem('currentUserId');
  }

  return {
    currentUser,
    loading,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!currentUser,
  };
}
