//models\missionModel.js
const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Mission name is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(v) {
        return v > this.startDate; // Ensure end date is after start date
      },
      message: 'End date must be after start date',
    },
  },
  advisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to an Advisor (use User model if 'Advisor' is not a separate model)
    required: [true, 'Advisor is required'],
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch', // Reference to a Batch (i.e., which batch is assigned the mission)
    required: [true, 'Batch is required'],
  },
  teams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      validate: {
        validator: function(v) {
          return v.length > 0; // Ensure that at least one team is assigned
        },
        message: 'At least one team should be assigned to the mission',
      },
    },
  ],
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

const Mission = mongoose.model('Mission', missionSchema);

module.exports = Mission;
