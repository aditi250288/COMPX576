const jwt = require('jsonwebtoken');

// New function to generate JWT token
exports.generateToken = (user) => {
  const payload = {
    userId: user.id,
    username: user.username
    // Add any other non-sensitive user information you want to include
  };

  const options = {
    expiresIn: '1h' // Token expires in 1 hour
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

// Your existing authenticateToken function
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Your existing validateInput function
exports.validateInput = (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  // Basic password strength check
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }
  next();
};