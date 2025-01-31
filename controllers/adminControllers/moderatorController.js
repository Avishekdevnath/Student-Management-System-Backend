const User = require('../../models/userModel');
const Role = require('../../models/roleModel');

// Fetch all moderators (Coordinators & Advisors)
exports.getAllModerators = async (req, res) => {
  try {
    const moderators = await User.find({ role: { $in: ['Coordinator', 'Advisor'] } });
    res.status(200).json(moderators);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching moderators' });
  }
};

// Create a new moderator
exports.createModerator = async (req, res) => {
  const { firstName, lastName, username, email, phone, password, role, discordId, profilePicture, isActive } = req.body;

  try {
    // Ensure role is either 'Coordinator' or 'Advisor'
    if (!['Coordinator', 'Advisor'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Only Coordinator or Advisor are allowed.' });
    }

    const newModerator = new User({
      firstName,
      lastName,
      username,
      email,
      phone,
      password,  // In production, password should be hashed
      role,
      discordId,
      profilePicture, // Optional field
      isActive,
    });

    await newModerator.save();
    res.status(201).json({ message: 'Moderator created successfully!', moderator: newModerator });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific moderator by ID
exports.getModeratorById = async (req, res) => {
  const { moderatorId } = req.params;
  try {
    const moderator = await User.findById(moderatorId);
    if (!moderator) {
      return res.status(404).json({ message: 'Moderator not found' });
    }
    res.status(200).json(moderator);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a moderator's details
exports.updateModerator = async (req, res) => {
  const { moderatorId } = req.params;
  const { firstName, lastName, username, email, phone, password, role, discordId, profilePicture, isActive } = req.body;

  try {
    // Ensure role is either 'Coordinator' or 'Advisor'
    if (!['Coordinator', 'Advisor'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Only Coordinator or Advisor are allowed.' });
    }

    const updatedModerator = await User.findByIdAndUpdate(
      moderatorId,
      {
        firstName,
        lastName,
        username,
        email,
        phone,
        password,  // In production, password should be hashed before saving
        role,
        discordId,
        profilePicture,  // Optional, will be null if not provided
        isActive,  // Set active status (true/false)
      },
      { new: true } // Return the updated document
    );

    if (!updatedModerator) {
      return res.status(404).json({ message: 'Moderator not found' });
    }

    res.status(200).json({ message: 'Moderator updated successfully!', moderator: updatedModerator });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a moderator
exports.deleteModerator = async (req, res) => {
  const { moderatorId } = req.params;

  try {
    const deletedModerator = await User.findByIdAndDelete(moderatorId);
    if (!deletedModerator) {
      return res.status(404).json({ message: 'Moderator not found' });
    }

    res.status(200).json({ message: 'Moderator deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Assign a role to a moderator (though they are usually fixed roles, this is optional)
exports.assignRoleToModerator = async (req, res) => {
  const { moderatorId } = req.params;
  const { roleName } = req.body;

  try {
    // Ensure the role is valid for moderators
    if (!['Coordinator', 'Advisor'].includes(roleName)) {
      return res.status(400).json({ message: 'Role must be either Coordinator or Advisor' });
    }

    // Find the moderator and update their role
    const updatedModerator = await User.findByIdAndUpdate(
      moderatorId,
      { role: roleName },
      { new: true } // Return updated document
    );

    if (!updatedModerator) {
      return res.status(404).json({ message: 'Moderator not found' });
    }

    res.status(200).json({ message: 'Role assigned successfully!', moderator: updatedModerator });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
