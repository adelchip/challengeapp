/**
 * Custom hooks for fetching and managing challenges data
 * Consolidates challenge-related data fetching logic
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Challenge } from '@/types';

interface UseChallengesOptions {
  /** Auto-fetch on mount */
  autoFetch?: boolean;
  /** Filter by status */
  status?: 'ongoing' | 'completed';
}

interface UseChallengesReturn {
  /** All challenges */
  challenges: Challenge[];
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Manually trigger fetch */
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching all challenges
 * 
 * @param options - Configuration options
 * @returns Challenges data, loading state, and refetch function
 * 
 * @example
 * const { challenges, loading, error, refetch } = useChallenges();
 * 
 * // With filter
 * const { challenges } = useChallenges({ status: 'ongoing' });
 */
export function useChallenges(options: UseChallengesOptions = {}): UseChallengesReturn {
  const { autoFetch = true, status } = options;
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply status filter if provided
      if (status) {
        query = query.eq('status', status);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setChallenges(data || []);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch challenges');
      setError(error);
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchChallenges();
    }
  }, [autoFetch, status]);

  return {
    challenges,
    loading,
    error,
    refetch: fetchChallenges
  };
}

// ============================================
// SINGLE CHALLENGE HOOK
// ============================================

interface UseChallengeReturn {
  /** Challenge data */
  challenge: Challenge | null;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Manually trigger fetch */
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching a single challenge by ID
 * 
 * @param challengeId - The challenge ID to fetch
 * @returns Challenge data, loading state, and refetch function
 * 
 * @example
 * const { challenge, loading, error } = useChallenge('123');
 */
export function useChallenge(challengeId: string | null): UseChallengeReturn {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchChallenge = async () => {
    if (!challengeId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', challengeId)
        .single();

      if (fetchError) throw fetchError;

      setChallenge(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch challenge');
      setError(error);
      console.error('Error fetching challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenge();
  }, [challengeId]);

  return {
    challenge,
    loading,
    error,
    refetch: fetchChallenge
  };
}

// ============================================
// USER'S CHALLENGES HOOK
// ============================================

interface UseUserChallengesReturn {
  /** User's challenges */
  challenges: Challenge[];
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Manually trigger fetch */
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching challenges where user is a participant
 * 
 * @param userId - The user's profile ID
 * @returns User's challenges, loading state, and refetch function
 * 
 * @example
 * const { challenges, loading } = useUserChallenges(currentUser?.id);
 */
export function useUserChallenges(userId: string | null | undefined): UseUserChallengesReturn {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserChallenges = async () => {
    if (!userId) {
      setLoading(false);
      setChallenges([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('challenges')
        .select('*')
        .contains('participants', [userId])
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setChallenges(data || []);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch user challenges');
      setError(error);
      console.error('Error fetching user challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserChallenges();
  }, [userId]);

  return {
    challenges,
    loading,
    error,
    refetch: fetchUserChallenges
  };
}

// ============================================
// PROFILE STATS HOOK
// ============================================

interface UseProfileStatsReturn {
  /** Number of completed challenges */
  completedChallengesCount: number;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Manually trigger fetch */
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching profile statistics (completed challenges count)
 * 
 * @param profileId - The profile ID to fetch stats for
 * @returns Profile stats, loading state, and refetch function
 * 
 * @example
 * const { completedChallengesCount, loading } = useProfileStats(profile.id);
 */
export function useProfileStats(profileId: string | null | undefined): UseProfileStatsReturn {
  const [completedChallengesCount, setCompletedChallengesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfileStats = async () => {
    if (!profileId) {
      setLoading(false);
      setCompletedChallengesCount(0);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch completed challenges where user is a participant
      const { data, error: fetchError } = await supabase
        .from('challenges')
        .select('id', { count: 'exact', head: false })
        .contains('participants', [profileId])
        .eq('status', 'completed');

      if (fetchError) throw fetchError;

      setCompletedChallengesCount(data?.length || 0);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch profile stats');
      setError(error);
      console.error('Error fetching profile stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileStats();
  }, [profileId]);

  return {
    completedChallengesCount,
    loading,
    error,
    refetch: fetchProfileStats
  };
}
