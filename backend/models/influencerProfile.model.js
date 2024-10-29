// models/influencerProfile.model.js
const mongoose = require('mongoose');

// Influencer Profile schema definition
const influencerProfileSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 0, // Minimum age limit
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other'], // Allowed values for gender
  },
  location: {
    type: String,
    required: true,
    trim: true, // Trim whitespace
  },
  followers: {
    type: Number,
    required: true,
    min: 0, // Minimum followers count
  },
  languages: [{
    type: String,
    required: true,
  }],
  categories: [{
    type: String,
    required: true,
  }],
  profile_photo: {
    type: String,
    required: true,
  },
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

// Export the InfluencerProfile model
module.exports = mongoose.model('InfluencerProfile', influencerProfileSchema);
