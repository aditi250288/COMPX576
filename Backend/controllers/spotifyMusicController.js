// C:\Users\Admin\Music Website\Backend\controllers\musicApi.js

const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

// Spotify API setup
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

const refreshSpotifyAccessToken = async () => {
  try {
    const data = await spotifyApi.refreshAccessToken();
    spotifyApi.setAccessToken(data.body['access_token']);
  } catch (error) {
    console.error('Error refreshing Spotify access token:', error);
    throw error;
  }
};

const spotifyApiRequest = async (apiCall) => {
  try {
    return await apiCall();
  } catch (error) {
    if (error.statusCode === 401) {
      await refreshSpotifyAccessToken();
      return await apiCall();
    }
    throw error;
  }
};

// Spotify API methods
exports.getTrackInfo = async (req, res) => {
  try {
    const data = await spotifyApiRequest(() => spotifyApi.getTrack(req.params.trackId));
    res.json(data.body);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.searchTracks = async (req, res) => {
  try {
    const data = await spotifyApiRequest(() => spotifyApi.searchTracks(req.query.q));
    res.json(data.body);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCurrentlyPlaying = async (req, res) => {
  try {
    const data = await spotifyApiRequest(() => spotifyApi.getMyCurrentPlayingTrack());
    res.json(data.body);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.play = async (req, res) => {
  try {
    await spotifyApiRequest(() => spotifyApi.play());
    res.json({ message: 'Playback started' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.pause = async (req, res) => {
  try {
    await spotifyApiRequest(() => spotifyApi.pause());
    res.json({ message: 'Playback paused' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.nextTrack = async (req, res) => {
  try {
    await spotifyApiRequest(() => spotifyApi.skipToNext());
    res.json({ message: 'Skipped to next track' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.previousTrack = async (req, res) => {
  try {
    await spotifyApiRequest(() => spotifyApi.skipToPrevious());
    res.json({ message: 'Skipped to previous track' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserPlaylists = async (req, res) => {
  try {
    const data = await spotifyApiRequest(() => spotifyApi.getUserPlaylists());
    res.json(data.body);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPlaylistTracks = async (req, res) => {
  try {
    const data = await spotifyApiRequest(() => spotifyApi.getPlaylistTracks(req.params.playlistId));
    res.json(data.body);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};