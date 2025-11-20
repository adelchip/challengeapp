'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Message, ChallengeRating, Profile } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useChallenge } from '@/hooks/useChallenges';
import { useProfiles } from '@/hooks/useProfiles';
import { ChallengeHeader } from '@/components/challenge/ChallengeHeader';
import { SuggestedProfiles } from '@/components/challenge/SuggestedProfiles';
import { ParticipantsList } from '@/components/challenge/ParticipantsList';
import { MessageList } from '@/components/challenge/MessageList';
import { RatingModal } from '@/components/challenge/RatingModal';
import { PageLoader } from '@/components/LoadingSpinner';

export default function ChallengeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { currentUser, checkAuth } = useAuth();
  const { challenge, loading: challengeLoading, refetch: refetchChallenge } = useChallenge(params.id as string);
  const { profiles, loading: profilesLoading } = useProfiles();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [existingRatings, setExistingRatings] = useState<ChallengeRating[]>([]);

  const isCreator = currentUser?.id === challenge?.created_by;
  
  // Derived state
  const participants = profiles.filter(p => challenge?.participants?.includes(p.id));
  const suggestedProfiles = profiles.filter(p => challenge?.suggested_profiles?.includes(p.id));

  useEffect(() => {
    if (challenge) {
      fetchMessagesAndRatings();
    }
  }, [challenge?.id]);

  async function fetchMessagesAndRatings() {
    if (!challenge) return;

    try {
      // Fetch messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('challenge_id', challenge.id)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;
      setMessages(messagesData || []);

      // Fetch existing ratings
      const { data: ratingsData, error: ratingsError } = await supabase
        .from('challenge_ratings')
        .select('*')
        .eq('challenge_id', challenge.id);

      if (ratingsError) throw ratingsError;
      setExistingRatings(ratingsData || []);
      
      // Initialize ratings state with existing ratings
      const initialRatings: Record<string, number> = {};
      ratingsData?.forEach(rating => {
        initialRatings[rating.profile_id] = rating.rating;
      });
      setRatings(initialRatings);
    } catch (error) {
      console.error('Error fetching messages and ratings:', error);
    }
  }

  async function handleJoin(profileId: string) {
    if (!challenge) return;

    try {
      const updatedParticipants = [...challenge.participants, profileId];
      const { error } = await supabase
        .from('challenges')
        .update({ participants: updatedParticipants })
        .eq('id', challenge.id);

      if (error) throw error;

      refetchChallenge(); // Refresh challenge data
    } catch (error) {
      console.error('Error adding participant:', error);
      alert('Error adding participant');
    }
  }

  async function handleLeave(profileId: string) {
    if (!challenge) return;

    try {
      const updatedParticipants = challenge.participants.filter(id => id !== profileId);
      const { error } = await supabase
        .from('challenges')
        .update({ participants: updatedParticipants })
        .eq('id', challenge.id);

      if (error) throw error;

      refetchChallenge(); // Refresh challenge data
    } catch (error) {
      console.error('Error removing participant:', error);
      alert('Error removing participant');
    }
  }

  async function handleRemoveParticipant(participantId: string) {
    if (!challenge || !isCreator) return;

    if (!confirm('Are you sure you want to remove this participant?')) {
      return;
    }

    try {
      const updatedParticipants = challenge.participants.filter(id => id !== participantId);
      const { error } = await supabase
        .from('challenges')
        .update({ participants: updatedParticipants })
        .eq('id', challenge.id);

      if (error) throw error;

      refetchChallenge(); // Refresh challenge data
    } catch (error) {
      console.error('Error removing participant:', error);
      alert('Error removing participant');
    }
  }

  async function completeChallenge() {
    if (!challenge) return;
    
    // Check if current user is the creator
    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId || challenge.created_by !== currentUserId) {
      alert('Only the challenge creator can mark it as completed');
      return;
    }
    
    // If there are participants, show rating modal
    if (participants.length > 0) {
      // Check if there are participants other than the creator to rate
      const participantsToRate = participants.filter(p => p.id !== currentUserId);
      if (participantsToRate.length > 0) {
        setShowRatingModal(true);
      } else {
        // Only the creator is a participant, no one to rate
        await finalizeCompletion();
      }
    } else {
      // No participants, just mark as completed
      await finalizeCompletion();
    }
  }

  async function finalizeCompletion() {
    if (!challenge) return;

    try {
      // Save all ratings
      const ratingsToSave = participants
        .filter(p => ratings[p.id]) // Only save profiles that have been rated
        .map(p => ({
          challenge_id: challenge.id,
          profile_id: p.id,
          rating: ratings[p.id]
        }));

      if (ratingsToSave.length > 0) {
        // Upsert ratings (insert or update if already exists)
        const { error: ratingsError } = await supabase
          .from('challenge_ratings')
          .upsert(ratingsToSave, { 
            onConflict: 'challenge_id,profile_id',
            ignoreDuplicates: false 
          });

        if (ratingsError) throw ratingsError;
      }

      // Update challenge status to completed
      const { error } = await supabase
        .from('challenges')
        .update({ status: 'completed' })
        .eq('id', challenge.id);

      if (error) throw error;

      refetchChallenge(); // Refresh challenge data
      setShowRatingModal(false);
    } catch (error) {
      console.error('Error completing challenge:', error);
      alert('Error completing challenge');
    }
  }

  function handleRatingChange(profileId: string, rating: number) {
    setRatings({ ...ratings, [profileId]: rating });
  }

  async function handleSendMessage(content: string, senderId: string) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          challenge_id: params.id,
          sender_profile_id: senderId,
          content: content,
        }])
        .select()
        .single();

      if (error) throw error;

      setMessages([...messages, data]);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message');
    }
  }

  if (challengeLoading || profilesLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!challenge) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
                {challenge.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                <span className={`badge badge-lg gap-2 ${challenge.type === 'public' ? 'badge-success' : 'badge-warning'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {challenge.type === 'public' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    )}
                  </svg>
                  {challenge.type === 'public' ? 'Public' : 'Private'}
                </span>
                <span className={`badge badge-lg gap-2 ${challenge.status === 'completed' ? 'badge-success' : 'badge-info'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {challenge.status === 'completed' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                  {challenge.status === 'completed' ? 'Completed' : 'Ongoing'}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {challenge.status === 'ongoing' && isCreator && (
                <button 
                  onClick={completeChallenge} 
                  className="btn btn-success btn-lg gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Complete Challenge
                </button>
              )}
              <button onClick={() => router.back()} className="btn btn-ghost btn-lg">
                ← Back
              </button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Challenge Description */}
              <div className="card bg-base-100 shadow-2xl">
                <div className="card-body">
                  <h2 className="card-title text-xl flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Challenge Information
                  </h2>
                  <div className="divider my-2"></div>
                  <p className="text-base leading-relaxed">{challenge.description}</p>
                </div>
              </div>

              {/* Collaboration Room */}
              <MessageList
                messages={messages}
                profiles={profiles}
                currentUser={currentUser}
                onSendMessage={handleSendMessage}
                isCompleted={challenge.status === 'completed'}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Suggested Profiles - Only show when challenge is ongoing */}
              {challenge.status === 'ongoing' && suggestedProfiles.length > 0 && (
                <SuggestedProfiles 
                  profiles={suggestedProfiles}
                  participantIds={challenge.participants}
                  onAdd={handleJoin}
                />
              )}

          {/* Participants */}
          <ParticipantsList
            participants={participants}
            currentUser={currentUser}
            isCreator={isCreator}
            creatorId={challenge.created_by}
            onJoin={() => currentUser && handleJoin(currentUser.id)}
            onLeave={() => currentUser && handleLeave(currentUser.id)}
            onRemoveParticipant={handleRemoveParticipant}
          />

          {/* Add Participant - Only show when challenge is ongoing */}
          {challenge.status === 'ongoing' && profiles.filter(p => !challenge.participants.includes(p.id)).length > 0 && (
            <div className="card bg-base-100 shadow-2xl">
              <div className="card-body">
                <h2 className="card-title text-lg flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Add Participant
                </h2>
                <div className="divider my-1"></div>
                <select
                  className="select select-bordered w-full max-w-xs"
                  onChange={(e) => e.target.value && handleJoin(e.target.value)}
                  value=""
                >
                  <option value="">Select a profile...</option>
                  {profiles.filter(p => !challenge.participants.includes(p.id)).map((profile: Profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={showRatingModal}
        participants={participants.filter(p => p.id !== challenge?.created_by)}
        ratings={ratings}
        onRatingChange={handleRatingChange}
        onSubmit={finalizeCompletion}
        onClose={() => setShowRatingModal(false)}
      />
      </div>
    </div>
  );
}
