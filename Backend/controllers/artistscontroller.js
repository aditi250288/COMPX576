// controllers/artistsController.js
const Artist = require('../models/artists');

exports.getAllArtists = async (req, res, next) => {
    try {
        const artists = await Artist.getAllArtists();
        res.json(artists);
    } catch (error) {
        console.error('Error fetching artists:', error);
        next(error);
    }
};

exports.getArtistById = async (req, res, next) => {
    try {
        const artist = await Artist.getArtistById(req.params.id);
        if (artist) {
            res.json(artist);
        } else {
            res.status(404).json({ message: "Artist not found" });
        }
    } catch (error) {
        console.error('Error fetching artist by ID:', error);
        next(error);
    }
};

exports.createArtist = async (req, res, next) => {
    try {
        const newArtistId = await Artist.createArtist(req.body);
        res.status(201).json({ message: "Artist created", id: newArtistId });
    } catch (error) {
        console.error('Error creating artist:', error);
        next(error);
    }
};

exports.updateArtist = async (req, res, next) => {
    try {
        const updated = await Artist.updateArtist(req.params.id, req.body);
        if (updated) {
            res.json({ message: "Artist updated" });
        } else {
            res.status(404).json({ message: "Artist not found" });
        }
    } catch (error) {
        console.error('Error updating artist:', error);
        next(error);
    }
};

exports.deleteArtist = async (req, res, next) => {
    try {
        const deleted = await Artist.deleteArtist(req.params.id);
        if (deleted) {
            res.json({ message: "Artist deleted" });
        } else {
            res.status(404).json({ message: "Artist not found" });
        }
    } catch (error) {
        console.error('Error deleting artist:', error);
        next(error);
    }
};