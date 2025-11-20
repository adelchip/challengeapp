/**
 * Application-wide constants
 * Centralizes magic numbers, strings, and configuration values
 */

// ============================================
// SCORING WEIGHTS
// ============================================

/**
 * Weights for profile similarity scoring algorithm
 */
export const SIMILARITY_WEIGHTS = {
  /** Maximum similarity score for skill match */
  MAX_SKILL_SIMILARITY: 10,
  /** Bonus points for same business unit */
  SAME_BUSINESS_UNIT: 3,
  /** Bonus points for same country */
  SAME_COUNTRY: 2,
} as const;

/**
 * Weights for leaderboard scoring algorithm
 */
export const LEADERBOARD_WEIGHTS = {
  /** Points per completed challenge */
  COMPLETED_CHALLENGE: 10,
  /** Multiplier for average rating */
  RATING_MULTIPLIER: 5,
} as const;

// ============================================
// LIMITS & PAGINATION
// ============================================

/**
 * Default limits for data queries
 */
export const QUERY_LIMITS = {
  /** Maximum profiles to show in "Similar to You" section */
  SIMILAR_PROFILES: 6,
  /** Maximum challenges to show in "Suggested" section */
  SUGGESTED_CHALLENGES: 6,
  /** Maximum profiles in AI pre-filtering */
  AI_PREFILTER_MAX: 100,
  /** Maximum AI profile suggestions */
  AI_SUGGESTIONS_MAX: 10,
  /** Default page size for profile list */
  DEFAULT_PAGE_SIZE: 12,
  /** Top N leaderboard entries to display */
  LEADERBOARD_TOP: 10,
} as const;

// ============================================
// STATUS & TYPE VALUES
// ============================================

/**
 * Challenge statuses
 */
export const CHALLENGE_STATUS = {
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
} as const;

/**
 * Challenge types
 */
export const CHALLENGE_TYPE = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  PERSONAL: 'personal',
  TEAM: 'team',
  COMPANY: 'company',
} as const;

// ============================================
// UI STRINGS
// ============================================

/**
 * Common error messages
 */
export const ERROR_MESSAGES = {
  PROFILE_NOT_FOUND: 'Profile not found',
  CHALLENGE_NOT_FOUND: 'Challenge not found',
  FETCH_FAILED: 'Failed to fetch data',
  CREATE_FAILED: 'Failed to create',
  UPDATE_FAILED: 'Failed to update',
  DELETE_FAILED: 'Failed to delete',
  AUTH_REQUIRED: 'Please login to continue',
  PERMISSION_DENIED: 'You do not have permission to perform this action',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  PROFILE_CREATED: 'Profile created successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  CHALLENGE_CREATED: 'Challenge created successfully',
  CHALLENGE_COMPLETED: 'Challenge completed successfully',
  JOINED_CHALLENGE: 'Joined challenge successfully',
  LEFT_CHALLENGE: 'Left challenge successfully',
} as const;

// ============================================
// BADGE STYLES
// ============================================

/**
 * DaisyUI badge class mappings for challenge status
 */
export const STATUS_BADGE_CLASSES = {
  [CHALLENGE_STATUS.ONGOING]: 'badge-info',
  [CHALLENGE_STATUS.COMPLETED]: 'badge-success',
} as const;

/**
 * DaisyUI badge class mappings for challenge type
 */
export const TYPE_BADGE_CLASSES = {
  [CHALLENGE_TYPE.PUBLIC]: 'badge-success',
  [CHALLENGE_TYPE.PRIVATE]: 'badge-warning',
  [CHALLENGE_TYPE.PERSONAL]: 'badge-primary',
  [CHALLENGE_TYPE.TEAM]: 'badge-secondary',
  [CHALLENGE_TYPE.COMPANY]: 'badge-accent',
} as const;

// ============================================
// SKILL RATINGS
// ============================================

/**
 * Skill rating scale (1-5 stars)
 */
export const SKILL_RATING = {
  MIN: 1,
  MAX: 5,
  DEFAULT: 3,
} as const;

// ============================================
// LOCAL STORAGE KEYS
// ============================================

/**
 * Keys for localStorage
 */
export const STORAGE_KEYS = {
  CURRENT_USER_ID: 'currentUserId',
} as const;

// ============================================
// EVENT NAMES
// ============================================

/**
 * Custom event names for cross-component communication
 */
export const EVENTS = {
  USER_CHANGED: 'userChanged',
} as const;

// ============================================
// TYPE EXPORTS
// ============================================

export type ChallengeStatus = typeof CHALLENGE_STATUS[keyof typeof CHALLENGE_STATUS];
export type ChallengeType = typeof CHALLENGE_TYPE[keyof typeof CHALLENGE_TYPE];
