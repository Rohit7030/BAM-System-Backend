const jwt = require('jsonwebtoken');
const User = require('../models/User'); // We might need to fetch the user to ensure they still exist

// This middleware protects routes by verifying JWT
const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (format: "Bearer TOKEN")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to the request (without password)
      // We explicitly select the password here because the schema has `select: false`
      // But we then remove it from the attached user object. This ensures the user exists.
      req.user = await User.findById(decoded.id).select('-password');

      // Check if user exists after decoding (important for deleted users)
      if (!req.user) {
        return res.status(401).json({ msg: 'Not authorized, user not found' });
      }

      next(); // Move to the next middleware/route handler

    } catch (error) {
      console.error(error.message);
      // If token is invalid or expired
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ msg: 'Not authorized, token expired' });
      }
      return res.status(401).json({ msg: 'Not authorized, token failed' });
    }
  }

  // If no token is found
  if (!token) {
    return res.status(401).json({ msg: 'Not authorized, no token' });
  }
};

module.exports = { protect };