/**
 * Custom hook for fetching and building leaderboard
 * Combines profiles, challenges, and ratings data
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Profile, Challenge } from '@/types';
import { buildLeaderboard, LeaderboardEntry, ChallengeRating } from '@/lib/scoringService';
import { QUERY_LIMITS } from '@/lib/constants';

interface UseLeaderboardOptions {
  /** Auto-fetch on mount */
  autoFetch?: boolean;
  /** Maximum number of entries to return */
  limit?: number;
}

interface UseLeaderboardReturn {
  /** Leaderboard entries sorted by score */
  leaderboard: LeaderboardEntry[];
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Manually trigger fetch and rebuild */
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching and building the leaderboard
 * Automatically fetches profiles, challenges, and ratings, then calculates scores
 * 
 * @param options - Configuration options
 * @returns Leaderboard data, loading state, and refetch function
 * 
 * @example
 * const { leaderboard, loading, error } = useLeaderboard();
 * 
 * // Custom limit
 * const { leaderboard } = useLeaderboard({ limit: 5 });
 */
export function useLeaderboard(options: UseLeaderboardOptions = {}): UseLeaderboardReturn {
  const { autoFetch = true, limit = QUERY_LIMITS.LEADERBOARD_TOP } = options;
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAndBuildLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all required data in parallel
      const [profilesResult, challengesResult, ratingsResult] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('challenges').select('*'),
        supabase.from('challenge_ratings').select('*')
      ]);

      if (profilesResult.error) throw profilesResult.error;
      if (challengesResult.error) throw challengesResult.error;
      if (ratingsResult.error) throw ratingsResult.error;

      const profiles: Profile[] = profilesResult.data || [];
      const challenges: Challenge[] = challengesResult.data || [];
      const ratings: ChallengeRating[] = ratingsResult.data || [];

      // Use scoring service to build leaderboard
      const leaderboardData = buildLeaderboard(profiles, challenges, ratings, limit);
      setLeaderboard(leaderboardData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch leaderboard data');
      setError(error);
      console.error('Error building leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchAndBuildLeaderboard();
    }
  }, [autoFetch, limit]);

  return {
    leaderboard,
    loading,
    error,
    refetch: fetchAndBuildLeaderboard
  };
}
