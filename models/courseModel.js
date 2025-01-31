const mongoose = require('mongoose');

// Assignment Schema
const assignmentSchema = new mongoose.Schema({
  assignmentTitle: {
    type: String,
    trim: true,
  },
  dueDate: {
    type: Date,
  },
  description: {
    type: String,
  },
});

// Exam Schema
const examSchema = new mongoose.Schema({
  examTitle: {
    type: String,
    trim: true,
  },
  examType: {
    type: String,
    enum: ['midterm', 'final'],
  },
  examDate: {
    type: Date,
  },
  duration: {
    type: Number, // Exam duration in minutes
  },
  weight: {
    type: Number, // Weight of the exam in final grade calculation
  },
});

// Module Schema
const moduleSchema = new mongoose.Schema({
  moduleName: {
    type: String,
    trim: true,
  },
  moduleContent: {
    type: String,
    trim: true,
  },
  assignments: [assignmentSchema],
  exams: [examSchema],
});

// Week Schema
const weekSchema = new mongoose.Schema(
  {
    weekNumber: {
      type: Number,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    modules: [moduleSchema],
  },
  { timestamps: true }
);

// Course Schema
const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Course name (e.g., "Introduction to Programming")
    },
    description: {
      type: String,
      trim: true, // Description of the course (optional)
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Semester', // Reference to the Semester model
    },
    batch: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch', // Reference to the Batch model (allowing multiple batches)
      },
    ],
    courseCode: {
      type: String,
      trim: true, // Unique code for the course (optional)
    },
    instructor: {
      type: String,
      trim: true, // Instructor name (optional)
    },
    weeks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Week', // Reference to the Week model
      },
    ],
  },
  { timestamps: true }
);

// Models
const Week = mongoose.model('Week', weekSchema);
const Course = mongoose.model('Course', courseSchema);

module.exports = { Course, Week };
