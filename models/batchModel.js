const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },

    // ✅ Semesters linked to this batch
    semesters: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Semester' }
    ],

    // ✅ Students linked to this batch
    students: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }
    ],

    // ✅ Advisors linked to this batch
    advisors: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],

    // ✅ Leader of this batch (must be a student)
    leader: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Student',
      default: null,
    },

    // ✅ Exams & Assignments (Stored in one `tasks` field)
    tasks: [
      {
        name: { type: String, required: true },  // Exam/Assignment Name
        type: { type: String, enum: ["Exam", "Assignment"], required: true }, // ✅ Type of task
        description: { type: String, default: '' },  // Used only for Assignments
        status: { type: String, enum: ["Pending", "Done"], default: "Pending" },
        weightage: { type: Number, default: 0 },  // Exam marks or Assignment max marks
        dueDate: { type: Date, required: true },  // Submission deadline or exam date
        assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Advisor assigning it
      }
    ],

    status: {
      type: String,
      enum: ['active', 'completed', 'ongoing'],
      default: 'active',
    },
  },
  { timestamps: true }
);

const Batch = mongoose.model('Batch', batchSchema);
module.exports = Batch;
