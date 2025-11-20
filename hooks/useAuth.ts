import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types';

/**
 * Custom hook for centralized authentication state management
 * 
 * Manages user authentication state using localStorage and Supabase.
 * Provides methods for login, logout, and checking auth status.
 * Automatically loads current user profile on mount and listens for auth changes.
 * 
 * @returns {Object} Authentication state and methods
 * @returns {Profile | null} currentUser - Currently logged in user profile (null if not logged in)
 * @returns {boolean} loading - True while loading user data
 * @returns {boolean} isAuthenticated - True if user is logged in
 * @returns {Function} login - Login with user ID: (userId: string) => void
 * @returns {Function} logout - Logout current user: () => void
 * @returns {Function} checkAuth - Get current user ID from localStorage: () => string | null
 * 
 * @example
 * function MyComponent() {
 *   const { currentUser, loading, login, logout, isAuthenticated } = useAuth();
 * 
 *   if (loading) return <LoadingSpinner />;
 * 
 *   if (!isAuthenticated) {
 *     return <button onClick={() => login('user-id')}>Login</button>;
 *   }
 * 
 *   return (
 *     <div>
 *       <p>Welcome, {currentUser?.name}</p>
 *       <button onClick={logout}>Logout</button>
 *     </div>
 *   );
 * }
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
