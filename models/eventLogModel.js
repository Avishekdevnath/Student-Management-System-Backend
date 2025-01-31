// File path: models/eventLogModel.js

const mongoose = require('mongoose');

const eventLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the user who triggered the event
      required: true,
    },
    action: {
      type: String, // Description of the action (e.g., "created meeting", "submitted attendance")
      required: true,
    },
    target: {
      type: String, // Target entity affected by the action (e.g., "Meeting", "Attendance")
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the target object (optional)
    },
    timestamp: {
      type: Date,
      default: Date.now, // When the event occurred
    },
  },
  { timestamps: true }
);

const EventLog = mongoose.model('EventLog', eventLogSchema);
module.exports = EventLog;
