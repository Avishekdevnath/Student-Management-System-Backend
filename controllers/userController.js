const User = require('../models/userModel');
console.log('hi');

// Create User
exports.createUser = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
console.log('hi');

    const newUser = new User({
      name,
      email,
      role, // Can be 'student', 'instructor', or 'advisor'
      password, // Remember to hash the password before saving
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating user' });
  }
};

// View All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Edit User
exports.editUser = async (req, res) => {
  const { userId } = req.params;
  const { name, email, role, password } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    if (password) {
      user.password = password; // Remember to hash the password
    }

    await user.save();
    res.json({ message: 'User updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating user' });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// Assign Roles to User
exports.assignRole = async (req, res) => {
  const { userId, role } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update role
    user.role = role;

    await user.save();
    res.json({ message: 'User role updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating user role' });
  }
};

// View User Profile
exports.getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('batch').populate('missions'); // Populate related data

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};


// Get User by ID
exports.getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId)
      .populate('batch')  // Populate related data like batch (if needed)
      .populate('missions');  // Populate related data like missions (if needed)

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching user by ID' });
  }
};
