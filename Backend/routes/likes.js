const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const { authenticateToken } = require('../middleware/auth');

// Get all likes for a user
router.get('/user/:userId', authenticateToken, likeController.getLikesByUser);

// Add a like
router.post('/', authenticateToken, likeController.addLike);

// Remove a like
router.delete('/', authenticateToken, likeController.removeLike);

// Get likes for a specific item (song, album, or playlist)
router.get('/item/:itemType/:itemId', likeController.getLikesForItem);

module.exports = router;