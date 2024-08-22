// C:\Users\Admin\Music Website\Backend\controllers\likeController.js

const db = require('../config/database'); // Adjust the path as needed

// Get all likes for a user
exports.getLikesByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const [likes] = await db.query(
            'SELECT * FROM likes WHERE user_id = ?',
            [userId]
        );
        res.json(likes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user likes', error: error.message });
    }
};

// Add a like
exports.addLike = async (req, res) => {
    const { userId, itemType, itemId } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO likes (user_id, item_type, item_id) VALUES (?, ?, ?)',
            [userId, itemType, itemId]
        );
        res.status(201).json({ message: 'Like added successfully', likeId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error adding like', error: error.message });
    }
};

// Remove a like
exports.removeLike = async (req, res) => {
    const { userId, itemType, itemId } = req.body;
    try {
        await db.query(
            'DELETE FROM likes WHERE user_id = ? AND item_type = ? AND item_id = ?',
            [userId, itemType, itemId]
        );
        res.json({ message: 'Like removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing like', error: error.message });
    }
};

// Get likes for a specific item (song, album, or playlist)
exports.getLikesForItem = async (req, res) => {
    const { itemType, itemId } = req.params;
    try {
        const [likes] = await db.query(
            'SELECT * FROM likes WHERE item_type = ? AND item_id = ?',
            [itemType, itemId]
        );
        res.json(likes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching likes for item', error: error.message });
    }
};