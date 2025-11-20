import Link from 'next/link';
import { Profile } from '@/types';

interface SuggestedProfilesProps {
  profiles: Profile[];
}

export function SuggestedProfiles({ profiles }: SuggestedProfilesProps) {
  if (profiles.length === 0) return null;

  return (
    <div className="card bg-base-100 shadow-2xl">
      <div className="card-body">
        <h2 className="card-title text-xl flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          AI Suggested Profiles
        </h2>
        <div className="divider my-2"></div>
        <div className="space-y-3">
          {profiles.map((profile) => (
            <Link
              key={profile.id}
              href={`/profiles/${profile.id}`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors"
            >
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img 
                    src={profile.photo || `https://ui-avatars.com/api/?name=${profile.name}`} 
                    alt={profile.name} 
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{profile.name}</p>
                <p className="text-sm opacity-70 truncate">{profile.role}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
