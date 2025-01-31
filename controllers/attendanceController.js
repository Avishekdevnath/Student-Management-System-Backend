const Attendance = require('../models/attendanceModel');
const Student = require('../models/studentModel');
const { validationResult } = require('express-validator');

// Get attendance records for a specific course
exports.getAttendanceByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const attendanceRecords = await Attendance.find({ courseId }).populate('student');

    if (!attendanceRecords.length) {
      return res.status(404).json({ message: 'No attendance records found for this course' });
    }

    return res.status(200).json({ attendanceRecords });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get attendance records for a specific student
exports.getAttendanceByStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const attendanceRecords = await Attendance.find({ student: studentId }).populate('course');

    if (!attendanceRecords.length) {
      return res.status(404).json({ message: 'No attendance records found for this student' });
    }

    return res.status(200).json({ attendanceRecords });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Mark attendance for a student
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, courseId, date, present } = req.body;

    // Check if attendance is already marked for this student and course on this date
    let attendance = await Attendance.findOne({ student: studentId, course: courseId, date });
    if (attendance) {
      return res.status(400).json({ message: 'Attendance already marked for this date' });
    }

    attendance = new Attendance({
      student: studentId,
      course: courseId,
      date,
      present
    });

    await attendance.save();
    return res.status(201).json({ message: 'Attendance marked successfully', attendance });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get attendance summary for a student (e.g., present/absent count)
exports.getAttendanceSummary = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const attendanceRecords = await Attendance.find({ student: studentId });

    let presentCount = 0;
    let absentCount = 0;

    attendanceRecords.forEach(record => {
      if (record.present) {
        presentCount++;
      } else {
        absentCount++;
      }
    });

    return res.status(200).json({
      presentCount,
      absentCount
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Approve or reject attendance (admin or advisor)
exports.approveAttendance = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const { approved } = req.body;

    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    attendance.approved = approved;
    await attendance.save();

    return res.status(200).json({ message: 'Attendance record updated', attendance });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
