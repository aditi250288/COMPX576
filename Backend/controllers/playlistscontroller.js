// C:\Users\Admin\Music Website\Backend\controllers\playlistsController.js

const db = require('../config/database');

// Get all playlists
exports.getAllPlaylists = async (req, res) => {
    try {
        const [playlists] = await db.query('SELECT * FROM playlists');
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching playlists', error: error.message });
    }
};

// Get playlist by ID
exports.getPlaylistById = async (req, res) => {
    const { id } = req.params;
    try {
        const [playlist] = await db.query('SELECT * FROM playlists WHERE id = ?', [id]);
        if (playlist.length === 0) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        res.json(playlist[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching playlist', error: error.message });
    }
};

// Create new playlist
exports.createPlaylist = async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user.id; // Assuming the user ID is attached to the request by the auth middleware
    try {
        const [result] = await db.query(
            'INSERT INTO playlists (name, description, user_id) VALUES (?, ?, ?)',
            [name, description, userId]
        );
        res.status(201).json({ message: 'Playlist created successfully', playlistId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating playlist', error: error.message });
    }
};

// Update playlist
exports.updatePlaylist = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE playlists SET name = ?, description = ? WHERE id = ? AND user_id = ?',
            [name, description, id, req.user.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Playlist not found or you do not have permission to update it' });
        }
        res.json({ message: 'Playlist updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating playlist', error: error.message });
    }
};

// Delete playlist
exports.deletePlaylist = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM playlists WHERE id = ? AND user_id = ?', [id, req.user.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Playlist not found or you do not have permission to delete it' });
        }
        res.json({ message: 'Playlist deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting playlist', error: error.message });
    }
};

// Add song to playlist
exports.addSongToPlaylist = async (req, res) => {
    const { id } = req.params;
    const { songId } = req.body;
    try {
        // First, check if the user owns the playlist
        const [playlist] = await db.query('SELECT * FROM playlists WHERE id = ? AND user_id = ?', [id, req.user.id]);
        if (playlist.length === 0) {
            return res.status(403).json({ message: 'You do not have permission to modify this playlist' });
        }
        
        await db.query(
            'INSERT INTO playlist_songs (playlist_id, song_id) VALUES (?, ?)',
            [id, songId]
        );
        res.status(201).json({ message: 'Song added to playlist successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding song to playlist', error: error.message });
    }
};

// Remove song from playlist
exports.removeSongFromPlaylist = async (req, res) => {
    const { id, songId } = req.params;
    try {
        // First, check if the user owns the playlist
        const [playlist] = await db.query('SELECT * FROM playlists WHERE id = ? AND user_id = ?', [id, req.user.id]);
        if (playlist.length === 0) {
            return res.status(403).json({ message: 'You do not have permission to modify this playlist' });
        }

        await db.query(
            'DELETE FROM playlist_songs WHERE playlist_id = ? AND song_id = ?',
            [id, songId]
        );
        res.json({ message: 'Song removed from playlist successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing song from playlist', error: error.message });
    }
};

// Get all songs in a playlist
exports.getPlaylistSongs = async (req, res) => {
    const { id } = req.params;
    try {
        const [songs] = await db.query(
            `SELECT s.* FROM songs s
             JOIN playlist_songs ps ON s.id = ps.song_id
             WHERE ps.playlist_id = ?`,
            [id]
        );
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching playlist songs', error: error.message });
    }
};