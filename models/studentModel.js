const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String,  unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', default: null },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
    advisor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    // ✅ Attendance Tracking
    attendance: {
      attendedDays: { type: Number, default: 0 },
      missedDays: { type: Number, default: 0 },
      totalDays: { type: Number, default: 0 },
    },

    // ✅ Task Progress Tracking (Auto-Synced with `Batch.tasks`)
    progress: [
      {
        taskName: { type: String,  }, // ✅ Name of Exam/Assignment
        type: { type: String, enum: ["Exam", "Assignment"], required: true }, // ✅ Type of task
        status: { type: String, enum: ["Pending", "Done"], default: "Pending" },
        score: { type: Number, default: null }, // Marks for Exam/Assignment
      }
    ],

    // ✅ Social Media Links
    socialLinks: {
      github: { type: String, trim: true, default: null },
      linkedin: { type: String, trim: true, default: null },
      twitter: { type: String, trim: true, default: null },
      facebook: { type: String, trim: true, default: null },
      portfolio: { type: String, trim: true, default: null },
    },

    // ✅ Address & Bio
    address: {
      street: { type: String, trim: true, default: null },
      city: { type: String, trim: true, default: null },
      zip: { type: String, trim: true, default: null },
      country: { type: String, trim: true, default: null },
    },
    bio: { type: String, trim: true, default: null },

    isActive: { type: Boolean, default: true },
    
    // ✅ Performance & Quality Metrics
    overallPerformanceScore: { type: Number, default: 0 },
    qualityPercentage: { type: Number, default: 0 } // ✅ Updated via API call
  },
  { timestamps: true }
);

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
