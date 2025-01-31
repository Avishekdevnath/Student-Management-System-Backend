//controllers\adminControllers\roleController.js

const Role = require('../../models/roleModel'); // Assuming Role model exists
const User = require('../../models/userModel');

// Create a new role
exports.createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    const role = new Role({ name, permissions });
    await role.save();

    res.status(201).json(role);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating role' });
  }
};

// Edit a role
exports.editRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { name, permissions } = req.body;

    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    role.name = name;
    role.permissions = permissions;
    await role.save();

    res.json(role);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error editing role' });
  }
};

// Assign role to user
exports.assignRoleToUser = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    const user = await User.findById(userId);
    const role = await Role.findById(roleId);

    if (!user || !role) {
      return res.status(404).json({ message: 'User or Role not found' });
    }

    user.role = role.name;
    await user.save();

    res.json({ message: 'Role assigned successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error assigning role' });
  }
};
