'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Challenge } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/LoadingSpinner';
import { ChallengeCard } from '@/components/ChallengeCard';
import Link from 'next/link';

export default function ChallengesPage() {
  const { currentUser } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
  }, []);

  async function fetchChallenges() {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false});

      if (error) throw error;
      
      // Filter out private challenges unless user is creator or participant
      const filteredChallenges = (data || []).filter(challenge => {
        if (challenge.type === 'public') return true;
        if (!currentUser) return false;
        return challenge.created_by === currentUser.id || challenge.participants?.includes(currentUser.id);
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
    return <PageLoader />;
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
            <ChallengeCard 
              key={challenge.id} 
              challenge={challenge}
              onDelete={deleteChallenge}
              showDeleteButton
            />
          ))}
        </div>
      )}
    </div>
  );
}
