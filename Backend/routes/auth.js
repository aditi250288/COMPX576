const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { authenticateToken, validateInput, generateToken } = require('../middleware/auth');
const SpotifyWebApi = require('spotify-web-api-node');

// Initialize Spotify API
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

// Get all users (protected route)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Register new user
router.post('/register', validateInput, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    const userId = await User.createUser({ username, email, password });
    res.status(201).json({ message: 'User created successfully', userId });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.getUserByUsername(username);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = await User.verifyPassword(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = generateToken(user);

    res.json({ message: 'Login successful', token, userId: user.user_id });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

// Spotify login
router.get('/spotify/login', (req, res) => {
  const scopes = ['user-read-private', 'user-read-email', 'user-library-read', 'user-library-modify'];
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authorizeURL);
});

// Spotify callback
router.get('/spotify/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;
    
    spotifyApi.setAccessToken(access_token);
    const spotifyUser = await spotifyApi.getMe();
    
    let user = await User.getUserBySpotifyId(spotifyUser.body.id);
    
    if (!user) {
      user = await User.createUserFromSpotify({
        spotifyId: spotifyUser.body.id,
        username: spotifyUser.body.display_name,
        email: spotifyUser.body.email,
      });
    }
    
    await User.updateSpotifyTokens(user.user_id, access_token, refresh_token);
    
    const token = generateToken(user);
    
    res.redirect(`${process.env.FRONTEND_URL}/login-success?token=${token}`);
  } catch (error) {
    console.error('Error in Spotify callback:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login-error`);
  }
});

// Refresh Spotify token
router.get('/refresh-token', authenticateToken, async (req, res) => {
  try {
    const user = await User.getUserById(req.user.id);
    spotifyApi.setRefreshToken(user.spotify_refresh_token);
    
    const data = await spotifyApi.refreshAccessToken();
    const { access_token } = data.body;
    
    await User.updateSpotifyAccessToken(user.user_id, access_token);
    
    res.json({ message: 'Token refreshed successfully' });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ message: 'Error refreshing token', error: error.message });
  }
});

module.exports = router;