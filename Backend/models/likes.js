const pool = require('../config/database');

class Like {
  static async addLike(userId, songId, albumId, playlistId) {
    const [result] = await pool.query(
      'INSERT INTO likes (user_id, song_id, album_id, playlist_id) VALUES (?, ?, ?, ?)',
      [userId, songId, albumId, playlistId]
    );
    return result.insertId;
  }

  static async removeLike(userId, songId, albumId, playlistId) {
    const [result] = await pool.query(
      'DELETE FROM likes WHERE user_id = ? AND song_id = ? AND album_id = ? AND playlist_id = ?',
      [userId, songId, albumId, playlistId]
    );
    return result.affectedRows;
  }

  static async getLikesByUser(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM likes WHERE user_id = ?',
      [userId]
    );
    return rows;
  }

  static async getLikesBySong(songId) {
    const [rows] = await pool.query(
      'SELECT * FROM likes WHERE song_id = ?',
      [songId]
    );
    return rows;
  }

  static async getLikesByAlbum(albumId) {
    const [rows] = await pool.query(
      'SELECT * FROM likes WHERE album_id = ?',
      [albumId]
    );
    return rows;
  }

  static async getLikesByPlaylist(playlistId) {
    const [rows] = await pool.query(
      'SELECT * FROM likes WHERE playlist_id = ?',
      [playlistId]
    );
    return rows;
  }

  static async checkLikeExists(userId, songId, albumId, playlistId) {
    const [rows] = await pool.query(
      'SELECT * FROM likes WHERE user_id = ? AND song_id = ? AND album_id = ? AND playlist_id = ?',
      [userId, songId, albumId, playlistId]
    );
    return rows.length > 0;
  }

  static async getLikesCount(songId, albumId, playlistId) {
    let query = 'SELECT COUNT(*) as count FROM likes WHERE ';
    let params = [];

    if (songId) {
      query += 'song_id = ?';
      params.push(songId);
    } else if (albumId) {
      query += 'album_id = ?';
      params.push(albumId);
    } else if (playlistId) {
      query += 'playlist_id = ?';
      params.push(playlistId);
    } else {
      throw new Error('At least one of songId, albumId, or playlistId must be provided');
    }

    const [result] = await pool.query(query, params);
    return result[0].count;
  }
}

module.exports = Like;