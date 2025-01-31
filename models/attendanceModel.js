// File path: models/attendanceModel.js

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the student
      required: true,
    },
    date: {
      type: Date,
      required: true, // Date of the attendance
    },
    attended: {
      type: Boolean,
      required: true, // Whether the student attended
    },
    meetingType: {
      type: String,
      enum: ['team', 'weekly_advisory', 'leader_meeting', 'advisor_meeting'], // Meeting type
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course', // Course related to attendance
      required: false,
    },
    week: {
      type: String, // Week of the course
    },
    moduleCompleted: {
      type: String, // Module completed on this date
    },
    remarks: {
      type: String, // Any remarks or comments
      default: '',
    },
  },
  { timestamps: true }
);

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
