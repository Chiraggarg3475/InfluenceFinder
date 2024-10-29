// routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validateUser, validateLogin, validatePasswordChange } = require('../middleware/validation.middleware');

// User registration
router.post('/register', validateUser, userController.register);

// User login
router.post('/login', validateLogin, userController.login);

// Get user by ID
router.get('/:userId', authMiddleware.authenticate, userController.getUserById);

// Update user
router.put('/:userId', authMiddleware.authenticate, userController.updateUser);

// Delete user
router.delete('/:userId', authMiddleware.authenticate, userController.deleteUser);

// Change password
router.patch('/:userId/change-password', authMiddleware.authenticate, validatePasswordChange, userController.changePassword);

// Get all users (admin only)
router.get('/', authMiddleware.authenticate, authMiddleware.adminOnly, userController.getAllUsers);

// User activity logging
router.get('/:userId/activity', authMiddleware.authenticate, userController.getUserActivityLogs);

// Forgot password
router.post('/forgot-password', userController.forgotPassword);

// Reset password
router.patch('/reset-password', userController.resetPassword);

// Get user profile
router.get('/:userId/profile', authMiddleware.authenticate, userController.getUserProfile);

// Deactivate user account
router.post('/:userId/deactivate', authMiddleware.authenticate, userController.deactivateUser);

module.exports = router;
