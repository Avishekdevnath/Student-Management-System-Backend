//models\leaderModel.js
const mongoose = require('mongoose');

const leaderSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    team: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Team' 
    },
    batch: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Batch' 
    },
    assignedStudents: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Student' 
      }
    ], // List of students assigned to the leader
    roleDescription: { 
      type: String, 
      trim: true 
    },
  },
  {
    timestamps: true,
  }
);

const Leader = mongoose.model('Leader', leaderSchema);

module.exports = Leader;
