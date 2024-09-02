const jwt = require("jsonwebtoken");
const user = require('../models/user'); // Assuming you have a user model

// Generate JWT token
exports.generateToken = (user) => {
  const payload = {
    userId: user.id,
    username: user.username,
  };

  const options = {
    expiresIn: "1h", // Token expires in 1 hour
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

// Authenticate JWT token and add user to request
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Failed to authenticate token" });
    }
    user.getUserById(decoded.userId)
      .then(userRecord => {
        req.user = {
          ...decoded,
          spotifyAccessToken: userRecord.spotifyAccessToken
        };
        next();
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: "Error authenticating user" });
      });
  });
};

// Check if Spotify token exists
exports.checkSpotifyToken = (req, res, next) => {
  if (!req.user || !req.user.spotifyAccessToken) {
    return res.status(401).json({ error: 'Spotify access token not found. Please authenticate with Spotify.' });
  }
  next();
};

// Validate user input for registration
exports.validateInput = (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  // Basic password strength check
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters long" });
  }
  next();
};

// Global error handler
exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "An unexpected error occurred" });
};

// Update Spotify token
exports.updateSpotifyToken = async (req, res) => {
  const userId = req.user.id;
  const { spotifyToken } = req.body;

  if (!spotifyToken) {
    return res.status(400).json({ message: 'Spotify token is required' });
  }

  try {
    await user.setSpotifyToken(userId, spotifyToken);
    res.json({ message: 'Spotify token updated successfully' });
  } catch (error) {
    console.error('Error updating Spotify token:', error.message);
    res.status(500).json({ message: 'Failed to update Spotify token', error: error.message });
  }
};

module.exports = exports;