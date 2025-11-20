import Link from 'next/link';
import { Profile } from '@/types';
import { MapPinIcon, StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';

interface ProfileCardProps {
  profile: Profile & { matchingSkills?: any[] };
}

/**
 * Reusable profile card component
 * Used in: Homepage (similar profiles), Profile search/list
 */
export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-start gap-3">
          {profile.photo && (
            <div className="avatar">
              <div className="w-12 rounded-full">
                <img src={profile.photo} alt={profile.name} />
              </div>
            </div>
          )}
          <div className="flex-1">
            <h3 className="card-title text-lg">{profile.name}</h3>
            <p className="text-sm opacity-70">{profile.role}</p>
            <p className="text-sm flex items-center gap-1">
              <MapPinIcon className="w-4 h-4" />
              {profile.country}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col gap-1 mt-3">
          {profile.matchingSkills && profile.matchingSkills.length > 0 ? (
            // Show matching skills with ratings (for "People Similar to You")
            profile.matchingSkills.slice(0, 5).map((skill: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="font-medium">{skill.name}</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(star => (
                    star <= skill.profileRating ? (
                      <StarIcon key={star} className="w-4 h-4 text-warning" />
                    ) : (
                      <StarIconOutline key={star} className="w-4 h-4 text-warning" />
                    )
                  ))}
                </div>
              </div>
            ))
          ) : profile.skills && profile.skills.length > 0 ? (
            // Show top 3 skills as badges (for profile lists)
            <div className="flex flex-wrap gap-2">
              {profile.skills.slice(0, 3).map((skill, idx) => (
                <div key={idx} className="badge badge-primary badge-sm gap-1">
                  {skill.name}
                  <span className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      star <= skill.rating ? (
                        <StarIcon key={star} className="w-3 h-3 text-warning" />
                      ) : (
                        <StarIconOutline key={star} className="w-3 h-3 text-warning" />
                      )
                    ))}
                  </span>
                </div>
              ))}
              {profile.skills.length > 3 && (
                <div className="badge badge-ghost badge-sm">
                  +{profile.skills.length - 3} more
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm opacity-50">No skills listed</p>
          )}
        </div>
        
        <div className="card-actions justify-end mt-4">
          <Link href={`/profiles/${profile.id}`} className="btn btn-sm btn-primary">
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
