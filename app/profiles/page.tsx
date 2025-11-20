'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types';
import { PageLoader } from '@/components/LoadingSpinner';
import { ProfileCard } from '@/components/ProfileCard';

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState<'created_at' | 'name' | 'skill_rating'>('created_at');
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce search input
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page when search changes
    }, 500); // 500ms delay

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  useEffect(() => {
    fetchProfiles();
  }, [currentPage, pageSize, debouncedSearch, sortBy]);

  async function fetchProfiles() {
    try {
      setLoading(true);
      
      // Get ALL profiles when searching (to check skills), otherwise paginate
      let query = supabase.from('profiles').select('*');
      
      // Apply sorting
      if (sortBy === 'name') {
        query = query.order('name', { ascending: true });
      } else {
        query = query.order('created_at', { ascending: false });
      }
      
      const { data, error } = await query;

      if (error) throw error;
      
      let processedData = data || [];
      
      // Client-side filtering for skills, role, business_unit, name
      if (debouncedSearch.trim()) {
        const search = debouncedSearch.trim().toLowerCase();
        processedData = processedData.filter(profile => {
          // Check if any skill matches
          const skillMatch = profile.skills.some((skill: any) => {
            const skillName = skill.name.toLowerCase();
            // Simple contains check - "java" matches "Java", "Java EE", etc.
            // But won't match "JavaScript" because we check word boundaries
            const words = skillName.split(/[\s,/\-\.]+/);
            return words.some((word: string) => word.startsWith(search) || word === search);
          });
          
          // Check role, business_unit, name
          const roleMatch = profile.role.toLowerCase().includes(search);
          const buMatch = profile.business_unit.toLowerCase().includes(search);
          const nameMatch = profile.name.toLowerCase().includes(search);
          
          return skillMatch || roleMatch || buMatch || nameMatch;
        });
      }
      
      // Update count after client-side filtering
      setTotalCount(processedData.length);
      
      // Sort by highest skill rating if selected
      if (sortBy === 'skill_rating') {
        const search = debouncedSearch.trim().toLowerCase();
        
        processedData = processedData.sort((a, b) => {
          // If searching, prioritize the rating of the searched skill
          if (search) {
            // Find the highest rating for matching skills
            const getMatchingSkillRating = (profile: Profile) => {
              const matchingSkills = profile.skills.filter((skill: any) => {
                const skillName = skill.name.toLowerCase();
                const words = skillName.split(/[\s,/\-\.]+/);
                return words.some((word: string) => word.startsWith(search) || word === search);
              });
              return matchingSkills.length > 0 
                ? Math.max(...matchingSkills.map((s: any) => s.rating))
                : 0;
            };
            
            const matchRatingA = getMatchingSkillRating(a);
            const matchRatingB = getMatchingSkillRating(b);
            
            // If both have matching skills, sort by matching skill rating
            if (matchRatingA > 0 || matchRatingB > 0) {
              return matchRatingB - matchRatingA;
            }
          }
          
          // Otherwise, sort by highest overall skill rating
          const maxRatingA = Math.max(...a.skills.map((s: any) => s.rating), 0);
          const maxRatingB = Math.max(...b.skills.map((s: any) => s.rating), 0);
          return maxRatingB - maxRatingA;
        });
      }
      
      // Apply pagination after filtering
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize;
      const paginatedData = processedData.slice(from, to);
      
      setProfiles(paginatedData);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <PageLoader />;
  }

  const totalPages = Math.ceil(totalCount / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Profiles</h1>
        <p className="text-sm opacity-70 mt-1">
          Showing {startItem}-{endItem} of {totalCount} profiles
        </p>
      </div>

      {/* Search and filters */}
      <div className="card bg-base-100 shadow-lg mb-6">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search input */}
            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text font-medium">🔍 Search profiles</span>
              </label>
              <input
                type="text"
                placeholder="Search by name, role, business unit, or skills (e.g., React, Java, Product Manager)..."
                className="input input-bordered w-full"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
              />
              {searchQuery && (
                <div className="label">
                  <span className="label-text-alt text-info">
                    {debouncedSearch === searchQuery ? (
                      <>Filtering by: "{searchQuery}"</>
                    ) : (
                      <>Typing...</>
                    )}
                  </span>
                  <button 
                    className="label-text-alt link link-error"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>

            {/* Sort selector */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Sort by</span>
              </label>
              <select 
                className="select select-bordered w-full"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as any);
                  setCurrentPage(1);
                }}
              >
                <option value="created_at">Newest first</option>
                <option value="name">Name (A-Z)</option>
                <option value="skill_rating">Highest skill rating</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Page size selector */}
      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm font-medium">Items per page:</label>
        <select 
          className="select select-bordered select-sm"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1); // Reset to first page
          }}
        >
          <option value={12}>12</option>
          <option value={24}>24</option>
          <option value={48}>48</option>
          <option value={100}>100</option>
        </select>
      </div>

      {profiles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No profiles found</p>
          {searchQuery && (
            <p className="text-sm opacity-70 mt-2">Try adjusting your search criteria</p>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {profiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                className="btn btn-sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                «
              </button>
              <button
                className="btn btn-sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ‹
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNumber}
                      className={`btn btn-sm ${currentPage === pageNumber ? 'btn-primary' : ''}`}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                className="btn btn-sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                ›
              </button>
              <button
                className="btn btn-sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                »
              </button>
              
              <span className="text-sm ml-2">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
