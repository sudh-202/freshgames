'use client';
import { useState, useEffect } from 'react';
import { getAllGames } from './utils/api';
import GameCarousel from './components/GameCarousel';
import SearchBar from './components/SearchBar';
import GameCard from './components/GameCard';
import Sidebar from './components/Sidebar';
import LoadingTimer from './components/LoadingTimer';

const GameSection = ({ title, icon, games, bgColor, loading }) => (
  <section className="relative">
    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
      <span className="mr-3">{icon}</span>
      {title}
      <span className={`ml-3 px-3 py-1 ${bgColor} rounded-full text-sm`}>
        {games?.length || 0}
      </span>
    </h2>
    {loading ? (
      <div className="h-64 flex items-center justify-center">
        <div className="text-white">Loading {title.toLowerCase()}...</div>
      </div>
    ) : (
      <GameCarousel games={games || []} />
    )}
  </section>
);

export default function Home() {
  const [games, setGames] = useState({
    popular: [],
    upcoming: [],
    aaa: [],
    cracked: [],
    uncracked: [],
  });
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loadingTime, setLoadingTime] = useState(0);

  const handleGenreChange = (newGenres) => {
    setSelectedGenres(Array.isArray(newGenres) ? newGenres : []);
  };

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  useEffect(() => {
    let isMounted = true;
    const startTime = Date.now();
    
    const fetchGames = async () => {
      setLoading(true);
      
      try {
        const allGames = await getAllGames(selectedGenres);
        
        if (isMounted) {
          const endTime = Date.now();
          const timeElapsed = (endTime - startTime) / 1000;
          setLoadingTime(timeElapsed);
          setGames(allGames);
          setLoading(false);
          
          console.log('Loading Performance:', {
            totalTime: `${timeElapsed.toFixed(2)} seconds`,
            gamesLoaded: Object.values(allGames).flat().length,
            genresApplied: selectedGenres
          });
        }
      } catch (error) {
        console.error('Error fetching games:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchGames();

    return () => {
      isMounted = false;
    };
  }, [selectedGenres]);

  const handleSearch = (results) => {
    setSearchResults(results);
  };

  const clearSearch = () => {
    setSearchResults(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar 
        selectedGenres={selectedGenres} 
        onGenreChange={handleGenreChange}
        onSidebarToggle={handleSidebarToggle}
      />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-80' : 'ml-16'}`}>
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-white text-center mb-8">Fresh Games</h1>
            
            {/* Loading Timer */}
            {loading && <LoadingTimer />}

            {/* Loading Stats */}
            {!loading && loadingTime > 0 && (
              <div className="mb-4 text-gray-400 text-sm text-center">
                Loaded in {loadingTime.toFixed(2)} seconds
              </div>
            )}
            
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
                <GameSection
                  title="Popular Games"
                  icon="⭐"
                  games={games.popular}
                  bgColor="bg-yellow-600"
                  loading={loading}
                />
                
                <GameSection
                  title="Upcoming Games"
                  icon="🎮"
                  games={games.upcoming}
                  bgColor="bg-blue-600"
                  loading={loading}
                />
                
                <GameSection
                  title="AAA Games"
                  icon="👑"
                  games={games.aaa}
                  bgColor="bg-purple-600"
                  loading={loading}
                />
                
                <GameSection
                  title="Cracked Games"
                  icon="🔓"
                  games={games.cracked}
                  bgColor="bg-green-600"
                  loading={loading}
                />
                
                <GameSection
                  title="Not-Cracked Games"
                  icon="🔒"
                  games={games.uncracked}
                  bgColor="bg-red-600"
                  loading={loading}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
