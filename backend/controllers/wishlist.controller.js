// controllers/wishlist.controller.js
const Wishlist = require('../models/wishlist.model');
const User = require('../models/user.model');
const { validationResult } = require('express-validator'); // For input validation
const logger = require('../utils/logger.utils'); // Assume you have a logger utility

// Add an influencer to the wishlist
exports.addToWishlist = async (req, res) => {
  const { user_id, profile_id } = req.body;

  // Input validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Check if the user exists
  const user = await User.findById(user_id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  try {
    const existingWishlistItem = await Wishlist.findOne({ user_id, profile_id });
    if (existingWishlistItem) {
      return res.status(400).json({ error: 'Profile already in wishlist' });
    }

    const newWishlistItem = new Wishlist({ user_id, profile_id });
    await newWishlistItem.save();

    logger.info(`Profile ${profile_id} added to wishlist for user ${user_id}`);
    res.status(201).json(newWishlistItem);
  } catch (err) {
    logger.error(`Error adding to wishlist: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

// Get a user's wishlist
exports.getWishlist = async (req, res) => {
  const { userId } = req.params;

  try {
    const wishlists = await Wishlist.find({ user_id: userId }).populate('profile_id');
    res.status(200).json(wishlists);
  } catch (err) {
    logger.error(`Error retrieving wishlist for user ${userId}: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

// Remove an influencer from the wishlist
exports.removeFromWishlist = async (req, res) => {
  const { userId, profileId } = req.params;

  try {
    const deletedItem = await Wishlist.findOneAndDelete({ user_id: userId, profile_id: profileId });
    if (!deletedItem) {
      return res.status(404).json({ error: 'Wishlist item not found' });
    }

    logger.info(`Profile ${profileId} removed from wishlist for user ${userId}`);
    res.status(204).json(); // No content
  } catch (err) {
    logger.error(`Error removing from wishlist: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

// Check if a profile is in the wishlist
exports.checkIfInWishlist = async (req, res) => {
  const { userId, profileId } = req.params;

  try {
    const item = await Wishlist.findOne({ user_id: userId, profile_id: profileId });
    if (item) {
      return res.status(200).json({ inWishlist: true });
    }
    res.status(200).json({ inWishlist: false });
  } catch (err) {
    logger.error(`Error checking wishlist for user ${userId}: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

// Clear a user's wishlist
exports.clearWishlist = async (req, res) => {
  const { userId } = req.params;

  try {
    await Wishlist.deleteMany({ user_id: userId });
    logger.info(`Wishlist cleared for user ${userId}`);
    res.status(204).json(); // No content
  } catch (err) {
    logger.error(`Error clearing wishlist for user ${userId}: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

// Get a wishlist item by ID
exports.getWishlistItemById = async (req, res) => {
  const { itemId } = req.params;

  try {
    const item = await Wishlist.findById(itemId).populate('profile_id');
    if (!item) {
      return res.status(404).json({ error: 'Wishlist item not found' });
    }
    res.status(200).json(item);
  } catch (err) {
    logger.error(`Error retrieving wishlist item ${itemId}: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

// Get the total count of wishlist items
exports.getWishlistItemCount = async (req, res) => {
  const { userId } = req.params;

  try {
    const count = await Wishlist.countDocuments({ user_id: userId });
    res.status(200).json({ count });
  } catch (err) {
    logger.error(`Error counting wishlist items for user ${userId}: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

// Update a wishlist item (if applicable)
exports.updateWishlistItem = async (req, res) => {
  const { itemId } = req.params;
  const updateData = req.body;

  try {
    const updatedItem = await Wishlist.findByIdAndUpdate(itemId, updateData, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ error: 'Wishlist item not found' });
    }
    logger.info(`Wishlist item ${itemId} updated`);
    res.status(200).json(updatedItem);
  } catch (err) {
    logger.error(`Error updating wishlist item ${itemId}: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};
