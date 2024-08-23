const user = require('../models/user');
const playlists = require('../models/playlists');
const likes = require('../models/likes');
const artists = require('../models/artists');
const albums = require('../models/albums');
const album_artists = require('../models/album_artist');
const songs = require('../models/songs');

// Create a new user
exports.createUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    try {
        const existingUser = await user.getUserByUsername(username);
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        const userId = await user.createUser({ username, email, password });
        res.status(201).json({ userId, message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).json({ message: 'Failed to create user', error: error.message });
    }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await user.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const foundUser = await user.getUserById(userId);
        if (!foundUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(foundUser);
    } catch (error) {
        console.error('Error fetching user:', error.message);
        res.status(500).json({ message: 'Failed to fetch user', error: error.message });
    }
};

// Update a user's information
exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const { username, email, password } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    // Check if the requesting user is the same as the user being updated or an admin
    if (req.user.id !== parseInt(userId) && !req.user.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
    }

    // Basic input validation
    if (username && username.length < 3) {
        return res.status(400).json({ message: 'Username must be at least 3 characters long' });
    }
    if (email && !email.includes('@')) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password && password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    try {
        const affectedRows = await user.updateUser(userId, { username, email, password });

        if (affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).json({ message: 'Failed to update user', error: error.message });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const result = await user.deleteUser(userId);
        if (result === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).json({ message: 'Failed to delete user', error: error.message });
    }
};

// Get user's playlists
exports.getUserPlaylists = async (req, res) => {
    const userId = req.params.id;
    try {
        const userPlaylists = await playlists.getPlaylistsByUser(userId);
        res.json(userPlaylists);
    } catch (error) {
        console.error('Error fetching user playlists:', error.message);
        res.status(500).json({ message: 'Failed to fetch user playlists', error: error.message });
    }
};

// Get user's liked items
exports.getUserLikes = async (req, res) => {
    const userId = req.params.id;
    try {
        const userLikes = await likes.getLikesByUserId(userId);
        res.json(userLikes);
    } catch (error) {
        console.error('Error fetching user likes:', error.message);
        res.status(500).json({ message: 'Failed to fetch user likes', error: error.message });
    }
};

// Verify a user's email
exports.verifyEmail = async (req, res) => {
    const userId = req.params.id;
    const { verificationCode } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    if (!verificationCode) {
        return res.status(400).json({ message: 'Verification code is required' });
    }

    try {
        const result = await user.verifyEmail(userId, verificationCode);
        if (result) {
            res.json({ message: 'Email verified successfully' });
        } else {
            res.status(400).json({ message: 'Invalid verification code' });
        }
    } catch (error) {
        console.error('Error verifying email:', error.message);
        res.status(500).json({ message: 'Failed to verify email', error: error.message });
    }
};