// File path: models/meetingModel.js

const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['team', 'advisory', 'leader'], // Meeting type
      required: true,
    },
    title: {
      type: String,
      required: true, // Meeting title
    },
    description: {
      type: String, // Meeting description
      default: '',
    },
    date: {
      type: Date,
      required: true, // Scheduled date and time
    },
    duration: {
      type: Number, // Duration in minutes
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Users attending the meeting
      },
    ],
    attendance: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attendance', // Attendance records for the meeting
      },
    ],
    meetingNotes: {
      type: String, // Notes recorded during or after the meeting
      default: '',
    },
  },
  { timestamps: true }
);

const Meeting = mongoose.model('Meeting', meetingSchema);
module.exports = Meeting;
