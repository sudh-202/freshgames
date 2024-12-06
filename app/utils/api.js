import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.rawg.io/api',
  params: {
    key: process.env.NEXT_PUBLIC_RAWG_API_KEY,
  },
});

export const getUpcomingGames = async () => {
  const currentDate = new Date().toISOString().split('T')[0];
  const nextMonth = new Date(new Date().setMonth(new Date().getMonth() + 1))
    .toISOString()
    .split('T')[0];

  try {
    const { data } = await api.get('/games', {
      params: {
        dates: `${currentDate},${nextMonth}`,
        ordering: '-added',
        page_size: 20,
      },
    });
    return data.results;
  } catch (error) {
    console.error('Error fetching upcoming games:', error);
    return [];
  }
};

export const getCrackedGames = async () => {
  try {
    const { data } = await api.get('/games', {
      params: {
        metacritic: '80,100',
        ordering: '-released',
        page_size: 20,
      },
    });
    return data.results;
  } catch (error) {
    console.error('Error fetching cracked games:', error);
    return [];
  }
};

export const getUncrackedGames = async () => {
  try {
    const { data } = await api.get('/games', {
      params: {
        dates: '2023-01-01,2024-12-31',
        ordering: '-added',
        page_size: 20,
      },
    });
    return data.results;
  } catch (error) {
    console.error('Error fetching uncracked games:', error);
    return [];
  }
};

export const getGameDetails = async (id) => {
  try {
    const [gameData, movieData, storeData] = await Promise.all([
      api.get(`/games/${id}`),
      api.get(`/games/${id}/movies`),
      api.get(`/games/${id}/stores`)
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
      ...gameData.data,
      trailer: movieData.data.results[0] || null,
      stores: stores
    };
  } catch (error) {
    console.error('Error fetching game details:', error);
    return null;
  }
};

export const searchGames = async (searchQuery) => {
  try {
    const { data } = await api.get('/games', {
      params: {
        search: searchQuery,
        page_size: 20,
        ordering: '-rating',
      },
    });
    return data.results;
  } catch (error) {
    console.error('Error searching games:', error);
    return [];
  }
};
