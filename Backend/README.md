# What2Watch Backend Proxy

This is a backend proxy server for the What2Watch app that handles API requests to OMDB, YouTube, and Jikan APIs.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   OMDB_API_KEY=your_omdb_api_key_here
   YOUTUBE_API_KEY=your_youtube_api_key_here
   JIKAN_API_KEY=your_jikan_api_key_here
   ```

3. Start the server:
   ```
   npm start
   ```

   For development with auto-restart:
   ```
   npm run dev
   ```

## API Endpoints

### OMDB API

- **Search Movies/TV Shows**
  ```
  GET /api/omdb/search?query=marvel&type=movie&year=2023
  ```

- **Get Movie/TV Show Details**
  ```
  GET /api/omdb/details/:id?plot=full
  ```

### YouTube API

- **Search Videos**
  ```
  GET /api/youtube/search?query=marvel trailer&maxResults=5
  ```

- **Get Video Details**
  ```
  GET /api/youtube/video/:id
  ```

### Jikan API

- **Get Top Anime**
  ```
  GET /api/jikan/top/anime?limit=10
  ```

- **Search Anime**
  ```
  GET /api/jikan/anime/search?query=naruto&limit=10
  ```

- **Get Anime Details**
  ```
  GET /api/jikan/anime/:id
  ```

## Frontend Integration

Update your frontend code to use these endpoints instead of directly calling the external APIs. For example:

```javascript
// Before
const response = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=marvel&type=movie`);

// After
const response = await fetch(`http://localhost:3000/api/omdb/search?query=marvel&type=movie`);
```

Make sure to update the base URL when deploying to production. 