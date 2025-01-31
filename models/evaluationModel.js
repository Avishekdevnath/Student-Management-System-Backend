// File path: models/evaluationModel.js

const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the student being evaluated
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team', // Reference to the team the student belongs to
      required: true,
    },
    problemsSolved: {
      type: Number,
      default: 0, // Number of problems solved by the student during the evaluation period
    },
    attendance: {
      type: Number,
      default: 0, // Number of meetings attended by the student
    },
    lateSubmissions: {
      type: Number,
      default: 0, // Number of late submissions by the student
    },
    progressScore: {
      type: Number,
      required: true, // Score for progress in the course (could be a weighted score)
    },
    totalScore: {
      type: Number,
      required: true, // Final score considering problem-solving, attendance, and penalties
    },
    meetingMark: {
      type: Number,
      default: 0, // Mark for meeting attendance (could be weighted)
    },
    isFinalized: {
      type: Boolean,
      default: false, // Flag indicating if the evaluation has been finalized
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Evaluation = mongoose.model('Evaluation', evaluationSchema);
module.exports = Evaluation;
