const Assignment = require('../models/assignmentModel');

// Create Assignment
exports.createAssignment = async (req, res) => {
  try {
    const { batch, course, module, week, questions, totalMarks } = req.body;

    const newAssignment = new Assignment({
      batch,
      course,
      module,
      week,
      questions,
      totalMarks,
    });

    await newAssignment.save();
    res.status(201).json({ message: 'Assignment created successfully', assignment: newAssignment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating assignment' });
  }
};

// View All Assignments
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('batch')  // Populate batch info
      .populate('course');  // Populate course info
    res.json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching assignments' });
  }
};

// Edit Assignment
exports.editAssignment = async (req, res) => {
  const { assignmentId } = req.params;
  const { batch, course, module, week, questions, totalMarks } = req.body;

  try {
    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    assignment.batch = batch || assignment.batch;
    assignment.course = course || assignment.course;
    assignment.module = module || assignment.module;
    assignment.week = week || assignment.week;
    assignment.questions = questions || assignment.questions;
    assignment.totalMarks = totalMarks || assignment.totalMarks;

    await assignment.save();
    res.json({ message: 'Assignment updated successfully', assignment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating assignment' });
  }
};

// Delete Assignment
exports.deleteAssignment = async (req, res) => {
  const { assignmentId } = req.params;

  try {
    const assignment = await Assignment.findByIdAndDelete(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json({ message: 'Assignment deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting assignment' });
  }
};

// Assign Assignment to Batch/Course
exports.assignAssignmentToBatch = async (req, res) => {
  const { assignmentId, batchId } = req.body;

  try {
    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    assignment.batch = batchId;
    await assignment.save();

    res.json({ message: 'Assignment assigned to batch successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error assigning assignment to batch' });
  }
};


// Get Assignment by ID
exports.getAssignmentById = async (req, res) => {
    const { assignmentId } = req.params;
  
    try {
      const assignment = await Assignment.findById(assignmentId)
        .populate('batch')  // Populate batch info
        .populate('course');  // Populate course info
  
      if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found' });
      }
  
      res.json(assignment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching assignment by ID' });
    }
  };
  