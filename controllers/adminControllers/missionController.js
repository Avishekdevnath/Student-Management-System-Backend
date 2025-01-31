
//controllers\adminControllers\missionController.js
const Mission = require('../../models/missionModel');

// Create Mission
exports.createMission = async (req, res) => {
  try {
    const { missionName, missionDescription, startDate, endDate, assignedBatch } = req.body;

    // Validate required fields
    if (!missionName || !missionDescription || !startDate || !endDate || !assignedBatch) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    // Create a new mission
    const newMission = new Mission({
      missionName,
      missionDescription,
      startDate,
      endDate,
      assignedBatch,
    });

    // Save mission to database
    await newMission.save();

    res.status(201).json({ message: 'Mission created successfully', mission: newMission });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating mission' });
  }
};

// Get All Missions
exports.getAllMissions = async (req, res) => {
  try {
    const missions = await Mission.find();
    res.json({ missions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching missions' });
  }
};

// Get Mission by ID
exports.getMissionById = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.missionId);
    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }
    res.json({ mission });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching mission' });
  }
};

// Edit Mission
exports.editMission = async (req, res) => {
  try {
    const { missionName, missionDescription, startDate, endDate, assignedBatch } = req.body;
    const updatedData = { missionName, missionDescription, startDate, endDate, assignedBatch };

    const mission = await Mission.findByIdAndUpdate(req.params.missionId, updatedData, { new: true });
    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    res.json({ message: 'Mission updated successfully', mission });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating mission' });
  }
};

// Delete Mission
exports.deleteMission = async (req, res) => {
  try {
    const mission = await Mission.findByIdAndDelete(req.params.missionId);
    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    res.json({ message: 'Mission deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting mission' });
  }
};


// Assign Mission to Batch
exports.assignMission = async (req, res) => {
    try {
      const { missionId, batchId } = req.body; // Assume we receive missionId and batchId from the request body
  
      // Validate required fields
      if (!missionId || !batchId) {
        return res.status(400).json({ message: 'Mission ID and Batch ID are required' });
      }
  
      // Find mission by ID
      const mission = await Mission.findById(missionId);
      if (!mission) {
        return res.status(404).json({ message: 'Mission not found' });
      }
  
      // Assign the batch to the mission (assuming `assignedBatch` is a field in the mission document)
      mission.assignedBatch = batchId;
  
      // Save the updated mission document
      await mission.save();
  
      res.json({ message: 'Mission assigned to batch successfully', mission });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error assigning mission' });
    }
  };
  