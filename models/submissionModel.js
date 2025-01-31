// File path: models/submissionModel.js

const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the student submitting the task
      required: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task', // Reference to the task being submitted
      required: true,
    },
    file: {
      type: String, // Path or reference to the file submitted
      required: true,
    },
    submissionDate: {
      type: Date,
      default: Date.now, // The date when the submission was made
    },
    status: {
      type: String,
      enum: ['pending', 'graded', 'late'], // Submission status
      default: 'pending',
    },
    grade: {
      type: Number, // Grade awarded for the submission
    },
    feedback: {
      type: String, // Feedback given by the evaluator or instructor
    },
    isFinalized: {
      type: Boolean,
      default: false, // Flag to indicate whether the submission is finalized
    },
  },
  { timestamps: true }
);

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;
