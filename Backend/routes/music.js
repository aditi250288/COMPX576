// routes/amazonMusic.js
const express = require('express');
const router = express.Router();
const amazonMusicController = require('../controllers/amazonMusicController');

router.get('/tracks/:trackId', amazonMusicController.getTrackInfo);
router.get('/search', amazonMusicController.searchTracks);

module.exports = router;