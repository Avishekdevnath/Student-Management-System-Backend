
//models\assignmentModel.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  marks: { type: Number, required: true },
});

const assignmentSchema = new mongoose.Schema({
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true }, // Reference to Batch model
  course: { type: String, required: true }, // Course name or ID
  module: { type: String, required: true }, // Module/subject name
  week: { type: Number, required: true }, // Week number of the course
  questions: [questionSchema], // List of questions and their marks
  totalMarks: { type: Number, required: true }, // Total marks for the assignment
  dueDate: { type: Date, required: true }, // Due date for the assignment
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user (admin or instructor)
  createdAt: { type: Date, default: Date.now },
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
