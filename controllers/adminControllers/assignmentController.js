//controllers\adminControllers\assignmentController.js

const Assignment = require('../../models/assignmentModel');
const Batch = require('../../models/batchModel');
const Course = require('../../models/courseModel');

// Create Assignment
exports.createAssignment = async (req, res) => {
  try {
    const { batch, course, module, week, questions, totalMarks } = req.body;

    // Validate required fields
    if (!batch || !course || !module || !week || !questions || !totalMarks) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    // Create a new assignment
    const newAssignment = new Assignment({
      batch,
      course,
      module,
      week,
      questions,
      totalMarks,
    });

    // Save assignment to database
    await newAssignment.save();

    res.status(201).json({ message: 'Assignment created successfully', assignment: newAssignment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating assignment' });
  }
};

// Get All Assignments
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('batch')
      .populate('course');
    res.json({ assignments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching assignments' });
  }
};

// Get Assignment by ID
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId)
      .populate('batch')
      .populate('course');
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.json({ assignment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching assignment' });
  }
};

// Edit Assignment
exports.editAssignment = async (req, res) => {
  try {
    const { batch, course, module, week, questions, totalMarks } = req.body;
    const updatedData = { batch, course, module, week, questions, totalMarks };

    const assignment = await Assignment.findByIdAndUpdate(req.params.assignmentId, updatedData, { new: true });
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json({ message: 'Assignment updated successfully', assignment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating assignment' });
  }
};

// Delete Assignment
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json({ message: 'Assignment deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting assignment' });
  }
};

// Assign Assignment to Batches/Courses
exports.assignAssignment = async (req, res) => {
  try {
    const { assignmentId, batchId, courseId } = req.body;

    // Validate required fields
    if (!assignmentId || !batchId || !courseId) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    // Find the assignment
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Assign to batch and course
    assignment.batch = batchId;
    assignment.course = courseId;

    // Save the updated assignment
    await assignment.save();

    res.json({ message: 'Assignment assigned to batch and course', assignment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error assigning assignment to batch and course' });
  }
};
