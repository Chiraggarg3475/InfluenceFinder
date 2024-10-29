// models/user.model.js
const mongoose = require('mongoose');

// User schema definition
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensure unique usernames
    trim: true,
  },
  password_hash: {
    type: String,
    required: true,
  },
  user_type: {
    type: String,
    enum: ['influencer', 'company'], // Allowed user types
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure unique email addresses
    lowercase: true, // Convert email to lowercase
    trim: true,
  },
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

// Export the User model
module.exports = mongoose.model('User', userSchema);
