// File path: models/leaderboardModel.js

const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team', // Reference to the team
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the student
      required: true,
    },
    problemSolvingScore: {
      type: Number,
      default: 0, // Score based on problem-solving tasks
    },
    attendanceScore: {
      type: Number,
      default: 0, // Score based on attendance
    },
    totalScore: {
      type: Number,
      default: 0, // Total score (problem-solving + attendance)
    },
    ranking: {
      type: Number, // Leaderboard rank
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course', // Reference to the course
      required: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch', // Reference to the batch
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);
module.exports = Leaderboard;
