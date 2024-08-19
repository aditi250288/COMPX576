// C:\Users\Admin\Music Website\Backend\controllers\artistsController.js

exports.getAllArtists = (req, res) => {
    res.json({ message: "Get all artists" });
};

exports.getArtistById = (req, res) => {
    res.json({ message: "Get artist by ID" });
};

exports.createArtist = (req, res) => {
    res.json({ message: "Create a new artist" });
};

exports.updateArtist = (req, res) => {
    res.json({ message: "Update an artist" });
};

exports.deleteArtist = (req, res) => {
    res.json({ message: "Delete an artist" });
};