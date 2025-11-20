'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useProfiles } from '@/hooks/useProfiles';
import { useChallenges, useUserChallenges } from '@/hooks/useChallenges';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { findSimilarProfiles, findSuggestedChallenges, ScoredProfile } from '@/lib/scoringService';
import { PageLoader } from '@/components/LoadingSpinner';
import { ProfileCard } from '@/components/ProfileCard';
import { ChallengeCard } from '@/components/ChallengeCard';
import { SuggestedChallenges } from '@/components/challenge/SuggestedChallenges';
import { MapPinIcon, StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';

export default function Home() {
  const { currentUser } = useAuth();
  const { profiles } = useProfiles();
  const { challenges } = useChallenges({ status: 'ongoing' });
  const { challenges: yourChallenges, loading: yourChallengesLoading } = useUserChallenges(currentUser?.id);
  const { leaderboard, loading: leaderboardLoading } = useLeaderboard();
  
  const [stats, setStats] = useState({ challenges: 0, profiles: 0 });
  const [relatedProfiles, setRelatedProfiles] = useState<ScoredProfile[]>([]);
  const [suggestedChallenges, setSuggestedChallenges] = useState<typeof challenges>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [currentUser, profiles, challenges]);

  async function loadData() {
    // Fetch stats
    const [challengesResult, profilesResult] = await Promise.all([
      supabase.from('challenges').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
    ]);

    setStats({
      challenges: challengesResult.count || 0,
      profiles: profilesResult.count || 0,
    });

    // Calculate similar profiles and suggested challenges using scoring service
    if (currentUser && profiles.length > 0) {
      const profilesExcludingUser = profiles.filter(p => p.id !== currentUser.id);
      
      // Use scoring service to find similar profiles
      const similar = findSimilarProfiles(currentUser, profilesExcludingUser);
      setRelatedProfiles(similar);
      
      // Use scoring service to find suggested challenges
      const suggested = findSuggestedChallenges(currentUser, challenges);
      setSuggestedChallenges(suggested);
    }

    setLoading(false);
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

  if (loading || yourChallengesLoading || leaderboardLoading) {
    return <PageLoader />;
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="hero min-h-[60vh] bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
              Turn Skills into Action
            </h1>
            <p className="text-xl mb-8 opacity-80">
              Connect with talented colleagues, join exciting challenges, and grow together. 
              Your next collaboration starts here.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              {!currentUser ? (
                <>
                  <Link href="/profiles" className="btn btn-primary btn-lg">
                    Get Started
                  </Link>
                  <Link href="/challenges" className="btn btn-outline btn-lg">
                    Explore Challenges
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/challenges/new" className="btn btn-primary btn-lg">
                    Create Challenge
                  </Link>
                  <Link href="/challenges" className="btn btn-outline btn-lg">
                    Browse Challenges
                  </Link>
                </>
              )}
            </div>
            
            {/* Stats */}
            <div className="stats shadow mt-12 bg-base-100/80 backdrop-blur">
              <div className="stat place-items-center">
                <div className="stat-title">Active Challenges</div>
                <div className="stat-value text-primary">{stats.challenges}</div>
                <div className="stat-desc">Join the action</div>
              </div>
              
              <div className="stat place-items-center">
                <div className="stat-title">Talented Profiles</div>
                <div className="stat-value text-secondary">{stats.profiles}</div>
                <div className="stat-desc">Ready to collaborate</div>
              </div>
              
              {currentUser && yourChallenges.length > 0 && (
                <div className="stat place-items-center">
                  <div className="stat-title">Your Challenges</div>
                  <div className="stat-value text-accent">{yourChallenges.length}</div>
                  <div className="stat-desc">Keep going!</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Combined Section: People Similar to You (2/3) + Leaderboard (1/3) */}
      {(currentUser && relatedProfiles.length > 0) || leaderboard.length > 0 ? (
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* People Similar to You - 2/3 width */}
            {currentUser && relatedProfiles.length > 0 && (
              <div className="lg:w-2/3">
                <div className="flex items-center gap-3 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    People Similar to You
                  </h2>
                </div>
                <p className="text-sm opacity-70 mb-6">
                  Profiles with matching skills and interests
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  {relatedProfiles.map((profile) => (
                    <ProfileCard key={profile.id} profile={profile} />
                  ))}
                </div>
              </div>
            )}

            {/* Leaderboard - 1/3 width */}
            {leaderboard.length > 0 && (
              <div className={currentUser && relatedProfiles.length > 0 ? "lg:w-1/3" : "w-full"}>
                <div className="flex items-center gap-3 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Top 10 Leaderboard
                  </h2>
                </div>
                <p className="text-sm opacity-70 mb-6">
                  Top performers by challenges and ratings
                </p>
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body p-4">
                    <div className="space-y-3">
                      {leaderboard.map((entry, index) => (
                        <div 
                          key={entry.profile.id} 
                          className={`flex items-center gap-3 p-3 rounded-lg ${
                            currentUser?.id === entry.profile.id ? 'bg-primary/10 border-2 border-primary' : 'bg-base-200'
                          }`}
                        >
                          <div className="flex-shrink-0 w-8 text-center font-bold">
                            {index === 0 && <span className="text-2xl">🥇</span>}
                            {index === 1 && <span className="text-2xl">🥈</span>}
                            {index === 2 && <span className="text-2xl">🥉</span>}
                            {index > 2 && <span className="text-sm opacity-70">#{index + 1}</span>}
                          </div>
                          
                          <Link href={`/profiles/${entry.profile.id}`} className="flex items-center gap-2 flex-1 min-w-0 hover:underline">
                            <div className="avatar">
                              <div className="w-8 rounded-full">
                                <img 
                                  src={entry.profile.photo || `https://ui-avatars.com/api/?name=${entry.profile.name}`} 
                                  alt={entry.profile.name} 
                                />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm truncate">{entry.profile.name}</div>
                              <div className="text-xs opacity-60 flex items-center gap-2">
                                <span>{entry.completedChallenges} completed</span>
                                {entry.totalRatings > 0 && (
                                  <span className="flex items-center gap-0.5">
                                    <StarIcon className="w-3 h-3 text-warning" />
                                    {entry.averageRating.toFixed(1)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                          
                          <div className="flex-shrink-0 text-right">
                            <div className="font-bold text-primary text-sm">{entry.score.toFixed(0)}</div>
                            <div className="text-xs opacity-60">pts</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {currentUser && relatedProfiles.length === 0 && (
        <div className="container mx-auto px-4 py-8">
          <div className="alert alert-info">
            <span>No similar profiles found yet. Complete your profile to find matching colleagues!</span>
          </div>
        </div>
      )}

      {currentUser && yourChallenges.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-6">Your Challenges</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {yourChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </div>
      )}

      {currentUser && (
        <SuggestedChallenges 
          challenges={suggestedChallenges}
          onJoin={joinChallenge}
        />
      )}
    </div>
  );
}
