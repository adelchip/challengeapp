import Link from 'next/link';
import { Challenge } from '@/types';

interface ChallengeCardProps {
  /** Challenge object to display */
  challenge: Challenge;
  /** Callback when join button is clicked */
  onJoin?: (challengeId: string) => void;
  /** Callback when delete button is clicked */
  onDelete?: (challengeId: string) => void;
  /** Show join button (default: false) */
  showJoinButton?: boolean;
  /** Show delete button (default: false) */
  showDeleteButton?: boolean;
}

/**
 * Reusable challenge card component with three action modes:
 * 
 * 1. **View Only Mode** (default):
 *    - Only "View Details" button shown
 *    - Used in "Your Challenges" section
 * 
 * 2. **Join Mode** (showJoinButton=true):
 *    - Shows "Join Challenge" button
 *    - Used in "Suggested Challenges" section
 *    - Requires onJoin callback
 * 
 * 3. **Delete Mode** (showDeleteButton=true):
 *    - Shows "Delete" button
 *    - Used in challenges list page (for creators)
 *    - Requires onDelete callback
 * 
 * @component
 * @example
 * // View only
 * <ChallengeCard challenge={challenge} />
 * 
 * // With join button
 * <ChallengeCard 
 *   challenge={challenge} 
 *   showJoinButton 
 *   onJoin={handleJoin} 
 * />
 * 
 * // With delete button
 * <ChallengeCard 
 *   challenge={challenge} 
 *   showDeleteButton 
 *   onDelete={handleDelete} 
 * />
 */
export function ChallengeCard({
  challenge, 
  onJoin, 
  onDelete,
  showJoinButton = false,
  showDeleteButton = false 
}: ChallengeCardProps) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title text-base">{challenge.title}</h3>
        <p className="text-sm line-clamp-3 opacity-70">{challenge.description}</p>
        
        <div className="flex gap-2 mt-2">
          <span className={`badge ${challenge.type === 'public' ? 'badge-success' : 'badge-warning'} badge-sm`}>
            {challenge.type}
          </span>
          <span className={`badge ${challenge.status === 'completed' ? 'badge-success' : 'badge-info'} badge-sm`}>
            {challenge.status}
          </span>
        </div>

        {challenge.participants && challenge.participants.length > 0 && (
          <div className="text-xs opacity-70 mt-2">
            {challenge.participants.length} participant{challenge.participants.length !== 1 ? 's' : ''}
          </div>
        )}
        
        <div className="card-actions justify-end mt-4 gap-2">
          <Link href={`/challenges/${challenge.id}`} className={showJoinButton || showDeleteButton ? "btn btn-sm btn-ghost" : "btn btn-sm btn-primary"}>
            View Details
          </Link>
          {showJoinButton && onJoin && (
            <button 
              onClick={() => onJoin(challenge.id)} 
              className="btn btn-sm btn-primary"
            >
              Join Challenge
            </button>
          )}
          {showDeleteButton && onDelete && (
            <button 
              onClick={() => onDelete(challenge.id)} 
              className="btn btn-sm btn-error"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
