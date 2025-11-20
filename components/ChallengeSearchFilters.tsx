/**
 * Challenge Search and Filters Component
 * Provides search and filtering controls for challenge list
 */

export type StatusFilter = 'all' | 'ongoing' | 'completed';
export type TypeFilter = 'all' | 'public' | 'private';

interface ChallengeSearchFiltersProps {
  /** Current search query */
  searchQuery: string;
  /** Current status filter */
  statusFilter: StatusFilter;
  /** Current type filter */
  typeFilter: TypeFilter;
  /** Callback when search query changes */
  onSearchChange: (query: string) => void;
  /** Callback when status filter changes */
  onStatusChange: (status: StatusFilter) => void;
  /** Callback when type filter changes */
  onTypeChange: (type: TypeFilter) => void;
  /** Number of results after filtering */
  resultsCount: number;
  /** Total number of challenges */
  totalCount: number;
}

/**
 * Search and filter controls for challenges
 * Allows filtering by search text, status, and type
 */
export function ChallengeSearchFilters({
  searchQuery,
  statusFilter,
  typeFilter,
  onSearchChange,
  onStatusChange,
  onTypeChange,
  resultsCount,
  totalCount
}: ChallengeSearchFiltersProps) {
  const hasActiveFilters = searchQuery || statusFilter !== 'all' || typeFilter !== 'all';

  const clearAllFilters = () => {
    onSearchChange('');
    onStatusChange('all');
    onTypeChange('all');
  };

  return (
    <>
      {/* Search and Filters Card */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search challenges by title or description..."
                  className="input input-bordered w-full"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    className="btn btn-ghost btn-square"
                    onClick={() => onSearchChange('')}
                    aria-label="Clear search"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3 items-center">
              
              {/* Status Filter */}
              <select
                className="select select-bordered"
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
                aria-label="Filter by status"
              >
                <option value="all">All Status</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>

              {/* Type Filter */}
              <select
                className="select select-bordered"
                value={typeFilter}
                onChange={(e) => onTypeChange(e.target.value as TypeFilter)}
                aria-label="Filter by type"
              >
                <option value="all">All Types</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {searchQuery && (
                <div className="badge badge-primary gap-2">
                  Search: "{searchQuery}"
                  <button onClick={() => onSearchChange('')} className="hover:text-error">×</button>
                </div>
              )}
              {statusFilter !== 'all' && (
                <div className="badge badge-secondary gap-2">
                  Status: {statusFilter}
                  <button onClick={() => onStatusChange('all')} className="hover:text-error">×</button>
                </div>
              )}
              {typeFilter !== 'all' && (
                <div className="badge badge-accent gap-2">
                  Type: {typeFilter}
                  <button onClick={() => onTypeChange('all')} className="hover:text-error">×</button>
                </div>
              )}
              <button 
                className="badge badge-ghost gap-2 hover:badge-error"
                onClick={clearAllFilters}
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-4 text-sm opacity-70">
        Showing {resultsCount} of {totalCount} challenges
      </div>
    </>
  );
}
