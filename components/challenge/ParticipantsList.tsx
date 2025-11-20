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
  /** Challenge creator's ID for highlighting */
  creatorId?: string;
  /** Callback when user wants to join */
  onJoin?: () => void;
  /** Callback when user wants to leave */
  onLeave?: () => void;
  /** Callback when creator removes a participant */
  onRemoveParticipant?: (participantId: string) => void;
}

/**
 * Participants list card for challenge detail page
 * Shows all participants with avatars and allows join/leave actions
 */
export function ParticipantsList({
  participants,
  currentUser,
  isCreator,
  creatorId,
  onJoin,
  onLeave,
  onRemoveParticipant
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
            {participants.map(participant => {
              const isCreatorProfile = creatorId && participant.id === creatorId;
              const canRemove = isCreator && !isCreatorProfile && onRemoveParticipant;
              
              return (
                <div
                  key={participant.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isCreatorProfile 
                      ? 'bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary shadow-md' 
                      : 'bg-base-200 hover:bg-base-300'
                  }`}
                >
                  <div className="avatar">
                    <div className={`w-12 rounded-full ${isCreatorProfile ? 'ring ring-primary ring-offset-base-100 ring-offset-2' : ''}`}>
                      <img 
                        src={participant.photo || `https://ui-avatars.com/api/?name=${participant.name}`} 
                        alt={participant.name} 
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link href={`/profiles/${participant.id}`} className="font-semibold text-sm hover:underline truncate">
                        {participant.name}
                      </Link>
                      {isCreatorProfile && (
                        <span className="badge badge-primary badge-sm gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                          Creator
                        </span>
                      )}
                    </div>
                    <p className="text-xs opacity-70 truncate">{participant.role}</p>
                  </div>
                  {canRemove && (
                    <button
                      onClick={() => onRemoveParticipant(participant.id)}
                      className="btn btn-circle btn-sm btn-error"
                      title="Remove participant"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
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
