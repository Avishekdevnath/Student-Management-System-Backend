const User = require('../models/userModel');
const Batch = require('../models/batchModel');
const Mission = require('../models/missionModel');
// const Assignment = require('../models/assignmentModel');  // Import Assignment model
const Notification = require('../models/notificationModel');
const Assignment = require('../models/assignmentModel');

exports.getDashboardStats = async (req, res) => {
  try {
    // Get counts of users, batches, missions, etc.
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalAdvisors = await User.countDocuments({ role: 'advisor' });

    const totalBatches = await Batch.countDocuments();
    const totalMissions = await Mission.countDocuments();
    const totalAssignments = await Assignment.countDocuments();  // Count total assignments

    // Notification counts (read/unread)
    const unreadNotifications = await Notification.countDocuments({ status: 'unread' });

    // Send the data as response
    res.json({
      totalUsers,
      totalStudents,
      totalInstructors,
      totalAdvisors,
      totalBatches,
      totalMissions,
      totalAssignments,  // Add total assignments to the response
      unreadNotifications
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};







exports.createAssignment = async (req, res) => {
  try {
    const { batch, course, module, week, questions, totalMarks } = req.body;

    const newAssignment = new Assignment({
      batch,
      course,
      module,
      week,
      questions,
      totalMarks,
    });

    await newAssignment.save();
    res.status(201).json({ message: 'Assignment created successfully', assignment: newAssignment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating assignment' });
  }
};
