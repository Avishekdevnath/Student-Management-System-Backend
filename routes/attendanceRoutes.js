const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { validateAttendance } = require('../validators/attendanceValidator');

// Route to get all attendance records for a specific course and date range
router.get('/course/:courseId/attendance', attendanceController.getAttendanceByCourse);

// Route to get individual student attendance records
router.get('/student/:studentId/attendance', attendanceController.getAttendanceByStudent);

// Route to mark attendance for a student (admin, advisor, or student relationship manager)
router.post('/mark', validateAttendance, attendanceController.markAttendance);

// Route to get attendance summary (e.g., present/absent counts for a student)
router.get('/summary/:studentId', attendanceController.getAttendanceSummary);

// Route to manually approve or reject attendance entries (admin or advisor)
router.put('/approve/:attendanceId', attendanceController.approveAttendance);

module.exports = router;
