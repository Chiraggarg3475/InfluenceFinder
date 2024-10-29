const { body, validationResult } = require('express-validator');

// const { body, validationResult } = require('express-validator');

exports.validateProfile = [
  // Validate fields
  body('username')
    .optional() // Optional field
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  
  body('email')
    .optional()
    .isEmail().withMessage('Invalid email address'),

  body('bio')
    .optional()
    .isLength({ max: 250 }).withMessage('Bio must not exceed 250 characters'),

  body('profilePicture')
    .optional()
    .isURL().withMessage('Profile picture must be a valid URL'),

  // Handle validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];


exports.validateUser = [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Additional validation functions can be added similarly
exports.validateLogin = [
  body('username').exists().withMessage('Username is required'),
  body('password').exists().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];


exports.validatePasswordChange = [
  body('currentPassword').exists().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.validateWishlistItem = [
  body('itemName')
    .isString()
    .withMessage('Item name is required and must be a string')
    .isLength({ min: 1 })
    .withMessage('Item name cannot be empty'),
  
  body('itemLink')
    .isURL()
    .withMessage('Item link must be a valid URL'),
  
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string if provided'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];