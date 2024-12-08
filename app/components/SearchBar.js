'use client';
import { useState, useEffect, useRef } from 'react';
import { searchGames } from '../utils/api';
import { debounce } from 'lodash';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Debounced search function
  const debouncedSearch = useRef(
    debounce(async (term) => {
      if (term.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchGames(term);
        setSuggestions(results.slice(0, 5)); // Limit to 5 suggestions
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
      setIsLoading(false);
    }, 300)
  ).current;

  useEffect(() => {
    // Cleanup debounce on unmount
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    // Handle clicks outside of search component
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(true);
    debouncedSearch(value);
  };

  const handleSuggestionClick = (game) => {
    setSearchTerm(game.name);
    setShowSuggestions(false);
    onSearch([game]); // Pass the selected game to parent
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const results = await searchGames(searchTerm);
      onSearch(results);
      setShowSuggestions(false);
    } catch (error) {
      console.error('Error searching games:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="relative mb-8" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search games..."
          className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onFocus={() => setShowSuggestions(true)}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
        >
          {isLoading ? (
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </button>
      </form>

      {/* Search Suggestions */}
      {showSuggestions && (searchTerm.length >= 2) && (
        <div className="absolute z-50 w-full mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-gray-400 text-center">
              Loading suggestions...
            </div>
          ) : suggestions.length > 0 ? (
            <ul>
              {suggestions.map((game) => (
                <li
                  key={game.id}
                  className="hover:bg-gray-700 cursor-pointer transition-colors duration-150"
                  onClick={() => handleSuggestionClick(game)}
                >
                  <div className="flex items-center p-3 space-x-3">
                    {game.background_image ? (
                      <img
                        src={game.background_image}
                        alt={game.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center">
                        <span className="text-gray-400">No img</span>
                      </div>
                    )}
                    <div>
                      <div className="text-white font-medium">{game.name}</div>
                      <div className="text-sm text-gray-400">
                        {game.released ? new Date(game.released).getFullYear() : 'Release date TBA'}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : searchTerm.length >= 2 ? (
            <div className="p-4 text-gray-400 text-center">
              No games found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
