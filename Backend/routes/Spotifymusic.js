// routes/spotifyMusic.js
const express = require('express');
const router = express.Router();
const spotifyMusicController = require('../controllers/spotifyMusicController');
const userController = require('../controllers/userController')
const {authenticateToken, checkSpotifyToken} = require('../middleware/auth');
const auth = require('../middleware/auth');


// Add the test route
router.get('/test', spotifyMusicController.testSpotifyAPI);

// Get information about a track
router.get('/tracks/:trackId', spotifyMusicController.getTrackInfo);

// Search for tracks
router.get('/search', spotifyMusicController.searchTracks);

// Get user's currently playing track
router.get('/currently-playing', spotifyMusicController.getCurrentlyPlaying);

// Control playback
router.put('/play', spotifyMusicController.play);
router.put('/pause', spotifyMusicController.pause);
router.post('/next', spotifyMusicController.nextTrack);
router.post('/previous', spotifyMusicController.previousTrack);

// Get user's playlists
router.get('/playlists', spotifyMusicController.getUserPlaylists);

// Get tracks from a playlist
router.get('/playlists/:playlistId/tracks', spotifyMusicController.getPlaylistTracks);

router.get('/library', authenticateToken, checkSpotifyToken, spotifyMusicController.getUserLibrary);

router.post('/update-spotify-token', authenticateToken, userController.updateSpotifyToken);




module.exports = router;