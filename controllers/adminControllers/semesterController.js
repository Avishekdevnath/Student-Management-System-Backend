const Semester = require('../../models/semesterModel'); // Import Semester model
const Course = require('../../models/courseModel'); // Import Course model
const Batch = require('../../models/batchModel'); // Import Batch model

// Create a new semester (Only semesterName and description are required)
exports.createSemester = async (req, res) => {
  try {
    const { semesterName, description } = req.body;

    // Create the new semester (no batch or courses required for creation)
    const newSemester = new Semester({
      semesterName,
      description,
    });

    // Save the semester
    await newSemester.save();

    return res.status(201).json({
      success: true,
      message: 'Semester created successfully',
      data: newSemester,
    });
  } catch (error) {
    console.error("Error creating semester:", error);
    return res.status(500).json({ success: false, message: 'Error creating semester' });
  }
};

// Get all semesters
exports.getAllSemesters = async (req, res) => {
  try {
    const semesters = await Semester.find()
      .populate('batch', 'batchName') // Populating batch details
      .populate('courses', 'courseName'); // Populating course details

    return res.status(200).json({
      success: true,
      data: semesters,
    });
  } catch (error) {
    console.error("Error fetching semesters:", error);
    return res.status(500).json({ success: false, message: 'Error fetching semesters' });
  }
};

// Get a specific semester by ID
exports.getSemesterById = async (req, res) => {
  const { semesterId } = req.params;
  try {
    const semester = await Semester.findById(semesterId)
      .populate('batch', 'batchName')
      .populate('courses', 'courseName');

    if (!semester) {
      return res.status(404).json({ success: false, message: 'Semester not found' });
    }

    return res.status(200).json({
      success: true,
      data: semester,
    });
  } catch (error) {
    console.error("Error fetching semester:", error);
    return res.status(500).json({ success: false, message: 'Error fetching semester' });
  }
};
// Update a specific semester
exports.updateSemester = async (req, res) => {
  const { semesterId } = req.params;
  const { semesterName, description, courseIds = [], batchIds = [] } = req.body;

  try {
    // Validate semesterId
    const semester = await Semester.findById(semesterId);
    if (!semester) {
      return res.status(404).json({ success: false, message: 'Semester not found' });
    }

    // Validate courses if courseIds are provided
    const validCourses = courseIds.length > 0 ? await Course.find({ '_id': { $in: courseIds } }) : [];
    if (validCourses.length !== courseIds.length) {
      return res.status(400).json({ success: false, message: 'One or more courses not found' });
    }

    // Validate batches if batchIds are provided
    const validBatches = batchIds.length > 0 ? await Batch.find({ '_id': { $in: batchIds } }) : [];
    if (validBatches.length !== batchIds.length) {
      return res.status(400).json({ success: false, message: 'One or more batches not found' });
    }

    // Update semester
    const updatedSemester = await Semester.findByIdAndUpdate(
      semesterId,
      {
        semesterName,
        description,
        courses: validCourses.map(course => course._id),
        batches: validBatches.map(batch => batch._id),
      },
      { new: true } // Return the updated document
    );

    return res.status(200).json({
      success: true,
      message: 'Semester updated successfully',
      data: updatedSemester,
    });
  } catch (error) {
    console.error('Error updating semester:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Delete a specific semester
exports.deleteSemester = async (req, res) => {
  const { semesterId } = req.params;
  try {
    const deletedSemester = await Semester.findByIdAndDelete(semesterId);

    if (!deletedSemester) {
      return res.status(404).json({ success: false, message: 'Semester not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Semester deleted successfully',
    });
  } catch (error) {
    console.error("Error deleting semester:", error);
    return res.status(500).json({ success: false, message: 'Error deleting semester' });
  }
};
