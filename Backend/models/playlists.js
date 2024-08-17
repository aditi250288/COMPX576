const pool = require('../database');

class Playlist {
  static async createPlaylist(playlistName, userId, image) {
    const dCreated = new Date().toISOString().slice(0, 10); // Current date in YYYY-MM-DD format
    const [result] = await pool.query(
      'INSERT INTO playlists (playlist_name, user_id, image, d_created) VALUES (?, ?, ?, ?)',
      [playlistName, userId, image, dCreated]
    );
    return result.insertId;
  }

  static async getPlaylistsByUser(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM playlists WHERE user_id = ?',
      [userId]
    );
    return rows;
  }

  static async getPlaylistById(playlistId) {
    const [rows] = await pool.query(
      'SELECT * FROM playlists WHERE playlist_id = ?',
      [playlistId]
    );
    return rows[0];
  }

  static async updatePlaylist(playlistId, playlistName, image) {
    const [result] = await pool.query(
      'UPDATE playlists SET playlist_name = ?, image = ? WHERE playlist_id = ?',
      [playlistName, image, playlistId]
    );
    return result.affectedRows;
  }

  static async deletePlaylist(playlistId) {
    const [result] = await pool.query(
      'DELETE FROM playlists WHERE playlist_id = ?',
      [playlistId]
    );
    return result.affectedRows;
  }

  static async getAllPlaylists() {
    const [rows] = await pool.query('SELECT * FROM playlists');
    return rows;
  }

  // Additional function to get playlists with user information
  static async getPlaylistsWithUserInfo() {
    const [rows] = await pool.query(`
      SELECT p.*, u.username 
      FROM playlists p 
      JOIN users u ON p.user_id = u.user_id
    `);
    return rows;
  }

  // Function to add a song to a playlist (assuming you have a playlist_songs table)
  static async addSongToPlaylist(playlistId, songId) {
    const [result] = await pool.query(
      'INSERT INTO playlist_songs (playlist_id, song_id) VALUES (?, ?)',
      [playlistId, songId]
    );
    return result.insertId;
  }

  // Function to remove a song from a playlist
  static async removeSongFromPlaylist(playlistId, songId) {
    const [result] = await pool.query(
      'DELETE FROM playlist_songs WHERE playlist_id = ? AND song_id = ?',
      [playlistId, songId]
    );
    return result.affectedRows;
  }

  // Function to get all songs in a playlist
  static async getSongsInPlaylist(playlistId) {
    const [rows] = await pool.query(`
      SELECT s.* 
      FROM songs s 
      JOIN playlist_songs ps ON s.song_id = ps.song_id 
      WHERE ps.playlist_id = ?
    `, [playlistId]);
    return rows;
  }
}

module.exports = Playlist;