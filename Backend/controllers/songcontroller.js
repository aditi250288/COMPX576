// C:\Users\Admin\Music Website\Backend\controllers\songsController.js

exports.getAllSongs = (req, res) => {
    res.json({ message: "Get all songs" });
};

exports.getSongById = (req, res) => {
    res.json({ message: "Get song by ID" });
};

exports.createSong = (req, res) => {
    res.json({ message: "Create a new song" });
};

exports.updateSong = (req, res) => {
    res.json({ message: "Update a song" });
};

exports.deleteSong = (req, res) => {
    res.json({ message: "Delete a song" });
};