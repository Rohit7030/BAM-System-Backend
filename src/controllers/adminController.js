const BankAccount = require('../models/BankAccount');
const User = require('../models/User'); // Needed to populate user details for filtering by username/email

// @desc    Get all bank accounts with optional filtering and search
// @route   GET /api/admin/bank-accounts
// @access  Private (Admin Only)
exports.getAllUserBankAccounts = async (req, res) => {
  try {
    const { username, bankName, ifscCode, email } = req.query; // Get query parameters for filtering

    let query = {}; // Build query object for MongoDB

    // Add filters based on query parameters
    if (bankName) {
      query.bankName = { $regex: bankName, $options: 'i' }; // Case-insensitive search
    }
    if (ifscCode) {
      query.ifscCode = { $regex: ifscCode, $options: 'i' }; // Case-insensitive search
    }

    // Handle user-specific filters (username, email) - requires population
    let userQuery = {};
    if (username) {
      userQuery.username = { $regex: username, $options: 'i' };
    }
    if (email) {
      userQuery.email = { $regex: email, $options: 'i' };
    }

    let bankAccounts;

    if (Object.keys(userQuery).length > 0) {
      // If filtering by user details, first find users matching the criteria
      const users = await User.find(userQuery).select('_id'); // Only need their IDs
      const userIds = users.map(user => user._id);

      if (userIds.length === 0) {
        // No users found matching the criteria, so no bank accounts
        return res.status(200).json({ success: true, count: 0, data: [] });
      }
      query.user = { $in: userIds }; // Filter bank accounts by these user IDs
    }

    // Find bank accounts, populate user details for displaying username/email
    bankAccounts = await BankAccount.find(query)
      .populate('user', 'username email') // Populate 'user' field, selecting only 'username' and 'email'
      .sort({ createdAt: -1 }); // Sort by creation date, newest first

    res.status(200).json({
      success: true,
      count: bankAccounts.length,
      data: bankAccounts
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};