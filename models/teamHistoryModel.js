// File path: models/teamHistoryModel.js

const mongoose = require('mongoose');

const teamHistorySchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the student
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team', // Reference to the team
      required: true,
    },
    action: {
      type: String,
      enum: ['Assigned', 'Removed', 'Updated'], // Action performed
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'removed'], // Current status in the team
      default: 'active',
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // User who performed the action (Admin, Coordinator, or Advisor)
    },
    performedAt: {
      type: Date,
      default: Date.now, // When the action was performed
    },
    notes: {
      type: String, // Optional notes about the change
      default: '',
    },
  },
  { timestamps: true }
);

const TeamHistory = mongoose.model('TeamHistory', teamHistorySchema);
module.exports = TeamHistory;
