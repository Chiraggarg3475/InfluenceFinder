const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Use environment variable or fallback

// Register a new user
exports.register = async (req, res) => {
  const { username, password, user_type, email } = req.body;

  // Input validation
  if (!username || !password || !user_type || !email) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Hash the password
    const password_hash = await bcrypt.hash(password, 10);
    
    const newUser = new User({ username, password_hash, user_type, email });
    await newUser.save();
    
    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (err) {
    // Handle duplicate email or username error
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: err.message });
  }
};

// User login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Input validation
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Compare password with hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id, user_type: user.user_type }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select('-password_hash'); // Exclude password hash from response
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user information
exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const updateData = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select('-password_hash');
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete user account
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).json(); // No content
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  const { userId } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new passwords are required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    user.password_hash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password_hash'); // Exclude password hash
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Log user activity
exports.logUserActivity = async (req, res) => {
  const { userId, action } = req.body;

  // Validate input
  if (!userId || !action) {
    return res.status(400).json({ error: 'User ID and action are required' });
  }

  try {
    console.log(`User ${userId} performed action: ${action}`);
    res.status(200).json({ message: 'Activity logged successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate a password reset token
    const token = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email with the reset link
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Use your email service
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS  // Your email password
      }
    });

    const mailOptions = {
      to: email,
      from: 'no-reply@yourapp.com',
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
            `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
            `http://localhost:3000/reset/${token}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Password reset
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Password reset token is invalid or has expired.' });
    }

    user.password_hash = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined; // Clear the token
    user.resetPasswordExpires = undefined; // Clear the expiration
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get user activity logs
exports.getUserActivityLogs = async (req, res) => {
  const { userId } = req.params;

  // Implement your logic to retrieve user activity logs
  // This is just a placeholder implementation
  try {
    // Assuming there's an Activity model or similar
    const logs = await Activity.find({ userId }); // Adjust as per your data structure
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select('-password_hash');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Deactivate user account
exports.deactivateUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(userId, { active: false }, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User account deactivated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
