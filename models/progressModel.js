// File path: models/progressModel.js

const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the student
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course', // Reference to the course
      required: true,
    },
    week: {
      type: Number, // The week number of the course
      required: true,
    },
    module: {
      type: String, // Module name or ID
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false, // Whether the module is completed
    },
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission', // File or link submission for the module
    },
    score: {
      type: Number, // Score for the completed module
      default: 0,
    },
    comments: {
      type: String, // Comments from the Advisor or Evaluator
      default: '',
    },
    updatedAt: {
      type: Date,
      default: Date.now, // When the progress was last updated
    },
  },
  { timestamps: true }
);

const Progress = mongoose.model('Progress', progressSchema);
module.exports = Progress;
