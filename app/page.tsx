'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Profile, Challenge } from '@/types';
import { MapPinIcon, StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';

interface LeaderboardEntry {
  profile: Profile;
  completedChallenges: number;
  averageRating: number;
  totalRatings: number;
  score: number;
}

export default function Home() {
  const [stats, setStats] = useState({ challenges: 0, profiles: 0 });
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [relatedProfiles, setRelatedProfiles] = useState<Profile[]>([]);
  const [suggestedChallenges, setSuggestedChallenges] = useState<Challenge[]>([]);
  const [yourChallenges, setYourChallenges] = useState<Challenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    // Get current user from localStorage
    const userId = localStorage.getItem('currentUserId');
    
    // Fetch stats
    const [challengesResult, profilesResult] = await Promise.all([
      supabase.from('challenges').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
    ]);

    setStats({
      challenges: challengesResult.count || 0,
      profiles: profilesResult.count || 0,
    });

    // Fetch current user if logged in
    if (userId) {
      const { data: userData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (userData) {
        setCurrentUser(userData);
        await Promise.all([
          fetchRelatedProfiles(userData),
          fetchSuggestedChallenges(userData),
          fetchYourChallenges(userData),
          fetchLeaderboard()
        ]);
      } else {
        // User not found, clear session
        localStorage.removeItem('currentUserId');
      }
    } else {
      // Fetch leaderboard even if not logged in
      await fetchLeaderboard();
    }

    setLoading(false);
  }

  async function fetchRelatedProfiles(user: Profile) {
    // Get all profiles except current user
    const { data: allProfiles } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', user.id);

    if (!allProfiles) return;

    // Calculate similarity scores based on skills
    const scoredProfiles = allProfiles.map(profile => {
      let score = 0;
      const matchingSkills: { name: string; userRating: number; profileRating: number; similarity: number }[] = [];
      
      // Check for matching skills
      user.skills.forEach(userSkill => {
        const matchingSkill = profile.skills.find(
          (s: any) => s.name.toLowerCase() === userSkill.name.toLowerCase()
        );
        if (matchingSkill) {
          const similarity = 10 - Math.abs(userSkill.rating - matchingSkill.rating);
          score += similarity;
          matchingSkills.push({
            name: matchingSkill.name,
            userRating: userSkill.rating,
            profileRating: matchingSkill.rating,
            similarity
          });
        }
      });

      // Bonus for same business unit
      if (profile.business_unit === user.business_unit) {
        score += 3;
      }

      // Bonus for same country
      if (profile.country === user.country) {
        score += 2;
      }

      // Sort matching skills by similarity
      matchingSkills.sort((a, b) => b.similarity - a.similarity);

      return { profile, score, matchingSkills };
    });

    // Sort by score and get top 6
    const related = scoredProfiles
      .filter(sp => sp.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    setRelatedProfiles(related.map(sp => ({
      ...sp.profile,
      matchingSkills: sp.matchingSkills
    })));
  }

  async function fetchSuggestedChallenges(user: Profile) {
    // Get ongoing challenges that the user is not already participating in
    const { data: challenges } = await supabase
      .from('challenges')
      .select('*')
      .eq('status', 'ongoing');

    if (!challenges) return;

    // Filter out challenges user is already in, and filter private challenges
    const scoredChallenges = challenges
      .filter(challenge => {
        // Exclude if already participating
        if (challenge.participants?.includes(user.id)) return false;
        // Include public challenges, or private challenges where user is creator or participant
        if (challenge.type === 'public') return true;
        return challenge.created_by === user.id || challenge.participants?.includes(user.id);
      })
      .map(challenge => {
        let score = 0;
        
        // Simple scoring: check if challenge description mentions user's skills
        const description = challenge.description.toLowerCase();
        const title = challenge.title.toLowerCase();
        
        user.skills.forEach(skill => {
          const skillLower = skill.name.toLowerCase();
          // Check for partial matches too (e.g., "react" matches "react.js")
          if (description.includes(skillLower) || title.includes(skillLower)) {
            score += skill.rating * 2; // Weight by skill rating
          }
        });

        return { challenge, score };
      });

    // Sort by score (highest first), then by created date (newest first)
    // Show all ongoing challenges, not just ones with matching skills
    const suggested = scoredChallenges
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return new Date(b.challenge.created_at).getTime() - new Date(a.challenge.created_at).getTime();
      })
      .slice(0, 6);

    setSuggestedChallenges(suggested.map(sc => sc.challenge));
  }

  async function fetchYourChallenges(user: Profile) {
    // Get all challenges where the user is a participant
    const { data: challenges } = await supabase
      .from('challenges')
      .select('*');

    if (!challenges) return;

    // Filter challenges where user is a participant
    const userChallenges = challenges
      .filter(challenge => challenge.participants?.includes(user.id))
      .sort((a, b) => {
        // Sort by: ongoing first, then by created_at (newest first)
        if (a.status === 'ongoing' && b.status !== 'ongoing') return -1;
        if (a.status !== 'ongoing' && b.status === 'ongoing') return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

    setYourChallenges(userChallenges);
  }

  async function joinChallenge(challengeId: string) {
    if (!currentUser) return;

    try {
      // Get current challenge
      const { data: challenge } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', challengeId)
        .single();

      if (!challenge) return;

      // Add user to participants
      const updatedParticipants = [...(challenge.participants || []), currentUser.id];

      const { error } = await supabase
        .from('challenges')
        .update({ participants: updatedParticipants })
        .eq('id', challengeId);

      if (error) throw error;

      // Redirect to challenge page
      window.location.href = `/challenges/${challengeId}`;
    } catch (error) {
      console.error('Error joining challenge:', error);
      alert('Error joining challenge');
    }
  }

  async function fetchLeaderboard() {
    try {
      // Get all profiles, challenges, and ratings
      const [profilesResult, challengesResult, ratingsResult] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('challenges').select('*'),
        supabase.from('challenge_ratings').select('*')
      ]);

      if (!profilesResult.data || !challengesResult.data || !ratingsResult.data) return;

      const profiles = profilesResult.data;
      const challenges = challengesResult.data;
      const ratings = ratingsResult.data;

      // Calculate leaderboard scores for each profile
      const leaderboardData: LeaderboardEntry[] = profiles.map(profile => {
        // Count completed challenges where user was a participant
        const completedChallenges = challenges.filter(
          challenge => 
            challenge.status === 'completed' && 
            challenge.participants?.includes(profile.id)
        ).length;

        // Get all ratings for this profile
        const profileRatings = ratings.filter(r => r.profile_id === profile.id);
        const totalRatings = profileRatings.length;
        const averageRating = totalRatings > 0
          ? profileRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
          : 0;

        // Calculate fair score:
        // - Completed challenges: 10 points each (encourages participation)
        // - Average rating: multiplied by 2 (rewards quality performance)
        // - This way, both participation and performance matter
        const score = (completedChallenges * 10) + (averageRating * 2);

        return {
          profile,
          completedChallenges,
          averageRating,
          totalRatings,
          score
        };
      });

      // Sort by score (highest first) and take top 10
      const topTen = leaderboardData
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      setLeaderboard(topTen);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  }

  function logout() {
    localStorage.removeItem('currentUserId');
    setCurrentUser(null);
    setRelatedProfiles([]);
    setSuggestedChallenges([]);
    setYourChallenges([]);
    window.dispatchEvent(new Event('userChanged'));
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      {!currentUser && (
        <div className="hero min-h-[20vh]">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <div className="flex gap-4 justify-center">
                <Link href="/profiles" className="btn btn-secondary">
                  Login as Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Section */}
      {leaderboard.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-6">Leaderboard - Top 10</h2>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-0">
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th className="w-16">Rank</th>
                      <th>Profile</th>
                      <th className="text-center">Completed</th>
                      <th className="text-center">Avg Rating</th>
                      <th className="text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, index) => (
                      <tr key={entry.profile.id} className={currentUser?.id === entry.profile.id ? 'bg-primary/10' : ''}>
                        <td className="font-bold text-center">
                          {index === 0 && <span className="text-2xl">🥇</span>}
                          {index === 1 && <span className="text-2xl">🥈</span>}
                          {index === 2 && <span className="text-2xl">🥉</span>}
                          {index > 2 && <span className="text-lg">#{index + 1}</span>}
                        </td>
                        <td>
                          <Link href={`/profiles/${entry.profile.id}`} className="flex items-center gap-3 hover:underline">
                            {entry.profile.photo && (
                              <div className="avatar">
                                <div className="w-10 rounded-full">
                                  <img src={entry.profile.photo} alt={entry.profile.name} />
                                </div>
                              </div>
                            )}
                            <div>
                              <div className="font-bold">{entry.profile.name}</div>
                              <div className="text-sm opacity-50">{entry.profile.business_unit}</div>
                            </div>
                          </Link>
                        </td>
                        <td className="text-center">
                          <div className="badge badge-success">{entry.completedChallenges}</div>
                        </td>
                        <td className="text-center">
                          {entry.totalRatings > 0 ? (
                            <div className="flex items-center justify-center gap-1">
                              <StarIcon className="w-4 h-4 text-warning" />
                              <span className="font-semibold">{entry.averageRating.toFixed(1)}</span>
                            </div>
                          ) : (
                            <span className="text-sm opacity-50">N/A</span>
                          )}
                        </td>
                        <td className="text-right">
                          <span className="font-bold text-primary">{entry.score.toFixed(0)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentUser && relatedProfiles.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-6">People Similar to You</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {relatedProfiles.map((profile) => (
              <div key={profile.id} className="card bg-base-100 shadow-xl">
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
                    {(profile as any).matchingSkills && (profile as any).matchingSkills.length > 0 ? (
                      (profile as any).matchingSkills.slice(0, 5).map((skill: any, idx: number) => (
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
                    ) : (
                      <p className="text-sm opacity-50">No matching skills</p>
                    )}
                  </div>
                  
                  <div className="card-actions justify-end mt-4">
                    <Link href={`/profiles/${profile.id}`} className="btn btn-sm btn-primary">
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentUser && yourChallenges.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-6">Your Challenges</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {yourChallenges.map((challenge) => (
              <div key={challenge.id} className="card bg-base-100 shadow-xl">
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
                  
                  <div className="card-actions justify-end mt-4">
                    <Link href={`/challenges/${challenge.id}`} className="btn btn-sm btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentUser && suggestedChallenges.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-6">Challenges Suggested for You</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {suggestedChallenges.map((challenge) => (
              <div key={challenge.id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-base">{challenge.title}</h3>
                  <p className="text-sm line-clamp-3 opacity-70">{challenge.description}</p>
                  
                  <div className="flex gap-2 mt-2">
                    <span className={`badge ${challenge.type === 'public' ? 'badge-success' : 'badge-warning'} badge-sm`}>
                      {challenge.type}
                    </span>
                    <span className="badge badge-info badge-sm">
                      {challenge.status}
                    </span>
                  </div>

                  {challenge.participants && challenge.participants.length > 0 && (
                    <div className="text-xs opacity-70 mt-2">
                      {challenge.participants.length} participant{challenge.participants.length !== 1 ? 's' : ''}
                    </div>
                  )}
                  
                  <div className="card-actions justify-end mt-4 gap-2">
                    <Link href={`/challenges/${challenge.id}`} className="btn btn-sm btn-ghost">
                      View Details
                    </Link>
                    <button 
                      onClick={() => joinChallenge(challenge.id)} 
                      className="btn btn-sm btn-primary"
                    >
                      Join Challenge
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
