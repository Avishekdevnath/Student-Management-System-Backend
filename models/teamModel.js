const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mission',
    },
    advisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Advisor for the team
      required: true,
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Team Lead is a User with the role "Team Lead"
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Students in the team
      },
    ],
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
    },
    performanceScore: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;
