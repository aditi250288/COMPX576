// songs.js (routes)
const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');

// GET all songs
router.get('/', songController.getAllSongs);

// GET songs by title (search)
router.get('/search/:title', songController.searchSongsByTitle);

// GET songs by artist
router.get('/artist/:artistId', songController.getSongsByArtist);

// GET songs by album
router.get('/album/:albumId', songController.getSongsByAlbum);

// GET songs by playlist
router.get('/playlist/:playlistId', songController.getSongsByPlaylist);

// GET a specific song by ID
router.get('/:id', songController.getSongById);

// POST a new song
router.post('/', songController.createSong);

// PUT (update) an existing song
router.put('/:id', songController.updateSong);

// DELETE a song
router.delete('/:id', songController.deleteSong);

module.exports = router;