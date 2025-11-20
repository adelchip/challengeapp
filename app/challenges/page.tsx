'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Challenge } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/LoadingSpinner';
import { ChallengeCard } from '@/components/ChallengeCard';
import Link from 'next/link';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

type StatusFilter = 'all' | 'ongoing' | 'completed';
type TypeFilter = 'all' | 'public' | 'private';

export default function ChallengesPage() {
  const { currentUser } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

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

  // Filtered challenges using useMemo for performance
  const filteredChallenges = useMemo(() => {
    return challenges.filter(challenge => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        challenge.title.toLowerCase().includes(searchLower) ||
        challenge.description.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus = statusFilter === 'all' || challenge.status === statusFilter;

      // Type filter
      const matchesType = typeFilter === 'all' || challenge.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [challenges, searchQuery, statusFilter, typeFilter]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Challenges
        </h1>
        <Link href="/challenges/new" className="btn btn-primary btn-lg gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Challenge
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="form-control">
                <div className="input-group">
                  <span className="bg-base-200">
                    <MagnifyingGlassIcon className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search challenges by title or description..."
                    className="input input-bordered w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      className="btn btn-ghost btn-square"
                      onClick={() => setSearchQuery('')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3 items-center">
              <FunnelIcon className="w-5 h-5 text-base-content/50" />
              
              {/* Status Filter */}
              <select
                className="select select-bordered"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              >
                <option value="all">All Status</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>

              {/* Type Filter */}
              <select
                className="select select-bordered"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
              >
                <option value="all">All Types</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          {/* Active Filters Summary */}
          {(searchQuery || statusFilter !== 'all' || typeFilter !== 'all') && (
            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="text-sm opacity-70">Active filters:</span>
              {searchQuery && (
                <div className="badge badge-primary gap-2">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-error">×</button>
                </div>
              )}
              {statusFilter !== 'all' && (
                <div className="badge badge-secondary gap-2">
                  Status: {statusFilter}
                  <button onClick={() => setStatusFilter('all')} className="hover:text-error">×</button>
                </div>
              )}
              {typeFilter !== 'all' && (
                <div className="badge badge-accent gap-2">
                  Type: {typeFilter}
                  <button onClick={() => setTypeFilter('all')} className="hover:text-error">×</button>
                </div>
              )}
              <button 
                className="badge badge-ghost gap-2 hover:badge-error"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setTypeFilter('all');
                }}
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-4 text-sm opacity-70">
        Showing {filteredChallenges.length} of {challenges.length} challenges
      </div>

      {filteredChallenges.length === 0 ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-base-content/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-semibold mb-2">No challenges found</p>
            <p className="text-sm opacity-70 mb-4">
              {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Be the first to create a challenge!'}
            </p>
            {challenges.length === 0 ? (
              <Link href="/challenges/new" className="btn btn-primary">
                Create first challenge
              </Link>
            ) : (
              <button 
                className="btn btn-ghost"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setTypeFilter('all');
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredChallenges.map((challenge) => (
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
