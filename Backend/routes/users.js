const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

// Create a new user (sign-up) - typically doesn't require authentication
router.post('/', userController.createUser);

// Get all users (admin only)
router.get('/', authenticateToken, userController.getAllUsers);

// Get user by ID
router.get('/:id', authenticateToken, userController.getUserById);

// Update user
router.put('/:id', authenticateToken, userController.updateUser);

// Delete user
router.delete('/:id', authenticateToken, userController.deleteUser);

// Get user's playlists
router.get('/:id/playlists', authenticateToken, userController.getUserPlaylists);

// Get user's liked items
router.get('/:id/likes', authenticateToken, userController.getUserLikes);

// Verify user's email
router.post('/:id/verify-email', authenticateToken, userController.verifyEmail);

module.exports = router;