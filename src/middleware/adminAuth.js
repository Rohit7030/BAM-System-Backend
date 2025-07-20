// This middleware ensures that only users with the 'admin' role can access the route.
const authorizeAdmin = (req, res, next) => {
  // The 'req.user' object is populated by the 'protect' middleware.
  // It contains the user's ID and role (e.g., { id: '...', role: 'user'/'admin' }).

  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Forbidden: You do not have admin access' });
  }
  next(); // If the user is an admin, proceed to the next middleware/route handler
};

module.exports = { authorizeAdmin };