const express = require('express');
const {
  addBankAccount,
  getBankAccounts,
  updateBankAccount,
  deleteBankAccount
} = require('../controllers/bankAccountController');
const { protect } = require('../middleware/auth'); // Import the protect middleware

const router = express.Router();

// All routes below this point will use the 'protect' middleware,
// ensuring only authenticated users can access them.

router.route('/')
  .post(protect, addBankAccount)      // POST /api/bank-accounts to add a new account
  .get(protect, getBankAccounts);     // GET /api/bank-accounts to get all accounts for the user

router.route('/:id')
  .put(protect, updateBankAccount)    // PUT /api/bank-accounts/:id to update a specific account
  .delete(protect, deleteBankAccount); // DELETE /api/bank-accounts/:id to delete a specific account

module.exports = router;