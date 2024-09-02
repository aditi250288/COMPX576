const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
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

class User {
  constructor(user_id, username, email, password_hash, email_verified, created_at, spotify_id, spotify_access_token, spotify_refresh_token) {
    this.user_id = user_id;
    this.username = username;
    this.email = email;
    this.password_hash = password_hash;
    this.email_verified = email_verified;
    this.created_at = created_at;
    this.spotify_id = spotify_id;
    this.spotify_access_token = spotify_access_token;
    this.spotify_refresh_token = spotify_refresh_token;
  }
  
  static async verifyPassword(plainTextPassword, hashedPassword) {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  static async getAllUsers() {
    try {
      const [rows] = await pool.query('SELECT user_id, username, email, email_verified, created_at FROM users');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getUserById(id) {
    try {
      const [rows] = await pool.query('SELECT user_id, username, email, email_verified, created_at, spotify_id FROM users WHERE user_id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getUserByUsername(username) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async createUser(userData) {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      const [result] = await pool.query(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [userData.username, userData.email, hashedPassword]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(id, userData) {
    try {
      if (userData.password) {
        const saltRounds = 10;
        userData.password_hash = await bcrypt.hash(userData.password, saltRounds);
        delete userData.password;
      }
      const [result] = await pool.query('UPDATE users SET ? WHERE user_id = ?', [userData, id]);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  static async deleteUser(id) {
    try {
      const [result] = await pool.query('DELETE FROM users WHERE user_id = ?', [id]);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  static async verifyEmail(userId, verificationCode) {
    try {
      // You might want to check the verification code here
      const [result] = await pool.query('UPDATE users SET email_verified = TRUE WHERE user_id = ?', [userId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async getUserPlaylists(userId) {
    try {
      const [rows] = await pool.query('SELECT * FROM playlists WHERE user_id = ?', [userId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getUserLikes(userId) {
    try {
      const [rows] = await pool.query('SELECT * FROM likes WHERE user_id = ?', [userId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getUserBySpotifyId(spotifyId) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE spotify_id = ?', [spotifyId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async createUserFromSpotify(userData) {
    try {
      const [result] = await pool.query(
        'INSERT INTO users (username, email, spotify_id, spotify_access_token, spotify_refresh_token) VALUES (?, ?, ?, ?, ?)',
        [userData.username, userData.email, userData.spotifyId, userData.accessToken, userData.refreshToken]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async updateSpotifyTokens(userId, accessToken, refreshToken) {
    try {
      const [result] = await pool.query(
        'UPDATE users SET spotify_access_token = ?, spotify_refresh_token = ? WHERE user_id = ?',
        [accessToken, refreshToken, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async linkSpotifyAccount(userId, spotifyId, accessToken, refreshToken) {
    try {
      const [result] = await pool.query(
        'UPDATE users SET spotify_id = ?, spotify_access_token = ?, spotify_refresh_token = ? WHERE user_id = ?',
        [spotifyId, accessToken, refreshToken, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async unlinkSpotifyAccount(userId) {
    try {
      const [result] = await pool.query(
        'UPDATE users SET spotify_id = NULL, spotify_access_token = NULL, spotify_refresh_token = NULL WHERE user_id = ?',
        [userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async setSpotifyToken(userId, spotifyToken) {
    try {
      const [result] = await pool.query(
        'UPDATE users SET spotify_access_token = ? WHERE user_id = ?',
        [spotifyToken, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async getSpotifyToken(userId) {
    try {
      const [rows] = await pool.query(
        'SELECT spotify_access_token FROM users WHERE user_id = ?',
        [userId]
      );
      return rows[0] ? rows[0].spotify_access_token : null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;