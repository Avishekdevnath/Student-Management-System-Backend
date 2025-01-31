// File path: models/auditLogModel.js

const mongoose = require('mongoose');

// Define the schema for audit logs
const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User who performed the action
      required: true,
    },
    action: {
      type: String,
      enum: ['CREATE', 'EDIT', 'DELETE', 'LOGIN', 'LOGOUT'], // Types of actions to log
      required: true,
    },
    targetModel: {
      type: String, // Name of the model being affected (e.g., 'User', 'Batch', 'Mission')
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId, // ID of the affected record
      required: true,
    },
    description: {
      type: String, // Description of what the action was about (optional)
    },
    ipAddress: {
      type: String, // IP address from which the action was performed
    },
    timestamp: {
      type: Date,
      default: Date.now, // Automatically sets the time when the log is created
    },
  },
  {
    timestamps: true, // Automatically creates `createdAt` and `updatedAt`
  }
);

// Create and export the AuditLog model
const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
