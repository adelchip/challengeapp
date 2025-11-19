'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types';
import { MapPinIcon, KeyIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';

export default function ViewProfilePage() {
  const router = useRouter();
  const params = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setProfile(data);
      
      // Check if this is the current logged-in user
      const currentUserId = localStorage.getItem('currentUserId');
      setIsCurrentUser(currentUserId === data.id);
    } catch (error) {
      console.error('Error fetching profile:', error);
      alert('Profile not found');
      router.push('/profiles');
    } finally {
      setLoading(false);
    }
  }

  function loginAs() {
    if (!profile) return;
    localStorage.setItem('currentUserId', profile.id);
    window.dispatchEvent(new Event('userChanged'));
    router.push('/');
  }

  function logout() {
    localStorage.removeItem('currentUserId');
    setIsCurrentUser(false);
    window.dispatchEvent(new Event('userChanged'));
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Profile Details</h1>
        <button onClick={() => router.back()} className="btn btn-ghost">
          ← Back
        </button>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-start gap-4">
            {profile.photo && (
              <div className="avatar">
                <div className="w-24 rounded-full">
                  <img src={profile.photo} alt={profile.name} />
                </div>
              </div>
            )}
            <div className="flex-1">
              <h2 className="card-title text-2xl">{profile.name}</h2>
              <p className="text-sm opacity-70">{profile.role} • {profile.business_unit}</p>
            </div>
          </div>
          
          <div className="divider"></div>

          <div className="space-y-4">
            {profile.description && (
              <div>
                <p className="text-sm opacity-70">About</p>
                <p className="text-base">{profile.description}</p>
              </div>
            )}

            <div>
              <p className="text-sm opacity-70">Country</p>
              <p className="text-lg font-semibold flex items-center gap-2">
                <MapPinIcon className="w-5 h-5" />
                {profile.country}
              </p>
            </div>

            {profile.interests && (
              <div>
                <p className="text-sm opacity-70">Interests</p>
                <p className="text-base">{profile.interests}</p>
              </div>
            )}

            <div>
              <p className="text-sm opacity-70 mb-2">Skills</p>
              <div className="grid gap-2">
                {profile.skills.map((skill, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-base-200 rounded">
                    <span className="font-medium">{skill.name}</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        star <= skill.rating ? (
                          <StarIcon key={star} className="w-4 h-4 text-warning" />
                        ) : (
                          <StarIconOutline key={star} className="w-4 h-4 text-warning" />
                        )
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card-actions justify-end mt-6">
            {isCurrentUser ? (
              <button onClick={logout} className="btn btn-error">
                Logout
              </button>
            ) : (
              <button onClick={loginAs} className="btn btn-primary gap-2">
                <KeyIcon className="w-5 h-5" />
                Login as {profile.name}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
