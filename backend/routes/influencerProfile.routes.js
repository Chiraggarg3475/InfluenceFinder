// routes/influencerProfile.routes.js
const express = require('express');
const router = express.Router();
const influencerProfileController = require('../controllers/influencerProfile.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validateProfile } = require('../middleware/validation.middleware');

// Create a new influencer profile
router.post('/', authMiddleware.authenticate, validateProfile, async (req, res) => {
  try {
    await influencerProfileController.createProfile(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

// Get influencer profile by ID
router.get('/:profileId', async (req, res) => {
  try {
    await influencerProfileController.getProfileById(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});

// Update influencer profile
router.put('/:profileId', authMiddleware.authenticate, validateProfile, async (req, res) => {
  try {
    // Authorization check: Only the profile owner can update
    const profileId = req.params.profileId;
    const userId = req.user.userId; // Assuming user ID is set in req.user by authMiddleware
    const profile = await influencerProfileController.getProfileById(req, res);
    
    if (profile.user_id.toString() !== userId) {
      return res.status(403).json({ error: 'You are not authorized to update this profile' });
    }

    await influencerProfileController.updateProfile(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Delete influencer profile
router.delete('/:profileId', authMiddleware.authenticate, async (req, res) => {
  try {
    // Authorization check: Only the profile owner can delete
    const profileId = req.params.profileId;
    const userId = req.user.userId; // Assuming user ID is set in req.user by authMiddleware
    const profile = await influencerProfileController.getProfileById(req, res);
    
    if (profile.user_id.toString() !== userId) {
      return res.status(403).json({ error: 'You are not authorized to delete this profile' });
    }

    await influencerProfileController.deleteProfile(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete profile' });
  }
});

// Get all profiles
router.get('/', async (req, res) => {
  try {
    await influencerProfileController.getAllProfiles(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve profiles' });
  }
});

// Search and filter influencer profiles
router.get('/search', async (req, res) => {
  try {
    await influencerProfileController.searchProfiles(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search profiles' });
  }
});

// Get profiles by user
router.get('/user/:userId', async (req, res) => {
  try {
    await influencerProfileController.getProfilesByUser(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user profiles' });
  }
});

// Get popular influencers
router.get('/popular', async (req, res) => {
  try {
    await influencerProfileController.getPopularInfluencers(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve popular influencers' });
  }
});

// Get recently created profiles
router.get('/recent', async (req, res) => {
  try {
    await influencerProfileController.getRecentlyCreatedProfiles(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve recent profiles' });
  }
});

// Rate influencer profile
router.post('/:profileId/rate', authMiddleware.authenticate, async (req, res) => {
  try {
    await influencerProfileController.rateProfile(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to rate profile' });
  }
});

// Add or remove profile from favorites
router.post('/:profileId/favorite', authMiddleware.authenticate, async (req, res) => {
  try {
    await influencerProfileController.addToFavorites(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to favorites' });
  }
});

router.delete('/:profileId/favorite', authMiddleware.authenticate, async (req, res) => {
  try {
    await influencerProfileController.removeFromFavorites(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from favorites' });
  }
});

// Get influencer analytics
router.get('/:profileId/analytics', async (req, res) => {
  try {
    await influencerProfileController.getProfileAnalytics(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve analytics' });
  }
});

// Export the router
module.exports = router;
