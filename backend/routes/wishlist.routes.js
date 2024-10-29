// routes/wishlist.routes.js
const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validateWishlistItem } = require('../middleware/validation.middleware');
const logger = require('../utils/logger.utils'); // Assume there's a logger utility for logging actions

// Middleware to log requests
router.use((req, res, next) => {
  logger.info(`Request: ${req.method} ${req.originalUrl}`);
  next();
});

// Add an influencer to the wishlist
router.post(
  '/',
  authMiddleware.authenticate, // Ensure user is authenticated
  validateWishlistItem,         // Validate input
  async (req, res) => {
    try {
      const wishlistItem = await wishlistController.addToWishlist(req, res);
      logger.info(`Added to wishlist: ${wishlistItem._id}`);
      res.status(201).json(wishlistItem);
    } catch (error) {
      logger.error(`Error adding to wishlist: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }
);

// Get a user's wishlist
router.get(
  '/:userId',
  authMiddleware.authenticate, // Ensure user is authenticated
  async (req, res) => {
    try {
      const wishlist = await wishlistController.getWishlist(req, res);
      res.status(200).json(wishlist);
    } catch (error) {
      logger.error(`Error fetching wishlist: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }
);

// Remove an influencer from the wishlist
router.delete(
  '/:userId/:profileId',
  authMiddleware.authenticate, // Ensure user is authenticated
  async (req, res) => {
    try {
      await wishlistController.removeFromWishlist(req, res);
      logger.info(`Removed from wishlist: User ${req.params.userId}, Profile ${req.params.profileId}`);
      res.status(204).send(); // No content
    } catch (error) {
      logger.error(`Error removing from wishlist: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }
);

// Export the router
module.exports = router;
