const mongoose = require('mongoose');

const BankAccountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId, // This creates a reference to another document's ID
    ref: 'User', // This tells Mongoose which model to use during population
    required: true
  },
  ifscCode: {
    type: String,
    required: [true, 'Please add an IFSC Code'],
    trim: true,
    uppercase: true, // IFSC codes are typically uppercase
    match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Please add a valid IFSC Code'] // Basic IFSC format validation
  },
  branchName: {
    type: String,
    required: [true, 'Please add a branch name'],
    trim: true,
    maxlength: [100, 'Branch name can not be more than 100 characters']
  },
  bankName: {
    type: String,
    required: [true, 'Please add a bank name'],
    trim: true,
    maxlength: [100, 'Bank name can not be more than 100 characters']
  },
  accountNumber: {
    type: String,
    required: [true, 'Please add an account number'],
    unique: false, // Not unique globally, but unique per user is handled in logic
    trim: true,
    minlength: [9, 'Account number must be at least 9 digits'],
    maxlength: [18, 'Account number can not be more than 18 digits'],
    match: [/^[0-9]+$/, 'Account number must contain only digits'] // Only digits
  },
  accountHolderName: {
    type: String,
    required: [true, 'Please add the account holder\'s name'],
    trim: true,
    maxlength: [100, 'Account holder name can not be more than 100 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BankAccount', BankAccountSchema);