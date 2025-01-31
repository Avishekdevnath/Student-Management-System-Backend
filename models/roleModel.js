// models/roleModel.js
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // e.g., 'admin', 'instructor', 'student'
      unique: true, // Ensures that role names are unique
    },
    permissions: {
      type: [String], // Array of permissions for this role
      required: true,
      default: [], // Permissions assigned to the role
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the Role model based on the schema
const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
