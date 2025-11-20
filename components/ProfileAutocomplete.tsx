/**
 * Profile Autocomplete Component
 * Search and select profiles with autocomplete functionality
 */

import { useState, useRef, useEffect } from 'react';
import { Profile } from '@/types';

interface ProfileAutocompleteProps {
  /** Available profiles to select from */
  profiles: Profile[];
  /** Callback when a profile is selected */
  onSelect: (profileId: string) => void;
  /** Placeholder text */
  placeholder?: string;
}

/**
 * Autocomplete input for selecting profiles
 * Provides search functionality with dropdown suggestions
 */
export function ProfileAutocomplete({
  profiles,
  onSelect,
  placeholder = 'Search profiles...'
}: ProfileAutocompleteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter profiles based on search query
  const filteredProfiles = profiles.filter(profile => {
    const query = searchQuery.toLowerCase();
    return (
      profile.name.toLowerCase().includes(query) ||
      profile.role.toLowerCase().includes(query) ||
      profile.business_unit.toLowerCase().includes(query)
    );
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && e.key !== 'Escape') {
      setIsOpen(true);
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredProfiles.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredProfiles[highlightedIndex]) {
          handleSelect(filteredProfiles[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchQuery('');
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelect = (profile: Profile) => {
    onSelect(profile.id);
    setSearchQuery('');
    setIsOpen(false);
    setHighlightedIndex(0);
    inputRef.current?.blur();
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    setIsOpen(true);
    setHighlightedIndex(0);
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className="input input-bordered w-full"
          value={searchQuery}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {searchQuery && (
          <button
            className="btn btn-ghost btn-sm btn-circle absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => {
              setSearchQuery('');
              inputRef.current?.focus();
            }}
            tabIndex={-1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && filteredProfiles.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-base-100 border border-base-300 rounded-lg shadow-xl max-h-60 overflow-y-auto"
        >
          {filteredProfiles.map((profile, index) => (
            <button
              key={profile.id}
              className={`w-full text-left px-4 py-3 hover:bg-base-200 transition-colors ${
                index === highlightedIndex ? 'bg-base-200' : ''
              }`}
              onClick={() => handleSelect(profile)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    <img 
                      src={profile.photo || `https://ui-avatars.com/api/?name=${profile.name}`} 
                      alt={profile.name}
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{profile.name}</div>
                  <div className="text-xs opacity-70 truncate">{profile.role}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && searchQuery && filteredProfiles.length === 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-base-100 border border-base-300 rounded-lg shadow-xl p-4 text-center text-sm opacity-70"
        >
          No profiles found
        </div>
      )}
    </div>
  );
}
