const Batch = require('../../models/batchModel');
const Course = require('../../models/courseModel');
const Semester = require('../../models/semesterModel');
exports.createBatch = async (req, res) => {
  const { name, startDate, endDate, students = [], advisors = [], leader } = req.body;

  // Log the incoming request data to inspect it
  console.log('Received batch creation data:', req.body);

  // Check if name is provided (mandatory)
  if (!name) {
    return res.status(400).json({ message: 'Batch name is required' });
  }

  try {
    const newBatch = new Batch({
      name,
      startDate,    // Optional, will be undefined if not provided
      endDate,      // Optional, will be undefined if not provided
      students,     // Default empty array if not provided
      advisors,     // Default empty array if not provided
      leader,       // Optional, will be undefined if not provided
    });

    await newBatch.save();
    res.status(200).json({ message: 'Batch created successfully', batch: newBatch });
  } catch (error) {
    console.error('Error creating batch:', error);
    res.status(500).json({ error: error.message });
  }
};


// Get all batches
exports.getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.find();
    console.log(batches);
    
    res.status(200).json({ message: 'Batches retrieved successfully', batches });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific batch by ID
exports.getBatchById = async (req, res) => {
  const { batchId } = req.params;
  
  try {
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    res.status(200).json({ message: 'Batch retrieved successfully', batch });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Edit a batch
exports.editBatch = async (req, res) => {
  const { batchId } = req.params;
  const { name, startDate, endDate, students, advisors, leader, semesters } = req.body;

  try {
    // Find the batch by its ID
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Update the batch with the provided details
    if (name) batch.name = name;
    if (startDate) batch.startDate = startDate;
    if (endDate) batch.endDate = endDate;
    if (students) batch.students = students;
    if (advisors) batch.advisors = advisors;
    if (leader) batch.leader = leader;

    // If semesters are provided, update or add them
    if (semesters) {
      // Remove existing semesters and add the new ones
      batch.semesters = semesters;
    }

    // Save the updated batch
    await batch.save();

    res.status(200).json({ message: 'Batch updated successfully', batch });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Delete a batch
exports.deleteBatch = async (req, res) => {
  const { batchId } = req.params;

  try {
    const batch = await Batch.findByIdAndDelete(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    res.status(200).json({ message: 'Batch deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Add a semester to a batch
exports.addSemesterToBatch = async (req, res) => {
  const { batchId } = req.params;
  const { semesterName, startDate, endDate, description } = req.body;

  // Check if semesterName is provided (mandatory)
  if (!semesterName) {
    return res.status(400).json({ message: 'Semester name is required' });
  }

  try {
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    const newSemester = new Semester({
      semesterName,
      startDate,
      endDate,
      description,
      batch: batchId, // Ensure that the semester is linked to the batch
    });

    await newSemester.save();
    batch.semesters.push(newSemester);
    await batch.save();

    res.status(201).json({ message: 'Semester added to batch', batch });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};









// Edit a semester in a batch
exports.editSemesterInBatch = async (req, res) => {
  const { batchId, semesterId } = req.params;
  const { semesterName, startDate, endDate, description } = req.body;

  try {
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    const semesterIndex = batch.semesters.findIndex(
      (semester) => semester._id.toString() === semesterId
    );

    if (semesterIndex === -1) {
      return res.status(404).json({ message: 'Semester not found in this batch' });
    }

    batch.semesters[semesterIndex] = {
      ...batch.semesters[semesterIndex],
      semesterName, // Optional in edit
      startDate,    // Optional in edit
      endDate,      // Optional in edit
      description,  // Optional in edit
    };

    await batch.save();

    res.status(200).json({ message: 'Semester updated successfully', batch });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Delete a semester from a batch
exports.deleteSemesterFromBatch = async (req, res) => {
  const { batchId, semesterId } = req.params;

  try {
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    const semesterIndex = batch.semesters.findIndex(
      (semester) => semester._id.toString() === semesterId
    );

    if (semesterIndex === -1) {
      return res.status(404).json({ message: 'Semester not found in this batch' });
    }

    batch.semesters.splice(semesterIndex, 1);
    await batch.save();

    res.status(200).json({ message: 'Semester deleted from batch', batch });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all students in a specific batch
exports.getStudentsInBatch = async (req, res) => {
  const { batchId } = req.params;

  try {
    const batch = await Batch.findById(batchId).populate('students');
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.status(200).json({ message: 'Students retrieved successfully', students: batch.students });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Assign teams to a batch
exports.assignTeamsToBatch = async (req, res) => {
  const { batchId } = req.body;
  const { teams } = req.body;

  try {
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    batch.teams = teams; // Assuming `teams` is an array of team objects
    await batch.save();

    res.status(200).json({ message: 'Teams assigned to batch successfully', batch });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
