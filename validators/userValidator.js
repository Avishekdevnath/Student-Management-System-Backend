const { body, param } = require('express-validator');

exports.validateRegister = [
  body('email').isEmail().withMessage('Enter a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').isIn(['admin', 'advisor', 'leader', 'student']).withMessage('Role must be one of admin, advisor, leader, or student'),
];

exports.validateLogin = [
  body('email').isEmail().withMessage('Enter a valid email address'),
  body('password').notEmpty().withMessage('Password cannot be empty'),
];

exports.validateForgotPassword = [
  body('email').isEmail().withMessage('Enter a valid email address'),
];

exports.validateResetPassword = [
  param('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];
