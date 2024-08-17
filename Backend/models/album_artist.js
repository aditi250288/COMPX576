const pool = require('../database');

class AlbumArtist {
  static async getAlbumsByArtist(artistId) {
    const [rows] = await pool.query(
      'SELECT a.* FROM albums a JOIN album_artists aa ON a.album_id = aa.album_id WHERE aa.artist_id = ?',
      [artistId]
    );
    return rows;
  }

  static async getArtistsByAlbum(albumId) {
    const [rows] = await pool.query(
      'SELECT ar.* FROM artists ar JOIN album_artists aa ON ar.artist_id = aa.artist_id WHERE aa.album_id = ?',
      [albumId]
    );
    return rows;
  }

  static async addArtistToAlbum(artistId, albumId) {
    try {
      const [result] = await pool.query(
        'INSERT INTO album_artists (artist_id, album_id) VALUES (?, ?)',
        [artistId, albumId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // The relationship already exists
        return false;
      }
      throw error;
    }
  }

  static async removeArtistFromAlbum(artistId, albumId) {
    const [result] = await pool.query(
      'DELETE FROM album_artists WHERE artist_id = ? AND album_id = ?',
      [artistId, albumId]
    );
    return result.affectedRows > 0;
  }

  static async getAlbumArtistRelationships() {
    const [rows] = await pool.query(
      'SELECT aa.*, a.album_name, ar.artist_name FROM album_artists aa ' +
      'JOIN albums a ON aa.album_id = a.album_id ' +
      'JOIN artists ar ON aa.artist_id = ar.artist_id'
    );
    return rows;
  }

  static async isArtistOnAlbum(artistId, albumId) {
    const [rows] = await pool.query(
      'SELECT * FROM album_artists WHERE artist_id = ? AND album_id = ?',
      [artistId, albumId]
    );
    return rows.length > 0;
  }
}

module.exports = AlbumArtist;