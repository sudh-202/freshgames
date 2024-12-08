import axios from 'axios';

const BASE_URL = 'https://api.rawg.io/api';
const NEXT_PUBLIC_RAWG_API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;

if (!NEXT_PUBLIC_RAWG_API_KEY) {
  throw new Error('RAWG API key not found. Please add NEXT_PUBLIC_RAWG_API_KEY to your .env file');
}

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    key: NEXT_PUBLIC_RAWG_API_KEY,
  },
});

export const getPopularGames = async () => {
  try {
    const response = await api.get('/games', {
      params: {
        ordering: '-rating',
        metacritic: '80,100',
        page_size: 10
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular games:', error);
    return [];
  }
};

export const getAAAGames = async () => {
  try {
    const response = await api.get('/games', {
      params: {
        metacritic: '80,100',
        platforms: '4,187', // PS4, PS5
        ordering: '-released',
        page_size: 10
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching AAA games:', error);
    return [];
  }
};

export const getIndieGames = async () => {
  try {
    const response = await api.get('/games', {
      params: {
        tags: 'indie',
        ordering: '-rating',
        page_size: 10
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching indie games:', error);
    return [];
  }
};

export const getUpcomingGames = async () => {
  const today = new Date().toISOString().split('T')[0];
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  
  try {
    const response = await api.get('/games', {
      params: {
        dates: `${today},${nextYear.toISOString().split('T')[0]}`,
        ordering: '-added',
        page_size: 10
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching upcoming games:', error);
    return [];
  }
};

export const getCrackedGames = async () => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  try {
    const response = await api.get('/games', {
      params: {
        dates: `2010-01-01,${sixMonthsAgo.toISOString().split('T')[0]}`,
        metacritic: '75,100',
        ordering: '-rating',
        page_size: 10
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching cracked games:', error);
    return [];
  }
};

export const getUncrackedGames = async () => {
  try {
    const response = await api.get('/games', {
      params: {
        dates: '2023-06-01,2024-12-31',
        metacritic: '80,100',
        ordering: '-released',
        page_size: 10,
        platforms: '187,186', // PS5, Xbox Series X
      }
    });

    if (!response.data.results || response.data.results.length === 0) {
      console.error('No uncracked games found in response:', response.data);
    }

    return response.data.results;
  } catch (error) {
    console.error('Error fetching uncracked games:', error);
    return [];
  }
};

export const searchGames = async (searchTerm) => {
  try {
    const response = await api.get('/games', {
      params: {
        search: searchTerm,
        page_size: 20
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching games:', error);
    return [];
  }
};

export const getGameDetails = async (gameId) => {
  try {
    const [gameDetails, gameTrailers, storeData] = await Promise.all([
      api.get(`/games/${gameId}`),
      api.get(`/games/${gameId}/movies`),
      api.get(`/games/${gameId}/stores`)
    ]);
    
    const stores = await Promise.all(
      storeData.data.results.map(async (store) => {
        const storeDetails = await api.get(`/stores/${store.store_id}`);
        return {
          ...store,
          storeName: storeDetails.data.name,
          storeIcon: storeDetails.data.image_background,
          domain: storeDetails.data.domain
        };
      })
    );

    return {
      ...gameDetails.data,
      trailer: gameTrailers.data.results[0],
      stores: stores
    };
  } catch (error) {
    console.error('Error fetching game details:', error);
    return null;
  }
};
