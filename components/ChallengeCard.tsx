import Link from 'next/link';
import { Challenge } from '@/types';

interface ChallengeCardProps {
  challenge: Challenge;
  onJoin?: (challengeId: string) => void;
  onDelete?: (challengeId: string) => void;
  showJoinButton?: boolean;
  showDeleteButton?: boolean;
}

/**
 * Reusable challenge card component
 * Used in: Homepage, Challenges list, Suggested challenges
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
