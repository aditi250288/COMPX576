// C:\Users\Admin\Music Website\Backend\controllers\albumController.js

const db = require('../config/database');

// Get all albums
exports.getAllAlbums = async (req, res) => {
    try {
        const [albums] = await db.query('SELECT * FROM albums');
        res.json(albums);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching albums', error: error.message });
    }
};

// Get album by ID
exports.getAlbumById = async (req, res) => {
    const { id } = req.params;
    try {
        const [album] = await db.query('SELECT * FROM albums WHERE id = ?', [id]);
        if (album.length === 0) {
            return res.status(404).json({ message: 'Album not found' });
        }
        res.json(album[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching album', error: error.message });
    }
};

// Create new album
exports.createAlbum = async (req, res) => {
    const { title, artist_id, release_date, genre } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO albums (title, artist_id, release_date, genre) VALUES (?, ?, ?, ?)',
            [title, artist_id, release_date, genre]
        );
        res.status(201).json({ message: 'Album created successfully', albumId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating album', error: error.message });
    }
};

// Update album
exports.updateAlbum = async (req, res) => {
    const { id } = req.params;
    const { title, artist_id, release_date, genre } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE albums SET title = ?, artist_id = ?, release_date = ?, genre = ? WHERE id = ?',
            [title, artist_id, release_date, genre, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Album not found' });
        }
        res.json({ message: 'Album updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating album', error: error.message });
    }
};

// Delete album
exports.deleteAlbum = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM albums WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Album not found' });
        }
        res.json({ message: 'Album deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting album', error: error.message });
    }
};