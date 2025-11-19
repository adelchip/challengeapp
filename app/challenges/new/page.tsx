'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types';

export default function NewChallengePage() {
  const router = useRouter();
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
      const currentUserId = localStorage.getItem('currentUserId');
      if (!currentUserId) {
        alert('Please login to create a challenge');
        setLoading(false);
        return;
      }

      console.log('🤖 Calling AI agent with Groq + Llama...');
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

      const responseTime = Date.now() - startTime;
      console.log(`⚡ AI response time: ${responseTime}ms`);

      if (!response.ok) {
        throw new Error('AI suggestion failed');
      }

      const { suggestedProfiles } = await response.json();
      console.log('✅ AI suggested profiles:', suggestedProfiles);
      
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
          participants: [],
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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">New Challenge</h1>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Develop new React feature"
                className="input input-bordered"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                placeholder="Describe the challenge in detail..."
                className="textarea textarea-bordered h-32"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              <label className="label">
                <span className="label-text-alt">AI will automatically suggest the most suitable profiles based on keywords</span>
              </label>
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Type</span>
              </label>
              <select
                className="select select-bordered"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'public' | 'private' })}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

              <div className="alert alert-info mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <div>
                  <div className="font-bold">🤖 AI-Powered Matching</div>
                  <span className="text-sm">Groq + Llama 3.3 70B will analyze skills and suggest only profiles that actually match the requirements (may find 0-10 profiles)</span>
                </div>
              </div>            {aiStatus === 'analyzing' && (
              <div className="alert alert-warning mt-4">
                <span className="loading loading-spinner"></span>
                <span>AI is analyzing challenge requirements...</span>
              </div>
            )}

            <div className="form-control mt-6 flex flex-row gap-4">
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={loading}
              >
                {loading ? <span className="loading loading-spinner"></span> : 'Create Challenge'}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => router.back()}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
