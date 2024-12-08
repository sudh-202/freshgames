'use client';
import { useState } from 'react';

const genres = [
  { id: 'action', name: 'Action Games', icon: '🎯' },
  { id: 'adventure', name: 'Adventure Games', icon: '🗺️' },
  { id: 'rpg', name: 'Role-Playing Games (RPG)', icon: '⚔️' },
  { id: 'simulation', name: 'Simulation Games', icon: '🎮' },
  { id: 'strategy', name: 'Strategy Games', icon: '🧠' },
  { id: 'sports', name: 'Sports Games', icon: '⚽' },
  { id: 'racing', name: 'Racing Games', icon: '🏎️' },
  { id: 'puzzle', name: 'Puzzle Games', icon: '🧩' },
  { id: 'party', name: 'Party Games', icon: '🎉' },
  { id: 'fighting', name: 'Fighting Games', icon: '🥊' },
  { id: 'horror', name: 'Horror Games', icon: '👻' },
  { id: 'sandbox', name: 'Sandbox Games', icon: '🏗️' },
  { id: 'survival', name: 'Survival Games', icon: '🏕️' },
  { id: 'idle', name: 'Idle Games', icon: '⏳' },
  { id: 'educational', name: 'Educational Games', icon: '📚' },
  { id: 'rhythm', name: 'Rhythm Games', icon: '🎵' },
  { id: 'board', name: 'Board/Card Games', icon: '🎲' },
  { id: 'trivia', name: 'Trivia Games', icon: '❓' },
  { id: 'vr', name: 'Virtual Reality (VR) Games', icon: '🥽' },
  { id: 'mmo', name: 'Massive Multiplayer Online (MMO)', icon: '🌐' },
];

const Sidebar = ({ selectedGenres, onGenreChange, onSidebarToggle }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGenres = genres.filter(genre => 
    genre.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    onSidebarToggle(!isOpen);
  };

  return (
    <div className={`fixed top-0 left-0 h-full bg-gray-800 transition-all duration-300 z-50 
      ${isOpen ? 'w-80' : 'w-16'}`}>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-4 top-8 bg-blue-600 text-white p-2 rounded-full transform hover:scale-110 transition-transform"
      >
        {isOpen ? '◀' : '▶'}
      </button>

      {/* Sidebar Content */}
      <div className="p-4 flex-1 overflow-y-auto h-full">
        {isOpen && (
          <>
            <h2 className="text-2xl font-bold text-white mb-6">Genres</h2>
            
            {/* Search Box */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search genres..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Selected Count */}
            <div className="mb-4 text-gray-300">
              Selected: {selectedGenres.length}
            </div>

            {/* Clear All Button */}
            {selectedGenres.length > 0 && (
              <button
                onClick={() => onGenreChange([])}
                className="mb-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full"
              >
                Clear All
              </button>
            )}
          </>
        )}

        {/* Genre List */}
        <div className="space-y-2">
          {filteredGenres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => {
                if (Array.isArray(selectedGenres)) {
                  const isSelected = selectedGenres.includes(genre.id);
                  onGenreChange(
                    isSelected
                      ? selectedGenres.filter(id => id !== genre.id)
                      : [...selectedGenres, genre.id]
                  );
                } else {
                  onGenreChange([genre.id]);
                }
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3
                ${isOpen ? '' : 'justify-center'}
                ${
                  selectedGenres.includes(genre.id)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
            >
              <span className="text-xl">{genre.icon}</span>
              {isOpen && <span>{genre.name}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
