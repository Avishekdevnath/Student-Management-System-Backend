const { body } = require('express-validator');

exports.validateBatchCreate = [
  body('name').notEmpty().withMessage('Batch name is required'),
  body('teams').isArray().withMessage('Teams must be an array of team IDs'),
  // Add more validation logic as necessary
];

exports.validateBatchUpdate = [
  body('name').optional().notEmpty().withMessage('Batch name cannot be empty'),
  body('teams').optional().isArray().withMessage('Teams must be an array of team IDs'),
  // Add more validation logic as necessary
];
