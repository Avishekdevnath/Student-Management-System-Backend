// progressValidator.js
const { check, validationResult } = require('express-validator');

exports.validateProgressData = [
  check('studentId').isMongoId().withMessage('Invalid student ID'),
  check('courseId').isMongoId().withMessage('Invalid course ID'),
  check('week').isInt({ min: 1 }).withMessage('Week must be a positive integer'),
  check('module').notEmpty().withMessage('Module is required'),
  check('isCompleted').isBoolean().withMessage('isCompleted must be a boolean'),
  check('score').optional().isFloat({ min: 0 }).withMessage('Score must be a valid number'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
