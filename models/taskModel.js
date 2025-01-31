// File path: models/taskModel.js

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // Title of the task
    },
    description: {
      type: String,
      default: '', // Brief description of the task
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the student or team the task is assigned to
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the user assigning the task (Advisor/Admin)
    },
    dueDate: {
      type: Date,
      required: true, // Task deadline
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'], // Priority level
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'completed', 'overdue'], // Task status
      default: 'not-started',
    },
    submissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submission', // Reference to task submissions
      },
    ],
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

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
