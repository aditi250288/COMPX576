const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const { authenticateToken } = require('../middleware/auth');

// Get all playlists
router.get('/', playlistController.getAllPlaylists);

// Get playlist by ID
router.get('/:id', playlistController.getPlaylistById);

// Create new playlist
router.post('/', authenticateToken, playlistController.createPlaylist);

// Update playlist
router.put('/:id', authenticateToken, playlistController.updatePlaylist);

// Delete playlist
router.delete('/:id', authenticateToken, playlistController.deletePlaylist);

// Add song to playlist
router.post('/:id/songs', authenticateToken, playlistController.addSongToPlaylist);

// Remove song from playlist
router.delete('/:id/songs/:songId', authenticateToken, playlistController.removeSongFromPlaylist);

// Get all songs in a playlist
router.get('/:id/songs', playlistController.getPlaylistSongs);

module.exports = router;