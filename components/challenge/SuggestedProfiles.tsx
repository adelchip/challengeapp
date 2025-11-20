import Link from 'next/link';
import { Profile } from '@/types';

interface SuggestedProfilesProps {
  profiles: Profile[];
  /** IDs of profiles already participating */
  participantIds?: string[];
  /** Callback when add button is clicked */
  onAdd?: (profileId: string) => void;
}

export function SuggestedProfiles({ profiles, participantIds = [], onAdd }: SuggestedProfilesProps) {
  if (profiles.length === 0) return null;

  return (
    <div className="card bg-base-100 shadow-2xl">
      <div className="card-body">
        <h2 className="card-title text-lg flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Suggested Profiles ({profiles.length})
        </h2>
        <p className="text-xs opacity-70 mb-3">Ordered by matching skill rating</p>
        <div className="space-y-2">
          {profiles.map((profile, idx) => {
            const isParticipant = participantIds.includes(profile.id);
            
            return (
              <div key={profile.id} className="flex items-center gap-2 p-2 bg-base-200 rounded">
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    <img 
                      src={profile.photo || `https://ui-avatars.com/api/?name=${profile.name}`} 
                      alt={profile.name} 
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="badge badge-xs badge-primary">#{idx + 1}</span>
                    <Link href={`/profiles/${profile.id}`} className="font-semibold text-sm truncate hover:underline">
                      {profile.name}
                    </Link>
                  </div>
                  <p className="text-xs opacity-70 truncate">{profile.role}</p>
                </div>
                {!isParticipant && onAdd && (
                  <button
                    onClick={() => onAdd(profile.id)}
                    className="btn btn-xs btn-primary"
                  >
                    Add
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
