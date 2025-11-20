/**
 * Custom hook for fetching and managing profiles data
 * Consolidates profile-related data fetching logic
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types';

interface UseProfilesOptions {
  /** Auto-fetch on mount */
  autoFetch?: boolean;
}

interface UseProfilesReturn {
  /** All profiles */
  profiles: Profile[];
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Manually trigger fetch */
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching all profiles
 * 
 * @param options - Configuration options
 * @returns Profiles data, loading state, and refetch function
 * 
 * @example
 * const { profiles, loading, error, refetch } = useProfiles();
 */
export function useProfiles(options: UseProfilesOptions = {}): UseProfilesReturn {
  const { autoFetch = true } = options;
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setProfiles(data || []);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch profiles');
      setError(error);
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchProfiles();
    }
  }, [autoFetch]);

  return {
    profiles,
    loading,
    error,
    refetch: fetchProfiles
  };
}

// ============================================
// SINGLE PROFILE HOOK
// ============================================

interface UseProfileReturn {
  /** Profile data */
  profile: Profile | null;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Manually trigger fetch */
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching a single profile by ID
 * 
 * @param profileId - The profile ID to fetch
 * @returns Profile data, loading state, and refetch function
 * 
 * @example
 * const { profile, loading, error } = useProfile('123');
 */
export function useProfile(profileId: string | null): UseProfileReturn {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = async () => {
    if (!profileId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();

      if (fetchError) throw fetchError;

      setProfile(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch profile');
      setError(error);
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [profileId]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile
  };
}
