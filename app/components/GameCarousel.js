'use client';
import { useRef } from 'react';
import GameCard from './GameCard';

const GameCarousel = ({ title, games }) => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const scrollAmount = direction === 'left' ? -400 : 400;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  if (!games || games.length === 0) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-8 text-center">
        <p className="text-gray-400">No games available in this category</p>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center h-full">
        <button
          onClick={() => scroll('left')}
          className="bg-gray-900/90 hover:bg-gray-900 text-white p-3 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Scroll left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {games.map((game) => (
          <div key={game.id} className="flex-none w-[300px] basis-1/5">
            <GameCard game={game} />
          </div>
        ))}
      </div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center h-full">
        <button
          onClick={() => scroll('right')}
          className="bg-gray-900/90 hover:bg-gray-900 text-white p-3 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Scroll right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default GameCarousel;
