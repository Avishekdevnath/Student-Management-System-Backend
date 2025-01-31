const { body } = require('express-validator');

exports.validateAttendance = [
  body('studentId').isMongoId().withMessage('Invalid student ID'),
  body('courseId').isMongoId().withMessage('Invalid course ID'),
  body('date').isDate().withMessage('Invalid date format'),
  body('present').isBoolean().withMessage('Presence status must be true or false'),
];
