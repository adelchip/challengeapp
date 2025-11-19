'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Challenge } from '@/types';
import Link from 'next/link';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
  }, []);

  async function fetchChallenges() {
    try {
      const currentUserId = localStorage.getItem('currentUserId');
      
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false});

      if (error) throw error;
      
      // Filter out private challenges unless user is creator or participant
      const filteredChallenges = (data || []).filter(challenge => {
        if (challenge.type === 'public') return true;
        if (!currentUserId) return false;
        return challenge.created_by === currentUserId || challenge.participants?.includes(currentUserId);
      });
      
      setChallenges(filteredChallenges);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteChallenge(id: string) {
    if (!confirm('Are you sure you want to delete this challenge?')) return;

    try {
      const { error } = await supabase
        .from('challenges')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setChallenges(challenges.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting challenge:', error);
      alert('Error deleting challenge');
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Challenges</h1>
        <Link href="/challenges/new" className="btn btn-primary">
          + New Challenge
        </Link>
      </div>

      {challenges.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No challenges found</p>
          <Link href="/challenges/new" className="btn btn-primary mt-4">
            Create first challenge
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-start gap-2">
                  <h2 className="card-title flex-1">{challenge.title}</h2>
                  <span className={`badge ${challenge.status === 'completed' ? 'badge-success' : 'badge-info'}`}>
                    {challenge.status === 'completed' ? 'Completed' : 'Ongoing'}
                  </span>
                </div>
                <p className="text-sm opacity-70 line-clamp-2">{challenge.description}</p>
                
                <div className="mt-2">
                  <p className="text-xs opacity-60">
                    Participants: {challenge.participants.length}
                  </p>
                  {challenge.suggested_profiles.length > 0 && (
                    <p className="text-xs opacity-60">
                      Suggested profiles: {challenge.suggested_profiles.length}
                    </p>
                  )}
                </div>

                <div className="card-actions justify-end mt-4">
                  <Link href={`/challenges/${challenge.id}`} className="btn btn-sm btn-primary">
                    View
                  </Link>
                  <button 
                    onClick={() => deleteChallenge(challenge.id)} 
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
