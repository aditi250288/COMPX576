// controllers/amazonMusicApi.js
const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'https://api.music.amazon.com/v1';

const amazonMusicApiRequest = async (endpoint, method = 'GET', data = null) => {
  try {
    const response = await axios({
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'x-api-key': process.env.AMAZON_API_KEY,
        'Authorization': `Bearer ${process.env.AMAZON_AUTH_TOKEN}`
      },
      data
    });
    return response.data;
  } catch (error) {
    console.error('Amazon Music API Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

exports.getTrackInfo = async (trackId) => {
  return amazonMusicApiRequest(`/tracks/${trackId}`);
};

exports.searchTracks = async (term) => {
  return amazonMusicApiRequest(`/search?term=${encodeURIComponent(term)}&type=track`);
};

// Add more API methods as needed