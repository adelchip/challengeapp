/**
 * Suggested Challenges Component
 * Displays AI-suggested challenges for the current user
 */

import { Challenge } from '@/types';
import { ChallengeCard } from '@/components/ChallengeCard';

interface SuggestedChallengesProps {
  /** List of suggested challenges */
  challenges: Challenge[];
  /** Callback when user joins a challenge */
  onJoin?: (challengeId: string) => void;
  /** Whether user is logged in */
  showWhenLoggedIn?: boolean;
}

/**
 * Grid of AI-suggested challenges for the current user
 * Only shown when user is logged in and has matching challenges
 */
export function SuggestedChallenges({ challenges, onJoin, showWhenLoggedIn = true }: SuggestedChallengesProps) {
  // Don't show if no challenges or user should be logged in but isn't
  if (challenges.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8 text-primary" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
          />
        </svg>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Challenges Suggested for You
        </h2>
      </div>
      <p className="text-sm opacity-70 mb-6">
        Based on your skills and interests, we think you'd be great for these challenges
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {challenges.map((challenge) => (
          <ChallengeCard 
            key={challenge.id} 
            challenge={challenge} 
            onJoin={onJoin}
            showJoinButton
          />
        ))}
      </div>
    </div>
  );
}
