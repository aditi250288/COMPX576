const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { authenticateToken, validateInput, generateToken } = require('../middleware/auth');

router.get('/', authenticateToken, async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

router.post('/register', validateInput, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    const userId = await User.createUser({ username, email, password });
    res.status(201).json({ message: 'User created successfully', userId });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.getUserByUsername(username);
    
    if (!user || !await User.verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = generateToken(user);

    res.json({ message: 'Login successful', token, userId: user.id });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

module.exports = router;