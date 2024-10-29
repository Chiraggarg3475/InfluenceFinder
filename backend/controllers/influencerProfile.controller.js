const InfluencerProfile = require('../models/influencerProfile.model');
const User = require('../models/user.model');
const { logger } = require('../utils/logger.utils'); // Assuming a logging utility

// Create a new influencer profile
exports.createProfile = async (req, res) => {
  const { user_id, age, gender, location, followers, languages, categories, profile_photo } = req.body;

  // Input validation
  if (!user_id || !age || !gender || !location || !followers || !languages || !categories || !profile_photo) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newProfile = new InfluencerProfile({ user_id, age, gender, location, followers, languages, categories, profile_photo });
    await newProfile.save();

    logger.info(`Profile created for user: ${user_id}`);
    res.status(201).json(newProfile);
  } catch (err) {
    logger.error(`Error creating profile: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

// Get influencer profile by ID
exports.getProfileById = async (req, res) => {
  const { profileId } = req.params;

  try {
    const profile = await InfluencerProfile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.status(200).json(profile);
  } catch (err) {
    logger.error(`Error retrieving profile: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

// Update influencer profile
exports.updateProfile = async (req, res) => {
  const { profileId } = req.params;
  const updateData = req.body;

  try {
    const updatedProfile = await InfluencerProfile.findByIdAndUpdate(profileId, updateData, { new: true, runValidators: true });
    if (!updatedProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    logger.info(`Profile updated for ID: ${profileId}`);
    res.status(200).json(updatedProfile);
  } catch (err) {
    logger.error(`Error updating profile: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

// Delete influencer profile
exports.deleteProfile = async (req, res) => {
  const { profileId } = req.params;

  try {
    const deletedProfile = await InfluencerProfile.findByIdAndDelete(profileId);
    if (!deletedProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    logger.info(`Profile deleted for ID: ${profileId}`);
    res.status(204).json(); // No content
  } catch (err) {
    logger.error(`Error deleting profile: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

// Get all influencer profiles
exports.getAllProfiles = async (req, res) => {
  try {
    const profiles = await InfluencerProfile.find();
    res.status(200).json(profiles);
  } catch (err) {
    logger.error(`Error retrieving all profiles: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

// Get profiles by user ID
exports.getProfilesByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const profiles = await InfluencerProfile.find({ user_id: userId });
    res.status(200).json(profiles);
  } catch (err) {
    logger.error(`Error retrieving profiles for user ${userId}: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

// Search influencer profiles
exports.searchProfiles = async (req, res) => {
  const { location, followers, categories } = req.query;

  const query = {};
  if (location) query.location = location;
  if (followers) query.followers = { $gte: followers }; // Example for followers
  if (categories) query.categories = { $in: categories.split(',') };

  try {
    const profiles = await InfluencerProfile.find(query);
    res.status(200).json(profiles);
  } catch (err) {
    logger.error(`Error searching profiles: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

// Add profile photo
exports.addProfilePhoto = async (req, res) => {
  const { profileId } = req.params;
  const { profile_photo } = req.body;

  if (!profile_photo) {
    return res.status(400).json({ error: 'Profile photo is required' });
  }

  try {
    const updatedProfile = await InfluencerProfile.findByIdAndUpdate(profileId, { profile_photo }, { new: true });
    if (!updatedProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    logger.info(`Profile photo updated for ID: ${profileId}`);
    res.status(200).json(updatedProfile);
  } catch (err) {
    logger.error(`Error updating profile photo: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

// Follow influencer
exports.followInfluencer = async (req, res) => {
  const { userId, profileId } = req.body;

  if (!userId || !profileId) {
    return res.status(400).json({ error: 'User ID and Profile ID are required' });
  }

  try {
    // Assuming we have a followers array in the InfluencerProfile model
    const profile = await InfluencerProfile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    if (profile.followers.includes(userId)) {
      return res.status(400).json({ error: 'You are already following this influencer' });
    }

    profile.followers.push(userId);
    await profile.save();

    logger.info(`User ${userId} followed influencer ${profileId}`);
    res.status(200).json({ message: 'Successfully followed the influencer' });
  } catch (err) {
    logger.error(`Error following influencer: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

// Unfollow influencer
exports.unfollowInfluencer = async (req, res) => {
  const { userId, profileId } = req.body;

  if (!userId || !profileId) {
    return res.status(400).json({ error: 'User ID and Profile ID are required' });
  }

  try {
    const profile = await InfluencerProfile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const index = profile.followers.indexOf(userId);
    if (index === -1) {
      return res.status(400).json({ error: 'You are not following this influencer' });
    }

    profile.followers.splice(index, 1);
    await profile.save();

    logger.info(`User ${userId} unfollowed influencer ${profileId}`);
    res.status(200).json({ message: 'Successfully unfollowed the influencer' });
  } catch (err) {
    logger.error(`Error unfollowing influencer: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

// Get followers of an influencer
exports.getFollowers = async (req, res) => {
  const { profileId } = req.params;

  try {
    const profile = await InfluencerProfile.findById(profileId).select('followers');
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Assuming we have a User model and can fetch user details
    const followersDetails = await User.find({ _id: { $in: profile.followers } });
    res.status(200).json(followersDetails);
  } catch (err) {
    logger.error(`Error retrieving followers for profile ${profileId}: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

// Get following influencers for a user
exports.getFollowing = async (req, res) => {
  const { userId } = req.params;

  try {
    const profiles = await InfluencerProfile.find({ followers: userId });
    res.status(200).json(profiles);
  } catch (err) {
    logger.error(`Error retrieving following influencers for user ${userId}: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

// Log profile activity
exports.logProfileActivity = async (req, res) => {
  // This function could log significant actions to a logging service or database
  // For this example, it's a placeholder
  logger.info(`Activity logged: ${req.body.activity}`);
  res.status(200).json({ message: 'Activity logged successfully' });
};

// Recommend influencers
exports.recommendInfluencers = async (req, res) => {
  const { userId } = req.params;

  // Logic for recommending influencers would go here, possibly based on user preferences
  // For simplicity, returning a static response
  res.status(200).json([{ id: '123', name: 'Influencer A' }, { id: '456', name: 'Influencer B' }]);
};

// Get profile analytics
exports.getProfileAnalytics = async (req, res) => {
  const { profileId } = req.params;

  // Logic for gathering analytics would go here
  // For this example, returning a static response
  res.status(200).json({ profileId, engagement: 75, followers: 1000 });
};

// Report an influencer profile
exports.reportProfile = async (req, res) => {
  const { profileId, reason } = req.body;

  if (!profileId || !reason) {
    return res.status(400).json({ error: 'Profile ID and reason are required' });
  }

  try {
    // Logic to handle reporting the profile, such as logging it or notifying admins
    logger.warn(`Profile ${profileId} reported for reason: ${reason}`);
    res.status(200).json({ message: 'Profile reported successfully' });
  } catch (err) {
    logger.error(`Error reporting profile: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};
