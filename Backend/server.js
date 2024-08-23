require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const database = require('./config/database');
const axios = require('axios');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
const port = process.env.PORT || 3000;

// Check for required environment variables
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set. Please check your .env file.');
  process.exit(1);
}

// Initialize Spotify API
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET || !process.env.SPOTIFY_REDIRECT_URI) {
  console.error('Spotify API credentials are missing. Please check your .env file.');
}

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

// Axios middleware
app.use((req, res, next) => {
  req.axios = axios;
  next();
});

// API Routes
app.use('/auth', require('./routes/auth')); // for login and register
app.use('/api/users', require('./routes/users')); // For user-related operations
app.use('/api/songs', require('./routes/songs'));
app.use('/api/artists', require('./routes/artists'));
app.use('/api/albums', require('./routes/albums'));
app.use('/api/spotify', require('./routes/spotifyMusic'));
app.use('/api/playlists', require('./routes/playlists'));

// Test route for database connection
app.get('/test-db', async (req, res) => {
  try {
    const [results] = await database.query('SELECT 1 + 1 AS solution');
    res.json({ message: 'Database connection successful', result: results[0].solution });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
});

// Example route using Axios
app.get('/test-axios', async (req, res) => {
  try {
    const response = await axios.get('https://api.example.com/data');
    res.json(response.data);
  } catch (error) {
    console.error('Axios request error:', error);
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
});

// Home route
app.get('/', (req, res) => {
  res.send('Music Website Backend is running');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    message: 'An unexpected error occurred', 
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message 
  });
});

// Database connection function
const connectToDatabase = async () => {
  try {
    await database.getConnection();
    console.log('Connected to database.');
  } catch (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }
};

// Start the server
const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

startServer();