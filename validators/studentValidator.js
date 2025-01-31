const { body, validationResult } = require('express-validator');

// Validator for student creation
exports.validateStudentCreation = [
  body('studentId').notEmpty().withMessage('Student ID is required').trim(),
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
  body('advisor').notEmpty().withMessage('Advisor is required').isMongoId().withMessage('Invalid advisor ID'),
  body('team').optional().isMongoId().withMessage('Invalid team ID'),
  body('batch').optional().isMongoId().withMessage('Invalid batch ID'),
  body('progress').optional().isArray().withMessage('Progress should be an array of course progress'),

  // Check validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validator for student update
exports.validateStudentUpdate = [
  body('studentId').optional().notEmpty().withMessage('Student ID should not be empty').trim(),
  body('name').optional().notEmpty().withMessage('Name is required').trim(),
  body('email').optional().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
  body('advisor').optional().isMongoId().withMessage('Invalid advisor ID'),
  body('team').optional().isMongoId().withMessage('Invalid team ID'),
  body('batch').optional().isMongoId().withMessage('Invalid batch ID'),
  body('progress').optional().isArray().withMessage('Progress should be an array of course progress'),

  // Check validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
