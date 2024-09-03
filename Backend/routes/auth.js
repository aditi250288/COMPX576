const express = require('express');
var bodyParser = require('body-parser')
const router = express.Router();
const User = require('../models/user');
const { authenticateToken, validateInput, generateToken } = require('../middleware/auth');
//const SpotifyWebApi = require('spotify-web-api-node');
const bcrypt = require('bcrypt');
//const rateLimit = require('express-rate-limit');

// Initialize Spotify API
//const spotifyApi = new SpotifyWebApi({
 // clientId: process.env.SPOTIFY_CLIENT_ID,
 // clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
 // redirectUri: process.env.SPOTIFY_REDIRECT_URI
//});

// Rate limiting
//const loginLimiter = rateLimit({
 // windowMs: 15 * 60 * 1000, // 15 minutes
//  max: 5, // Limit each IP to 5 login requests per windowMs
 // message: 'Too many login attempts, please try again later.'
//});


// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

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

    // Check password strength
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    const existingUser = await User.getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    const userId = await User.createUser({ username, email, password });
    
    res.status(201).json({ 
      message: 'User created successfully. Please log in.',
      userId
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Login user
router.post('/login', jsonParser, async (req, res) => {
  try {
    console.log(req.body);
    const { username, password } = req.body;
    console.log("new log");

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.getUserByUsername(username);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Use bcrypt to compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = generateToken(user);

    // Don't send password hash in response
    const { password_hash, ...userWithoutPassword } = user;

    res.json({ 
      message: 'Login successful', 
      token, 
      user: userWithoutPassword 
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});

// Refresh JWT token
router.post('/refresh-token', authenticateToken, (req, res) => {
  const user = req.user;
  const newToken = generateToken(user);
  res.json({ token: newToken });
});

// Logout (client-side)
router.post('/logout', (req, res) => {
  
  // JWT tokens can't be invalidated server-side, so we just send a success response
  res.json({ message: 'Logout successful' });
});

// Spotify login
//router.get('/spotify/login', (req, res) => {
 // const scopes = ['user-read-private', 'user-read-email', 'user-library-read', 'user-library-modify'];
  //const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  //res.redirect(authorizeURL);
//});

// Spotify callback
//router.get('/spotify/callback', async (req, res) => {
  //const { code } = req.query;
  //try {
    //const data = await spotifyApi.authorizationCodeGrant(code);
    //const { access_token, refresh_token } = data.body;
    
    //spotifyApi.setAccessToken(access_token);
    //const spotifyUser = await spotifyApi.getMe();
    
    //let user = await User.getUserBySpotifyId(spotifyUser.body.id);
    
    //if (!user) {
      //user = await User.createUserFromSpotify({
        //spotifyId: spotifyUser.body.id,
        //username: spotifyUser.body.display_name,
        //email: spotifyUser.body.email,
      //});
    //}
    
   // await User.updateSpotifyTokens(user.user_id, access_token, refresh_token);
    
    //const token = generateToken(user);

    //Redirect to Spotify library
    //res.redirect(`${process.env.FRONTEND_URL}/library?token=${token}`);
  //} catch (error) {
    //console.error('Error in Spotify callback:', error);
    //res.redirect(`${process.env.FRONTEND_URL}/login-error`);
  //}
//});

// Refresh Spotify token
//router.get('/refresh-spotify-token', authenticateToken, async (req, res) => {
  //try {
    //const user = await User.getUserById(req.user.id);
    //spotifyApi.setRefreshToken(user.spotify_refresh_token);
    
    //const data = await spotifyApi.refreshAccessToken();
   // const { access_token } = data.body;
    
    //await User.updateSpotifyAccessToken(user.user_id, access_token);
    
    //res.json({ message: 'Spotify token refreshed successfully' });
  //} catch (error) {
    //console.error('Error refreshing Spotify token:', error);
    //res.status(500).json({ message: 'Error refreshing Spotify token', error: error.message });
  //}
//});

module.exports = router;