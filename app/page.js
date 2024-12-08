'use client';
import { useState, useEffect } from 'react';
import { 
  getUpcomingGames, 
  getCrackedGames, 
  getUncrackedGames,
  getPopularGames,
  getAAAGames,
  getIndieGames
} from './utils/api';
import GameCarousel from './components/GameCarousel';
import SearchBar from './components/SearchBar';
import GameCard from './components/GameCard'; 

export default function Home() {
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [crackedGames, setCrackedGames] = useState([]);
  const [uncrackedGames, setUncrackedGames] = useState([]);
  const [popularGames, setPopularGames] = useState([]);
  const [aaaGames, setAAAGames] = useState([]);
  const [indieGames, setIndieGames] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        console.log('Fetching games...');
        const [upcoming, cracked, uncracked, popular, aaa, indie] = await Promise.all([
          getUpcomingGames(),
          getCrackedGames(),
          getUncrackedGames(),
          getPopularGames(),
          getAAAGames(),
          getIndieGames()
        ]);

        console.log('Uncracked Games Response:', uncracked);
        
        setUpcomingGames(upcoming || []);
        setCrackedGames(cracked || []);
        setUncrackedGames(uncracked || []);
        setPopularGames(popular || []);
        setAAAGames(aaa || []);
        setIndieGames(indie || []);
      } catch (error) {
        console.error('Error fetching games:', error);
        setError(error);
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Error: {error.message}</div>
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
                <span className="mr-3">⭐</span>
                Popular Games
                <span className="ml-3 px-3 py-1 bg-yellow-600 rounded-full text-sm">
                  {popularGames.length}
                </span>
              </h2>
              {loading ? (
                <div className="text-white text-lg">Loading...</div>
              ) : (
                <GameCarousel games={popularGames} />
              )}
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="mr-3">🎮</span>
                Upcoming Games
                <span className="ml-3 px-3 py-1 bg-blue-600 rounded-full text-sm">
                  {upcomingGames.length}
                </span>
              </h2>
              {loading ? (
                <div className="text-white text-lg">Loading...</div>
              ) : (
                <GameCarousel games={upcomingGames} />
              )}
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="mr-3">👑</span>
                AAA Games
                <span className="ml-3 px-3 py-1 bg-purple-600 rounded-full text-sm">
                  {aaaGames.length}
                </span>
              </h2>
              {loading ? (
                <div className="text-white text-lg">Loading...</div>
              ) : (
                <GameCarousel games={aaaGames} />
              )}
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="mr-3">🔓</span>
                Cracked Games
                <span className="ml-3 px-3 py-1 bg-green-600 rounded-full text-sm">
                  {crackedGames.length}
                </span>
              </h2>
              {loading ? (
                <div className="text-white text-lg">Loading...</div>
              ) : (
                <GameCarousel games={crackedGames} />
              )}
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="mr-3">🔒</span>
                Not-Cracked Games
                <span className="ml-3 px-3 py-1 bg-red-600 rounded-full text-sm">
                  {uncrackedGames.length}
                </span>
              </h2>
              {loading ? (
                <div className="text-white text-lg">Loading...</div>
              ) : (
                <GameCarousel games={uncrackedGames} />
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
