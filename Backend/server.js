const express = require('express');
require('dotenv').config();
const database = require('./database');
const cors = require('cors');
const axios = require('axios');

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
const port = process.env.PORT || 3000;

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

// Middleware
app.use(cors());
app.use(express.json());

// Axios middleware
app.use((req, res, next) => {
  req.axios = axios;
  next();
});

// Auth routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Song routes
const songRoutes = require('./routes/songs');
app.use('/api/songs', songRoutes);

// Artist routes
const artistRoutes = require('./routes/artists');
app.use('/api/artists', artistRoutes);

// Album routes
const albumRoutes = require('./routes/albums');
app.use('/api/albums', albumRoutes);

// Spotify routes
const spotifyRoutes = require('./routes/spotifyMusic');
app.use('/api/spotify', spotifyRoutes);

// Test route for database connection
app.get('/test-db', async (req, res) => {
  try {
    const [results] = await database.query('SELECT 1 + 1 AS solution');
    res.json({ message: 'Database connection successful', result: results[0].solution });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).send('Database connection failed');
  }
});

// Example route using Axios
app.get('/test-axios', async (req, res) => {
  try {
    const response = await req.axios.get('https://api.example.com/data');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
});

// Example route
app.get('/', (req, res) => {
  res.send('Music Website Backend is running');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
database.getConnection()
  .then(() => {
    console.log('Connected to database.');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  });