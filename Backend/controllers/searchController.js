// backend/controllers/searchController.js
const mysql = require('mysql2/promise');

// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

exports.search = async (req, res) => {
  const { query } = req.query;
  
  try {
    const [results] = await pool.query(`
      SELECT 'song' AS type, song_id AS id, song_title AS name FROM songs WHERE song_title LIKE ?
      UNION ALL
      SELECT 'album' AS type, album_id AS id, album_name AS name FROM albums WHERE album_name LIKE ?
      UNION ALL
      SELECT 'artist' AS type, artist_id AS id, artist_name AS name FROM artists WHERE artist_name LIKE ?
      UNION ALL
      SELECT 'playlist' AS type, playlist_id AS id, playlist_name AS name FROM playlists WHERE playlist_name LIKE ?
    `, [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]);
    
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'An error occurred while searching' });
  }
};