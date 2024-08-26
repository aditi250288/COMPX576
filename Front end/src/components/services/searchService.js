import axios from 'axios';

const BASE_URL = 'http://localhost:3000'; // adjust this to match your backend URL

export const searchService = {
  search: async (query) => {
    try {
      const response = await axios.get(`${BASE_URL}/search`, { params: { query } });
      return response.data;
    } catch (error) {
      console.error('Error in search service:', error);
      throw error;
    }
  },
};