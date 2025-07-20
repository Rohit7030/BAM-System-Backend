const BankAccount = require('../models/BankAccount');
const User = require('../models/User'); // Required if we need to check user existence or role, though auth middleware handles most of it.

// @desc    Add a new bank account
// @route   POST /api/bank-accounts
// @access  Private (User)
exports.addBankAccount = async (req, res) => {
  const { ifscCode, branchName, bankName, accountNumber, accountHolderName } = req.body;

  try {
    // The user ID comes from the `req.user.id` set by the `protect` middleware
    const userId = req.user.id;

    // Check if an account with the same account number already exists for this user
    const existingAccount = await BankAccount.findOne({ user: userId, accountNumber });
    if (existingAccount) {
      // While assignment says "Multiple Account Support" (which means multiple accounts per user),
      // it's generally good practice to prevent duplicate account numbers for the *same* user.
      // Adjust this logic if the intent is to allow truly identical accounts (unlikely).
      return res.status(400).json({ msg: 'Bank account with this number already exists for this user' });
    }

    const newBankAccount = new BankAccount({
      user: userId,
      ifscCode,
      branchName,
      bankName,
      accountNumber,
      accountHolderName
    });

    await newBankAccount.save();

    res.status(201).json({
      success: true,
      data: newBankAccount
    });

  } catch (error) {
    console.error(error.message);
    // Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ msg: messages.join(', ') });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Get all bank accounts for the logged-in user
// @route   GET /api/bank-accounts
// @access  Private (User)
exports.getBankAccounts = async (req, res) => {
  try {
    // The user ID comes from the `req.user.id` set by the `protect` middleware
    const bankAccounts = await BankAccount.find({ user: req.user.id }).sort({ createdAt: -1 }); // Sort by newest first

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

// @desc    Update a specific bank account
// @route   PUT /api/bank-accounts/:id
// @access  Private (User)
exports.updateBankAccount = async (req, res) => {
  const { id } = req.params; // Bank account ID from URL
  const userId = req.user.id; // User ID from authenticated request

  try {
    let bankAccount = await BankAccount.findById(id);

    if (!bankAccount) {
      return res.status(404).json({ msg: 'Bank account not found' });
    }

    // Ensure the logged-in user owns the bank account
    if (bankAccount.user.toString() !== userId) {
      return res.status(401).json({ msg: 'Not authorized to update this bank account' });
    }

    // Update fields from req.body
    bankAccount = await BankAccount.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true // Run schema validators on update
      }
    );

    res.status(200).json({
      success: true,
      data: bankAccount
    });

  } catch (error) {
    console.error(error.message);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ msg: messages.join(', ') });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a specific bank account
// @route   DELETE /api/bank-accounts/:id
// @access  Private (User)
exports.deleteBankAccount = async (req, res) => {
  const { id } = req.params; // Bank account ID from URL
  const userId = req.user.id; // User ID from authenticated request

  try {
    const bankAccount = await BankAccount.findById(id);

    if (!bankAccount) {
      return res.status(404).json({ msg: 'Bank account not found' });
    }

    // Ensure the logged-in user owns the bank account
    if (bankAccount.user.toString() !== userId) {
      return res.status(401).json({ msg: 'Not authorized to delete this bank account' });
    }

    await bankAccount.deleteOne(); // Mongoose 6+ prefers deleteOne() or deleteMany()

    res.status(200).json({
      success: true,
      msg: 'Bank account removed'
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};