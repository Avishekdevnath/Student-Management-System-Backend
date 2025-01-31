//models\notificationModel.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Can be a student, leader, or advisor
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // The user sending the notification (optional, could be admin/advisor)
    },
    message: {
      type: String,
      required: true, // Notification content
    },
    type: {
      type: String,
      enum: ['announcement', 'reminder', 'evaluation', 'meeting'], // Types of notifications
      required: true,
    },
    status: {
      type: String,
      enum: ['unread', 'read'],
      default: 'unread',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    readAt: {
      type: Date, // Date when the notification was read
    },
    isImportant: {
      type: Boolean,
      default: false, // Flag to mark the notification as important
    },
    validUntil: {
      type: Date, // Expiry date of the notification
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, // Flexible data type for any additional data
      default: {}
    }
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
