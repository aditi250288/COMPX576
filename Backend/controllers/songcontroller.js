// songController.js
const Song = require('../models/songs');

exports.getAllSongs = async (req, res) => {
    try {
        const songs = await Song.getAllSongs();
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching songs", error: error.message });
    }
};

exports.getSongById = async (req, res) => {
    try {
        const song = await Song.getSongById(req.params.id);
        if (song) {
            res.json(song);
        } else {
            res.status(404).json({ message: "Song not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching song", error: error.message });
    }
};

exports.createSong = async (req, res) => {
    try {
        const newSongId = await Song.createSong(req.body);
        res.status(201).json({ message: "Song created", songId: newSongId });
    } catch (error) {
        res.status(500).json({ message: "Error creating song", error: error.message });
    }
};

exports.updateSong = async (req, res) => {
    try {
        const affectedRows = await Song.updateSong(req.params.id, req.body);
        if (affectedRows > 0) {
            res.json({ message: "Song updated successfully" });
        } else {
            res.status(404).json({ message: "Song not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating song", error: error.message });
    }
};

exports.deleteSong = async (req, res) => {
    try {
        const affectedRows = await Song.deleteSong(req.params.id);
        if (affectedRows > 0) {
            res.json({ message: "Song deleted successfully" });
        } else {
            res.status(404).json({ message: "Song not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting song", error: error.message });
    }
};

exports.searchSongsByTitle = async (req, res) => {
    try {
        const songs = await Song.searchSongsByTitle(req.params.title);
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: "Error searching songs", error: error.message });
    }
};

exports.getSongsByArtist = async (req, res) => {
    try {
        const songs = await Song.getSongsByArtist(req.params.artistId);
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching songs by artist", error: error.message });
    }
};

exports.getSongsByAlbum = async (req, res) => {
    try {
        const songs = await Song.getSongsByAlbum(req.params.albumId);
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching songs by album", error: error.message });
    }
};

exports.getSongsByPlaylist = async (req, res) => {
    try {
        const songs = await Song.getSongsByPlaylist(req.params.playlistId);
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching songs by playlist", error: error.message });
    }
};