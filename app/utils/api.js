import axios from 'axios';

const BASE_URL = 'https://api.rawg.io/api';
const NEXT_PUBLIC_RAWG_API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;

if (!NEXT_PUBLIC_RAWG_API_KEY) {
  throw new Error('RAWG API key not found. Please add NEXT_PUBLIC_RAWG_API_KEY to your .env file');
}

// Cache configuration
const CACHE_DURATION = 1 * 60 * 1000; // 1 minutes
const cache = new Map();

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    key: NEXT_PUBLIC_RAWG_API_KEY,
  },
  timeout: 10000, // Increased timeout to 10 seconds
});

// Add retry logic to axios instance
api.interceptors.response.use(undefined, async (err) => {
  const { config } = err;
  if (!config || !config.retry) {
    return Promise.reject(err);
  }
  config.retry -= 1;
  const delayRetry = new Promise(resolve => setTimeout(resolve, 1000));
  await delayRetry;
  return api(config);
});

// Request queue
const requestQueue = new Map();

const getCacheKey = (endpoint, params) => {
  return `${endpoint}:${JSON.stringify(params)}`;
};

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (!cached) return null;
  
  const isExpired = Date.now() - cached.timestamp > CACHE_DURATION;
  if (isExpired) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
};

const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

// Enhanced request function with retries and better error handling
const queuedRequest = async (endpoint, params = {}) => {
  const cacheKey = getCacheKey(endpoint, params);
  
  // Check if request is already in progress
  if (requestQueue.has(cacheKey)) {
    console.log(`Request in progress for ${endpoint}`);
    return requestQueue.get(cacheKey);
  }

  // Check cache first
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    console.log(`Cache hit for ${endpoint}`);
    return cachedData;
  }

  // Create new request promise with retry logic
  const requestPromise = api.get(endpoint, { 
    params,
    retry: 3, // Allow 3 retries
  })
    .then(response => {
      const data = response.data;
      setCachedData(cacheKey, data);
      requestQueue.delete(cacheKey);
      return data;
    })
    .catch(error => {
      console.error(`Error fetching ${endpoint}:`, error.message);
      requestQueue.delete(cacheKey);
      // Return empty results but don't cache errors
      return { results: [] };
    });

  // Add to queue
  requestQueue.set(cacheKey, requestPromise);
  return requestPromise;
};

// Optimized batch request function
const batchRequest = async (requests) => {
  try {
    return await Promise.all(
      requests.map(({ endpoint, params }) => queuedRequest(endpoint, params))
    );
  } catch (error) {
    console.error('Error in batch request:', error);
    return requests.map(() => ({ results: [] }));
  }
};

export const getAllGames = async (selectedGenres = []) => {
  console.log('Starting getAllGames with genres:', selectedGenres);
  const startTime = Date.now();

  // Define base parameters for each section
  const baseParams = {
    page_size: 15, // Increased from 10 to ensure we get enough results
    metacritic: '1,100' // Relaxed metacritic range to get more results
  };

  // Apply genre filter if selected
  const genreParam = selectedGenres.length > 0 ? { genres: selectedGenres.join(',') } : {};

  // Get current date and format it
  const currentDate = new Date();
  const futureDate = new Date(currentDate);
  futureDate.setFullYear(currentDate.getFullYear() + 1);
  
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const requests = [
    {
      name: 'popular',
      params: {
        ...baseParams,
        ...genreParam,
        ordering: '-rating',
        metacritic: '80,100'
      }
    },
    {
      name: 'upcoming',
      params: {
        ...baseParams,
        ...genreParam,
        dates: `${formatDate(currentDate)},${formatDate(futureDate)}`,
        ordering: '-added',
        metacritic: null // Remove metacritic filter for upcoming games
      }
    },
    {
      name: 'aaa',
      params: {
        ...baseParams,
        ...genreParam,
        tags: 'aaa',
        ordering: '-added',
        metacritic: '60,100', // Relaxed metacritic range for AAA games
        exclude_additions: true,
        exclude_parents: false
      }
    },
    {
      name: 'cracked',
      params: {
        ...baseParams,
        ...genreParam,
        dates: '2010-01-01,2023-06-01',
        metacritic: '75,100'
      }
    },
    {
      name: 'uncracked',
      params: {
        ...baseParams,
        ...genreParam,
        dates: '2023-06-01,2024-12-31',
        platforms: '187,186', // PS5, Xbox Series X
        metacritic: '75,100'
      }
    }
  ];

  try {
    // Make parallel requests with individual error handling
    const results = await Promise.all(
      requests.map(async ({ name, params }) => {
        try {
          console.log(`Fetching ${name} games with params:`, params);
          const data = await queuedRequest('/games', params);
          console.log(`${name} games fetched:`, data.results?.length || 0, 'results');
          return {
            name,
            data: data.results || []
          };
        } catch (error) {
          console.error(`Error fetching ${name} games:`, error);
          return {
            name,
            data: [] // Return empty array for failed section
          };
        }
      })
    );

    // Convert results to object
    const gameData = {};
    results.forEach(({ name, data }) => {
      gameData[name] = data;
    });

    const endTime = Date.now();
    console.log('getAllGames completed:', {
      duration: `${(endTime - startTime) / 1000}s`,
      sections: Object.keys(gameData).map(section => ({
        name: section,
        count: gameData[section].length
      })),
      totalGames: Object.values(gameData).flat().length
    });

    return gameData;
  } catch (error) {
    console.error('Fatal error in getAllGames:', error);
    // Return empty arrays for all sections instead of failing completely
    return {
      popular: [],
      upcoming: [],
      aaa: [],
      cracked: [],
      uncracked: []
    };
  }
};

export const searchGames = async (searchTerm) => {
  if (!searchTerm) return [];
  
  try {
    const response = await queuedRequest('/games', {
      search: searchTerm,
      page_size: 20
    });
    return response.results || [];
  } catch (error) {
    console.error('Error searching games:', error);
    return [];
  }
};

export const getPopularGames = async (selectedGenres = []) => {
  try {
    const params = {
      ordering: '-rating',
      page_size: 20,
      metacritic: '80,100'
    };

    if (selectedGenres.length > 0) {
      params.genres = selectedGenres.join(',');
    }

    const response = await queuedRequest('/games', params);
    return response.results;
  } catch (error) {
    console.error('Error fetching popular games:', error);
    return [];
  }
};

export const getAAAGames = async (selectedGenres = []) => {
  try {
    const params = {
      ordering: '-added',
      page_size: 20,
      metacritic: '80,100',
      tags: 'aaa'
    };

    if (selectedGenres.length > 0) {
      params.genres = selectedGenres.join(',');
    }

    const response = await queuedRequest('/games', params);
    return response.results;
  } catch (error) {
    console.error('Error fetching AAA games:', error);
    return [];
  }
};

export const getIndieGames = async (selectedGenres = []) => {
  try {
    const params = {
      tags: 'indie',
      ordering: '-rating',
      page_size: 20
    };

    if (selectedGenres.length > 0) {
      params.genres = selectedGenres.join(',');
    }

    const response = await queuedRequest('/games', params);
    return response.results;
  } catch (error) {
    console.error('Error fetching indie games:', error);
    return [];
  }
};

export const getUpcomingGames = async (selectedGenres = []) => {
  const today = new Date().toISOString().split('T')[0];
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  
  try {
    const params = {
      dates: `${today},${nextYear.toISOString().split('T')[0]}`,
      ordering: '-added',
      page_size: 20
    };

    if (selectedGenres.length > 0) {
      params.genres = selectedGenres.join(',');
    }

    const response = await queuedRequest('/games', params);
    return response.results;
  } catch (error) {
    console.error('Error fetching upcoming games:', error);
    return [];
  }
};

export const getCrackedGames = async (selectedGenres = []) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  try {
    const params = {
      dates: `2010-01-01,${sixMonthsAgo.toISOString().split('T')[0]}`,
      metacritic: '75,100',
      ordering: '-rating',
      page_size: 20
    };

    if (selectedGenres.length > 0) {
      params.genres = selectedGenres.join(',');
    }

    const response = await queuedRequest('/games', params);
    return response.results;
  } catch (error) {
    console.error('Error fetching cracked games:', error);
    return [];
  }
};

export const getUncrackedGames = async (selectedGenres = []) => {
  try {
    const params = {
      dates: '2023-06-01,2024-12-31',
      metacritic: '80,100',
      ordering: '-released',
      page_size: 20,
      platforms: '187,186' // PS5, Xbox Series X
    };

    if (selectedGenres.length > 0) {
      params.genres = selectedGenres.join(',');
    }

    const response = await queuedRequest('/games', params);
    return response.results;
  } catch (error) {
    console.error('Error fetching uncracked games:', error);
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
