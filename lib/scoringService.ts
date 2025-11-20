/**
 * Scoring and matching algorithms for profiles and challenges
 * Separates business logic from UI components
 */

import { Profile, Challenge } from '@/types';
import { SIMILARITY_WEIGHTS, QUERY_LIMITS, LEADERBOARD_WEIGHTS } from './constants';

// ============================================
// PROFILE SIMILARITY SCORING
// ============================================

export interface MatchingSkill {
  name: string;
  userRating: number;
  profileRating: number;
  similarity: number;
}

export interface ScoredProfile extends Profile {
  score: number;
  matchingSkills: MatchingSkill[];
}

/**
 * Calculate similarity score between current user and a profile
 * Based on matching skills, business unit, and country
 * 
 * @param currentUser - The logged-in user's profile
 * @param profile - The profile to compare against
 * @returns Scored profile with similarity score and matching skills
 */
export function calculateProfileSimilarity(
  currentUser: Profile,
  profile: Profile
): ScoredProfile {
  let score = 0;
  const matchingSkills: MatchingSkill[] = [];

  // Calculate skill similarity
  currentUser.skills.forEach(userSkill => {
    const matchingSkill = profile.skills.find(
      (s: any) => s.name.toLowerCase() === userSkill.name.toLowerCase()
    );
    
    if (matchingSkill) {
      // Higher similarity for closer ratings
      const similarity = SIMILARITY_WEIGHTS.MAX_SKILL_SIMILARITY - 
        Math.abs(userSkill.rating - matchingSkill.rating);
      score += similarity;
      
      matchingSkills.push({
        name: matchingSkill.name,
        userRating: userSkill.rating,
        profileRating: matchingSkill.rating,
        similarity
      });
    }
  });

  // Bonus for same business unit
  if (profile.business_unit === currentUser.business_unit) {
    score += SIMILARITY_WEIGHTS.SAME_BUSINESS_UNIT;
  }

  // Bonus for same country
  if (profile.country === currentUser.country) {
    score += SIMILARITY_WEIGHTS.SAME_COUNTRY;
  }

  return {
    ...profile,
    score,
    matchingSkills: matchingSkills.sort((a, b) => b.similarity - a.similarity)
  };
}

/**
 * Find profiles similar to the current user
 * Returns top N profiles sorted by similarity score
 * 
 * @param currentUser - The logged-in user's profile
 * @param allProfiles - All available profiles (excluding current user)
 * @param limit - Maximum number of results (default: QUERY_LIMITS.SIMILAR_PROFILES)
 * @returns Array of scored profiles sorted by similarity
 */
export function findSimilarProfiles(
  currentUser: Profile,
  allProfiles: Profile[],
  limit: number = QUERY_LIMITS.SIMILAR_PROFILES
): ScoredProfile[] {
  return allProfiles
    .map(profile => calculateProfileSimilarity(currentUser, profile))
    .filter(scoredProfile => scoredProfile.score > 0) // Only include profiles with matches
    .sort((a, b) => b.score - a.score) // Sort by highest score
    .slice(0, limit);
}

// ============================================
// CHALLENGE MATCHING
// ============================================

/**
 * Calculate skill match score between a profile and challenge requirements
 * 
 * @param profile - The profile to evaluate
 * @param challengeText - Combined challenge title + description
 * @returns Score representing how well the profile matches the challenge
 */
export function calculateChallengeMatch(
  profile: Profile,
  challengeText: string
): number {
  let score = 0;
  const text = challengeText.toLowerCase();

  // Check if profile skills match challenge requirements
  profile.skills.forEach(skill => {
    const skillName = skill.name.toLowerCase();
    if (text.includes(skillName)) {
      // Higher ratings get more points
      score += skill.rating;
    }
  });

  // Check if role matches
  if (text.includes(profile.role.toLowerCase())) {
    score += 2;
  }

  return score;
}

/**
 * Find challenges suitable for a user based on their skills
 * 
 * @param currentUser - The logged-in user's profile
 * @param allChallenges - All available challenges
 * @param limit - Maximum number of results (default: QUERY_LIMITS.SUGGESTED_CHALLENGES)
 * @returns Array of challenges sorted by match score
 */
export function findSuggestedChallenges(
  currentUser: Profile,
  allChallenges: Challenge[],
  limit: number = QUERY_LIMITS.SUGGESTED_CHALLENGES
): Challenge[] {
  return allChallenges
    .filter(challenge => {
      // Exclude challenges user already participates in
      return !challenge.participants?.includes(currentUser.id);
    })
    .map(challenge => {
      const challengeText = `${challenge.title} ${challenge.description}`;
      const score = calculateChallengeMatch(currentUser, challengeText);
      return { challenge, score };
    })
    .filter(item => item.score > 0) // Only include relevant challenges
    .sort((a, b) => b.score - a.score) // Sort by highest match
    .slice(0, limit)
    .map(item => item.challenge);
}

// ============================================
// LEADERBOARD CALCULATION
// ============================================

export interface LeaderboardEntry {
  profile: Profile;
  completedChallenges: number;
  averageRating: number;
  totalRatings: number;
  score: number;
}

export interface ChallengeRating {
  profile_id: string;
  rating: number;
  [key: string]: any;
}

/**
 * Calculate leaderboard score for a profile
 * Combines completed challenges count and average rating
 * 
 * @param completedCount - Number of completed challenges
 * @param averageRating - Average rating received (0-5)
 * @returns Calculated leaderboard score
 */
export function calculateLeaderboardScore(
  completedCount: number,
  averageRating: number
): number {
  return (
    completedCount * LEADERBOARD_WEIGHTS.COMPLETED_CHALLENGE +
    averageRating * LEADERBOARD_WEIGHTS.RATING_MULTIPLIER
  );
}

/**
 * Build leaderboard from profiles, challenges, and ratings
 * 
 * @param profiles - All profiles
 * @param challenges - All challenges
 * @param ratings - All challenge ratings
 * @param limit - Maximum number of entries (default: QUERY_LIMITS.LEADERBOARD_TOP)
 * @returns Sorted leaderboard entries
 */
export function buildLeaderboard(
  profiles: Profile[],
  challenges: Challenge[],
  ratings: ChallengeRating[],
  limit: number = QUERY_LIMITS.LEADERBOARD_TOP
): LeaderboardEntry[] {
  const leaderboardData: LeaderboardEntry[] = profiles.map(profile => {
    // Count completed challenges where user was a participant
    const completedChallenges = challenges.filter(
      challenge =>
        challenge.status === 'completed' &&
        challenge.participants?.includes(profile.id)
    ).length;

    // Get all ratings for this profile
    const profileRatings = ratings.filter(r => r.profile_id === profile.id);
    const totalRatings = profileRatings.length;
    const averageRating =
      totalRatings > 0
        ? profileRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
        : 0;

    // Calculate final score
    const score = calculateLeaderboardScore(completedChallenges, averageRating);

    return {
      profile,
      completedChallenges,
      averageRating,
      totalRatings,
      score
    };
  });

  return leaderboardData
    .filter(entry => entry.score > 0) // Only include profiles with activity
    .sort((a, b) => b.score - a.score) // Sort by highest score
    .slice(0, limit);
}
