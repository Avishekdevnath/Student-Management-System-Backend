const { body } = require('express-validator');

exports.validateMissionCreate = [
  body('name').notEmpty().withMessage('Mission name is required'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('startDate').isISO8601().toDate().withMessage('Start date must be a valid date'),
  body('endDate').isISO8601().toDate().withMessage('End date must be a valid date'),
  body('advisor').isMongoId().withMessage('Advisor must be a valid ID'),
  body('teams').isArray().withMessage('Teams must be an array of team IDs').isLength({ min: 1 }).withMessage('At least one team must be assigned to the mission'),
];

exports.validateMissionUpdate = [
  body('name').optional().notEmpty().withMessage('Mission name cannot be empty'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('startDate').optional().isISO8601().toDate().withMessage('Start date must be a valid date'),
  body('endDate').optional().isISO8601().toDate().withMessage('End date must be a valid date'),
  body('advisor').optional().isMongoId().withMessage('Advisor must be a valid ID'),
  body('teams').optional().isArray().withMessage('Teams must be an array of team IDs').isLength({ min: 1 }).withMessage('At least one team must be assigned to the mission'),
];
