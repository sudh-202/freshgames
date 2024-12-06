import { getGameDetails } from '../../utils/api';
import Image from 'next/image';
import Link from 'next/link';

export default async function GamePage({ params }) {
  const game = await getGameDetails(params.id);

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Game not found</h1>
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/" className="text-blue-400 hover:text-blue-300 inline-block mb-8">
          ← Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
            <Image
              src={game.background_image || '/placeholder.jpg'}
              alt={game.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-4">{game.name}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {game.genres?.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Release Date</p>
                <p className="text-lg">{new Date(game.released).toLocaleDateString()}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Rating</p>
                <p className="text-lg flex items-center">
                  <span className="text-yellow-400 mr-2">★</span>
                  {game.rating}/5
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">About</h2>
              <div
                className="text-gray-300 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: game.description }}
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Platforms</h2>
              <div className="flex flex-wrap gap-2">
                {game.platforms?.map((platform) => (
                  <span
                    key={platform.platform.id}
                    className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                  >
                    {platform.platform.name}
                  </span>
                ))}
              </div>
            </div>

            {game.metacritic && (
              <div className="bg-gray-800 p-4 rounded-lg inline-block">
                <p className="text-gray-400 text-sm">Metacritic Score</p>
                <p className="text-2xl font-bold">{game.metacritic}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
