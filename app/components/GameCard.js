'use client';
import Image from 'next/image';
import Link from 'next/link';

const GameCard = ({ game }) => {
  return (
    <Link 
      href={`/game/${game.id}`}
      className="block bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
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
    </Link>
  );
};

export default GameCard;
