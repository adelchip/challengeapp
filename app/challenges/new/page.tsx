'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export default function NewChallengePage() {
  const router = useRouter();
  const { currentUser, checkAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState<'idle' | 'analyzing' | 'success' | 'error'>('idle');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [suggestedProfiles, setSuggestedProfiles] = useState<Profile[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'public' as 'public' | 'private',
  });

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setAiStatus('analyzing');

    try {
      // Get current user
      const currentUserId = checkAuth();
      if (!currentUserId) {
        alert('Please login to create a challenge');
        setLoading(false);
        return;
      }

      const startTime = Date.now();
      
      // Call AI API to get profile suggestions
      const response = await fetch('/api/ai-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challenge: formData,
          profiles: profiles,
        }),
      });

      if (!response.ok) {
        throw new Error('AI suggestion failed');
      }

      const { suggestedProfiles } = await response.json();
      
      setAiStatus('success');
      setSuggestedProfiles(suggestedProfiles);
      
      const suggestedProfileIds = suggestedProfiles.map((p: Profile) => p.id);

      const { data, error } = await supabase
        .from('challenges')
        .insert([{
          title: formData.title,
          description: formData.description,
          type: formData.type,
          status: 'ongoing',
          created_by: currentUserId,
          suggested_profiles: suggestedProfileIds,
          participants: [currentUserId], // Automatically add creator as participant
        }])
        .select()
        .single();

      if (error) throw error;
      
      router.push(`/challenges/${data.id}`);
    } catch (error) {
      console.error('❌ Error creating challenge:', error);
      setAiStatus('error');
      alert('Error creating challenge');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
              Create a New Challenge
            </h1>
            <p className="text-lg opacity-70">
              Describe your project and let AI find the perfect team members
            </p>
          </div>

          {/* Main Form Card */}
          <div className="card bg-base-100 shadow-2xl">
            <div className="card-body p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Input */}
                <div className="form-control">
                  <div className="mb-2">
                    <span className="font-semibold text-lg">Challenge Title</span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., Build a Real-Time Chat Feature with React & WebSocket"
                    className="input input-bordered input-lg focus:input-primary w-full"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                {/* Description Textarea */}
                <div className="form-control">
                  <div className="mb-2">
                    <span className="font-semibold text-lg">Description</span>
                  </div>
                  <textarea
                    placeholder="Describe your challenge in detail. Include technologies, skills needed, goals, and any specific requirements..."
                    className="textarea textarea-bordered textarea-lg h-40 focus:textarea-primary w-full"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                  <div className="mt-2 text-sm opacity-70 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Include keywords like React, Python, Design, etc. for better AI matching
                  </div>
                </div>

                {/* Type Selection */}
                <div className="form-control">
                  <div className="mb-2">
                    <span className="font-semibold text-lg">Visibility</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`label cursor-pointer border-2 rounded-lg p-4 transition-all ${
                      formData.type === 'public' ? 'border-primary bg-primary/10' : 'border-base-300 hover:border-primary/50'
                    }`}>
                      <div className="flex flex-col items-start gap-2 flex-1">
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="label-text font-bold">Public</span>
                        </div>
                        <span className="text-xs opacity-70">Everyone can see and join</span>
                      </div>
                      <input
                        type="radio"
                        name="type"
                        className="radio radio-primary"
                        value="public"
                        checked={formData.type === 'public'}
                        onChange={(e) => setFormData({ ...formData, type: 'public' })}
                      />
                    </label>

                    <label className={`label cursor-pointer border-2 rounded-lg p-4 transition-all ${
                      formData.type === 'private' ? 'border-primary bg-primary/10' : 'border-base-300 hover:border-primary/50'
                    }`}>
                      <div className="flex flex-col items-start gap-2 flex-1">
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <span className="label-text font-bold">Private</span>
                        </div>
                        <span className="text-xs opacity-70">Only invited members</span>
                      </div>
                      <input
                        type="radio"
                        name="type"
                        className="radio radio-primary"
                        value="private"
                        checked={formData.type === 'private'}
                        onChange={(e) => setFormData({ ...formData, type: 'private' })}
                      />
                    </label>
                  </div>
                </div>

                {/* AI Info Alert */}
                <div className="alert bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-primary" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="font-bold">AI-Powered Team Matching</h3>
                    <div className="text-sm opacity-80">
                      Our AI (Groq + Llama 3.3 70B) will analyze your challenge and suggest 0-10 profiles with matching skills
                    </div>
                  </div>
                </div>

                {/* AI Status */}
                {aiStatus === 'analyzing' && (
                  <div className="alert alert-warning shadow-lg">
                    <span className="loading loading-spinner loading-md"></span>
                    <div>
                      <h3 className="font-bold">Analyzing Requirements</h3>
                      <div className="text-sm">AI is finding the best matches for your challenge...</div>
                    </div>
                  </div>
                )}

                {aiStatus === 'success' && (
                  <div className="alert alert-success shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-bold">Success!</h3>
                      <div className="text-sm">Found {suggestedProfiles.length} matching profile{suggestedProfiles.length !== 1 ? 's' : ''}</div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="divider"></div>
                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    className="btn btn-ghost btn-lg"
                    onClick={() => router.back()}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Challenge
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Help Tips */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body items-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <h3 className="font-bold">Be Specific</h3>
                <p className="text-sm opacity-70">Include tech stack and required skills</p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body items-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="font-bold">AI Matching</h3>
                <p className="text-sm opacity-70">Let AI find the perfect team</p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body items-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h3 className="font-bold">Privacy Control</h3>
                <p className="text-sm opacity-70">Choose public or private visibility</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
