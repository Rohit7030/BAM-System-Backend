const express = require('express');
const { getAllUserBankAccounts } = require('../controllers/adminController');
const { protect } = require('../middleware/auth'); // Import the base authentication middleware
const { authorizeAdmin } = require('../middleware/adminAuth'); // Import the admin authorization middleware

const router = express.Router();

// All admin routes will be prefixed with /api/admin
// They require both:
// 1. A valid JWT token (protect middleware)
// 2. The user role to be 'admin' (authorizeAdmin middleware)

router.route('/bank-accounts')
  .get(protect, authorizeAdmin, getAllUserBankAccounts); // GET /api/admin/bank-accounts

// You could add more admin-specific routes here in the future
// e.g., router.route('/users').get(protect, authorizeAdmin, getUsers);
// e.g., router.route('/users/:id').delete(protect, authorizeAdmin, deleteUser);

module.exports = router;