'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Challenge, Profile, Message, ChallengeRating } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { UserGroupIcon, StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';

export default function ChallengeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { currentUser, checkAuth } = useAuth();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [suggestedProfiles, setSuggestedProfiles] = useState<Profile[]>([]);
  const [participants, setParticipants] = useState<Profile[]>([]);
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedSender, setSelectedSender] = useState('');
  const [loading, setLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [existingRatings, setExistingRatings] = useState<ChallengeRating[]>([]);

  const isCreator = currentUser?.id === challenge?.created_by;

  useEffect(() => {
    fetchChallengeData();
  }, []);

  async function fetchChallengeData() {
    try {
      // Fetch challenge
      const { data: challengeData, error: challengeError } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', params.id)
        .single();

      if (challengeError) throw challengeError;
      setChallenge(challengeData);

      // Fetch all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;
      setAllProfiles(profilesData || []);

      // Filter suggested and participant profiles (exclude creator)
      const suggested = (profilesData || []).filter(p => 
        challengeData.suggested_profiles.includes(p.id) && p.id !== challengeData.created_by
      );
      
      // Sort suggested profiles by relevant skill rating
      const sortedSuggested = suggested.sort((a, b) => {
        // Extract tech keywords from challenge
        const text = `${challengeData.title} ${challengeData.description}`.toLowerCase();
        const techKeywords = text.match(/\b(react|angular|vue|node|java|python|javascript|typescript|css|html|sql|mongodb|postgres|docker|kubernetes|aws|azure|git|figma|photoshop|ui|ux|design|spring|django|flask|express|api|rest|graphql|redis|kafka|go|rust|swift|kotlin|android|ios|flutter|mobile|frontend|backend|fullstack|devops|cloud|data|analytics|machine learning|ai|testing|qa|cypress|jest|selenium|c\+\+|c#|ruby|php|scala|perl|r\b)\b/gi) || [];
        
        if (techKeywords.length === 0) {
          // No keywords, sort by max skill rating
          const maxA = Math.max(...a.skills.map((s: any) => s.rating), 0);
          const maxB = Math.max(...b.skills.map((s: any) => s.rating), 0);
          return maxB - maxA;
        }
        
        const normalizedKeywords = techKeywords.map(k => k.toLowerCase());
        
        // Calculate matching skill rating for profile A
        const matchingSkillsA = a.skills.filter((skill: any) => {
          const skillName = skill.name.toLowerCase();
          return normalizedKeywords.some(keyword => 
            skillName.includes(keyword) || keyword.includes(skillName)
          );
        });
        const ratingA = matchingSkillsA.length > 0 
          ? Math.max(...matchingSkillsA.map((s: any) => s.rating))
          : 0;
        
        // Calculate matching skill rating for profile B
        const matchingSkillsB = b.skills.filter((skill: any) => {
          const skillName = skill.name.toLowerCase();
          return normalizedKeywords.some(keyword => 
            skillName.includes(keyword) || keyword.includes(skillName)
          );
        });
        const ratingB = matchingSkillsB.length > 0 
          ? Math.max(...matchingSkillsB.map((s: any) => s.rating))
          : 0;
        
        return ratingB - ratingA; // Sort descending
      });
      
      setSuggestedProfiles(sortedSuggested);

      const parts = (profilesData || []).filter(p => 
        challengeData.participants.includes(p.id)
      );
      setParticipants(parts);

      // Fetch messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('challenge_id', params.id)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;
      setMessages(messagesData || []);

      // Fetch existing ratings for this challenge
      const { data: ratingsData, error: ratingsError } = await supabase
        .from('challenge_ratings')
        .select('*')
        .eq('challenge_id', params.id);

      if (ratingsError) throw ratingsError;
      setExistingRatings(ratingsData || []);
      
      // Initialize ratings state with existing ratings
      const ratingsMap: Record<string, number> = {};
      (ratingsData || []).forEach((rating: ChallengeRating) => {
        ratingsMap[rating.profile_id] = rating.rating;
      });
      setRatings(ratingsMap);

    } catch (error) {
      console.error('Error fetching challenge data:', error);
      alert('Challenge not found');
      router.push('/challenges');
    } finally {
      setLoading(false);
    }
  }

  async function addParticipant(profileId: string) {
    if (!challenge) return;

    try {
      const updatedParticipants = [...challenge.participants, profileId];
      const { error } = await supabase
        .from('challenges')
        .update({ participants: updatedParticipants })
        .eq('id', challenge.id);

      if (error) throw error;

      setChallenge({ ...challenge, participants: updatedParticipants });
      const newParticipant = allProfiles.find(p => p.id === profileId);
      if (newParticipant) {
        setParticipants([...participants, newParticipant]);
      }
    } catch (error) {
      console.error('Error adding participant:', error);
      alert('Error adding participant');
    }
  }

  async function removeParticipant(profileId: string) {
    if (!challenge) return;

    try {
      const updatedParticipants = challenge.participants.filter(id => id !== profileId);
      const { error } = await supabase
        .from('challenges')
        .update({ participants: updatedParticipants })
        .eq('id', challenge.id);

      if (error) throw error;

      setChallenge({ ...challenge, participants: updatedParticipants });
      setParticipants(participants.filter(p => p.id !== profileId));
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

      setChallenge({ ...challenge, status: 'completed' });
      setShowRatingModal(false);
    } catch (error) {
      console.error('Error completing challenge:', error);
      alert('Error completing challenge');
    }
  }

  function handleRatingChange(profileId: string, rating: number) {
    setRatings({ ...ratings, [profileId]: rating });
  }

  async function sendMessage() {
    if (!newMessage.trim() || !selectedSender) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          challenge_id: params.id,
          sender_profile_id: selectedSender,
          content: newMessage,
        }])
        .select()
        .single();

      if (error) throw error;

      setMessages([...messages, data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message');
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!challenge) return null;

  const availableProfiles = allProfiles.filter(p => 
    !challenge.participants.includes(p.id)
  );

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
              <div className="card bg-base-100 shadow-2xl">
                <div className="card-body">
                  <h2 className="card-title text-xl flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Collaboration Room
                  </h2>
                  <div className="divider my-2"></div>
                  
                  {participants.length === 0 ? (
                    <div className="alert alert-info">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>Add participants to start collaboration</span>
                    </div>
                  ) : (
                    <>
                      <div className="bg-gradient-to-br from-base-200 to-base-300 rounded-xl p-4 h-80 overflow-y-auto mb-4 shadow-inner">
                        {messages.length === 0 ? (
                          <div className="flex items-center justify-center h-full">
                            <p className="text-sm opacity-50">No messages yet. Start the conversation!</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {messages.map((message) => {
                              const sender = allProfiles.find(p => p.id === message.sender_profile_id);
                              return (
                                <div key={message.id} className="chat chat-start">
                                  <div className="chat-image avatar">
                                    <div className="w-8 rounded-full">
                                      <img 
                                        src={sender?.photo || `https://ui-avatars.com/api/?name=${sender?.name}`} 
                                        alt={sender?.name}
                                      />
                                    </div>
                                  </div>
                                  <div className="chat-header text-xs opacity-70 mb-1">
                                    {sender?.name || 'Unknown'}
                                    <time className="ml-2">{new Date(message.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</time>
                                  </div>
                                  <div className="chat-bubble chat-bubble-primary">{message.content}</div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {challenge.status === 'ongoing' ? (
                        <div className="space-y-3">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-semibold">Send as:</span>
                            </label>
                            <select
                              className="select select-bordered select-lg w-full"
                              value={selectedSender}
                              onChange={(e) => setSelectedSender(e.target.value)}
                            >
                              <option value="">Select your profile...</option>
                              {participants.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Type your message..."
                              className="input input-bordered input-lg flex-1"
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            />
                            <button 
                              onClick={sendMessage} 
                              className="btn btn-primary btn-lg gap-2"
                              disabled={!selectedSender || !newMessage.trim()}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                              Send
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="alert alert-success">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span>Challenge completed - Messages are read-only</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Suggested Profiles - Only show when challenge is ongoing */}
              {challenge.status === 'ongoing' && suggestedProfiles.length > 0 ? (
                <div className="card bg-base-100 shadow-2xl">
                  <div className="card-body">
                    <h2 className="card-title text-lg flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Suggested Profiles ({suggestedProfiles.length})
                    </h2>
                    <p className="text-xs opacity-70 mb-3">Ordered by matching skill rating</p>
                <div className="space-y-2">
                  {suggestedProfiles.map((profile, idx) => (
                    <div key={profile.id} className="flex items-center gap-2 p-2 bg-base-200 rounded">
                      <div className="avatar">
                        <div className="w-10 rounded-full">
                          <img src={profile.photo || `https://ui-avatars.com/api/?name=${profile.name}`} alt={profile.name} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="badge badge-xs badge-primary">#{idx + 1}</span>
                          <p className="font-semibold text-sm truncate">{profile.name}</p>
                        </div>
                        <p className="text-xs opacity-70 truncate">{profile.role}</p>
                        {profile.skills.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {profile.skills.slice(0, 2).map(s => (
                              <span key={s.name} className="badge badge-xs gap-0.5">
                                {s.name}
                                <span className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map(star => (
                                    star <= s.rating ? (
                                      <StarIcon key={star} className="w-2 h-2 text-warning" />
                                    ) : (
                                      <StarIconOutline key={star} className="w-2 h-2 text-warning" />
                                    )
                                  ))}
                                </span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {!challenge.participants.includes(profile.id) && (
                        <button
                          onClick={() => addParticipant(profile.id)}
                          className="btn btn-xs btn-primary"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {/* Participants */}
          <div className="card bg-base-100 shadow-2xl">
            <div className="card-body">
              <h2 className="card-title text-lg flex items-center gap-2">
                <UserGroupIcon className="w-5 h-5" />
                Participants ({participants.length})
              </h2>
              <div className="divider my-1"></div>
              {participants.length === 0 ? (
                <div className="alert alert-warning">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-sm">No participants yet</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {participants.map((profile) => {
                    const isCreator = profile.id === challenge.created_by;
                    return (
                      <div 
                        key={profile.id} 
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                          isCreator ? 'bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary shadow-md' : 'bg-base-200 hover:bg-base-300'
                        }`}
                      >
                        <div className="avatar">
                          <div className={`w-12 rounded-full ${isCreator ? 'ring ring-primary ring-offset-base-100 ring-offset-2' : ''}`}>
                            <img src={profile.photo || `https://ui-avatars.com/api/?name=${profile.name}`} alt={profile.name} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link href={`/profiles/${profile.id}`} className="font-semibold text-sm hover:underline truncate">
                              {profile.name}
                            </Link>
                            {isCreator && (
                              <span className="badge badge-primary badge-sm gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                                Creator
                              </span>
                            )}
                          </div>
                          <p className="text-xs opacity-70 truncate">{profile.role}</p>
                          {challenge.status === 'completed' && ratings[profile.id] && (
                            <div className="flex items-center gap-1 mt-2">
                              <span className="text-xs font-medium">Rating:</span>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  star <= ratings[profile.id] ? (
                                    <StarIcon key={star} className="w-3 h-3 text-warning" />
                                  ) : (
                                    <StarIconOutline key={star} className="w-3 h-3 text-warning opacity-30" />
                                  )
                                ))}
                              </div>
                              <span className="text-xs font-semibold badge badge-sm badge-warning">{ratings[profile.id]}/5</span>
                            </div>
                          )}
                        </div>
                        {challenge.status === 'ongoing' && !isCreator && (
                          <button
                            onClick={() => removeParticipant(profile.id)}
                            className="btn btn-sm btn-error btn-circle"
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
            </div>
          </div>

          {/* Add Participant - Only show when challenge is ongoing */}
          {challenge.status === 'ongoing' && availableProfiles.length > 0 && (
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
                  className="select select-bordered select-lg w-full"
                  onChange={(e) => e.target.value && addParticipant(e.target.value)}
                  value=""
                >
                  <option value="">Select a profile to add...</option>
                  {availableProfiles.map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.name} - {profile.role}
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
      {showRatingModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Rate Participants</h3>
            <p className="text-sm opacity-70 mb-4">
              Rate each participant's contribution to this challenge (1-5 stars)
            </p>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {participants.filter(p => p.id !== challenge.created_by).map((profile) => (
                <div key={profile.id} className="card bg-base-200">
                  <div className="card-body p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="avatar">
                        <div className="w-12 rounded-full">
                          <img 
                            src={profile.photo || `https://ui-avatars.com/api/?name=${profile.name}`} 
                            alt={profile.name} 
                          />
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold">{profile.name}</p>
                        <p className="text-xs opacity-70">{profile.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Rating:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingChange(profile.id, star)}
                            className="focus:outline-none"
                          >
                            {ratings[profile.id] >= star ? (
                              <StarIcon className="w-6 h-6 text-warning cursor-pointer hover:scale-110 transition-transform" />
                            ) : (
                              <StarIconOutline className="w-6 h-6 text-warning cursor-pointer hover:scale-110 transition-transform" />
                            )}
                          </button>
                        ))}
                      </div>
                      {ratings[profile.id] && (
                        <span className="text-sm font-semibold ml-2">
                          {ratings[profile.id]} / 5
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="modal-action">
              <button 
                className="btn btn-ghost" 
                onClick={() => setShowRatingModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-success" 
                onClick={finalizeCompletion}
                disabled={participants.filter(p => p.id !== challenge.created_by).some(p => !ratings[p.id])}
              >
                {participants.filter(p => p.id !== challenge.created_by).every(p => ratings[p.id]) 
                  ? '✓ Complete Challenge' 
                  : `Rate ${participants.filter(p => p.id !== challenge.created_by && !ratings[p.id]).length} more participant${participants.filter(p => p.id !== challenge.created_by && !ratings[p.id]).length !== 1 ? 's' : ''}`
                }
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
