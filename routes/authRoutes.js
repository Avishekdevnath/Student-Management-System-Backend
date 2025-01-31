// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');
// const { validateLogin, validateRegister, validateResetPassword, validateForgotPassword } = require('../validators/userValidator');

// // Register Route
// router.post('/register', validateRegister, authController.register);

// // Login Route
// router.post('/login', validateLogin, authController.login);

// // Refresh Token Route
// router.post('/refresh', authController.refreshToken);

// // Forgot Password Route
// router.post('/forgot-password', validateForgotPassword, authController.forgotPassword);

// // Reset Password Route
// router.post('/reset-password/:token', validateResetPassword, authController.resetPassword);

// // Logout Route (Optional)
// router.post('/logout', authController.logout);

// module.exports = router;
const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getUserProfile); // Token in query string

module.exports = router;
