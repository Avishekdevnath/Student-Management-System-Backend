// controllers\adminControllers\authController.js
const User = require('../../models/userModel');

// Admin Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password match (simple string comparison)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a simple token (usually would be JWT in production)
    const token = user._id; // Using user ID as the "token" for simplicity

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Admin Logout (Invalidate token)
exports.logout = (req, res) => {
  // In a simple system, logout means removing the token client-side
  res.json({ message: 'Logged out successfully' });
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (user.password !== oldPassword) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    // Change password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during password change' });
  }
};
