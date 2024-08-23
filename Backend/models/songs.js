// songs.js
const pool = require('../config/database');

class Song {
  constructor(song_id, song_title, album_id, artist_id, url, duration, release_date, playlist_id) {
    this.song_id = song_id;
    this.song_title = song_title;
    this.album_id = album_id;
    this.artist_id = artist_id;
    this.url = url;
    this.duration = duration;
    this.release_date = release_date;
    this.playlist_id = playlist_id;
  }

  static async getAllSongs() {
    try {
      const [rows] = await pool.query('SELECT * FROM songs');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getSongById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM songs WHERE song_id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async createSong(songData) {
    try {
      const [result] = await pool.query('INSERT INTO songs SET ?', songData);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async updateSong(id, songData) {
    try {
      const [result] = await pool.query('UPDATE songs SET ? WHERE song_id = ?', [songData, id]);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  static async deleteSong(id) {
    try {
      const [result] = await pool.query('DELETE FROM songs WHERE song_id = ?', [id]);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  static async searchSongsByTitle(title) {
    try {
      const [rows] = await pool.query('SELECT * FROM songs WHERE song_title LIKE ?', [`%${title}%`]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getSongsByArtist(artistId) {
    try {
      const [rows] = await pool.query('SELECT * FROM songs WHERE artist_id = ?', [artistId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getSongsByAlbum(albumId) {
    try {
      const [rows] = await pool.query('SELECT * FROM songs WHERE album_id = ?', [albumId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getSongsByPlaylist(playlistId) {
    try {
      const [rows] = await pool.query('SELECT * FROM songs WHERE playlist_id = ?', [playlistId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Song;