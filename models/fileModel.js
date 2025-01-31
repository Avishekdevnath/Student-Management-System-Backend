// File path: models/fileModel.js

const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true, // Name of the file
    },
    fileType: {
      type: String,
      required: true, // Type of file (e.g., pdf, docx, etc.)
    },
    fileSize: {
      type: Number,
      required: true, // Size of the file in bytes
    },
    filePath: {
      type: String,
      required: true, // Path to the file (in server or cloud storage)
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the user who uploaded the file
      required: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task', // Reference to the task the file is associated with
    },
    submissionDate: {
      type: Date,
      default: Date.now, // Date the file was submitted
    },
    status: {
      type: String,
      enum: ['submitted', 'pending', 'graded'],
      default: 'pending', // Submission status
    },
  },
  { timestamps: true }
);

const File = mongoose.model('File', fileSchema);
module.exports = File;
