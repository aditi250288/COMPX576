// models/Album.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

class Album {
  constructor(album_id, album_name, artist_id, release_date, total_songs, image, genre, popularity) {
    this.album_id = album_id;
    this.album_name = album_name;
    this.artist_id = artist_id;
    this.release_date = release_date;
    this.total_songs = total_songs;
    this.image = image;
    this.genre = genre;
    this.popularity = popularity;
  }

  static async getAllAlbums() {
    try {
      const [rows] = await pool.query('SELECT * FROM albums');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getAlbumById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM albums WHERE album_id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async createAlbum(albumData) {
    try {
      const [result] = await pool.query('INSERT INTO albums SET ?', albumData);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async updateAlbum(id, albumData) {
    try {
      const [result] = await pool.query('UPDATE albums SET ? WHERE album_id = ?', [albumData, id]);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  static async deleteAlbum(id) {
    try {
      const [result] = await pool.query('DELETE FROM albums WHERE album_id = ?', [id]);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  static async getAlbumsByArtist(artistId) {
    try {
      const [rows] = await pool.query('SELECT * FROM albums WHERE artist_id = ?', [artistId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getAlbumsByGenre(genre) {
    try {
      const [rows] = await pool.query('SELECT * FROM albums WHERE genre = ?', [genre]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getMostPopularAlbums(limit = 10) {
    try {
      const [rows] = await pool.query('SELECT * FROM albums ORDER BY popularity DESC LIMIT ?', [limit]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Album;