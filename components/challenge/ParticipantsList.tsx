/**
 * Participants List Component
 * Displays list of challenge participants with join/leave actions
 */

import Link from 'next/link';
import { Profile } from '@/types';
import { UserGroupIcon } from '@heroicons/react/24/solid';

interface ParticipantsListProps {
  /** List of participants */
  participants: Profile[];
  /** Current user's profile (if logged in) */
  currentUser: Profile | null;
  /** Whether current user is the challenge creator */
  isCreator: boolean;
  /** Callback when user wants to join */
  onJoin?: () => void;
  /** Callback when user wants to leave */
  onLeave?: () => void;
}

/**
 * Participants list card for challenge detail page
 * Shows all participants with avatars and allows join/leave actions
 */
export function ParticipantsList({
  participants,
  currentUser,
  isCreator,
  onJoin,
  onLeave
}: ParticipantsListProps) {
  const isParticipant = currentUser && participants.some(p => p.id === currentUser.id);

  return (
    <div className="card bg-base-100 shadow-2xl">
      <div className="card-body">
        <h2 className="card-title text-lg flex items-center gap-2">
          <UserGroupIcon className="w-5 h-5" />
          Participants ({participants.length})
        </h2>
        <div className="divider my-1"></div>
        
        {participants.length === 0 ? (
          <div className="alert alert-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>No participants yet. Be the first to join!</span>
          </div>
        ) : (
          <div className="space-y-3">
            {participants.map(participant => (
              <Link
                key={participant.id}
                href={`/profiles/${participant.id}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200 transition-colors"
              >
                {participant.photo && (
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img src={participant.photo} alt={participant.name} />
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-medium">{participant.name}</div>
                  <div className="text-sm opacity-70">{participant.role}</div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Join/Leave Actions */}
        {currentUser && !isCreator && (
          <div className="mt-4">
            {isParticipant ? (
              <button className="btn btn-error btn-block btn-sm" onClick={onLeave}>
                Leave Challenge
              </button>
            ) : (
              <button className="btn btn-primary btn-block" onClick={onJoin}>
                Join Challenge
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
