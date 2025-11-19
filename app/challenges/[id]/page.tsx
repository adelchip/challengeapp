'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Challenge, Profile, Message, ChallengeRating } from '@/types';
import Link from 'next/link';
import { UserGroupIcon, StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';

export default function ChallengeDetailPage() {
  const router = useRouter();
  const params = useParams();
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
  
  const currentUserId = localStorage.getItem('currentUserId');
  const isCreator = currentUserId === challenge.created_by;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{challenge.title}</h1>
        <div className="flex gap-2">
          {challenge.status === 'ongoing' && isCreator && (
            <button 
              onClick={completeChallenge} 
              className="btn btn-success btn-sm"
            >
              ✓ Complete Challenge
            </button>
          )}
          <button onClick={() => router.back()} className="btn btn-ghost btn-sm">
            ← Back
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <h2 className="card-title">Challenge Information</h2>
                <div className="flex gap-2">
                  <span className={`badge ${challenge.type === 'public' ? 'badge-success' : 'badge-warning'}`}>
                    {challenge.type === 'public' ? 'Public' : 'Private'}
                  </span>
                  <span className={`badge ${challenge.status === 'completed' ? 'badge-success' : 'badge-info'}`}>
                    {challenge.status === 'completed' ? 'Completed' : 'Ongoing'}
                  </span>
                </div>
              </div>
              <p className="mt-4">{challenge.description}</p>
            </div>
          </div>

          {/* Collaboration Room */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">💬 Collaboration Room</h2>
              
              {participants.length === 0 ? (
                <p className="text-sm opacity-70">Add participants to start collaboration</p>
              ) : (
                <>
                  <div className="bg-base-200 rounded-lg p-4 h-64 overflow-y-auto mb-4">
                    {messages.length === 0 ? (
                      <p className="text-sm opacity-70 text-center">No messages yet</p>
                    ) : (
                      <div className="space-y-3">
                        {messages.map((message) => {
                          const sender = allProfiles.find(p => p.id === message.sender_profile_id);
                          return (
                            <div key={message.id} className="chat chat-start">
                              <div className="chat-header text-xs opacity-70">
                                {sender?.name || 'Unknown'}
                                <time className="ml-2">{new Date(message.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</time>
                              </div>
                              <div className="chat-bubble">{message.content}</div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {challenge.status === 'ongoing' && (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-xs">Send as:</span>
                      </label>
                      <select
                        className="select select-bordered select-sm mb-2"
                        value={selectedSender}
                        onChange={(e) => setSelectedSender(e.target.value)}
                      >
                        <option value="">Select profile...</option>
                        {participants.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Write a message..."
                          className="input input-bordered flex-1"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <button 
                          onClick={sendMessage} 
                          className="btn btn-primary"
                          disabled={!selectedSender || !newMessage.trim()}
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {challenge.status === 'completed' && (
                    <div className="alert alert-info">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <span className="text-sm">Challenge completed - Messages are read-only</span>
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
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-sm">Suggested Profiles ({suggestedProfiles.length})</h2>
                <p className="text-xs opacity-70 mb-2">Ordered by matching skill rating</p>
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
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-sm flex items-center gap-2">
                <UserGroupIcon className="w-5 h-5" />
                Participants ({participants.length})
              </h2>
              {participants.length === 0 ? (
                <p className="text-xs opacity-70">No participants yet</p>
              ) : (
                <div className="space-y-2">
                  {participants.map((profile) => {
                    const isCreator = profile.id === challenge.created_by;
                    return (
                      <div 
                        key={profile.id} 
                        className={`flex items-center gap-2 p-2 rounded ${
                          isCreator ? 'bg-primary/10 border-2 border-primary' : 'bg-base-200'
                        }`}
                      >
                        <div className="avatar">
                          <div className="w-10 rounded-full">
                            <img src={profile.photo || `https://ui-avatars.com/api/?name=${profile.name}`} alt={profile.name} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <Link href={`/profiles/${profile.id}`} className="font-semibold text-sm hover:underline truncate">
                              {profile.name}
                            </Link>
                            {isCreator && (
                              <span className="badge badge-primary badge-xs">Creator</span>
                            )}
                          </div>
                          <p className="text-xs opacity-70 truncate">{profile.role}</p>
                          {challenge.status === 'completed' && ratings[profile.id] && (
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-xs">Rating:</span>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  star <= ratings[profile.id] ? (
                                    <StarIcon key={star} className="w-3 h-3 text-warning" />
                                  ) : (
                                    <StarIconOutline key={star} className="w-3 h-3 text-warning" />
                                  )
                                ))}
                              </div>
                              <span className="text-xs font-semibold">{ratings[profile.id]}/5</span>
                            </div>
                          )}
                        </div>
                        {challenge.status === 'ongoing' && !isCreator && (
                          <button
                            onClick={() => removeParticipant(profile.id)}
                            className="btn btn-xs btn-error"
                          >
                            Remove
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
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-sm">➕ Add Participant</h2>
                <select
                  className="select select-bordered select-sm"
                  onChange={(e) => e.target.value && addParticipant(e.target.value)}
                  value=""
                >
                  <option value="">Select profile...</option>
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
  );
}
