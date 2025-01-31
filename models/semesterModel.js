// File path: models/semesterModel.js
const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema(
  {
    semesterName: {
      type: String,
      required: true, // E.g., "Semester 1"
    },
    startDate: {
      type: Date,
      // required: true, // Semester start date
    },
    endDate: {
      type: Date, // Semester end date (optional)
    },
    description: {
      type: String, // Description or additional info about the semester (optional)
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course', // Reference to multiple courses in this semester
      },
    ],
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch', // Reference to the batch that this semester belongs to
    },
  },
  { timestamps: true }
);

const Semester = mongoose.model('Semester', semesterSchema);
module.exports = Semester;
