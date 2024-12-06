'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Modal from './Modal';
import { getGameDetails } from '../utils/api';

const GameCard = ({ game }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gameDetails, setGameDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchGameDetails = async () => {
    if (!isModalOpen || gameDetails) return;
    setLoading(true);
    const details = await getGameDetails(game.id);
    setGameDetails(details);
    setLoading(false);
  };

  useEffect(() => {
    fetchGameDetails();
  }, [isModalOpen]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Function to determine crack status based on release date
  const getCrackStatus = () => {
    if (!game.released) return 'Upcoming';
    const releaseDate = new Date(game.released);
    const now = new Date();
    const monthsSinceRelease = (now - releaseDate) / (1000 * 60 * 60 * 24 * 30);
    
    if (monthsSinceRelease < 0) return 'Upcoming';
    if (monthsSinceRelease < 1) return 'Too New';
    if (monthsSinceRelease < 6) return 'Not Cracked';
    return 'Likely Cracked';
  };

  return (
    <>
      <div 
        onClick={handleOpenModal}
        className="cursor-pointer bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
      >
        <div className="relative">
          <div className="relative h-[150px] w-full">
            <Image
              src={game.background_image || '/placeholder.jpg'}
              alt={game.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
          {game.metacritic && (
            <span className={`absolute top-2 right-2 px-2 py-1 rounded text-sm font-bold ${
              game.metacritic >= 80 ? 'bg-green-500' :
              game.metacritic >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            } text-white`}>
              {game.metacritic}
            </span>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-bold text-white truncate mb-2">{game.name}</h3>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">
              {game.released ? new Date(game.released).getFullYear() : 'TBA'}
            </span>
            {game.rating > 0 && (
              <div className="flex items-center">
                <span className="text-yellow-400 mr-1">★</span>
                <span className="text-gray-300">{game.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {game.genres && (
            <div className="mt-3 flex flex-wrap gap-1">
              {game.genres.slice(0, 2).map((genre) => (
                <span
                  key={genre.id}
                  className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="relative">
          <button
            onClick={handleCloseModal}
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : (
            <>
              {gameDetails?.trailer ? (
                <div className="relative h-[300px] w-full">
                  <iframe
                    className="w-full h-full"
                    src={gameDetails.trailer.data.max}
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="relative h-[300px] w-full">
                  <Image
                    src={game.background_image || '/placeholder.jpg'}
                    alt={game.name}
                    fill
                    className="object-cover rounded-t-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-white">{game.name}</h2>
                  {game.metacritic && (
                    <span className={`px-3 py-1 rounded text-sm font-bold ${
                      game.metacritic >= 80 ? 'bg-green-500' :
                      game.metacritic >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    } text-white`}>
                      {game.metacritic}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-sm">Release Date</p>
                    <p className="text-white">
                      {game.released ? new Date(game.released).toLocaleDateString() : 'TBA'}
                    </p>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-sm">Crack Status</p>
                    <p className={`text-white font-medium ${
                      getCrackStatus() === 'Likely Cracked' ? 'text-green-400' :
                      getCrackStatus() === 'Not Cracked' ? 'text-red-400' :
                      'text-yellow-400'
                    }`}>
                      {getCrackStatus()}
                    </p>
                  </div>
                </div>

                {gameDetails?.description_raw && (
                  <div className="mb-6">
                    <h3 className="text-white font-semibold mb-2">About</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {gameDetails.description_raw}
                    </p>
                  </div>
                )}

                {game.genres && (
                  <div className="mb-6">
                    <h3 className="text-white font-semibold mb-2">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {game.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {game.platforms && (
                  <div className="mb-6">
                    <h3 className="text-white font-semibold mb-2">Platforms</h3>
                    <div className="flex flex-wrap gap-2">
                      {game.platforms.map((platform) => (
                        <span
                          key={platform.platform.id}
                          className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                        >
                          {platform.platform.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {gameDetails?.stores && gameDetails.stores.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-white font-semibold mb-2">Where to Buy</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {gameDetails.stores.map((store) => (
                        <a
                          key={store.id}
                          href={`https://${store.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <div className="relative w-6 h-6 rounded-full overflow-hidden">
                            <Image
                              src={store.storeIcon || '/placeholder.jpg'}
                              alt={store.storeName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="text-sm text-white">{store.storeName}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default GameCard;
