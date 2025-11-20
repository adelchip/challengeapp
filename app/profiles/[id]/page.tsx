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
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header with Back Button */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Profile Details
            </h1>
            <button onClick={() => router.back()} className="btn btn-ghost btn-lg">
              ← Back
            </button>
          </div>

          {/* Main Profile Card */}
          <div className="card bg-base-100 shadow-2xl">
            <div className="card-body p-8">
              {/* Profile Header with Avatar */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
                {profile.photo && (
                  <div className="avatar">
                    <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img src={profile.photo} alt={profile.name} />
                    </div>
                  </div>
                )}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                    <h2 className="text-3xl font-bold">{profile.name}</h2>
                    <button 
                      className="btn btn-circle btn-sm hover:bg-[#6264A7] hover:border-[#6264A7] tooltip tooltip-right"
                      data-tip="Chat on Teams (Coming Soon)"
                      onClick={() => {/* Future: Open Teams chat */}}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 2228.833 2073.333" fill="currentColor">
                        <path fill="#5059C9" d="M1554.637,777.5h575.713c54.391,0,98.483,44.092,98.483,98.483v524.398c0,199.901-162.051,361.952-361.952,361.952h0c-199.901,0-361.952-162.051-361.952-361.952V828.971C1504.929,800.544,1526.211,777.5,1554.637,777.5L1554.637,777.5z"/>
                        <circle fill="#5059C9" cx="1943.75" cy="440.583" r="233.25"/>
                        <circle fill="#7B83EB" cx="1218.083" cy="336.917" r="336.917"/>
                        <path fill="#7B83EB" d="M1667.323,777.5H717.01c-53.743,0-97.304,43.561-97.304,97.304v598.724c0,53.743,43.561,97.304,97.304,97.304h950.313c53.743,0,97.304-43.561,97.304-97.304V874.804C1764.627,821.061,1721.066,777.5,1667.323,777.5z"/>
                        <path opacity="0.1" d="M1244,777.5v950.312c0,53.743-43.561,97.304-97.304,97.304H717.01c-53.743,0-97.304-43.561-97.304-97.304V874.804c0-53.743,43.561-97.304,97.304-97.304H1244z"/>
                        <path opacity="0.2" d="M1192.167,777.5v950.312c0,53.743-43.561,97.304-97.304,97.304H717.01c-53.743,0-97.304-43.561-97.304-97.304V874.804c0-53.743,43.561-97.304,97.304-97.304H1192.167z"/>
                        <path opacity="0.2" d="M1192.167,777.5v898.438c0,53.743-43.561,97.304-97.304,97.304H717.01c-53.743,0-97.304-43.561-97.304-97.304V874.804c0-53.743,43.561-97.304,97.304-97.304H1192.167z"/>
                        <path opacity="0.2" d="M1140.333,777.5v898.438c0,53.743-43.561,97.304-97.304,97.304H717.01c-53.743,0-97.304-43.561-97.304-97.304V874.804c0-53.743,43.561-97.304,97.304-97.304H1140.333z"/>
                        <path opacity="0.1" d="M1244,509.522v163.275c-217.092,0.031-393.175,176.114-393.206,393.206H657.588V509.522H1244z"/>
                        <path opacity="0.2" d="M1192.167,561.355v111.442c-217.092,0.031-393.175,176.114-393.206,393.206h-42.33V561.355H1192.167z"/>
                        <path opacity="0.2" d="M1192.167,561.355v111.442c-217.092,0.031-393.175,176.114-393.206,393.206h-42.33V561.355H1192.167z"/>
                        <path opacity="0.2" d="M1140.333,561.355v111.442c-217.092,0.031-393.175,176.114-393.206,393.206h-42.33V561.355H1140.333z"/>
                        <linearGradient id="a" x1="198.099" x2="942.234" y1="392.261" y2="1681.073" gradientUnits="userSpaceOnUse">
                          <stop offset="0" stopColor="#5a62c3"/>
                          <stop offset=".5" stopColor="#4d55bd"/>
                          <stop offset="1" stopColor="#3940ab"/>
                        </linearGradient>
                        <path fill="url(#a)" d="M95.833,466.5h950.312c52.985,0,95.937,42.952,95.937,95.937v950.312c0,52.985-42.952,95.937-95.937,95.937H95.833c-52.985,0-95.937-42.952-95.937-95.937V562.437C-0.104,509.452,42.848,466.5,95.833,466.5z"/>
                        <path fill="#FFF" d="M820.211,828.193H630.241v517.297H509.211V828.193H320.123V727.844h500.088V828.193z"/>
                      </svg>
                    </button>
                  </div>
                  <p className="text-lg opacity-70 mb-3">{profile.role}</p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <div className="badge badge-lg badge-primary">{profile.business_unit}</div>
                    <div className="badge badge-lg badge-secondary gap-2">
                      <MapPinIcon className="w-4 h-4" />
                      {profile.country}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="divider"></div>

              {/* Profile Details Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {profile.description && (
                    <div className="card bg-base-200">
                      <div className="card-body p-4">
                        <h3 className="font-bold text-sm opacity-70 mb-2">ABOUT</h3>
                        <p className="text-base">{profile.description}</p>
                      </div>
                    </div>
                  )}

                  {profile.interests && (
                    <div className="card bg-base-200">
                      <div className="card-body p-4">
                        <h3 className="font-bold text-sm opacity-70 mb-2">INTERESTS</h3>
                        <p className="text-base">{profile.interests}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Skills */}
                <div>
                  <div className="card bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/10">
                    <div className="card-body p-4">
                      <h3 className="font-bold text-sm opacity-70 mb-3 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        SKILLS ({profile.skills.length})
                      </h3>
                      <div className="space-y-3">
                        {profile.skills.map((skill, idx) => (
                          <div key={idx} className="bg-base-100 rounded-lg p-3 shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-sm">{skill.name}</span>
                              <span className="badge badge-sm badge-primary">{skill.rating}/5</span>
                            </div>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                star <= skill.rating ? (
                                  <StarIcon key={star} className="w-4 h-4 text-warning" />
                                ) : (
                                  <StarIconOutline key={star} className="w-4 h-4 text-warning opacity-30" />
                                )
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="divider"></div>
              <div className="flex gap-4 justify-end flex-wrap">
                {isCurrentUser ? (
                  <>
                    <button 
                      onClick={() => router.push(`/profiles/${profile.id}/edit`)} 
                      className="btn btn-primary btn-lg gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </button>
                    <button onClick={logout} className="btn btn-error btn-lg gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </>
                ) : (
                  <button onClick={loginAs} className="btn btn-primary btn-lg gap-2">
                    <KeyIcon className="w-5 h-5" />
                    Login as {profile.name}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body items-center text-center p-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <div className="stat-value text-primary text-3xl">{profile.skills.length}</div>
                <div className="stat-desc text-sm opacity-70">Skills</div>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body items-center text-center p-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-secondary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className="stat-value text-secondary text-3xl">{profile.business_unit}</div>
                <div className="stat-desc text-sm opacity-70">Business Unit</div>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body items-center text-center p-6">
                <MapPinIcon className="h-10 w-10 text-accent mb-2" />
                <div className="stat-value text-accent text-3xl">{profile.country}</div>
                <div className="stat-desc text-sm opacity-70">Location</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
