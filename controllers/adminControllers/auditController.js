// controllers\adminControllers\auditController.js
const AuditLog = require('../../models/auditLogModel'); // Assuming AuditLog model exists

// View audit logs
exports.viewLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }); // Sort by latest logs
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching audit logs' });
  }
};

// Delete a log
exports.deleteLog = async (req, res) => {
  try {
    const { logId } = req.params;
    
    const log = await AuditLog.findById(logId);
    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }

    await log.remove();
    res.json({ message: 'Log deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting log' });
  }
};


// Get logs count based on filters
exports.getLogsCount = async (req, res) => {
  try {
    const { action, userId, targetModel, startDate, endDate } = req.query;

    // Build query filters based on provided query parameters
    const filters = {};
    if (action) filters.action = action;
    if (userId) filters.user = userId;
    if (targetModel) filters.targetModel = targetModel;
    if (startDate && endDate) {
      filters.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Get the total number of logs matching the filters
    const logCount = await AuditLog.countDocuments(filters);

    res.json({ totalLogs: logCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching logs count', error: err.message });
  }
};






// Clear all audit logs
exports.clearAllLogs = async (req, res) => {
  try {
    // Delete all records from the AuditLog collection
    const result = await AuditLog.deleteMany({});

    // Check if any logs were deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No logs found to delete' });
    }

    res.json({ message: 'All audit logs cleared successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error clearing audit logs', error: err.message });
  }
};