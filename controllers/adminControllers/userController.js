// controllers\adminControllers\userController.js
const User = require('../../models/userModel');
const Role = require('../../models/roleModel');


exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'Admin' });
    const totalStudents = await User.countDocuments({ role: 'Student' });
    const totalInstructors = await User.countDocuments({ role: 'Instructor' });
    const totalActiveUsers = await User.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalAdmins,
        totalStudents,
        totalInstructors,
        totalActiveUsers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// const User = require("../models/userModel");

// Controller to create a new user
const createUser = async (req, res) => {
  console.log("Creating user...");

  const { firstName, lastName, username, email, phone, password, role, discordId, profilePicture, isActive } = req.body;

  try {
    // ✅ Check if all required fields are provided
    if (!firstName || !lastName || !username || !email || !phone || !password || !role) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // ✅ Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists!" });
    }

    // ✅ Create a new user object (password stored in plain text)
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      phone,
      password, // ⚠️ No hashing (not recommended for production)
      role,
      discordId,
      profilePicture,
      isActive,
    });

    // ✅ Save user to the database
    await newUser.save();
    res.status(201).json({ message: "User created successfully!", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = { createUser };



// Controller to get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to search for users
const searchUsers = async (req, res) => {
  const { query } = req.query; // Search query from URL parameters
  
  try {
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
      ],
    });
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Controller to edit a user's details
const editUser = async (req, res) => {
  const { userId } = req.params;
  const { firstName, lastName, username, email, phone, password, role, discordId, profilePicture, isActive, roleData } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        username,
        email,
        phone,
        password,  // In production, hash the password before saving
        role,
        discordId,
        profilePicture,  // Optional, will be null if not provided
        isActive,  // Set active status (true/false)
        roleData,  // Updated role-specific data
      },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully!', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Controller to delete a user
const deleteUser = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to assign a role to a user
const assignRole = async (req, res) => {
  const { userId } = req.params || req.body;
  const { roleName } = req.body;

  try {
    // Check if the role exists
    const role = await Role.findOne({ name: roleName });
    if (!role) {
      return res.status(400).json({ message: 'Role not found' });
    }

    // Find the user and update their role
    const user = await User.findByIdAndUpdate(userId, { role: roleName }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Optionally, you can also update the roleData based on the role
    user.roleData = { permissions: role.permissions };
    await user.save();

    res.status(200).json({ message: `Role '${roleName}' assigned successfully!`, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to get a user's profile
const getUserProfile = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  searchUsers,
  editUser,
  deleteUser,
  assignRole,
  getUserProfile,
};
