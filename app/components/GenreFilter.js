import React from 'react';

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

const GenreFilter = ({ selectedGenres, onGenreChange }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-white mb-4">Filter by Genre</h2>
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => onGenreChange(genre.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2
              ${
                selectedGenres.includes(genre.id)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            <span>{genre.icon}</span>
            <span>{genre.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreFilter;
