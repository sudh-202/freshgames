'use client';
import { useState, useEffect } from 'react';
import { getUpcomingGames, getCrackedGames, getUncrackedGames } from './utils/api';
import GameCarousel from './components/GameCarousel';
import SearchBar from './components/SearchBar';
import GameCard from './components/GameCard'; 

export default function Home() {
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [crackedGames, setCrackedGames] = useState([]);
  const [uncrackedGames, setUncrackedGames] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const [upcoming, cracked, uncracked] = await Promise.all([
          getUpcomingGames(),
          getCrackedGames(),
          getUncrackedGames(),
        ]);

        setUpcomingGames(upcoming);
        setCrackedGames(cracked);
        setUncrackedGames(uncracked);
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleSearch = (results) => {
    setSearchResults(results);
  };

  const clearSearch = () => {
    setSearchResults(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white text-center mb-8">Fresh Games</h1>
        
        <SearchBar onSearch={handleSearch} />

        {searchResults ? (
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Search Results</h2>
              <button
                onClick={clearSearch}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200"
              >
                Clear Search
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="mr-3">🎮</span>
                Upcoming Games
                <span className="ml-3 px-3 py-1 bg-blue-600 rounded-full text-sm">
                  {upcomingGames.length}
                </span>
              </h2>
              <GameCarousel games={upcomingGames} />
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="mr-3">🔓</span>
                Cracked Games
                <span className="ml-3 px-3 py-1 bg-green-600 rounded-full text-sm">
                  {crackedGames.length}
                </span>
              </h2>
              <GameCarousel games={crackedGames} />
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="mr-3">🔒</span>
                Not-Cracked Games
                <span className="ml-3 px-3 py-1 bg-red-600 rounded-full text-sm">
                  {uncrackedGames.length}
                </span>
              </h2>
              <GameCarousel games={uncrackedGames} />
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
