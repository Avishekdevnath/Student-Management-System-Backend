const User = require('../../models/userModel');
const Batch = require('../../models/batchModel');
const Team = require('../../models/teamModel');
const Mission = require('../../models/missionModel');
const Attendance = require('../../models/attendanceModel');

// Admin Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    // Fetch counts of key entities: Users, Batches, Teams, and Missions
    const userCount = await User.countDocuments();
    const batchCount = await Batch.countDocuments();
    const teamCount = await Team.countDocuments();
    const missionCount = await Mission.countDocuments();

    // Example: Fetch total attendance for today
    const todayAttendanceCount = await Attendance.countDocuments({
      date: new Date().toISOString().split('T')[0], // Today's date (YYYY-MM-DD)
    });

    // Prepare dashboard stats
    const dashboardStats = {
      userCount,
      batchCount,
      teamCount,
      missionCount,
      todayAttendanceCount,
    };

    res.status(200).json({
      success: true,
      data: dashboardStats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// Get Advisors
exports.getAdvisors = async (req, res) => {
  try {
    const users = await User.find();
    console.log(users);
    
    // Assuming that users with the role "advisor" are the advisors
    const advisors = await User.find({ role: 'Advisor' });
    console.log('line 51 ',advisors);
    
    res.status(200).json({
      success: true,
      data: advisors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// Get Teams
exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('members') // Assuming the 'members' field is a reference to the User model
      .populate('leader'); // Assuming the 'leader' is also a reference to User
    res.status(200).json({
      success: true,
      data: teams,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// Get Batches
exports.getBatches = async (req, res) => {
  try {
    const batches = await Batch.find().populate('students');
    res.status(200).json({
      success: true,
      data: batches,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'Admin' });
    const totalStudents = await User.countDocuments({ role: 'Student' });
    const totalInstructors = await User.countDocuments({ role: 'Instructor' });
    const totalActiveUsers = await User.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalAdmins,
        totalStudents,
        totalInstructors,
        totalActiveUsers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
