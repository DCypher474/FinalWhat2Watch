require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for now
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Root route with API documentation
app.get('/', (req, res) => {
  res.json({
    name: 'What2Watch Backend API',
    version: '1.0.0',
    endpoints: {
      omdb: {
        search: '/api/omdb/search?query={query}&type={type}',
        details: '/api/omdb/details/:id'
      },
      youtube: {
        search: '/api/youtube/search?query={query}',
        video: '/api/youtube/video/:id'
      },
      jikan: {
        topAnime: '/api/jikan/top/anime',
        search: '/api/jikan/anime/search?query={query}',
        details: '/api/jikan/anime/:id'
      }
    },
    documentation: 'For more information, visit the GitHub repository'
  });
});

// OMDB API Proxy Routes
app.get('/api/omdb/search', async (req, res) => {
  try {
    const { query, type, year } = req.query;
    const response = await axios.get(`https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${query}&type=${type}${year ? `&y=${year}` : ''}`);
    res.json(response.data);
  } catch (error) {
    console.error('OMDB Search Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from OMDB API' });
  }
});

app.get('/api/omdb/details/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { plot } = req.query;
    const response = await axios.get(`https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${id}&plot=${plot || 'short'}`);
    res.json(response.data);
  } catch (error) {
    console.error('OMDB Details Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch details from OMDB API' });
  }
});

// YouTube API Proxy Routes
app.get('/api/youtube/search', async (req, res) => {
  try {
    const { query, maxResults = 10 } = req.query;
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&maxResults=${maxResults}&type=video&key=${process.env.YOUTUBE_API_KEY}`);
    res.json(response.data);
  } catch (error) {
    console.error('YouTube Search Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from YouTube API' });
  }
});

app.get('/api/youtube/video/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${id}&key=${process.env.YOUTUBE_API_KEY}`);
    res.json(response.data);
  } catch (error) {
    console.error('YouTube Video Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch video details from YouTube API' });
  }
});

// Jikan API Proxy Routes
app.get('/api/jikan/top/anime', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    let url = `https://api.jikan.moe/v4/top/anime?limit=${limit}`;
    if (process.env.JIKAN_API_KEY) {
      url += `&api_key=${process.env.JIKAN_API_KEY}`;
    }
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Jikan Top Anime Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch top anime from Jikan API' });
  }
});

app.get('/api/jikan/anime/search', async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;
    let url = `https://api.jikan.moe/v4/anime?q=${query}&limit=${limit}&sfw=true`;
    if (process.env.JIKAN_API_KEY) {
      url += `&api_key=${process.env.JIKAN_API_KEY}`;
    }
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Jikan Anime Search Error:', error.message);
    res.status(500).json({ error: 'Failed to search anime from Jikan API' });
  }
});

app.get('/api/jikan/anime/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let url = `https://api.jikan.moe/v4/anime/${id}/full`;
    if (process.env.JIKAN_API_KEY) {
      url += `?api_key=${process.env.JIKAN_API_KEY}`;
    }
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Jikan Anime Details Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch anime details from Jikan API' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
