// models/wishlist.model.js
const mongoose = require('mongoose');

// Wishlist schema definition
const wishlistSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  profile_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InfluencerProfile', // Reference to the InfluencerProfile model
    required: true,
  },
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

// Export the Wishlist model
module.exports = mongoose.model('Wishlist', wishlistSchema);
