// models/artists.js
const db = require('../config/database');

class Artist {
    static async getAllArtists() {
        const [rows] = await db.query('SELECT * FROM artists');
        return rows;
    }

    static async getArtistById(id) {
        const [rows] = await db.query('SELECT * FROM artists WHERE artist_id = ?', [id]);
        return rows[0];
    }

    static async createArtist(artistData) {
        const [result] = await db.query('INSERT INTO artists SET ?', artistData);
        return result.insertId;
    }

    static async updateArtist(id, artistData) {
        const [result] = await db.query('UPDATE artists SET ? WHERE artist_id = ?', [artistData, id]);
        return result.affectedRows > 0;
    }

    static async deleteArtist(id) {
        const [result] = await db.query('DELETE FROM artists WHERE artist_id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Artist;