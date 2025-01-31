//controllers\adminControllers\notificationController.js

const Notification = require('../../models/notificationModel');
const User = require('../../models/userModel');

// Create Notification (Batch-wise, Mission-wise, Team-wise, Person-wise)
exports.createNotification = async (req, res) => {
  try {
    const { recipients, message, type, sender, isImportant, validUntil, priority, metadata, batchId, missionId, teamId } = req.body;

    // Validate the input data
    if (!recipients || !message || !type) {
      return res.status(400).json({ message: 'Missing required fields: recipients, message, type' });
    }

    // Create a list of notifications for each recipient
    const notifications = await Notification.insertMany(
      recipients.map((recipient) => ({
        recipient,
        sender: sender || null, // Optional sender (could be admin/advisor)
        message,
        type,
        status: 'unread',
        isImportant: isImportant || false,
        validUntil,
        priority: priority || 'medium',
        metadata: metadata || {},
        batchId,
        missionId,
        teamId,
      }))
    );

    res.status(201).json({ message: 'Notifications created successfully', notifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating notifications' });
  }
};

// Get Notifications - Filter by Batch, Mission, Team, or Person
exports.getNotifications = async (req, res) => {
  try {
    const { batchId, missionId, teamId, recipientId, status } = req.query;

    const filter = {};

    if (batchId) filter.batchId = batchId;
    if (missionId) filter.missionId = missionId;
    if (teamId) filter.teamId = teamId;
    if (recipientId) filter.recipient = recipientId;
    if (status) filter.status = status;  // 'unread' or 'read'

    const notifications = await Notification.find(filter)
      .populate('recipient')
      .populate('sender')
      .sort({ createdAt: -1 });  // Sorting by latest notifications first

    res.json({ notifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

// Get Notification by ID
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.notificationId)
      .populate('recipient')
      .populate('sender');

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching notification' });
  }
};

// Update Notification (Mark as Read, Update Status, etc.)
exports.updateNotification = async (req, res) => {
  try {
    const { status, isImportant, validUntil } = req.body;

    const notification = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      { status, isImportant, validUntil },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification updated successfully', notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating notification' });
  }
};

// Delete Notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.notificationId);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting notification' });
  }
};

// Mark Notification as Read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      { status: 'read', readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification marked as read', notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error marking notification as read' });
  }
};

// Mark Notification as Unread
exports.markAsUnread = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      { status: 'unread', readAt: null },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification marked as unread', notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error marking notification as unread' });
  }
};
